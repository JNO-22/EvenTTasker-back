const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

// FUNCIONES CRUD DEL USUARIO
//Crear un nuevo usuario -- CREATE
router.post("/user", async (req, res) => {
  const body = req.body; // se obtienen los datos del body de la peticion
  try {
    const nuevoUser = await userModel.create(body); // se crea el nuevo usuario
    res.status(201).send(nuevoUser); // se envia el nuevo usuario
  } catch (err) {
    res.status(400).send({
      mensaje:
        err.name === "MongoError" || err.code === 11000
          ? "El correo ya se encuentra registrado"
          : "Error al crear el usuario",
    });
  }
});

//Obtener todos los usuarios -- READ
router.get("/users", async (req, res) => {
  try {
    const users = await userModel.find(); // Obtener todos los usuarios
    res.status(200).send(users); // se envia la lista de todos los usuarios
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al obtener los usuarios", error: error });
  }
});

//Actualizar un usuario -- UPDATE
router.put("/user/:id", async (req, res) => {
  const id = req.query.id; // se obtiene el id
  const body = req.body; // se obtiene el body

  try {
    const userActualizado = await userModel.findByIdAndUpdate(id, body, {
      new: true, // <-- permite obtener el usuario actualizado en lugar de el original
      runValidators: true,
    }); // se actualiza el usuario con el id y el body
    if (!userActualizado) {
      res.status(404).send({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).send(userActualizado);
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al actualizar el usuario", error: error });
  }
});

//eliminar un usuario -- DELETE
router.delete("/user/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id); // buscar y elimina el usuario

    // si el usuario no existe da un error
    if (!user) {
      res.status(404).send({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).send({ mensaje: "Usuario eliminado", user });
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al eliminar el usuario", error: error });
  }
});

// Obtener un usuario -- READ
router.get("/user/:id", async (req, res) => {
  const userId = req.query.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).send({ mensaje: "Usuario no encontrado" });
    } else {
      res.status(200).send({
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
      });
    }
  } catch (err) {
    res
      .status(400)
      .send({ mensaje: "Error al buscar usuario", error: "" + err });
  }
});

// Iniciar sesion -- Endpoint
router.get("/user", async (req, res) => {
  const mail = req.query.correo;
  const password = req.query.password;
  try {
    const user = await userModel.findOne({ correo: mail, password: password });
    if (!user) {
      res.status(404).send({ mensaje: "Email o contraseña incorrectos" });
    } else {
      res.status(200).send({
        id: user._id,
        nombre: user.nombre,
      });
    }
  } catch (err) {
    res
      .status(400)
      .send({ mensaje: "Error al iniciar sesión", error: "" + err });
  }
});

//Obtener los eventos de un usuario -- Endpoint
router.get("/user/:id/eventos", async (req, res) => {
  const userID = req.params.id;
  try {
    const posts = await userModel.findById(userID).populate("eventos");
    res.status(200).send(posts.eventos);
  } catch (error) {
    res
      .status(400)
      .send({ mensaje: "Error al obtener los eventos", error: "" + error });
  }
});

module.exports = router;
