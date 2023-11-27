const express = require('express');
const port = 3000;
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require('bcrypt');
// const router = express.Router();
const mongoose = require("mongoose");
const speakeasy = require('speakeasy');
const { config } = require('dotenv');
config();
// TODO:
// ** EN [] LOS REQUISITOS FUNCIONALES
// CREATE restaurante teniendo en mente [3,4]
// Añadir Two-Factor Authentication [7]
// Modular
// README
// Validaciones de HABILITADO [que se compruebe que si es FALSE i.e que no pueda hacer login y otras funcionalidades.]
const Skey = 'ojoazul'

// Configura la conexión a la base de datos
mongoose.connect("mongodb://localhost/db_Proyecto2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
app.use(express.json());

db.on("error", console.error.bind(console, "Error de conexión a la base de datos:"));
db.once("open", async () => {
  console.log("Conexión a la base de datos exitosa.");
  
});   
  // Definir modelos y esquemas para colecciones
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
  

  const restauranteSchema = new mongoose.Schema({
    nombre: String,
    categoria: String,
    popularidad: Number,
    habilitado: {
      type: Boolean,
      default: true  // Valor por defecto es habilitado (true)
    } 
  });
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
// Probando para [3,4]
  const extractUserIdFromToken = async (token) => {
    try {
      const decoded = await jwt.verify(token, Skey);
      return decoded.userId;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      return null;
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


function verifyTwoFactorToken(userSecret, twoFactorToken) {
  // Verify the token
  const verificationResult = speakeasy.totp.verify({
    secret: userSecret,
    token: twoFactorToken,
  });

  // Return the verification result
  return verificationResult;
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
    // const isTokenValid = verifyTwoFactorToken(user.twoFactorSecret, twoFactorToken);
    const isTokenValid = user.twoFactorSecret === twoFactorToken;
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

// Endpoint to generate a new 2FA secret for a user
app.post('/usuarios/generate-2fa-secret/:userId', async (req, res) => {
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
});

// Function to generate and enable 2FA for a user
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

// Function to enable 2FA for a user

// Schemas
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
  

  // Crear modelos
  const Producto = mongoose.model("Producto", productoSchema);
  const Usuario = mongoose.model("Usuario", usuarioSchema);
  const Restaurante = mongoose.model("Restaurante", restauranteSchema);
  const Pedido = mongoose.model("Pedido", pedidoSchema);


  // CRUD Usuario
  // CREATE un usuario
  app.post('/usuarios', async (req, res) => {
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
  });
  // READ usuario por ID o correo&contrasena 
  app.post('/usuarios/login', middleware, async (req, res) => {
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
        return res.json({ token });
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
  });
  
  
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
  
  
// UPDATE usuario dado un id.
app.put('/usuarios/:id', authenticateJWT, check2FA, async (req, res) => {
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
});
// DELETE inhabilitar usuario.
app.patch('/usuarios/:id/deshabilitar', authenticateJWT, async (req, res) => {
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
});

// Middleware de revisar si el usuario es admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await Usuario.findById(userId);

    if (!user || user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos de administrador' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ error: 'Error checking admin status' });
  }
};




  
  // CRUD Restaurante
     // CREATE 

app.post('/restaurantes', authenticateJWT, isAdmin, async (req, res) => {
  console.log('User Object:', req.user);
  const { nombre, categoria, popularidad } = req.body;
  
  try {

    const restaurante = new Restaurante({
      nombre,
      categoria,
      popularidad,
    });

    await restaurante.save();
    return res.status(201).json({ mensaje: 'Restaurante creado con éxito' });
  } catch (error) {
    console.error('Error al crear el restaurante:', error);
    return res.status(500).json({ error: 'Error al crear el restaurante' });
  }
});



    // READ retorna restaurantes que pertenezcan a la categoría proveída y/o su nombre se asemeje a la búsqueda.
    app.get('/restaurantes/busqueda', async (req, res) => {
      try {
        const { categoria, nombre } = req.query;
        let query = {};
    
        if (categoria) {
          
          query.categoria = { $regex: new RegExp(`.*${categoria}.*`, 'i') };
        }
    
        if (nombre) {
          // Detecta nombres que contengan la palabra, sea mayuscula o minúscula.
          query.nombre = { $regex: new RegExp(`.*${nombre}.*`, 'i') };
        }
    
        const restaurantes = await Restaurante.find(query);
    
        if (restaurantes.length === 0) {
          return res.status(404).json({ message: 'No se encontraron restaurantes que coincidan con los criterios de búsqueda.' });
        }
    
        return res.json(restaurantes);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al buscar restaurantes.' });
      }
    });
    
    
  // READ retorna los datos del restaurante que corresponde a la id proveída.
  app.get('/restaurantes/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const restaurante = await Restaurante.findOne({ _id: new mongoose.Types.ObjectId(id) }).exec();
      if (restaurante) {
        res.json(restaurante);
      } else {
        res.status(404).json({ error: 'Restaurante no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error al buscar el restaurante' });
    }
  });


  // UPDATE modifica los datos del RESTAURANTE que corresponde a la id proveída.
  app.put('/restaurantes/:id', authenticateJWT, async (req, res) => { 
    const restauranteId = req.params.id;
    const { nombre, categoria, popularidad } = req.body;
  
    try {
      // Verifica si el ID del restaurante es válido
      if (!mongoose.Types.ObjectId.isValid(restauranteId)) {
        return res.status(400).json({ error: 'ID de restaurante no válido' });
      }
  
      // Busca el restaurante por ID y actualiza sus datos
      const restaurante = await Restaurante.findByIdAndUpdate(
        restauranteId,
        { nombre, categoria, popularidad },
        { new: true } // Devuelve el restaurante actualizado
      );
  
      if (!restaurante) {
        return res.status(404).json({ error: 'Restaurante no encontrado' });
      }
  
      res.json(restaurante);
    } catch (error) {
      console.error('Error al actualizar el restaurante:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  // DELETE deshabilita un restaurante basado en la id proveída.
app.patch('/restaurantes/:id/deshabilitar', authenticateJWT, async (req, res) => {
  const restauranteId = req.params.id;
  try {
    const restaurante = await Restaurante.findById(restauranteId);
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }

    restaurante.habilitado = false;
    await restaurante.save();
    return res.json({ message: `Restaurante deshabilitado con éxito` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al deshabilitar el restaurante' });
  }
});


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  // CRUD productos
  // CREATE un producto
  app.post('/productos', authenticateJWT, async (req, res) => {
    try {
      const { nombre, descripcion, precio, restauranteId } = req.body;
  
      // Validar que todos los campos requeridos estén presentes
      if (!nombre || !descripcion || !precio || !restauranteId) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }
  
      // Verificar si el restaurante existe
      const restaurante = await Restaurante.findById(restauranteId);
      if (!restaurante) {
        return res.status(404).json({ error: 'Restaurante no encontrado' });
      }
  
      // Crear el producto
      const nuevoProducto = new Producto({
        nombre,
        descripcion,
        precio,
        restauranteId,
      });
  
      await nuevoProducto.save();
  
      return res.json({ message: 'Producto creado con éxito' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al crear el producto' });
    }
  // READ un producto basado en su id.

  });
  app.get('/productos/busqueda', async (req, res) => { 
    try {
      const { restauranteId, categoria } = req.query;
      let query = {};
  
      if (restauranteId && !mongoose.Types.ObjectId.isValid(restauranteId)) {
        return res.status(400).json({ error: 'ID de restaurante no válido' });
      }
  
      if (restauranteId) {
        query.restauranteId = restauranteId; 
      }
  
      if (categoria) {
        query.categoria = categoria;
      }
  
      const productos = await Producto.find(query);
  
      if (productos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos que coincidan con los criterios de búsqueda.' });
      }
  
      return res.json(productos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al buscar productos.' });
    }
  });
  
  app.get('/productos/:id', async (req, res) => {
    const productoId = req.params.id;
    try {
      // Realiza una búsqueda en la base de datos para encontrar el producto con el ID proporcionado
      const producto = await Producto.findById(productoId);
  
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      return res.json(producto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al buscar el producto' });
    }
  });
  
  
  
  
  
  // UPDATE modifica los datos del producto que corresponde a la id proveída, usando los datos proveídos
  app.put('/productos/:id',  authenticateJWT, async (req, res) => {
    try {
      const productoId = req.params.id;
      const { nombre, descripcion, precio, categoria, restauranteId } = req.body;
  
      // Verificar si el ID del producto es válido
      if (!mongoose.Types.ObjectId.isValid(productoId)) {
        return res.status(400).json({ error: 'ID de producto no válido' });
      }
  
      // Verificar si el producto existe
      const producto = await Producto.findById(productoId);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      // Actualizar los campos del producto con los datos proporcionados
      if (nombre) producto.nombre = nombre;
      if (descripcion) producto.descripcion = descripcion;
      if (precio) producto.precio = precio;
      if (categoria) producto.categoria = categoria;
      if (restauranteId) producto.restauranteId = restauranteId;
  
      // Guardar el producto actualizado en la base de datos
      await producto.save();
  
      return res.json({ message: 'Producto actualizado con éxito', producto });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });
  // DELETE “inhabilita” un producto que corresponde a la id proveída.

  app.patch('/productos/:id/inhabilitar', authenticateJWT, async (req, res) => {
    try {
      const productoId = req.params.id;
  
      // Verificar si el ID del producto es válido
      if (!mongoose.Types.ObjectId.isValid(productoId)) {
        return res.status(400).json({ error: 'ID de producto no válido' });
      }
  
      // Verificar si el producto existe
      const producto = await Producto.findById(productoId);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      // "Inhabilitar" el producto (siempre establecer el campo habilitado en false)
      producto.habilitado = false;
  
      // Guardar el producto "inhabilitado" en la base de datos
      await producto.save();
  
      return res.json({ message: 'Producto inhabilitado con éxito', producto });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al inhabilitar el producto' });
    }
  });
  // CRUD de Pedidos
  // CREATE crea un pedido de un usuario a un restaurante en la base de datos con los datos enviados al backend
  app.post('/pedidos', authenticateJWT,   async (req, res) => { // [3] Solo debe recibir el ID de usuario del JWT
    try {
      const { usuarioId = req.user.userId, restauranteId, productos, total, estado } = req.body;
      // Crea una instancia de Pedido con los datos recibidos
      const nuevoPedido = new Pedido({
        usuarioId,
        restauranteId,
        productos,
        total,
        estado
      });
      // Guarda el pedido en la base de datos
      await nuevoPedido.save();

      res.status(201).json({ mensaje: 'Pedido creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el pedido' });
    }
  });
  // READ retorna los datos de los pedidos realizados por el usuario proveído, enviados por el usuario proveído, pedidos a un
//restaurante proveído, y/o entre las fechas proveídas.
app.get('/pedidos/filtrados', async (req, res) => {
  try {
    const { usuarioId, restauranteId, enviadoPor, fechaInicio, fechaFin } = req.query;
    let condiciones = {};

    // Aplicar condiciones según los parámetros proporcionados
    if (usuarioId) {
      condiciones.usuarioId = usuarioId;
    }
    if (restauranteId) {
      condiciones.restauranteId = restauranteId;
    }
    if (enviadoPor) {
      condiciones.enviadoPor = enviadoPor;
    }
    if (fechaInicio && fechaFin) {
      condiciones.fechaPedido = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    const pedidosFiltrados = await Pedido.find(condiciones);

    res.status(200).json(pedidosFiltrados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos filtrados' });
  }
});
 // READ retorna los datos de los pedidos enviados, pero sin aceptar.
  app.get('/pedidos/enviados-sin-aceptar', async (req, res) => {
    try {
      // Buscar todos los pedidos con estado "enviado". Se asume que 'realizado' es aceptar.
      const pedidosEnviadosSinAceptar = await Pedido.find({ estado: 'enviado' });
  
      res.status(200).json(pedidosEnviadosSinAceptar);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los pedidos enviados sin aceptar' });
    }
  });
  
  // READ retorna los datos del pedido que corresponde a la id proveída.
  app.get('/pedidos/:id', async (req, res) => {
    try {
      const pedidoId = req.params.id;
  
      // Busca el pedido en la base de datos por su ID
      const pedido = await Pedido.findById(pedidoId);
  
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el pedido' });
    }
  });
  // UPDATE pedido por su ID
  
  app.put('/pedidos/:id', authenticateJWT, async (req, res) => {
    try {
      const pedidoId = req.params.id;
      const { productos, total, estado } = req.body;
  
      // Verificar si el pedido existe
      const pedido = await Pedido.findById(pedidoId);
  
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      // Verificar si el pedido no ha sido enviado ni realizado (o en otro estado que permite modificaciones)
      if (pedido.estado === 'enviado' || pedido.estado === 'realizado') {
        return res.status(403).json({ error: 'No se pueden modificar pedidos enviados o realizados' });
      }
  
      // Actualizar los datos del pedido
      pedido.productos = productos;
      pedido.total = total;
      pedido.estado = estado;
  
      // Guardar el pedido actualizado en la base de datos
      await pedido.save();
  
      res.status(200).json({ mensaje: 'Pedido modificado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al modificar el pedido' });
    }
  });
  // DELETE El endpoint “inhabilita” un producto que corresponde a la id proveída.
  app.put('/pedidos/inhabilitar/:id', authenticateJWT, async (req, res) => {
    try {
      const pedidoId = req.params.id;
  
      // Buscar el producto en la base de datos por su ID
      const pedido = await Pedido.findById(pedidoId);
  
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      // "Inhabilitar" el producto estableciendo habilitado en false
      pedido.habilitado = false;
  
      // Guardar el producto actualizado en la base de datos
      await pedido.save();
  
      res.status(200).json({ mensaje: 'Pedido inhabilitado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al inhabilitar el pedido' });
    }
  });
  
