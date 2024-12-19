require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log("Error al conectarse a la base de datos", error);
    process.exit(1);
  }
};

module.exports = dbConnect;
