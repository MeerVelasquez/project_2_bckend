const mongoose = require("mongoose");
const pedidoSchema = new mongoose.Schema({
    usuarioId: mongoose.Schema.Types.ObjectId,
    restauranteId: mongoose.Schema.Types.ObjectId,
    productos: [
      {
        productoId: mongoose.Schema.Types.ObjectId,
        cantidad: Number
      }
    ],
    total: Number,
    estado: String,
    fechaPedido: {
      type: Date,
      default: Date.now  // Valor por defecto es la fecha y hora actual
    },
    habilitado: {
      type: Boolean,
      default: true  // Valor por defecto es habilitado (true)
    }
  });
  const Pedido = mongoose.model("Pedido", pedidoSchema);
  module.exports = Pedido;