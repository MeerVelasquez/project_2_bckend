const mongoose = require("mongoose");
const productoSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    categoria: String,
    restauranteId: {
      type:mongoose.Schema.Types.ObjectId,
      required: true
    },
    habilitado: {
      type: Boolean,
      default: true  // Valor por defecto es habilitado (true)
    }  // Referencia al restaurante al que pertenece
  });

const Producto = mongoose.model("Producto", productoSchema);
module.exports = Producto;