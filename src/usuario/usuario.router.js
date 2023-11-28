const express = require('express');
const mongoose = require('mongoose');
const {
  crearUsuario,
  leerUsuario,
  updateUsuario,
  inhabilitarUsuario,
  generate2FAKey
} = require('./usuario.controller'); 
const {  isAdmin,
  check2FA, generateAndEnableTwoFactor} = require('../middlewares/authentication');
const router = express.Router();
// Routes for handling user operations
router.post('/', crearUsuario);
router.post('/login', leerUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', isAdmin, inhabilitarUsuario);
router.post('/generate-2fa-secret/:userId',generate2FAKey, generateAndEnableTwoFactor);
// Endpoint for checking 2FA
router.post('/check-2fa', check2FA);

module.exports = router;

