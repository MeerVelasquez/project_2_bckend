const mongoose = require("mongoose");
const restauranteSchema = new mongoose.Schema({
    nombre: String,
    categoria: String,
    popularidad: Number,
    habilitado: {
      type: Boolean,
      default: true  // Valor por defecto es habilitado (true)
    } 
  });

const Restaurante = mongoose.model('Restaurante', restauranteSchema);
module.exports = Restaurante;
