
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

// describe('buscarRestaurantes', () => {
//   it('should search for restaurants successfully based on category and/or name', async () => {
    
//     const mockReq = {
//       query: {
//         categoria: 'Example Category',
//         nombre: 'Example Restaurant',
//       },
//     };

    
//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

    
//     Restaurante.find.mockResolvedValueOnce([
//       { nombre: 'Example Restaurant 1', categoria: 'Example Category 1' },
//       { nombre: 'Example Restaurant 2', categoria: 'Example Category 2' },
//     ]);

    
//     await buscarRestaurantes(mockReq, mockRes);

    
//     expect(mockRes.status).toHaveBeenCalledWith(201);

    
//     expect(mockRes.json).toHaveBeenCalledWith([
//       { nombre: 'Example Restaurant 1', categoria: 'Example Category 1' },
//       { nombre: 'Example Restaurant 2', categoria: 'Example Category 2' },
//     ]);

    
//     expect(Restaurante.find).toHaveBeenCalledWith({
//       categoria: { $regex: /.*Example Category.*/i },
//       nombre: { $regex: /.*Example Restaurant.*/i },
//     });
//   });

//   it('should handle the case where no restaurants are found', async () => {
    

//     const mockReq = {
//       query: {
//         categoria: 'Nonexistent Category',
//         nombre: 'Nonexistent Restaurant',
//       },
//     };

//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     Restaurante.find.mockResolvedValueOnce([]);

//     await buscarRestaurantes(mockReq, mockRes);

    
//     expect(mockRes.status).toHaveBeenCalledWith(404);

    
//     expect(mockRes.json).toHaveBeenCalledWith({
//       message: 'No se encontraron restaurantes que coincidan con los criterios de búsqueda.',
//     });

    
//     expect(Restaurante.find).toHaveBeenCalledWith({
//       categoria: { $regex: /.*Nonexistent Category.*/i },
//       nombre: { $regex: /.*Nonexistent Restaurant.*/i },
//     });
//   });

  
// });
// it('should handle errors during the retrieval process', async () => {
//   const mockReq = {
//     params: {
//       id: '655f99b3fc92f333add0f01d',
//     },
//   };

//   const mockRes = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//   };

//   // Mock an error for the findOne method
//   const errorMessage = 'Example Error';
//   Restaurante.findOne.mockRejectedValueOnce(new Error(errorMessage));

//   // Use a try-catch block to handle the rejection
//   try {
//     await obtenerRestaurantePorId(mockReq, mockRes);
//   } catch (error) {
//     // Assert that the response status is 500
//     expect(mockRes.status).toHaveBeenCalledWith(500);

//     // Assert that the response contains the expected error message
//     expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error al buscar el restaurante' });

//     // Assert that the error message matches the expected error
//     expect(error.message).toEqual(errorMessage);
//   }

//   // Optionally, you can also assert other things, like if the findOne method was called
//   expect(Restaurante.findOne).toHaveBeenCalledWith({
//     _id: new mongoose.Types.ObjectId('655f99b3fc92f333add0f01d'),
//   });
// });




// describe('obtenerRestaurantePorId', () => {
//   it('should return the restaurant when it exists', async () => {
//     // Create and save a fake restaurant
//     const fakeRestaurante = await createFakeRestauranteInDatabase();

//     // Mock the findOne method of Restaurante model to resolve with the fake restaurant data
//     Restaurante.findOne.mockResolvedValueOnce(fakeRestaurante);

//     // Use the saved restaurant's _id for the test
//     const req = { params: { id: fakeRestaurante._id.toString() } };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Call the controller function
//     await obtenerRestaurantePorId(req, res);

//     // Assert the response status and data
//     expect(res.status).toHaveBeenCalledWith(200); // Assuming 200 is the correct status for success
//     expect(res.json).toHaveBeenCalledWith(fakeRestaurante);
//   });
// });
// describe('actualizarRestaurante', () => {
//   it('should update a restaurant successfully', async () => {
//     const mockReq = {
//       params: { id: 'valid-id' },
//       body: { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//     };

//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mock the findByIdAndUpdate method of the Restaurante model
//     Restaurante.findByIdAndUpdate.mockResolvedValueOnce({
//       _id: 'valid-id',
//       nombre: 'Updated Restaurant',
//       categoria: 'Updated Category',
//       popularidad: 5,
//     });

//     await actualizarRestaurante(mockReq, mockRes);
//     // Assert that the response status is 200
//     expect(mockRes.status).toHaveBeenCalledWith(200);

//     // Assert that the response contains the updated restaurant object
//     expect(mockRes.json).toHaveBeenCalledWith({
//       _id: 'valid-id',
//       nombre: 'Updated Restaurant',
//       categoria: 'Updated Category',
//       popularidad: 5,
//     });

//     // Optionally, you can assert other things, like if the findByIdAndUpdate method was called
//     expect(Restaurante.findByIdAndUpdate).toHaveBeenCalledWith(
//       'valid-id',
//       { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//       { new: true }
//     );
//   });

//   it('should handle the case where the restaurant is not found', async () => {
//     const mockReq = {
//       params: { id: 'nonexistent-id' },
//       body: { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//     };

//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mocking findByIdAndUpdate to return null, simulating that the restaurant is not found
//     Restaurante.findByIdAndUpdate.mockResolvedValueOnce(null);

//     await actualizarRestaurante(mockReq, mockRes);

//     // Assert that the response status is 404
//     expect(mockRes.status).toHaveBeenCalledWith(404);

//     // Assert that the response contains the expected error message
//     expect(mockRes.json).toHaveBeenCalledWith({ error: 'Restaurante no encontrado' });

//     // Optionally, you can assert other things, like if the findByIdAndUpdate method was called
//     expect(Restaurante.findByIdAndUpdate).toHaveBeenCalledWith(
//       'nonexistent-id',
//       { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//       { new: true }
//     );
//   });

//   it('should handle invalid restaurant ID', async () => {
//     const mockReq = {
//       params: { id: 'invalid-id' },
//       body: { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//     };

//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mocking findByIdAndUpdate to throw an error, simulating an invalid ID
//     Restaurante.findByIdAndUpdate.mockRejectedValueOnce(new Error('Invalid ID'));

//     await actualizarRestaurante(mockReq, mockRes);

//     // Assert that the response status is 400
//     expect(mockRes.status).toHaveBeenCalledWith(400);

//     // Assert that the response contains the expected error message
//     expect(mockRes.json).toHaveBeenCalledWith({ error: 'ID de restaurante no válido' });

//     // Optionally, you can assert other things, like if the findByIdAndUpdate method was called
//     expect(Restaurante.findByIdAndUpdate).toHaveBeenCalledWith(
//       'invalid-id',
//       { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//       { new: true }
//     );
//   });

//   it('should handle errors during the update process', async () => {
//     const mockReq = {
//       params: { id: 'valid-id' },
//       body: { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//     };

//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Mocking findByIdAndUpdate to throw an error during the update process
//     Restaurante.findByIdAndUpdate.mockRejectedValueOnce(new Error('Update Error'));

//     await actualizarRestaurante(mockReq, mockRes);

//     // Assert that the response status is 500
//     expect(mockRes.status).toHaveBeenCalledWith(500);

//     // Assert that the response contains the expected error message
//     expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });

//     // Optionally, you can assert other things, like if the findByIdAndUpdate method was called
//     expect(Restaurante.findByIdAndUpdate).toHaveBeenCalledWith(
//       'valid-id',
//       { nombre: 'Updated Restaurant', categoria: 'Updated Category', popularidad: 5 },
//       { new: true }
//     );
//   });
// });
describe('buscarRestaurantes', () => {
  it('should return restaurants matching the criteria', async () => {
    // Mock request and response objects
    const req = { query: { categoria: 'Mexican', nombre: 'Taco' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the find method to resolve with an array of restaurants
    jest.spyOn(Restaurante, 'find').mockImplementationOnce(() => [{ name: 'Taco Bell' }, { name: 'Mexican Grill' }]);

    // Call the function and await its completion
    await buscarRestaurantes(req, res);

    // Check if the response status and JSON were called with the expected values
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ name: 'Taco Bell' }, { name: 'Mexican Grill' }]);
  });

  it('should return a 404 when no restaurants are found', async () => {
    // Mock request and response objects
    const req = { query: { categoria: 'NonexistentCategory', nombre: 'NonexistentName' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the find method to resolve with an empty array
    jest.spyOn(Restaurante, 'find').mockImplementationOnce(() => []);

    // Call the function and await its completion
    await buscarRestaurantes(req, res);

    // Check if the response status and JSON were called with the expected values
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No se encontraron restaurantes que coincidan con los criterios de búsqueda.',
    });
  });

  it('should return a 500 when an error occurs', async () => {
    // Mock request and response objects
    const req = { query: {} };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the find method to simulate an error
    jest.spyOn(Restaurante, 'find').mockRejectedValueOnce(new Error('Test error'));

    // Call the function and await its completion
    await buscarRestaurantes(req, res);

    // Check if the response status and JSON were called with the expected values
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