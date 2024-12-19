const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fechaLimite: {
    type: Date,
    required: true,
  },
  prioridad: {
    type: String,
    enum: ["alta", "media", "baja"],
    default: "baja",
  },
  completada: {
    type: Boolean,
    default: false,
  },
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ModelTarea = mongoose.model("tareas", tareaSchema);

module.exports = ModelTarea;
