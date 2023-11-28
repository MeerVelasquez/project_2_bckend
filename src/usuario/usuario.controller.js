const Usuario = require('./usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {  isAdmin,
  check2FA, generateAndEnableTwoFactor, generateToken} = require('../middlewares/authentication');
  // CREATE un usuario
    async  function crearUsuario (req, res)  {
    try {
      const { nombre, correoElectronico, contrasena, numeroCelular, direccion, rol } = req.body;
  
      // Usando bcrypt para encriptar
      const hashcontrasena = await bcrypt.hash(contrasena, 10);
  
      // Instancia de modelo usuario
      const nuevoUsuario = new Usuario({
        nombre,
        correoElectronico,  
        contrasena: hashcontrasena, // Guarda la contrasena en hash
        numeroCelular,
        direccion,
        rol,
      });
  
      
      await nuevoUsuario.save();
  
      res.status(201).json({ mensaje: 'Usuario creado con éxito' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  };
  // READ usuario por ID o correo&contrasena 
   async function leerUsuario (req, res)  {
    const { correoElectronico, contrasena, _id, twoFactorToken } = req.body;
  
    if (mongoose.Types.ObjectId.isValid(_id)) {
      try {
        const usuario = await Usuario.findById(_id);
        if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
  
        const token = generateToken(usuario._id);
        console.log('Generated Token:', token);
  
        // Send the token to the client, e.g., in the response body
        return res.status(201).json({ token });
      } catch (err) {
        return res.status(500).json({ error: 'Error al buscar el usuario' });
      }
    } else if (correoElectronico && contrasena) {
      try {
        const usuario = await Usuario.findOne({ correoElectronico: correoElectronico });
        console.log(usuario);
  
        const check = await bcrypt.compare(contrasena, usuario.contrasena);
        console.log(check);
  
        if (!check) {
          return res.status(404).json({ error: 'Usuario no encontrado o contraseña incorrecta' });
        }
  
        // Check if 2FA is enabled for the user
        if (usuario.isTwoFactorEnabled) {
          // Ensure twoFactorToken is present in the request body
          if (!twoFactorToken) {
            return res.status(400).json({ error: 'Se requiere un token de autenticación de dos factores.' });
          }
  
          // Verify the 2FA token
        }
  
        const token = generateToken(usuario._id);
        console.log(token);
  
        return res.json({ usuario, token });
      } catch (err) {
        return res.status(500).json({ error: 'Error al buscar el usuario' });
      }
    } else {
      return res.status(400).json({ error: 'Parámetros no válidos' });
    }
  };
  
  
// UPDATE usuario dado un id.
  async function updateUsuario (req, res) {
  const { id } = req.params;
  const { nombre, correoElectronico, contrasena, numeroCelular, direccion, rol } = req.body;

  // Validar que el ID sea válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de usuario no válido' });
  }
 
  try {
    // Verificar permisos (descomentar según sea necesario)
    // if (req.user.rol !== 'admin' && req.user._id !== id) {
    //   return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    // }

    // Hashear la contraseña si se proporciona
    let hashedContrasena;
    if (contrasena) {
      const saltRounds = 10; // Número de rondas para la generación de la sal
      hashedContrasena = await bcrypt.hash(contrasena, saltRounds);
    }

    // Construir objeto de actualización excluyendo campos undefined
    const updateFields = {
      nombre,
      correoElectronico,
      contrasena: hashedContrasena,
      numeroCelular,
      direccion,
      rol,
    };
    const filteredUpdateFields = Object.fromEntries(Object.entries(updateFields).filter(([_, v]) => v !== undefined));

    // Actualizar el usuario
    const usuario = await Usuario.findByIdAndUpdate(id, filteredUpdateFields, { new: true });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json(usuario);
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
}
// DELETE inhabilitar usuario.
  async function inhabilitarUsuario (req, res)  {
  const usuarioId = req.params.id;

  try {
    // Verificar si el usuario con el ID proporcionado existe en la base de datos
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Cambiar la propiedad "habilitado" a false
    usuario.habilitado = false;

    // Guardar el usuario actualizado
    await usuario.save();

    return res.json({ message: 'Usuario deshabilitado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al deshabilitar el usuario' });
  }
}
async function generate2FAKey(req, res) {
  const { userId } = req.params;

  try {
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // Call the function to generate the 2FA secret
    const result = await generateAndEnableTwoFactor(userId);

    // Send the response with the generated secret and updated user details
    res.json(result);
  } catch (error) {
    console.error('Error generating 2FA secret:', error);
    res.status(500).json({ error: 'Error generating 2FA secret' });
  }
}
module.exports = {
  crearUsuario,
  leerUsuario,
  updateUsuario,
  inhabilitarUsuario,
  generate2FAKey,
};




  