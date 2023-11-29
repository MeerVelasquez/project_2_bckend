const express = require('express');
const {
    crearPedido,
    obtenerPedidosFiltrados,
    obtenerPedidosEnviadosSinAceptar,
    obtenerPedidoPorId,
    actualizarPedido,
    inhabilitarPedido,
  } = require('./pedidos.controller.js'); 
const { authenticateJWT } = require('../middlewares/authentication.js');
const routerPedido = express.Router();

// CREATE un pedido
routerPedido.post('', authenticateJWT, crearPedido);

// READ pedidos filtrados
routerPedido.get('/filtrados', obtenerPedidosFiltrados);

// READ pedidos enviados sin aceptar
routerPedido.get('/enviados-sin-aceptar', obtenerPedidosEnviadosSinAceptar);

// READ pedido por ID
routerPedido.get('/:id', authenticateJWT, obtenerPedidoPorId);

// UPDATE pedido por ID
routerPedido.put('/:id', actualizarPedido);

// DELETE eliminar pedido por ID
routerPedido.delete('/inhabilitar/:id', inhabilitarPedido);

module.exports = routerPedido;
