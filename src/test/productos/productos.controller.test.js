const request = require('supertest');
const app = require('../../index'); 
const mongoose = require('mongoose');
const Producto = require('../../productos/productos.model');
const Restaurante = require('../../restaurantes/restaurantes.model');

jest.mock('.../productos/productos.model');
jest.mock('.../restaurantes/restaurantes.model');

describe('Controlador de Productos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Crear Producto', () => {
    test('debería crear un producto exitosamente', async () => {
      const mockRestauranteId = mongoose.Types.ObjectId();
      const mockProducto = { nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 10, restauranteId: mockRestauranteId };

      Restaurante.findById.mockResolvedValueOnce({ _id: mockRestauranteId });
      Producto.prototype.save.mockResolvedValueOnce(mockProducto);

      const response = await request(app)
        .post('/productos')
        .send(mockProducto);

      expect(response.statusCode).toBe(200);
    });

    test('debería crear un producto exitosamente - body', async () => {
        const mockRestauranteId = mongoose.Types.ObjectId();
        const mockProducto = { nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 10, restauranteId: mockRestauranteId };
  
        Restaurante.findById.mockResolvedValueOnce({ _id: mockRestauranteId });
        Producto.prototype.save.mockResolvedValueOnce(mockProducto);
  
        const response = await request(app)
          .post('/productos')
          .send(mockProducto);
  
        expect(response.body).toEqual({ message: 'Producto creado con éxito' });
      });

      test('debería devolver un error 400 si faltan campos obligatorios', async () => {
        const response = await request(app)
          .post('/productos')
          .send({ nombre: 'Producto sin campos obligatorios' });
    
        expect(response.statusCode).toBe(400);

      });
      test('debería devolver un error 400 si faltan campos obligatorios-body', async () => {
        const response = await request(app)
          .post('/productos')
          .send({ nombre: 'Producto sin campos obligatorios' });

        expect(response.body).toEqual({ error: 'Todos los campos son obligatorios.' });
      });

      test('debería devolver un error 404 si el restaurante no se encuentra', async () => {
        const mockProducto = { nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 10, restauranteId: mongoose.Types.ObjectId() };
    
        Restaurante.findById.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .post('/productos')
          .send(mockProducto);
    
        expect(response.statusCode).toBe(404);

      });
    
      test('debería devolver un error 404 si el restaurante no se encuentra -body', async () => {
        const mockProducto = { nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 10, restauranteId: mongoose.Types.ObjectId() };
    
        Restaurante.findById.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .post('/productos')
          .send(mockProducto);
    

        expect(response.body).toEqual({ error: 'Restaurante no encontrado' });
      });

      test('debería devolver un error 500 si hay un error al guardar el producto', async () => {
        const mockRestauranteId = mongoose.Types.ObjectId();
        const mockProducto = { nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 10, restauranteId: mockRestauranteId };
    
        Restaurante.findById.mockResolvedValueOnce({ _id: mockRestauranteId });
        Producto.prototype.save.mockRejectedValueOnce(new Error('Error al guardar el producto'));
    
        const response = await request(app)
          .post('/productos')
          .send(mockProducto);
    
        expect(response.statusCode).toBe(500);
    
      });

      test('debería devolver un error 500 si hay un error al guardar el producto-body', async () => {
        const mockRestauranteId = mongoose.Types.ObjectId();
        const mockProducto = { nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 10, restauranteId: mockRestauranteId };
    
        Restaurante.findById.mockResolvedValueOnce({ _id: mockRestauranteId });
        Producto.prototype.save.mockRejectedValueOnce(new Error('Error al guardar el producto'));
    
        const response = await request(app)
          .post('/productos')
          .send(mockProducto);
    

        expect(response.body).toEqual({ error: 'Error al crear el producto' });
      });
  });

  describe('Buscar Productos', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    
      test('debería buscar productos correctamente', async () => {
        const mockRestauranteId = mongoose.Types.ObjectId();
        const mockCategoria = 'Bebida';
        const mockProductos = [
          { _id: mongoose.Types.ObjectId(), nombre: 'Producto 1', categoria: mockCategoria, restauranteId: mockRestauranteId },
          { _id: mongoose.Types.ObjectId(), nombre: 'Producto 2', categoria: mockCategoria, restauranteId: mockRestauranteId },
        ];
    
        Producto.find.mockResolvedValueOnce(mockProductos);
    
        const response = await request(app)
          .get('/productos')
          .query({ restauranteId: mockRestauranteId, categoria: mockCategoria });
    
        expect(response.statusCode).toBe(200);
  
      });

      test('debería buscar productos correctamente - body', async () => {
        const mockRestauranteId = mongoose.Types.ObjectId();
        const mockCategoria = 'Bebida';
        const mockProductos = [
          { _id: mongoose.Types.ObjectId(), nombre: 'Producto 1', categoria: mockCategoria, restauranteId: mockRestauranteId },
          { _id: mongoose.Types.ObjectId(), nombre: 'Producto 2', categoria: mockCategoria, restauranteId: mockRestauranteId },
        ];
    
        Producto.find.mockResolvedValueOnce(mockProductos);
    
        const response = await request(app)
          .get('/productos')
          .query({ restauranteId: mockRestauranteId, categoria: mockCategoria });

        expect(response.body).toEqual(mockProductos);
      });

      test('debería devolver un error 400 si el ID del restaurante no es válido', async () => {
        const response = await request(app)
          .get('/productos')
          .query({ restauranteId: 'IDInvalido' });
    
        expect(response.statusCode).toBe(400);
  
      });

      test('debería devolver un error 400 si el ID del restaurante no es válido - body', async () => {
        const response = await request(app)
          .get('/productos')
          .query({ restauranteId: 'IDInvalido' });

        expect(response.body).toEqual({ error: 'ID de restaurante no válido' });
      });

      test('debería devolver un error 500 si hay un error al buscar productos', async () => {
        Producto.find.mockRejectedValueOnce(new Error('Error al buscar productos'));
    
        const response = await request(app)
          .get('/productos');
    
        expect(response.statusCode).toBe(500);
   
      });

      test('debería devolver un error 500 si hay un error al buscar productos-- body', async () => {
        Producto.find.mockRejectedValueOnce(new Error('Error al buscar productos'));
    
        const response = await request(app)
          .get('/productos');
    

        expect(response.body).toEqual({ error: 'Error al buscar productos.' });
      });

      test('debería devolver un mensaje 404 si no se encuentran productos', async () => {
        Producto.find.mockResolvedValueOnce([]);
    
        const response = await request(app)
          .get('/productos');
    
        expect(response.statusCode).toBe(404);

      });

      test('debería devolver un mensaje 404 si no se encuentran productos -- body', async () => {
        Producto.find.mockResolvedValueOnce([]);
    
        const response = await request(app)
          .get('/productos');
   
        expect(response.body).toEqual({ message: 'No se encontraron productos que coincidan con los criterios de búsqueda.' });
      });

  });

  describe('Obtener Producto por ID', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    
      test('debería obtener un producto por ID correctamente', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
        const mockProducto = { _id: mockProductoId, nombre: 'Producto de prueba', categoria: 'Comida' };
    
        Producto.findById.mockResolvedValueOnce(mockProducto);
    
        const response = await request(app)
          .get(`/productos/${mockProductoId}`);
    
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(mockProducto);
      });

      test('debería obtener un producto por ID correctamente- body', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
        const mockProducto = { _id: mockProductoId, nombre: 'Producto de prueba', categoria: 'Comida' };
    
        Producto.findById.mockResolvedValueOnce(mockProducto);
    
        const response = await request(app)
          .get(`/productos/${mockProductoId}`);
    

        expect(response.body).toEqual(mockProducto);
      });

      test('debería devolver un error 404 si el producto no existe', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
    
        Producto.findById.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .get(`/productos/${mockProductoId}`);
    
        expect(response.statusCode).toBe(404);

      });

      test('debería devolver un error 404 si el producto no existe -- body', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
    
        Producto.findById.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .get(`/productos/${mockProductoId}`);
    

        expect(response.body).toEqual({ error: 'Producto no encontrado' });
      });

      test('debería devolver un error 500 si hay un error al buscar el producto', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
    
        Producto.findById.mockRejectedValueOnce(new Error('Error al buscar el producto'));
    
        const response = await request(app)
          .get(`/productos/${mockProductoId}`);
    
        expect(response.statusCode).toBe(500);
 
      });
    
      test('debería devolver un error 500 si hay un error al buscar el producto -- body', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
    
        Producto.findById.mockRejectedValueOnce(new Error('Error al buscar el producto'));
    
        const response = await request(app)
          .get(`/productos/${mockProductoId}`);

        expect(response.body).toEqual({ error: 'Error al buscar el producto' });
      });
  });

  describe('Actualizar Producto por ID', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    
      test('debería actualizar un producto por ID correctamente', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
        const mockProductoActualizado = { _id: mockProductoId, nombre: 'Producto Actualizado', categoria: 'Bebida' };
    
        Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockResolvedValueOnce(mockProductoActualizado) });
    
        const response = await request(app)
          .put(`/productos/${mockProductoId}`)
          .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });
    
        expect(response.statusCode).toBe(200);
             
      });

      test('debería actualizar un producto por ID correctamente--body', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
        const mockProductoActualizado = { _id: mockProductoId, nombre: 'Producto Actualizado', categoria: 'Bebida' };
    
        Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockResolvedValueOnce(mockProductoActualizado) });
    
        const response = await request(app)
          .put(`/productos/${mockProductoId}`)
          .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });
    

        expect(response.body).toEqual({ message: 'Producto actualizado con éxito', producto: mockProductoActualizado });
      });

       test('debería devolver un error 404 si el producto no existe', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce(null);

    const response = await request(app)
      .put(`/productos/${mockProductoId}`)
      .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });

    expect(response.statusCode).toBe(404);

  });

    test('debería devolver un error 404 si el producto no existe- body', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce(null);

    const response = await request(app)
      .put(`/productos/${mockProductoId}`)
      .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });

    expect(response.body).toEqual({ error: 'Producto no encontrado' });
  });

    test('debería devolver un error 500 si hay un error al actualizar el producto', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockRejectedValueOnce(new Error('Error al actualizar el producto')) });

    const response = await request(app)
      .put(`/productos/${mockProductoId}`)
      .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });

    expect(response.statusCode).toBe(500);

  });

   test('debería devolver un error 500 si hay un error al actualizar el producto -- body', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockRejectedValueOnce(new Error('Error al actualizar el producto')) });

    const response = await request(app)
      .put(`/productos/${mockProductoId}`)
      .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });


    expect(response.body).toEqual({ error: 'Error al actualizar el producto' });
  });


   test('debería devolver un error 400 si el ID de producto no es válido', async () => {
    const response = await request(app)
      .put('/productos/invalidID')
      .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });

    expect(response.statusCode).toBe(400);
 
  });

   test('debería devolver un error 400 si el ID de producto no es válido-body', async () => {
    const response = await request(app)
      .put('/productos/invalidID')
      .send({ nombre: 'Producto Actualizado', categoria: 'Bebida' });

    expect(response.body).toEqual({ error: 'ID de producto no válido' });
  });
  });

  describe('Inhabilitar Producto por ID', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    
      test('debería inhabilitar un producto por ID correctamente', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
        const mockProductoInhabilitado = { _id: mockProductoId, nombre: 'Producto Deshabilitado', habilitado: false };
    
        Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockResolvedValueOnce(mockProductoInhabilitado) });
    
        const response = await request(app)
          .patch(`/productos/${mockProductoId}/inhabilitar`)
          .send();
    
        expect(response.statusCode).toBe(200);
  
      });

      test('debería inhabilitar un producto por ID correctamente -body', async () => {
        const mockProductoId = mongoose.Types.ObjectId();
        const mockProductoInhabilitado = { _id: mockProductoId, nombre: 'Producto Deshabilitado', habilitado: false };
    
        Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockResolvedValueOnce(mockProductoInhabilitado) });
    
        const response = await request(app)
          .patch(`/productos/${mockProductoId}/inhabilitar`)
          .send();
    
    
        expect(response.body).toEqual({ message: 'Producto inhabilitado con éxito', producto: mockProductoInhabilitado });
      });
  });

  test('debería devolver un error 404 si el producto no existe', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce(null);

    const response = await request(app)
      .patch(`/productos/${mockProductoId}/inhabilitar`)
      .send();

    expect(response.statusCode).toBe(404);

  });

  test('debería devolver un error 404 si el producto no existe --body', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce(null);

    const response = await request(app)
      .patch(`/productos/${mockProductoId}/inhabilitar`)
      .send();


    expect(response.body).toEqual({ error: 'Producto no encontrado' });
  });

  test('debería devolver un error 500 si hay un error al inhabilitar el producto', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockRejectedValueOnce(new Error('Error al inhabilitar el producto')) });

    const response = await request(app)
      .patch(`/productos/${mockProductoId}/inhabilitar`)
      .send();

    expect(response.statusCode).toBe(500);

  });

  test('debería devolver un error 500 si hay un error al inhabilitar el producto --body', async () => {
    const mockProductoId = mongoose.Types.ObjectId();

    Producto.findById.mockResolvedValueOnce({ save: jest.fn().mockRejectedValueOnce(new Error('Error al inhabilitar el producto')) });

    const response = await request(app)
      .patch(`/productos/${mockProductoId}/inhabilitar`)
      .send();


    expect(response.body).toEqual({ error: 'Error al inhabilitar el producto' });
  });

  test('debería devolver un error 400 si el ID de producto no es válido', async () => {
    const response = await request(app)
      .patch('/productos/5/inhabilitar')
      .send();

    expect(response.statusCode).toBe(400);
 
  });

  
  test('debería devolver un error 400 si el ID de producto no es válido --body', async () => {
    const response = await request(app)
      .patch('/productos/5/inhabilitar')
      .send();


    expect(response.body).toEqual({ error: 'ID de producto no válido' });
  });
});
