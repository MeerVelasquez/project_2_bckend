
const { crearRestaurante, buscarRestaurantes, obtenerRestaurantePorId, actualizarRestaurante, deshabilitarRestaurante } = require('../../restaurantes/restaurantes.controller'); 
const { authenticateJWT, isAdmin, middleware } = require('../../middlewares/authentication');
// const { createFakeRestauranteInDatabase } = require('../testUtils/testUtils'); 
const mongoose = require('mongoose');
const Restaurante = require('../../restaurantes/restaurantes.model');
jest.mock('bcrypt');
jest.mock('../../restaurantes/restaurantes.model');
jest.mock('../../middlewares/authentication');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('crearRestaurante', () => {
  it('should create a new restaurant successfully', async () => {
    
    const mockReq = {
      body: {
        nombre: 'Example Restaurant',
        categoria: 'Example Category',
        popularidad: 4,
      },
      user: {
        
      },
    };

    
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    
    Restaurante.prototype.save.mockResolvedValueOnce();

    
    await crearRestaurante(mockReq, mockRes);

    
    expect(mockRes.status).toHaveBeenCalledWith(201);

    
    expect(mockRes.json).toHaveBeenCalledWith({ mensaje: 'Restaurante creado con éxito' });

    
    expect(Restaurante.prototype.save).toHaveBeenCalled();
  });

});


describe('buscarRestaurantes', () => {
  it('should return restaurants matching the criteria', async () => {
    
    const req = { query: { categoria: 'Mexican', nombre: 'Taco' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    jest.spyOn(Restaurante, 'find').mockImplementationOnce(() => [{ name: 'Taco Bell' }, { name: 'Mexican Grill' }]);

    
    await buscarRestaurantes(req, res);

    // Expect
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ name: 'Taco Bell' }, { name: 'Mexican Grill' }]);
  });

  it('should return a 404 when no restaurants are found', async () => {
    
    const req = { query: { categoria: 'NonexistentCategory', nombre: 'NonexistentName' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    jest.spyOn(Restaurante, 'find').mockImplementationOnce(() => []);

    
    await buscarRestaurantes(req, res);

    // Expect
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No se encontraron restaurantes que coincidan con los criterios de búsqueda.',
    });
  });

  it('should return a 500 when an error occurs', async () => {
    
    const req = { query: {} };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    jest.spyOn(Restaurante, 'find').mockRejectedValueOnce(new Error('Test error'));

    
    await buscarRestaurantes(req, res);

    // Expect
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al buscar restaurantes.' });
  });
});


describe('obtenerRestaurantePorId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('obtenerRestaurantePorId', () => {
    it('should return the correct restaurante when it exists', async () => {
      const validId = new mongoose.Types.ObjectId().toHexString();
      const mockRestauranteData = {
        _id: validId,
        nombre: 'Test'
      };
      const mockExec = jest.fn(() => Promise.resolve(mockRestauranteData));
      jest.spyOn(Restaurante, 'findOne').mockImplementationOnce(() => ({ exec: mockExec }));
  
      const req = { params: { id: validId } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      await obtenerRestaurantePorId(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRestauranteData);
    });
  });  it('should return a 404 when the restaurante is not found', async () => {
    const nonValidId = new mongoose.Types.ObjectId(100).toHexString();
    const mockExec = jest.fn(() => Promise.resolve(null));
    Restaurante.findOne.mockImplementationOnce(() => ({ exec: mockExec }));

    const req = { params: { id: nonValidId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await obtenerRestaurantePorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Restaurante no encontrado' });
  });

  it('should return a 500 when an error occurs', async () => {
    const mockExec = jest.fn(() => Promise.reject(new Error('Test error')));
    Restaurante.findOne.mockImplementationOnce(() => ({ exec: mockExec }));

    const req = { params: { id: 'validId' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await obtenerRestaurantePorId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al buscar el restaurante' });
  });
});

describe('actualizarRestaurante', () => {
  it('should update and return the updated restaurante', async () => {
    const req = {
      params: { id: new mongoose.Types.ObjectId().toHexString() },
      body: { nombre: 'Updated Name', categoria: 'Updated Category', popularidad: 5 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const mockRestaurante = { _id: req.params.id, ...req.body };
    jest.spyOn(Restaurante, 'findByIdAndUpdate').mockImplementationOnce(() => mockRestaurante);

    // Expect...
    await actualizarRestaurante(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRestaurante);
  });

  it('should return a 400 when the restauranteId is not valid', async () => {
    
    const req = {
      params: { id: 'invalidId' },
      body: { nombre: 'Updated Name', categoria: 'Updated Category', popularidad: 5 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    await actualizarRestaurante(req, res);

    // Expect
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID de restaurante no válido' });
  });

  it('should return a 404 when the restaurante is not found', async () => {
    
    const req = {
      params: { id: new mongoose.Types.ObjectId().toHexString() },
      body: { nombre: 'Updated Name', categoria: 'Updated Category', popularidad: 5 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    jest.spyOn(Restaurante, 'findByIdAndUpdate').mockImplementationOnce(() => null);

    
    await actualizarRestaurante(req, res);
    // Expect
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Restaurante no encontrado' });
  });

  it('should return a 500 when an error occurs', async () => {
    
    const req = {
      params: { id: new mongoose.Types.ObjectId().toHexString() },
      body: { nombre: 'Updated Name', categoria: 'Updated Category', popularidad: 5 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    jest.spyOn(Restaurante, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Test error'));

    
    await actualizarRestaurante(req, res);

    // Expect
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
  });
});

describe('deshabilitarRestaurante', () => {
  it('should delete and return success message', async () => {
    
    const req = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    const mockRestaurante = { _id: req.params.id };
    jest.spyOn(Restaurante, 'findByIdAndDelete').mockImplementationOnce(() => mockRestaurante);

    
    await deshabilitarRestaurante(req, res);

    // Expect
    
    expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante eliminado con éxito' });
  });

  it('should return a 404 when the restaurante is not found', async () => {
    
    const req = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    jest.spyOn(Restaurante, 'findByIdAndDelete').mockImplementationOnce(() => null);

    
    await deshabilitarRestaurante(req, res);

    // Expect
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Restaurante no encontrado' });
  });

  it('should return a 500 when an error occurs', async () => {
    
    const req = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    
    jest.spyOn(Restaurante, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Test error'));

    
    await deshabilitarRestaurante(req, res);

    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar el restaurante' });
  });
});