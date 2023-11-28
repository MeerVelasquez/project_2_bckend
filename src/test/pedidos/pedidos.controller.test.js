const {crearPedido,
    obtenerPedidosFiltrados,
    obtenerPedidosEnviadosSinAceptar,
    obtenerPedidoPorId,
    actualizarPedido,
    inhabilitarPedido, } = require('.../pedidos/pedidos.controller');
const Pedido = require('.../pedidos/pedidos.model'); 
const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('bcrypt');
jest.mock('.../pedidos/pedidos.model');
jest.mock('.../middlewares/authentication');

describe('Controlador de Creación de Pedido', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('POST /pedidos', () => {
      test('debería crear un nuevo pedido exitosamente', async () => {
        const mockPedido = {
          usuarioId: mongoose.Types.ObjectId(),
          restauranteId: mongoose.Types.ObjectId(),
          productos: [{ nombre: 'Producto 1', cantidad: 2 }],
          total: 50,
          estado: 'pendiente',
        };
        Pedido.prototype.save.mockResolvedValueOnce(); 
  
        const response = await request(app)
          .post('/pedidos')
          .set('Authorization', 'Bearer mockJWT') 
          .send(mockPedido);
  
        expect(response.statusCode).toBe(201);

      });

      test('debería crear un nuevo pedido exitosamente-body', async () => {
        const mockPedido = {
          usuarioId: mongoose.Types.ObjectId(),
          restauranteId: mongoose.Types.ObjectId(),
          productos: [{ nombre: 'Producto 1', cantidad: 2 }],
          total: 50,
          estado: 'pendiente',
        };
        Pedido.prototype.save.mockResolvedValueOnce(); 
  
        const response = await request(app)
          .post('/pedidos')
          .set('Authorization', 'Bearer mockJWT') 
          .send(mockPedido);
  
        expect(response.body).toEqual({ mensaje: 'Pedido creado exitosamente' });

      });
  
      test('debería manejar errores al crear un nuevo pedido', async () => {
        const mockPedidoConError = {
          restauranteId: mongoose.Types.ObjectId(),
          productos: [{ nombre: 'Producto 1', cantidad: 2 }],
          total: 50,
          estado: 'pendiente',
        };
  
        const response = await request(app)
          .post('/pedidos')
          .set('Authorization', 'Bearer mockJWT')
          .send(mockPedidoConError);
  
        expect(response.statusCode).toBe(500);
      });

      test('debería manejar errores al crear un nuevo pedido - body', async () => {
        const mockPedidoConError = {
          restauranteId: mongoose.Types.ObjectId(),
          productos: [{ nombre: 'Producto 1', cantidad: 2 }],
          total: 50,
          estado: 'pendiente',
        };
  
        const response = await request(app)
          .post('/pedidos')
          .set('Authorization', 'Bearer mockJWT')
          .send(mockPedidoConError);

        expect(response.body).toEqual({ error: 'Error al crear el pedido' });
      });
    });
  });


  describe('Controlador de Obtener Pedidos Filtrados', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('GET /pedidos/filtrados', () => {
      test('debería obtener pedidos filtrados exitosamente', async () => {
        const condicionesFiltradas = {
          usuarioId: mongoose.Types.ObjectId(),
          restauranteId: mongoose.Types.ObjectId(),
          enviadoPor: 'admin',
          fechaInicio: '2023-01-01',
          fechaFin: '2023-01-31',
        };
        const mockPedidosFiltrados = [{ _id: mongoose.Types.ObjectId(), ...condicionesFiltradas }];
  
        Pedido.find.mockResolvedValueOnce(mockPedidosFiltrados);
  
        const response = await request(app)
          .get('/pedidos/filtrados')
          .query(condicionesFiltradas);
  
        expect(response.statusCode).toBe(200);

      });

      test('debería obtener pedidos filtrados exitosamente - body', async () => {
        const condicionesFiltradas = {
          usuarioId: mongoose.Types.ObjectId(),
          restauranteId: mongoose.Types.ObjectId(),
          enviadoPor: 'admin',
          fechaInicio: '2023-01-01',
          fechaFin: '2023-01-31',
        };
        const mockPedidosFiltrados = [{ _id: mongoose.Types.ObjectId(), ...condicionesFiltradas }];
  
        Pedido.find.mockResolvedValueOnce(mockPedidosFiltrados);
  
        const response = await request(app)
          .get('/pedidos/filtrados')
          .query(condicionesFiltradas);
        expect(response.body).toEqual(mockPedidosFiltrados);
      });

      test('debería manejar errores al obtener pedidos filtrados', async () => {
        Pedido.find.mockRejectedValueOnce(new Error('Error al obtener pedidos filtrados'));
  
        const response = await request(app)
          .get('/pedidos/filtrados')
          .query({ usuarioId: mongoose.Types.ObjectId() });
  
        expect(response.statusCode).toBe(500);
      });

      test('debería manejar errores al obtener pedidos filtrados- body', async () => {
        Pedido.find.mockRejectedValueOnce(new Error('Error al obtener pedidos filtrados'));
  
        const response = await request(app)
          .get('/pedidos/filtrados')
          .query({ usuarioId: mongoose.Types.ObjectId() });
  
        expect(response.body).toEqual({ error: 'Error al obtener los pedidos filtrados' });
      });

    });
  });

  describe('Controlador de Obtener Pedidos Enviados Sin Aceptar', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('GET /pedidos/enviados-sin-aceptar', () => {
      test('debería obtener pedidos enviados sin aceptar exitosamente', async () => {
        const mockPedidosEnviadosSinAceptar = [{ _id: mongoose.Types.ObjectId(), estado: 'enviado' }];
  
        Pedido.find.mockResolvedValueOnce(mockPedidosEnviadosSinAceptar);
  
        const response = await request(app)
          .get('/pedidos/enviados-sin-aceptar');
  
        expect(response.statusCode).toBe(200);

      });

      test('debería obtener pedidos enviados sin aceptar exitosamente - body', async () => {
        const mockPedidosEnviadosSinAceptar = [{ _id: mongoose.Types.ObjectId(), estado: 'enviado' }];
  
        Pedido.find.mockResolvedValueOnce(mockPedidosEnviadosSinAceptar);
  
        const response = await request(app)
          .get('/pedidos/enviados-sin-aceptar');
  

        expect(response.body).toEqual(mockPedidosEnviadosSinAceptar);
      });
  
      test('debería manejar errores al obtener pedidos enviados sin aceptar', async () => {
        Pedido.find.mockRejectedValueOnce(new Error('Error al obtener pedidos enviados sin aceptar'));
  
        const response = await request(app)
          .get('/pedidos/enviados-sin-aceptar');
  
        expect(response.statusCode).toBe(500);

      });

      test('debería manejar errores al obtener pedidos enviados sin aceptar - body', async () => {
        Pedido.find.mockRejectedValueOnce(new Error('Error al obtener pedidos enviados sin aceptar'));
  
        const response = await request(app)
          .get('/pedidos/enviados-sin-aceptar');

        expect(response.body).toEqual({ error: 'Error al obtener los pedidos enviados sin aceptar' });
      });
    });
  });

  describe('Controlador de Obtener Pedido por ID', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('GET /pedidos/:id', () => {
      test('debería obtener el pedido por ID exitosamente', async () => {
        const mockPedido = { _id: mongoose.Types.ObjectId(), estado: 'enviado' };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
  
        const response = await request(app)
          .get(`/pedidos/${mockPedido._id}`);
  
        expect(response.statusCode).toBe(200);

      });
      test('debería obtener el pedido por ID exitosamente-body', async () => {
        const mockPedido = { _id: mongoose.Types.ObjectId(), estado: 'enviado' };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
  
        const response = await request(app)
          .get(`/pedidos/${mockPedido._id}`);
  

        expect(response.body).toEqual(mockPedido);
      });
  
      test('debería manejar el caso en que el pedido no se encuentra', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
  
        Pedido.findById.mockResolvedValueOnce(null);
  
        const response = await request(app)
          .get(`/pedidos/${mockPedidoId}`);
  
        expect(response.statusCode).toBe(404);
      });

      test('debería manejar el caso en que el pedido no se encuentra-body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
  
        Pedido.findById.mockResolvedValueOnce(null);
  
        const response = await request(app)
          .get(`/pedidos/${mockPedidoId}`);
  
        expect(response.body).toEqual({ error: 'Pedido no encontrado' });
      });
  
      test('debería manejar errores al obtener el pedido por ID', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
  
        Pedido.findById.mockRejectedValueOnce(new Error('Error al obtener el pedido por ID'));
  
        const response = await request(app)
          .get(`/pedidos/${mockPedidoId}`);
  
        expect(response.statusCode).toBe(500);
      });

      test('debería manejar errores al obtener el pedido por ID - body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
  
        Pedido.findById.mockRejectedValueOnce(new Error('Error al obtener el pedido por ID'));
  
        const response = await request(app)
          .get(`/pedidos/${mockPedidoId}`);
  

        expect(response.body).toEqual({ error: 'Error al obtener el pedido' });
      });
  

    });
  });

  describe('Controlador de Actualizar Pedido por ID', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('PUT /pedidos/:id', () => {
      test('debería actualizar el pedido por ID exitosamente', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, estado: 'pendiente', productos: [], total: 0 };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockResolvedValueOnce(mockPedido);
  
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);
  
        expect(response.statusCode).toBe(200);

      });

      test('debería actualizar el pedido por ID exitosamente - body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, estado: 'pendiente', productos: [], total: 0 };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockResolvedValueOnce(mockPedido);
  
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);
        expect(response.body).toEqual({ mensaje: 'Pedido modificado exitosamente' });

      });
  
      test('debería manejar el caso en que el pedido no se encuentra', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        Pedido.findById.mockResolvedValueOnce(null);
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);
  
        expect(response.statusCode).toBe(404);

      });

      test('debería manejar el caso en que el pedido no se encuentra - body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        Pedido.findById.mockResolvedValueOnce(null);
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);
 
        expect(response.body).toEqual({ error: 'Pedido no encontrado' });
      });
  
      test('debería manejar el caso en que el pedido no puede ser modificado', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, estado: 'enviado', productos: [], total: 0 };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
  
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);
  
        expect(response.statusCode).toBe(403);
      

      });

      test('debería manejar el caso en que el pedido no puede ser modificado - body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, estado: 'enviado', productos: [], total: 0 };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
  
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);

        expect(response.body).toEqual({ error: 'No se pueden modificar pedidos enviados o realizados' });

      });
  
      test('debería manejar errores al intentar actualizar el pedido', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, estado: 'pendiente', productos: [], total: 0 };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockRejectedValueOnce(new Error('Error al actualizar el pedido'));
  
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);
  
        expect(response.statusCode).toBe(500);

      });

      test('debería manejar errores al intentar actualizar el pedido - body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, estado: 'pendiente', productos: [], total: 0 };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockRejectedValueOnce(new Error('Error al actualizar el pedido'));
  
        const nuevosDatosPedido = { productos: [{ nombre: 'Producto1', precio: 10 }], total: 10, estado: 'realizado' };
  
        const response = await request(app)
          .put(`/pedidos/${mockPedidoId}`)
          .send(nuevosDatosPedido);
  
        expect(response.body).toEqual({ error: 'Error al modificar el pedido' });
      });

    });
  });

  describe('Controlador de Inhabilitar Pedido por ID', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('DELETE /pedidos/:id', () => {
      test('debería inhabilitar el pedido por ID exitosamente', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, habilitado: true };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockResolvedValueOnce(mockPedido);
  
        const response = await request(app).delete(`/pedidos/${mockPedidoId}`);
  
        expect(response.statusCode).toBe(200);

      });

      test('debería inhabilitar el pedido por ID exitosamente-body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, habilitado: true };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockResolvedValueOnce(mockPedido);
  
        const response = await request(app).delete(`/pedidos/${mockPedidoId}`);
  

        expect(response.body).toEqual({ mensaje: 'Pedido inhabilitado exitosamente' });
      });
  
      test('debería manejar el caso en que el pedido no se encuentra', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
  
        Pedido.findById.mockResolvedValueOnce(null);
  
        const response = await request(app).delete(`/pedidos/${mockPedidoId}`);
  
        expect(response.statusCode).toBe(404);
  

      });

      test('debería manejar el caso en que el pedido no se encuentra - body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
  
        Pedido.findById.mockResolvedValueOnce(null);
  
        const response = await request(app).delete(`/pedidos/${mockPedidoId}`);

        expect(response.body).toEqual({ error: 'Pedido no encontrado' });

      });
  
      test('debería manejar errores al intentar inhabilitar el pedido', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, habilitado: true };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockRejectedValueOnce(new Error('Error al inhabilitar el pedido'));
  
        const response = await request(app).delete(`/pedidos/${mockPedidoId}`);
  
        expect(response.statusCode).toBe(500);

 
      });

      test('debería manejar errores al intentar inhabilitar el pedido - body', async () => {
        const mockPedidoId = mongoose.Types.ObjectId();
        const mockPedido = { _id: mockPedidoId, habilitado: true };
  
        Pedido.findById.mockResolvedValueOnce(mockPedido);
        Pedido.findByIdAndUpdate.mockRejectedValueOnce(new Error('Error al inhabilitar el pedido'));
  
        const response = await request(app).delete(`/pedidos/${mockPedidoId}`);
  

        expect(response.body).toEqual({ error: 'Error al inhabilitar el pedido' });
 
      });
  

    });
  });