const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const mongoose = require('mongoose');
const Usuario = require('../usuario/usuario.model');
const Pedido = require('../pedidos/pedidos.model');// Probando para [3,4]
const Restaurante = require('../restaurantes/restaurantes.model');
const Producto = require('../productos/productos.model');
const Skey = 'ojoazul'
  
  const check2FA = async (req, res, next) => {
    try {
      // Assuming you pass twoFactorToken in the request body
      const twoFactorToken = req.body.twoFactorToken;
  
      // Buscar el usuario por ID
      const userId = req.user.userId;
      const user = await Usuario.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Verificar permisos
      if (user.rol.includes('admin')) {
        // Si el rol contiene 'admin', activar la autenticación de dos factores
        if (!user.isTwoFactorEnabled) {
          const { secret, user: updatedUser } = await enableTwoFactor(userId);
          return res.json({
            mensaje: 'Usuario actualizado y autenticación de dos factores habilitada con éxito',
            secret,
            updatedUser,
          });
        }
  
        // Si el 2FA está habilitado, verificar el token proporcionado
        if (twoFactorToken) {
          const isTokenValid = verifyTwoFactor(user, twoFactorToken);
  
          if (!isTokenValid) {
            return res.status(401).json({ message: 'Invalid 2FA token.' });
          }
        } else {
          // Return an error if a 2FA token is required for admin but not provided
          return res.status(400).json({
            error: 'Se requiere un token de autenticación de dos factores para administradores.',
          });
        }
      }
  
      // Proceder con la actualización sin 2FA para usuarios no admin
      // ... Rest of your existing update logic ...
      // ...
  
      return res.json({ mensaje: 'Usuario actualizado con éxito', updatedUser: user });
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  };

  const extractUserIdFromToken = async (token) => {
    try {
      const decoded = await jwt.verify(token, Skey);
      return decoded.userId;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      return null;
    }
  };
// Middleware de revisar si el usuario es admin

const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    console.log(token);
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Formato de token no válido' });
    }
    
    const tokenValue = token.split(' ')[1];
    console.log(tokenValue)
    try {
      // Verify the token and decode the payload
      const decoded = jwt.verify(tokenValue, Skey);
      console.log(decoded);
      // Buscar usuario por id para saber si es administrador
      const user = await Usuario.findById(decoded.userId);

      if (!user || user.rol !== 'admin') {
        return res.status(403).json({ error: 'No tienes permisos de administrador' });
      }

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        // Invalid token
        return res.status(401).json({ error: 'Token inválido' });
      } else if (jwtError instanceof jwt.TokenExpiredError) {
        // Token expired
        return res.status(401).json({ error: 'Token expirado' });
      } else {
        // En otros casos de error de JWT
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ error: 'Error checking admin status' });
  }
};

// Función para generar el token JWT
  const generateToken = (userId) => {
  const token = jwt.sign({ userId }, Skey, { expiresIn: '1h' }); 
  return token;
};
// Middlewares
// Middleware de 2FA con speakeasy
  const generateSecret = () => {
  // Generar un secreto para el usuario (esto debería almacenarse de forma segura en la base de datos)
  return speakeasy.generateSecret({ length: 20 });
};

  const enableTwoFactor = async (userId, secret) => {
  try {
    // Update user in the database to enable 2FA
    const user = await Usuario.findByIdAndUpdate(
      userId,
      { $set: { isTwoFactorEnabled: true, twoFactorSecret: secret } },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error enabling 2FA for user:', error);
    throw new Error('Error enabling 2FA');
  }
};
  const verifyTwoFactor = (user, token) => {
  // Verificar el token de 2FA
  return speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 1, // Acepta tokens generados un poco antes o después del tiempo actual
  });
};

// Como es dificil el uso de un authenticator sin tener un frontend se usa la funcion debajo de los comentarios
//   function verifyTwoFactorToken(userSecret, twoFactorToken) {
//   // Verify the token
//   const verificationResult = speakeasy.totp.verify({
//     secret: userSecret,
//     token: twoFactorToken,
//   });

//   // Return the verification result
//   return verificationResult;
// }
function verifyTwoFactorToken(userSecret, twoFactorToken) {
  try {
    // Recibir el tiempo actual en segundos
    const currentTime = Math.floor(Date.now() / 1000);

    // // Generate a time-based token using the current time
    // const generatedToken = speakeasy.totp({
    //   secret: userSecret,
    //   encoding: 'base32',
    //   time: currentTime,
    // });

    // Verify the provided token against the generated token
    const verificationResult = speakeasy.totp.verify({
      secret: userSecret,
      token: twoFactorToken,
      window: 1, 
    });

    // Return the verification result
    return verificationResult;
  } catch (error) {
    console.error('Error verifying two-factor token:', error);
    return false; // Verification failed
  }
}
  const middleware = async (req, res, next) => {
  try {
    console.log('Request Body:', req.body); // Log the request body

    const { correoElectronico, contrasena, twoFactorToken } = req.body;

    // Check if email and password are provided
    if (!correoElectronico || !contrasena) {
      return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios' });
    }

    // Find the user by email and password
    const user = await Usuario.findOne({ correoElectronico: correoElectronico });
    
    if (!user || !user.isTwoFactorEnabled) {
      // Continue without 2FA verification
      console.log('User not found or 2FA not enabled, skipping 2FA verification');
      req.user = user;
      return next();
    }

    // Password verification
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 2FA verification
    console.log('Verifying 2FA token:', twoFactorToken);
    console.log(user.twoFactorSecret)
    const isTokenValid = verifyTwoFactorToken(user.twoFactorSecret, twoFactorToken);
    // const isTokenValid = user.twoFactorSecret === twoFactorToken;
    if (isTokenValid) {
      req.user = user;
      console.log('2FA token is valid, proceeding with the request');
      return next();
    } else {
      console.log('Invalid 2FA token');
      return res.status(401).json({ message: 'Invalid 2FA token.' });
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    return res.status(401).json({ message: 'Unauthorized.' });
  }
};


// Middleware de autenticacion JWT  
  const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Formato de token no válido' });
  }

  const tokenValue = token.split(' ')[1];

  jwt.verify(tokenValue, Skey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token expirado' });
      }
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = {
      userId: decoded.userId,
    };

    next();
  });
};
const generateAndEnableTwoFactor = async (userId) => {
  try {
    // Generate 2FA secret
    const secret = generateSecret();

    // Enable 2FA for the user
    const user = await enableTwoFactor(userId, secret.base32);

    // Return the secret and updated user details
    return { secret: secret.otpauth_url, user };
  } catch (error) {
    console.error('Error enabling 2FA for user:', error);
    throw new Error('Error generating 2FA secret');
  }
};
// function generateTOTPWithoutAuthenticator(userSecret) {
//   const currentTime = Math.floor(Date.now() / 1000); 
//   const totpCode = speakeasy.totp({
//     secret: userSecret,
//     encoding: 'base32', 
//     time: currentTime,
//   });
//   return totpCode;
// }

// Example usage

module.exports = {
  authenticateJWT,
  isAdmin,
  check2FA,
  middleware,
  verifyTwoFactor,
  verifyTwoFactorToken,
  generateSecret,
  generateToken,extractUserIdFromToken,
  generateAndEnableTwoFactor,
};