const mongoose = require("mongoose");
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    correoElectronico: {
      type: String,
      required: true,
      unique: true
    },
    contrasena: {
      type: String,
      required: true
    },
    numeroCelular: String,
    direccion: String,
    rol: String,
    habilitado: {
      type: Boolean,
      default: true  // Valor por defecto es habilitado (true)
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String, // Store the base32-encoded secret for TOTP
  });

const Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;
