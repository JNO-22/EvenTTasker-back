const express = require("express");
const router = express.Router();
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");

// FUNCIONES CRUD DEL EVENTO
//Crear un nuevo evento -- CREATE
router.post("/eventos/:id", async (req, res) => {
  const userId = req.query.id;
  const { body } = req;
  const eventDate = new Date(body.fecha);
  const eventData = { ...body, fecha: eventDate, cliente: userId };

  try {
    const newEvent = await eventModel.create(eventData);
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ mensaje: "Usuario no encontrado" });
    }

    user.eventos.push(newEvent._id);
    await user.save();

    res.status(201).send(newEvent);
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ mensaje: "Error al crear el evento", error });
  }
});

//Obtener todos los eventos -- READ
router.get("/eventos", async (req, res) => {
  try {
    const eventos = await eventModel.find(); // Obtener los eventos
    const filtroEventos = eventos.map((evento) => ({
      fecha: evento.fecha,
      lugar: evento.lugar,
      titulo: evento.titulo,
      categoria: evento.categoria,
    }));
    res.status(200).send(filtroEventos);
  } catch (error) {
    res.status(400).send({ mensaje: "Error al obtener los eventos", error });
  }
});

//Actualizar un evento -- UPDATE
router.put("/eventos/:id", async (req, res) => {
  const eventId = req.query.id;
  const { body } = req;
  body.fecha = new Date(body.fecha);
  try {
    const updatedEvent = await eventModel.findByIdAndUpdate(eventId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).send({ mensaje: "Evento no encontrado" });
    }
    res.status(200).send(updatedEvent);
  } catch (error) {
    res.status(400).send({ mensaje: "Error al actualizar el evento", error });
  }
});

//Eliminar un evento -- DELETE
router.delete("/eventos/:id", async (req, res) => {
  const eventId = req.query.id;
  try {
    const event = await eventModel.findByIdAndDelete(eventId);
    const user = await userModel.findById(event.cliente);
    user.eventos.pull(event._id);
    await user.save();
    res.status(200).send({ message: "Event deleted", event });
  } catch (error) {
    res.status(400).send({ message: "Error deleting event", error });
  }
});

//Obtener eventos de un usuario -- Endpoint
router.get("/eventos/:id", async (req, res) => {
  const userID = req.query.id;
  try {
    const find = await eventModel.find({ cliente: userID });
    const posts = find.map((post) => ({
      fecha: post.fecha,
      lugar: post.lugar,
      titulo: post.titulo,
      categoria: post.categoria,
      id: post._id,
    }));
    posts.fecha = new Date(posts.fecha);

    if (!posts) {
      res.status(404).send({ mensaje: "No se encontraron eventos" });
    }

    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send({ mensaje: "Error al obtener el evento", error });
  }
});

module.exports = router;
