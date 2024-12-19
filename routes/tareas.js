const express = require("express");
const router = express.Router();

let modelTarea = require("../models/tareaModel");

// Obtener todas las tareas de un evento
router.get("/:id", async (req, res) => {
  const eventId = req.query.id;
  try {
    let tareas = await modelTarea.find({ evento: eventId });
    if (tareas.length == 0) {
      return res.status(200).send({
        mensaje: "No se encontraron tareas",
      });
    }
    tareas = tareas.map((tarea) => {
      return {
        id: tarea._id,
        ...tarea._doc,
      };
    });
    res.status(200).send(tareas);
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al listar todas las tareas", error: error });
  }
});

// Crear una nueva tarea
router.post("/:id", async (req, res) => {
  if (!req.query.id) {
    return res.status(400).send({ mensaje: "No se seleccciono un evento" });
  }
  const eventId = req.query.id;
  try {
    let nuevaTarea = req.body;
    nuevaTarea.evento = eventId;
    let respuesta = await modelTarea.create(nuevaTarea);
    res
      .status(201)
      .send({ mensaje: "Tarea creada exitosamente", body: respuesta });
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al crear una nueva tarea", error: error });
  }
});

// Actualizar una tarea
router.put("/:id", async (req, res) => {
  let tareaId = req.query.id;
  try {
    let tareaActualizada = req.body;
    let respuesta = await modelTarea.findByIdAndUpdate(
      tareaId,
      tareaActualizada,
      {
        new: true,
        runValidators: true,
      }
    );
    if (respuesta != null) {
      res
        .status(200)
        .send({ mensaje: "Tarea actualizada exitosamente", body: respuesta });
    } else {
      res
        .status(400)
        .send({ mensaje: "Error al actualizar una nueva tarea", error: error });
    }
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al actualizar una nueva tarea", error: error });
  }
});

// Borrar una tarea
router.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let respuesta = await modelTarea.findByIdAndDelete(id);
    if (respuesta != null) {
      res
        .status(200)
        .send({ mensaje: "Tarea borrada exitosamente", body: respuesta });
    } else {
      res
        .status(400)
        .send({ mensaje: "Error al borrar una tarea", error: error });
    }
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al borrar una tarea", error: error });
  }
});

// Filtrar tareas
router.get("/prioridad/:nivel", async (req, res) => {
  try {
    let { nivel } = req.params;
    let tareas = await modelTarea.find({ prioridad: nivel });

    if (tareas.length == 0) {
      return res.status(400).send({
        mensaje: "no se encontraron tareas con esa prioridad",
        body: tareas,
      });
    }
    res.status(200).send({ mensaje: "Tareas con prioridad ", body: tareas });
  } catch (error) {
    res.status(400).send({ mensaje: "Error filtrar tareas", error: error });
  }
});

// Filtrar tareas
router.get("/proximas-vencer/:dias", async (req, res) => {
  try {
    let { dias } = req.params;
    dias = parseInt(dias);

    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + dias);

    let tareas = await modelTarea.find({
      "fecha-limite": {
        $gte: hoy,
        $lte: fechaLimite,
      },
    });

    if (tareas.length == 0) {
      return res.status(400).send({
        mensaje: "No se encontraron tareas próximas a vencer",
        body: tareas,
      });
    }
    res.status(200).send({ mensaje: "Tareas próximas a vencer", body: tareas });
  } catch (error) {
    res.status(400).send({ mensaje: "Error filtrar tareas", error: error });
  }
});

module.exports = router;
