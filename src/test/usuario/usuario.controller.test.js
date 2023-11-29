const { crearUsuario, leerUsuario, updateUsuario, inhabilitarUsuario, generate2FAKey } = require('../../usuario/usuario.controller');
const Usuario = require('../../usuario/usuario.model'); 
const { generateAndEnableTwoFactor } = require('../../middlewares/authentication');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

jest.mock('bcrypt');
jest.mock('../../usuario/usuario.model');
jest.mock('../../middlewares/authentication');

const createTestUser = async () => {
  try {
    const newUser = new Usuario({
      nombre: 'John Doe',
      correoElectronico: 'john.doe@example.com',
      contrasena: await bcrypt.hash('password123', 10),
      numeroCelular: '123456789',
      direccion: '123 Main Street',
      rol: 'user',
    });

    const result = await newUser.save();
    return result;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error; // Rethrow the error to indicate test failure
  }
};

describe('User Controller - crearUsuario', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  // Crear usuario
  test('Deberia crear un usuario exitosamente', async () => {
    // Mock de la request
    const req = {
      body: {
        nombre: 'John Doe',
        correoElectronico: 'john.doe@example.com',
        contrasena: 'password123',
        numeroCelular: '123456789',
        direccion: '123 Main Street',
        rol: 'user',
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock save
    Usuario.prototype.save.mockResolvedValueOnce();

    // crearUsuario
    await crearUsuario(req, res);

    // expects...
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    
    expect(Usuario.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario creado con éxito' });
  });

  test('Deberia validar que los campos requeridos hayan sido digitados', async () => {
    
    const req = {
      body: {
        contrasena:undefined,
        
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // crearUsuario
    await crearUsuario(req, res);

    // expect...
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error:  'La contrasena y/o correo son inválidos.' });
  });
});
// leerUsuario
describe('leerUsuario function', () => {
  test('404 en Id de usuario invalido.', async () => {
    // Create a test user and get its ID
    const userId = await createTestUser();
    const req = {
      body: { _id: new mongoose.Types.ObjectId(100) },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await leerUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error:  'Usuario no encontrado' });
  });
  test('400 cuando tenga parametros invalidos', async () => {
    const req = {
      body: { invalidParameter: 'placeholder' },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await leerUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    
  });
});
describe('updateUsuario function', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update a user successfully', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    console.log(userId);
    const req = {
      params: { id: new mongoose.Types.ObjectId },
      body: {
        nombre: 'Updated Name',
        correoElectronico: 'updated-email@example.com',
        contrasena: 'updated-password',
        numeroCelular: '987654321',
        direccion: 'Updated Address',
        rol: 'admin',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the findByIdAndUpdate method of the user model
    Usuario.findByIdAndUpdate.mockResolvedValue({
      _id: userId,
      nombre: 'Updated Name',
      correoElectronico: 'updated-email@example.com',
      numeroCelular: '987654321',
      direccion: 'Updated Address',
      rol: 'admin',
    });

    await updateUsuario(req, res);

    
    expect(res.json).toHaveBeenCalledWith({
      _id: userId,
      nombre: 'Updated Name',
      correoElectronico: 'updated-email@example.com',
      numeroCelular: '987654321',
      direccion: 'Updated Address',
      rol: 'admin',
    });
  });

  it('400 si se dan parametros invalidos', async () => {
    const req = {
      params: { id: 'nonexistent-user-id' },
      body: { nombre: 'Updated Name' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the findByIdAndUpdate method to return null (user not found)
    Usuario.findByIdAndUpdate.mockResolvedValue(null);

    await updateUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID de usuario no válido' });
  });

  it('should return a 400 status when user ID is invalid', async () => {
    const req = {
      params: { id: 'invalid-user-id' },
      body: { nombre: 'Updated Name' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the findByIdAndUpdate method to throw an error (invalid ID)
    Usuario.findByIdAndUpdate.mockRejectedValue(new mongoose.Error.ValidationError());

    await updateUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID de usuario no válido' });
  });

  
});
describe('inhabilitarUsuario function', () => {
  it('should delete a user successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    Usuario.findByIdAndDelete.mockResolvedValueOnce({ _id: userId });

    const req = { params: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await inhabilitarUsuario(req, res);

    
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario eliminado con éxito' });
  });

  it('should handle errors and return a 500 status', async () => {
    const userId = new mongoose.Types.ObjectId();
    Usuario.findByIdAndDelete.mockRejectedValueOnce('Some error');

    const req = { params: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await inhabilitarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar el usuario' });
  });

  it('should handle a non-existing user and return a 404 status', async () => {
    const userId = new mongoose.Types.ObjectId();
    Usuario.findByIdAndDelete.mockResolvedValueOnce(null);
    const req = { params: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await inhabilitarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
  });
});
describe('generate2FAKey function', () => {
  it('should generate and enable 2FA successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    generateAndEnableTwoFactor.mockResolvedValueOnce({ result: 'success' });

    const req = { params: { userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await generate2FAKey(req, res);

    
    expect(res.json).toHaveBeenCalledWith({ result: 'success' });
  });

  it('should handle errors during 2FA generation and return a 500 status', async () => {
    const userId = new mongoose.Types.ObjectId();
    generateAndEnableTwoFactor.mockRejectedValueOnce('Some error');

    const req = { params: { userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await generate2FAKey(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al generar secreto 2FA' });
  });

  it('should handle an invalid userId and return a 400 status', async () => {
    const invalidUserId = 'invalidId';
    const req = { params: { userId: invalidUserId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await generate2FAKey(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Id de usuario invalida' });
  });
});
