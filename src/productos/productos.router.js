const express = require('express');
const { authenticateJWT } = require('../middlewares/authentication.js');
const {
  crearProducto,
  buscarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  inhabilitarProducto,
} = require('./productos.controller.js'); 

const routerProducto = express.Router();

// CREATE a producto
routerProducto.post('', authenticateJWT, crearProducto);

 // READ un producto basado en su id.
routerProducto.get('/busqueda', buscarProductos);
 // READ un producto basado en su id.
 routerProducto.get('/:id',  obtenerProductoPorId);
 // UPDATE modifica los datos del RESTAURANTE que corresponde a la id proveída.
routerProducto.put('/:id', authenticateJWT, actualizarProducto);

  // DELETE deshabilita un restaurante basado en la id proveída.
routerProducto.delete('/:id', authenticateJWT, inhabilitarProducto);

// UPDATE modifica los datos del producto que corresponde a la id proveída, usando los datos proveídos
routerProducto.put('/:id',  authenticateJWT);

module.exports = routerProducto;


