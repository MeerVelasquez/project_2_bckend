const Producto = require('./productos.model.js'); 
const Restaurante = require('../restaurantes/restaurantes.model.js');
const mongoose = require('mongoose');

// CREATE a producto
  async function crearProducto(req, res) {
  try {
    const { nombre, descripcion, precio, categoria, restauranteId } = req.body;

    if (!nombre || !descripcion || !precio || !restauranteId) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const restaurante = await Restaurante.findById(restauranteId);
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      restauranteId,
    });

    await nuevoProducto.save();

    return res.status(200).json({ message: 'Producto creado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el producto' });
  }
}

// READ productos based on provided criteria
  async function buscarProductos(req, res) {
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

    return res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al buscar productos.' });
  }
}

// READ producto by ID
  async function obtenerProductoPorId(req, res) {
  const productoId = req.params.id;
  try {
    const producto = await Producto.findById(productoId);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al buscar el producto' });
  }
}

// UPDATE producto by ID
  async function actualizarProducto(req, res) {
  try {
    const productoId = req.params.id;
    const { nombre, descripcion, precio, categoria, restauranteId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ error: 'ID de producto no válido' });
    }

    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (nombre) producto.nombre = nombre;
    if (descripcion) producto.descripcion = descripcion;
    if (precio) producto.precio = precio;
    if (categoria) producto.categoria = categoria;
    if (restauranteId) producto.restauranteId = restauranteId;

    await producto.save();

    return res.status(200).json({ message: 'Producto actualizado con éxito', producto });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
}

// PATCH deshabilita un producto based en la ID proveída
  async function inhabilitarProducto(req, res) {
  try {
    const productoId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ error: 'ID de producto no válido' });
    }

    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    producto.habilitado = false;

    await producto.save();

    return res.status(200).json({ message: 'Producto inhabilitado con éxito', producto });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al inhabilitar el producto' });
  }
}
module.exports ={
  crearProducto,
  buscarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  inhabilitarProducto,
}