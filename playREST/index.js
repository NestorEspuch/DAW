//

const express = require("express");
const utilidades = require("./utilidades.js");
const nombreFichero = "juegos.json";
let app = express();
app.use(express.json());

let arrayJuegos = utilidades.cargarJuegos(nombreFichero);

app.get("/juegos", (req, res) => {
  if (Object.keys(req.query).length == 0) {
    if (arrayJuegos.length > 0 && arrayJuegos) {
      res.status(200).send({ ok: true, resultado: arrayJuegos });
    } else {
      res.status(400).send({
        ok: false,
        error: "Se ha encontrado un fallo en la petición.",
      });
    }
  } else if (req.query["anyos"] && req.query["tipo"]) {
    let arrayFiltrado = arrayJuegos.filter((j) => {
      return j.edadMinima <= req.query["anyos"] && j.tipo == req.query["tipo"];
    });
    if (req.query["anyos"] < 0) {
      res.status(400).send({
        ok: false,
        error: "Edad mínima recomendada en años inválida.",
      });
    } else if (!req.query["tipo"]) {
      res.status(400).send({ ok: false, error: "tipo no reconocido." });
    } else {
      if (arrayFiltrado.length > 0 && arrayFiltrado != null) {
        res.status(200).send({ ok: true, resultado: arrayFiltrado });
      } else {
        res
          .status(500)
          .send({ ok: false, error: "No se han encontrado juegos." });
      }
    }
  } else if (req.query["anyos"]) {
    let arrayFiltrado = arrayJuegos.filter((j) => {
      return j.edadMinima <= req.query["anyos"];
    });
    if (req.query["anyos"] < 0) {
      res.status(400).send({
        ok: false,
        error: "Edad mínima recomendada en años inválida.",
      });
    } else {
      if (arrayFiltrado.length > 0 && arrayFiltrado != null) {
        res.status(200).send({ ok: true, resultado: arrayFiltrado });
      } else {
        res
          .status(500)
          .send({ ok: false, error: "No se han encontrado juegos." });
      }
    }
  } else if (req.query["tipo"]) {
    let arrayFiltrado = arrayJuegos.filter((j) => {
      return j.tipo.toLowerCase() == req.query["tipo"].toLowerCase();
    });
    if (req.query["tipo"] == null) {
      res.status(400).send({
        ok: false,
        error: "No se han encontrado juegos con ese tipo.",
      });
    } else {
      if (arrayFiltrado.length > 0 && arrayFiltrado != null) {
        res.status(200).send({ ok: true, resultado: arrayFiltrado });
      } else {
        res
          .status(500)
          .send({ ok: false, error: "No se han encontrado juegos." });
      }
    }
  }
});

app.get("/juegos/:id", (req, res) => {
  if (req.params["id"] > 0) {
    let arrayFiltrado = arrayJuegos.filter((j) => {
      return j.id == req.params["id"];
    });
    if (arrayFiltrado.length > 0 && arrayFiltrado) {
      res.status(200).send({ ok: true, resultado: arrayFiltrado });
    } else {
      res
        .status(400)
        .send({ ok: false, error: "Código de juego inexistente." });
    }
  } else {
    res.status(500).send({ ok: false, error: "Id inválido." });
  }
});

app.post("/juegos", (req, res) => {
  if (req.body) {
    if (arrayJuegos.filter((j) => j.id == req.body.id).length == 0) {
      let juego = {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        edadMinima: req.body.edadMinima,
        numeroJugadores: req.body.numeroJugadores,
        tipo: req.body.tipo,
        precio: req.body.precio,
      };
      arrayJuegos.push(juego);
      utilidades.guardarJuegos(nombreFichero, arrayJuegos);
      res.status(200).send({ ok: true, resultado: juego });
    } else {
      res.status(400).send({ ok: false, error: "Código de juego repetido." });
    }
  } else {
    res.status(500).send({ ok: false, error: "Datos del juego incorrectos." });
  }
});

app.put("/juegos/:id", (req, res) => {
  if (req.body) {
    let existe = arrayJuegos.filter((j) => j.id == req.params["id"]);
    if (existe.length > 0) {
      let juego = existe[0];
      juego.nombre = req.body.nombre;
      juego.descripcion = req.body.descripcion;
      juego.edadMinima = req.body.edadMinima;
      juego.numeroJugadores = req.body.numeroJugadores;
      juego.tipo = req.body.tipo;
      juego.precio = req.body.precio;

      utilidades.guardarJuegos(nombreFichero, arrayJuegos);
      res.status(200).send({ ok: true, resultado: juego });
    } else {
      res.status(400).send({ ok: false, error: "Juego no encontrado." });
    }
  } else {
    res.status(500).send({ ok: false, error: "Datos recibidos incorrectos." });
  }
});

app.delete("/juegos/:id", (req, res) => {
  let existe = arrayJuegos.filter((j) => j.id == req.params["id"]);
  if (existe.length > 0) {
    let juego = existe[0];
    let guardarJuegos = arrayJuegos.filter((j) => j.id != req.params["id"]);
    utilidades.guardarJuegos(nombreFichero, guardarJuegos);
    res.status(200).send({ ok: true, resultado: juego });
  } else {
    res.status(400).send({ ok: false, error: "Juego no encontrado." });
  }
});

app.listen(8080);
