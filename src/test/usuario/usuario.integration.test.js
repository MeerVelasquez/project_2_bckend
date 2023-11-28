const supertest = require('supertest');
const app = require('../../index'); 

describe('Pruebas de Integración para Usuarios', () => {
  const usuarioEjemplo = {
    nombre: 'UsuarioPrueba',
    correoElectronico: 'usuario.prueba@example.com',
    contrasena: 'contrasena123',
    numeroCelular: '123456789',
    direccion: 'Calle 123',
    rol: 'user',
  };

  let usuarioId;

  test('Crea un usuario exitosamente', async () => {
    const response = await supertest(app)
      .post('/usuarios')
      .send(usuarioEjemplo);

    expect(response.status).toBe(201);
    usuarioId = response.body.usuario._id; 
  });

  test('Crea un usuario exitosamente --body', async () => {
    const response = await supertest(app)
      .post('/usuarios')
      .send(usuarioEjemplo);
    expect(response.body).toHaveProperty('mensaje', 'Usuario creado con éxito');
    usuarioId = response.body.usuario._id; 
   
  });

  test('Crea un usuario exitosamente -body', async () => {
    const response = await supertest(app)
      .post('/usuarios')
      .send(usuarioEjemplo);
      expect(response.body).toHaveProperty('usuario');
      usuarioId = response.body.usuario._id; 
   
  });


  test('Lee un usuario por ID exitosamente', async () => {
    const response = await supertest(app)
      .post(`/usuarios/${usuarioId}`)
      .send({
        _id: usuarioId,
      });

    expect(response.status).toBe(201);
  });

  test('Lee un usuario por ID exitosamente --body', async () => {
    const response = await supertest(app)
      .post(`/usuarios/${usuarioId}`)
      .send({
        _id: usuarioId,
      });

    expect(response.body).toHaveProperty('usuario');
  });

  test('Lee un usuario por ID exitosamente -- object ', async () => {
    const response = await supertest(app)
      .post(`/usuarios/${usuarioId}`)
      .send({
        _id: usuarioId,
      });

    expect(response.body.usuario._id).toBe(usuarioId);
  });

  test('Actualiza un usuario exitosamente', async () => {
    const nuevosDatos = {
      nombre: 'UsuarioModificado',
      numeroCelular: '987654321',
    };

    const response = await supertest(app)
      .put(`/usuarios/${usuarioId}`)
      .send(nuevosDatos);

    expect(response.status).toBe(200);

  });

  
  test('Actualiza un usuario exitosamente -- body', async () => {
    const nuevosDatos = {
      nombre: 'UsuarioModificado',
      numeroCelular: '987654321',
    };

    const response = await supertest(app)
      .put(`/usuarios/${usuarioId}`)
      .send(nuevosDatos);

    expect(response.body).toHaveProperty('nombre', 'UsuarioModificado');
  });

  test('Actualiza un usuario exitosamente - body', async () => {
    const nuevosDatos = {
      nombre: 'UsuarioModificado',
      numeroCelular: '987654321',
    };

    const response = await supertest(app)
      .put(`/usuarios/${usuarioId}`)
      .send(nuevosDatos);


    expect(response.body).toHaveProperty('numeroCelular', '987654321');
  });

  // Prueba de inhabilitar usuario
  test('Inhabilita un usuario exitosamente', async () => {
    const response = await supertest(app)
      .delete(`/usuarios/${usuarioId}`);

    expect(response.body).toHaveProperty('message', 'Usuario deshabilitado con éxito');
  });

  test('Inhabilita un usuario exitosamente', async () => {
    const response = await supertest(app)
      .delete(`/usuarios/${usuarioId}`);

    expect(response.body).toHaveProperty('message', 'Usuario deshabilitado con éxito');
  });

  // Prueba de error al leer usuario con datos incorrectos
  test('Retorna un error al leer un usuario con datos incorrectos', async () => {
    const response = await supertest(app)
      .post(`/ruta-de-tu-endpoint`)
      .send({
        correoElectronico: 'usuario.inexistente@example.com',
        contrasena: 'contrasenaIncorrecta',
      });

    expect(response.status).toBe(404);
   
  });

  test('Retorna un error al leer un usuario con datos incorrectos --body', async () => {
    const response = await supertest(app)
      .post(`/ruta-de-tu-endpoint`)
      .send({
        correoElectronico: 'usuario.inexistente@example.com',
        contrasena: 'contrasenaIncorrecta',
      });

    expect(response.body).toHaveProperty('error', 'Usuario no encontrado o contraseña incorrecta');
  });
});
