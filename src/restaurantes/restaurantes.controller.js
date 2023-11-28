const mongoose = require('mongoose');
const Restaurante = require('../restaurantes/restaurantes.model'); // Adjust the path accordingly

// CREATE a restaurante
 async function crearRestaurante(req, res) {
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
}

// READ restaurantes based on provided category and/or name
 async function buscarRestaurantes(req, res) {
  try {
    const { categoria, nombre } = req.query;
    let query = {};

    if (categoria) {
      query.categoria = { $regex: new RegExp(`.*${categoria}.*`, 'i') };
    }

    if (nombre) {
      query.nombre = { $regex: new RegExp(`.*${nombre}.*`, 'i') };
    }

    const restaurantes = await Restaurante.find(query);

    if (restaurantes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron restaurantes que coincidan con los criterios de búsqueda.' });
    }

    return res.status(201).json(restaurantes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al buscar restaurantes.' });
  }
}

// READ restaurante by ID
 async function obtenerRestaurantePorId(req, res) {
  const id = req.params.id;

  try {
    const restaurante = await Restaurante.findOne({ _id: new mongoose.Types.ObjectId(id) }).exec();
    if (restaurante) {
      res.status(201).json(restaurante);
    } else {
      res.status(404).json({ error: 'Restaurante no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el restaurante' });
  }
}

// UPDATE restaurante by ID
 async function actualizarRestaurante(req, res) {
  const restauranteId = req.params.id;
  const { nombre, categoria, popularidad } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(restauranteId)) {
      return res.status(400).json({ error: 'ID de restaurante no válido' });
    }

    const restaurante = await Restaurante.findByIdAndUpdate(
      restauranteId,
      { nombre, categoria, popularidad },
      { new: true }
    );

    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }

    res.status(200).json(restaurante);
  } catch (error) {
    console.error('Error al actualizar el restaurante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// PATCH deshabilita un restaurante based en la ID proveída
 async function deshabilitarRestaurante(req, res) {
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
}
module.exports = { crearRestaurante, buscarRestaurantes, obtenerRestaurantePorId, actualizarRestaurante, deshabilitarRestaurante };