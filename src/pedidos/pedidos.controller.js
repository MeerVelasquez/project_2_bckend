const Pedido = require('./pedidos.model.js'); 
const mongoose = require('mongoose');
// CREATE un pedido
  async function crearPedido(req, res) {
  try {
    const { usuarioId = req.user.userId, restauranteId, productos, total, estado } = req.body;

    // Crea una instancia de Pedido con los datos recibidos
    const nuevoPedido = new Pedido({
      usuarioId,
      restauranteId,
      productos,
      total,
      estado,
    });

    // Guarda el pedido en la base de datos
    await nuevoPedido.save();

    res.status(201).json({ mensaje: 'Pedido creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
}

// READ pedidos filtrados
  async function obtenerPedidosFiltrados(req, res) {
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
}

// READ pedidos enviados sin aceptar
  async function obtenerPedidosEnviadosSinAceptar(req, res) {
  try {
    // Buscar todos los pedidos con estado "enviado". Se asume que 'realizado' es aceptar.
    const pedidosEnviadosSinAceptar = await Pedido.find({ estado: 'enviado' });

    res.status(200).json(pedidosEnviadosSinAceptar);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos enviados sin aceptar' });
  }
}

// READ pedido por ID
  async function obtenerPedidoPorId(req, res) {
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
}

// UPDATE pedido por ID
  async function actualizarPedido(req, res) {
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
}

// DELETE inhabilitar pedido por ID
  async function inhabilitarPedido(req, res) {
  try {
    const pedidoId = req.params.id;

    // Buscar el pedido en la base de datos por su ID
    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // "Inhabilitar" el pedido estableciendo habilitado en false
    pedido.habilitado = false;

    // Guardar el pedido "inhabilitado" en la base de datos
    await pedido.save();

    res.status(200).json({ mensaje: 'Pedido inhabilitado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al inhabilitar el pedido' });
  }
}
module.exports = {
  crearPedido,
  obtenerPedidosFiltrados,
  obtenerPedidosEnviadosSinAceptar,
  obtenerPedidoPorId,
  actualizarPedido,
  inhabilitarPedido,
};