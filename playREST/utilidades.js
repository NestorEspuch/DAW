//Contiene las funciones para cargar y guardar los juegos del/a fichero juegos.js

const fs = require("fs");

function cargarJuegos(nombreFichero) {
  let juegos = [];
  if (fs.existsSync(nombreFichero)) {
    juegos = JSON.parse(fs.readFileSync(nombreFichero, "utf-8"));
  }
  return juegos;
}
function guardarJuegos(nombreFichero, arrayJuegos) {
  if (fs.existsSync(nombreFichero)) {
    if (arrayJuegos.length > 0 && arrayJuegos != null) {
      arrayJuegos = arrayJuegos.sort((a, b) => {
        return a.id - b.id;
      });
      fs.writeFileSync(nombreFichero, JSON.stringify(arrayJuegos));
    }
  }
}
module.exports = {
  cargarJuegos: cargarJuegos,
  guardarJuegos: guardarJuegos,
};
