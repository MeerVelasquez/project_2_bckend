const express = require('express');
const { crearRestaurante, buscarRestaurantes, obtenerRestaurantePorId, actualizarRestaurante, deshabilitarRestaurante } = require('./restaurantes.controller.js'); 
const { authenticateJWT, isAdmin, middleware } = require('../middlewares/authentication'); 
const routerRestaurante = express.Router();
// CREATE a restaurante
routerRestaurante.post('/', authenticateJWT, isAdmin, crearRestaurante);

// READ restaurantes based on provided category and/or name
routerRestaurante.get('/restaurantes/busqueda', buscarRestaurantes);

// READ restaurante by ID
routerRestaurante.get('/:id', obtenerRestaurantePorId);

// UPDATE restaurante by ID
routerRestaurante.put('/:id', authenticateJWT, actualizarRestaurante);

// PATCH deshabilita un restaurante based en la ID proveída
routerRestaurante.patch('/:id/deshabilitar', authenticateJWT, deshabilitarRestaurante);

module.exports = routerRestaurante;

