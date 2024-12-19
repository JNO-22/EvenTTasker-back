const dbConnect = require("./config/db");
const eventoRouter = require("./routes/eventos");
const userRouter = require("./routes/user");
const tareasRouter = require("./routes/tareas");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(eventoRouter, userRouter);
app.use("/tareas", tareasRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

dbConnect()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor corriendo y conectado a la base de datos");
    });
  })
  .catch((error) => {
    console.log("Error al conectarse a la base de datos", error);
  });
