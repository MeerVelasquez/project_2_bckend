const { crearUsuario, leerUsuario, updateUsuario, inhabilitarUsuario, generate2FAKey } = require('.../usuario/usuario.controller');
const Usuario = require('.../usuario/usuario.model'); 
const { generateAndEnableTwoFactor } = require('.../middlewares/authentication');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

jest.mock('bcrypt');
jest.mock('.../usuario/usuario.model');
jest.mock('.../middlewares/authentication');

describe('User Controller - crearUsuario', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('Debe crear un usuario de forma exitosa', async () => {
      const req = {
        body: {
          nombre: 'John Doe',
          correoElectronico: 'john@example.com',
          contrasena: 'password123',
          numeroCelular: '1234567890',
          direccion: '123 Main St',
          rol: 'user',
        },
      };
  
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
  
      bcrypt.hash.mockResolvedValue('hashedPassword');
  
      await crearUsuario(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
     
    });

    test('Debe crear un usuario de forma exitosa-status', async () => {
        const req = {
          body: {
            nombre: 'John Doe',
            correoElectronico: 'john@example.com',
            contrasena: 'password123',
            numeroCelular: '1234567890',
            direccion: '123 Main St',
            rol: 'user',
          },
        };
    
        const res = {
          status: jest.fn(),
          json: jest.fn(),
        };
    
        bcrypt.hash.mockResolvedValue('hashedPassword');
    
        await crearUsuario(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
      });

        test('Debe crear un usuario de forma exitosa-json', async () => {
            const req = {
                body: {
                  nombre: 'John Doe',
                  correoElectronico: 'john@example.com',
                  contrasena: 'password123',
                  numeroCelular: '1234567890',
                  direccion: '123 Main St',
                  rol: 'user',
                },
              };
          
              const res = {
                status: jest.fn(),
                json: jest.fn(),
              };
          
              bcrypt.hash.mockResolvedValue('hashedPassword');
          
              await crearUsuario(req, res);
              expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario creado con éxito' });
               
        });

        test('Error al crear un usuario', async () => {
            jest.spyOn(require('.../usuario/usuario.model'), 'save').mockImplementationOnce(() => {
              throw new Error('Simulated error');
            });
        
            const response = await request(app)
              .post('/usuarios')
              .send({
                nombre: 'John Doe',
                correoElectronico: 'john@example.com',
                contrasena: 'password123',
                numeroCelular: '1234567890',
                direccion: '123 Main St',
                rol: 'user',
              });
        
            expect(response.statusCode).toBe(500);
          });

          test('Error al crear un usuario-body', async () => {
            jest.spyOn(require('.../usuario/usuario.model'), 'save').mockImplementationOnce(() => {
              throw new Error('Simulated error');
            });
        
            const response = await request(app)
              .post('/usuarios')
              .send({
                nombre: 'John Doe',
                correoElectronico: 'john@example.com',
                contrasena: 'password123',
                numeroCelular: '1234567890',
                direccion: '123 Main St',
                rol: 'user',
              });
              expect(response.body).toHaveProperty('error', 'Error al crear el usuario');
          });

  });

    describe('User Controller - leerUsuario', () => {
        afterEach(() => {
        jest.clearAllMocks();
        });

        test('Debe regresar un token ID', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findById.mockResolvedValueOnce({ _id: mockUserId });
        
            const response = await request(app)
              .post('/usuarios/login')
              .send({ _id: '655f9afc958d8ea1da2cab0f' });
        
            expect(response.statusCode).toBe(201);
          });

          test('Debe regresar un token ID- body', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findById.mockResolvedValueOnce({ _id: mockUserId });
        
            const response = await request(app)
              .post('/usuarios/login')
              .send({ _id: '655f9afc958d8ea1da2cab0f' });
        
            
            expect(response.body).toHaveProperty('token');
          });

            test('Debe regresar un token ID- gentoken', async () => {
                const mockUserId = mongoose.Types.ObjectId();
                Usuario.findById.mockResolvedValueOnce({ _id: mockUserId });
            
                const response = await request(app)
                .post('/usuarios/login')
                .send({ _id: '655f9afc958d8ea1da2cab0f' });
            
                expect(generateToken).toHaveBeenCalledWith(mockUserId);
            });

            test('Debe regresar un token ID- valid-id', async () => {
                const mockUserId = mongoose.Types.ObjectId();
                Usuario.findById.mockResolvedValueOnce({ _id: mockUserId });
            
                const response = await request(app)
                .post('/usuarios/login')
                .send({ _id: '655f9afc958d8ea1da2cab0f' });
            
                expect(Usuario.findById).toHaveBeenCalledWith('655f9afc958d8ea1da2cab0f');
            });
    
  test('Debe regresar un token cuando le proveen correoElectronico y contrasena ', async () => {
    const mockUserId = mongoose.Types.ObjectId();
    Usuario.findOne.mockResolvedValueOnce({ _id: mockUserId, contrasena: 'hashedPassword' });
    bcrypt.compare.mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/usuarios/login')
      .send({ correoElectronico: 'test@example.com', contrasena: 'password' });

    expect(response.statusCode).toBe(200);
   
  });

  test('Debe regresar un token cuando le proveen correoElectronico y contrasena -body-usuario ', async () => {
    const mockUserId = mongoose.Types.ObjectId();
    Usuario.findOne.mockResolvedValueOnce({ _id: mockUserId, contrasena: 'hashedPassword' });
    bcrypt.compare.mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/usuarios/login')
      .send({ correoElectronico: 'test@example.com', contrasena: 'password' });


    expect(response.body).toHaveProperty('usuario');
  
  });

        test('Debe regresar un token cuando le proveen correoElectronico y contrasena -body-token ', async () => {
             const mockUserId = mongoose.Types.ObjectId();
         Usuario.findOne.mockResolvedValueOnce({ _id: mockUserId, contrasena: 'hashedPassword' });
            bcrypt.compare.mockResolvedValueOnce(true);

        const response = await request(app)
      .post('/usuarios/login')
      .send({ correoElectronico: 'test@example.com', contrasena: 'password' });

       expect(response.body).toHaveProperty('token');
     });

     test('Debe regresar un token cuando le proveen correoElectronico y contrasena - bycrypt ', async () => {
    const mockUserId = mongoose.Types.ObjectId();
    Usuario.findOne.mockResolvedValueOnce({ _id: mockUserId, contrasena: 'hashedPassword' });
    bcrypt.compare.mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/usuarios/login')
      .send({ correoElectronico: 'test@example.com', contrasena: 'password' });

    
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
   
     });

     test('Debe regresar un token cuando le proveen correoElectronico y contrasena - genToken ', async () => {
        const mockUserId = mongoose.Types.ObjectId();
        Usuario.findOne.mockResolvedValueOnce({ _id: mockUserId, contrasena: 'hashedPassword' });
        bcrypt.compare.mockResolvedValueOnce(true);

        const response = await request(app)
      .post('/usuarios/login')
      .send({ correoElectronico: 'test@example.com', contrasena: 'password' });

     expect(generateToken).toHaveBeenCalledWith(mockUserId);

        test('Debe regresar 404 cuando _id es dado pero no encontrado - status', async () => {
        Usuario.findById.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .post('/usuarios/login')
          .send({ _id: '1345678898' });
    
        expect(response.statusCode).toBe(404);
      });

      test('Debe regresar 404 cuando _id es dado pero no encontrado - body', async () => {
        Usuario.findById.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .post('/usuarios/login')
          .send({ _id: '1345678898' });
    
        expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
      });

      test('correo electronico y contrasena pero el usuario no es encontrado -status', async () => {
        Usuario.findOne.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .post('/usuarios/login')
          .send({ correoElectronico: 'non-existing@example.com', contrasena: 'password' });
    
        expect(response.statusCode).toBe(404);
      });

      test('correo electronico y contrasena pero el usuario no es encontrado -body', async () => {
        Usuario.findOne.mockResolvedValueOnce(null);
    
        const response = await request(app)
          .post('/usuarios/login')
          .send({ correoElectronico: 'non-existing@example.com', contrasena: 'password' });
    
       
        expect(response.body).toHaveProperty('error', 'Usuario no encontrado o contraseña incorrecta');
      
      });

      test('should return 500 when there is an error finding user by correoElectronico', async () => {
        Usuario.findOne.mockRejectedValueOnce(new Error('Database error'));
    
        const response = await request(app)
          .post('/usuarios/login')
          .send({ correoElectronico: 'test@example.com', contrasena: 'password' });
    
        expect(response.statusCode).toBe(500);
  
      });

      test('should return 500 when there is an error finding user by correoElectronico - body', async () => {
        Usuario.findOne.mockRejectedValueOnce(new Error('Database error'));
    
        const response = await request(app)
          .post('/usuarios/login')
          .send({ correoElectronico: 'test@example.com', contrasena: 'password' });
    
      
        expect(response.body).toHaveProperty('error', 'Error al buscar el usuario');

      });




 

    
    });
      


});

    describe('User Controller - updateUsuario', () => {
        afterEach(() => {
        jest.clearAllMocks();
        });

        test('Actualizar un usuario de manera exitosa -status', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            const mockUpdatedUser = {
              _id: mockUserId,
              nombre: 'Nuevo Nombre',
              correoElectronico: 'nuevo@example.com',
              numeroCelular: '1234567890',
              direccion: 'Nueva Dirección',
              rol: 'admin',
            };
            Usuario.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedUser);
        
            const response = await request(app)
              .put(`/usuarios/${mockUserId}`)
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
            expect(response.statusCode).toBe(200);
          });

          test('Actualizar un usuario de manera exitosa - body', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            const mockUpdatedUser = {
              _id: mockUserId,
              nombre: 'Nuevo Nombre',
              correoElectronico: 'nuevo@example.com',
              numeroCelular: '1234567890',
              direccion: 'Nueva Dirección',
              rol: 'admin',
            };
            Usuario.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedUser);
        
            const response = await request(app)
              .put(`/usuarios/${mockUserId}`)
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
        
            expect(response.body).toEqual(mockUpdatedUser);
            expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith(mockUserId, expect.any(Object), { new: true });
          });

          test('Actualizar un usuario de manera exitosa - object', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            const mockUpdatedUser = {
              _id: mockUserId,
              nombre: 'Nuevo Nombre',
              correoElectronico: 'nuevo@example.com',
              numeroCelular: '1234567890',
              direccion: 'Nueva Dirección',
              rol: 'admin',
            };
            Usuario.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedUser);
        
            const response = await request(app)
              .put(`/usuarios/${mockUserId}`)
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
            expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith(mockUserId, expect.any(Object), { new: true });
          });
       
          test('user id invalido- status', async () => {
            const response = await request(app)
              .put('/usuarios/5')
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
            expect(response.statusCode).toBe(400);
          });

          test('user id invalido- body', async () => {
            const response = await request(app)
              .put('/usuarios/5')
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
            expect(response.body).toHaveProperty('error', 'ID de usuario no válido');
          });

          test('user id invalido- object', async () => {
            const response = await request(app)
              .put('/usuarios/5')
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        

            expect(Usuario.findByIdAndUpdate).not.toHaveBeenCalled();
          });

          test('usuario no encontrado', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findByIdAndUpdate.mockResolvedValueOnce(null);
        
            const response = await request(app)
              .put(`/usuarios/${mockUserId}`)
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
            expect(response.statusCode).toBe(404);
          });

          test('usuario no encontrado- body', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findByIdAndUpdate.mockResolvedValueOnce(null);
        
            const response = await request(app)
              .put(`/usuarios/${mockUserId}`)
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
  
            expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
         
          });

          test('usuario no encontrado- object', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findByIdAndUpdate.mockResolvedValueOnce(null);
        
            const response = await request(app)
              .put(`/usuarios/${mockUserId}`)
              .send({
                nombre: 'Nuevo Nombre',
                correoElectronico: 'nuevo@example.com',
                numeroCelular: '1234567890',
                direccion: 'Nueva Dirección',
                rol: 'admin',
              });
        
  
              expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith(mockUserId, expect.any(Object), { new: true });
         
          });




    });

    describe('User Controller - inhabilitarUsuario', () => {
        afterEach(() => {
        jest.clearAllMocks();
        });
    

        test('inhabilitar exitosamente- status', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            const mockUser = {
              _id: mockUserId,
              habilitado: true,
            };
            Usuario.findById.mockResolvedValueOnce(mockUser);
        
            const response = await request(app)
              .delete(`/usuarios/${mockUserId}`);
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Usuario deshabilitado con éxito' });
          });


          test('inhabilitar exitosamente- body', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            const mockUser = {
              _id: mockUserId,
              habilitado: true,
            };
            Usuario.findById.mockResolvedValueOnce(mockUser);
        
            const response = await request(app)
              .delete(`/usuarios/${mockUserId}`);

            expect(response.body).toEqual({ message: 'Usuario deshabilitado con éxito' });
          });

          test('usuario no encontrado - status', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findById.mockResolvedValueOnce(null);
        
            const response = await request(app)
              .delete(`/usuarios/${mockUserId}`);
        
            expect(response.statusCode).toBe(404);

          });

          test('usuario no encontrado - body', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findById.mockResolvedValueOnce(null);
        
            const response = await request(app)
              .delete(`/usuarios/${mockUserId}`);
        
       
            expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
   
          });

          test('usuario no encontrado - object', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            Usuario.findById.mockResolvedValueOnce(null);
        
            const response = await request(app)
              .delete(`/usuarios/${mockUserId}`);
    
            expect(Usuario.findById).toHaveBeenCalledWith(mockUserId);
          });
    
    });

    describe('User Controller - generate2FAKey', () => {
        afterEach(() => {
          jest.clearAllMocks();
        });
      
        test('should generate 2FA secret successfully', async () => {
          const mockUserId = mongoose.Types.ObjectId();
          const mock2FASecret = 'mock2FASecret';
          generateAndEnableTwoFactor.mockResolvedValueOnce({ secret: mock2FASecret });
      
          const response = await request(app)
            .post(`/generate-2fa-secret/${mockUserId}`);
      
          expect(response.statusCode).toBe(200);
  
        });

        test('should generate 2FA secret successfully- body', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            const mock2FASecret = 'mock2FASecret';
            generateAndEnableTwoFactor.mockResolvedValueOnce({ secret: mock2FASecret });
        
            const response = await request(app)
              .post(`/generate-2fa-secret/${mockUserId}`);
        

              expect(response.body).toEqual({ secret: mock2FASecret });
          });
          test('should generate 2FA secret successfully- mock', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            const mock2FASecret = 'mock2FASecret';
            generateAndEnableTwoFactor.mockResolvedValueOnce({ secret: mock2FASecret });
        
            const response = await request(app)
              .post(`/generate-2fa-secret/${mockUserId}`);
        

            expect(response.body).toEqual({ secret: mock2FASecret });
          });
        test('should handle invalid user ID', async () => {
            const response = await request(app)
              .post('/generate-2fa-secret/invalid-id');
        
            expect(response.statusCode).toBe(400);
       
          });

          test('should handle invalid user ID-body', async () => {
            const response = await request(app)
              .post('/generate-2fa-secret/invalid-id');
        
       
            expect(response.body).toHaveProperty('error', 'Invalid userId');
 
          });

          test('should handle invalid user ID-object', async () => {
            const response = await request(app)
              .post('/generate-2fa-secret/invalid-id');
        
       
              expect(generateAndEnableTwoFactor).not.toHaveBeenCalled();
 
          });
        
          test('should handle error during 2FA generation', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            generateAndEnableTwoFactor.mockRejectedValueOnce(new Error('Error generating 2FA secret'));
        
            const response = await request(app)
              .post(`/generate-2fa-secret/${mockUserId}`);
        
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('error', 'Error generating 2FA secret');
            expect(generateAndEnableTwoFactor).toHaveBeenCalledWith(mockUserId);
          });

          test('should handle error during 2FA generation-body', async () => {
            const mockUserId = mongoose.Types.ObjectId();
            generateAndEnableTwoFactor.mockRejectedValueOnce(new Error('Error generating 2FA secret'));
        
            const response = await request(app)
              .post(`/generate-2fa-secret/${mockUserId}`);
        

            expect(response.body).toHaveProperty('error', 'Error generating 2FA secret');
   
          });
        });