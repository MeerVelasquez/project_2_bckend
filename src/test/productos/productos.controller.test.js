const request = require('supertest');
const {
  crearProducto,
  buscarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  inhabilitarProducto,
} = require('../../productos/productos.controller'); 
const mongoose = require('mongoose');
const Producto = require('../../productos/productos.model');
const Restaurante = require('../../restaurantes/restaurantes.model');

jest.mock('../../productos/productos.model');
jest.mock('../../restaurantes/restaurantes.model');

describe('Controlador de Productos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('crearProducto', () => {
    it('should create a new producto and return success message', async () => {
      
      const req = {
        body: {
          nombre: 'Nuevo Producto',
          descripcion: 'Descripción del producto',
          precio: 9.99,
          categoria: 'Comida',
          restauranteId: new mongoose.Types.ObjectId().toHexString(),
        },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      const mockRestaurante = { _id: req.body.restauranteId };
      jest.spyOn(Restaurante, 'findById').mockImplementationOnce(() => mockRestaurante);
  
      
      const mockProducto = { _id: new mongoose.Types.ObjectId() };
      jest.spyOn(Producto.prototype, 'save').mockImplementationOnce(() => mockProducto);
  
      
      await crearProducto(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Producto creado con éxito' });
    });
  
    it('should return a 400 when required fields are missing', async () => {
      
      const req = { body: { descripcion: 'Descripción del producto' } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      await crearProducto(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todos los campos son obligatorios.' });
    });
  
    it('should return a 500 when an error occurs', async () => {
      
      const req = {
        body: {
          nombre: 'Nuevo Producto',
          descripcion: 'Descripción del producto',
          precio: 9.99,
          categoria: 'Comida',
          restauranteId: new mongoose.Types.ObjectId(0)
        },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      const mockRestaurante = { _id: req.body.restauranteId };
      jest.spyOn(Restaurante, 'findById').mockImplementationOnce(() => mockRestaurante);
  
      
      jest.spyOn(Producto.prototype, 'save').mockRejectedValueOnce(new Error('Test error'));
  
      
      await crearProducto(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el producto' });
    });
  });
  describe('buscarProductos', () => {
    it('should return productos based on provided criteria', async () => {
      
      const req = { query: { restauranteId: new mongoose.Types.ObjectId().toHexString(), categoria: 'Comida' } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      const mockProductos = [{ name: 'Producto1' }, { name: 'Producto2' }];
      jest.spyOn(Producto, 'find').mockImplementationOnce(() => mockProductos);
  
      
      await buscarProductos(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProductos);
    });
  
    it('should return a 400 when restauranteId is not valid', async () => {
      
      const req = { query: { restauranteId: 'invalidId', categoria: 'Comida' } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      await buscarProductos(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID de restaurante no válido' });
    });
  
    it('should return a 404 when no productos are found', async () => {
      
      const req = { query: { restauranteId: new mongoose.Types.ObjectId().toHexString(), categoria: 'NonexistentCategory' } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      jest.spyOn(Producto, 'find').mockImplementationOnce(() => []);
  
      
      await buscarProductos(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No se encontraron productos que coincidan con los criterios de búsqueda.',
      });
    });
  
    it('should return a 500 when an error occurs', async () => {
      
      const req = { query: {} };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      jest.spyOn(Producto, 'find').mockRejectedValueOnce(new Error('Test error'));
  
      
      await buscarProductos(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al buscar productos.' });
    });
  });
  
  describe('obtenerProductoPorId', () => {
    it('should return the correct producto when it exists', async () => {
      
      const req = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      const mockProducto = { _id: req.params.id, name: 'Producto1' };
      jest.spyOn(Producto, 'findById').mockImplementationOnce(() => mockProducto);
  
      
      await obtenerProductoPorId(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProducto);
    });
  
    it('should return a 404 when the producto is not found', async () => {
      
      const req = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      jest.spyOn(Producto, 'findById').mockImplementationOnce(() => null);
  
      
      await obtenerProductoPorId(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
    });
  
    it('should return a 500 when an error occurs', async () => {
      
      const req = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      jest.spyOn(Producto, 'findById').mockRejectedValueOnce(new Error('Test error'));
  
      
      await obtenerProductoPorId(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al buscar el producto' });
    });
  });
  describe('actualizarProducto', () => {
    it('should update and return 200', async () => {
      
      const req = {
        params: { id: new mongoose.Types.ObjectId().toHexString() },
        body: { nombre: 'Updated Producto', descripcion: 'Updated Description', precio: 15.99, categoria: 'Updated Category', restauranteId: new mongoose.Types.ObjectId().toHexString() },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      const mockProducto = new Producto({ _id: req.params.id, ...req.body });
  
      
      jest.spyOn(Producto, 'findById').mockImplementationOnce(() => ({
        ...mockProducto,
        save: jest.fn().mockResolvedValue(mockProducto),
      }));
  
      
      await actualizarProducto(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return a 400 when the productoId is not valid', async () => {
      
      const req = { params: { id: 'invalidId' }, body: {} };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      await actualizarProducto(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID de producto no válido' });
    });
  
    it('should return a 404 when the producto is not found', async () => {
      
      const req = { params: { id: new mongoose.Types.ObjectId().toHexString() }, body: {} };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      jest.spyOn(Producto, 'findById').mockImplementationOnce(() => null);
  
      
      await actualizarProducto(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
    });
    it('should return a 500 when an error occurs', async () => {
      
      const req = { params: { id: new mongoose.Types.ObjectId().toHexString() }, body: {id : new mongoose.Types.ObjectId(0)} };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      
      const mockProducto = { _id: req.params.id };
      jest.spyOn(Producto, 'findById').mockResolvedValue(mockProducto);
  
      
      
  
      
      await actualizarProducto(req, res);
  
      // Expect
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar el producto' });
    });
  });
});
