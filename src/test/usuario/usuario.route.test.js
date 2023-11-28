const request = require('supertest');
const app = require('../../index'); 
const mongoose = require('mongoose');
const Usuario = require('../../usuario/usuario.model');


jest.mock('.../usuario/usuario.model');

describe('Usuario routes', () => {

    //Pruebas unitarias de la ruta de usuario
test ('route-usuario-all', async () => {
    const test_body = {nombre: 'Homero Simpson', 
    correoElectronico: 'homer@example.com', 
    contrasena: '12345678',
     numeroCelular: '123987', 
     direccion: 'Calle falsa 123', 
     rol: 'usuario', habilitado: true};
     const {status} = await request (app).post('/usuarios').send(test_body).set('Accept', 'application/json');
      expect(status).toBe(201);
    
});

test ('route-usuario-all-body', async () => {
    const test_body = {nombre: 'Homero Simpson', 
    correoElectronico: 'homer@example.com', 
    contrasena: '12345678',
     numeroCelular: '123987', 
     direccion: 'Calle falsa 123', 
     rol: 'usuario', habilitado: true};
     const {status, body} = await request (app).post('/usuarios').send(test_body).set('Accept', 'application/json');
        expect(body).toStrictEqual(test_body);
    
});

test ('route-usuario-required', async () => {
    const test_body = {nombre: 'Homero Simpson', 
    correoElectronico: 'homer@example.com', 
    contrasena: '12345678',
     numeroCelular: '123987', 
     direccion: 'Calle falsa 123'};
     const {status} = await request (app).post('/usuarios').send(test_body).set('Accept', 'application/json');
      expect(status).toBe(201);
    
});

test ('route-usuario-required-body', async () => {
    const test_body = {nombre: 'Homero Simpson', 
    correoElectronico: 'homer@example.com', 
    contrasena: '12345678',
     numeroCelular: '123987', 
     direccion: 'Calle falsa 123'};
     const {status, body} = await request (app).post('/usuarios').send(test_body).set('Accept', 'application/json');
    expect(body).toStrictEqual(test_body);
    
});

test ('route-usuario-error', async () => {
    const test_body = {nombre: 'Homero Simpson', 
    correoElectronico: 'homer@example.com'};
    const {status} = await request (app).post('/usuarios').send(test_body).set('Accept', 'application/json');
    expect(status).toBe(500);
});


//usuarios/login 

test ('route-usuario-login', async () => {
    const test_body = {correoElectronico: 'homero@example.com', contrasena: '12345678'};
    const {status} = await request (app).post('/usuarios/login').send(test_body).set('Accept', 'application/json');
    expect(status).toBe(201);
} );

test ('route-usuario-login-body', async () => {
    const test_body = {correoElectronico: ' homero@example.com', contrasena: '12345678'};
    const {status, body} = await request (app).post('/usuarios/login').send(test_body).set('Accept', 'application/json');
    expect(body).toStrictEqual(test_body);
} );

test ('route-usuario-login-error', async () => {
    const test_body = {correoElectronico: ' hom@example.com', contrasena: '123456'};
    const {status} = await request (app).post('/usuarios/login').send(test_body).set('Accept', 'application/json');
    expect(status).toBe(404);
} );

//usuarios/:id

test ('route-usuario-id', async () => {
    const response = await request (app).put('/usuarios/1').send({nombre: 'Homero Simpson',
    correoElectronico: 'hom@example.com', contrasena: '12345678', numeroCelular: '123987', direccion: 'Calle falsa 123', rol: 'usuario'}).set('Accept', 'application/json');
    expect(response.status).toBe(200);
});

test ('route-usuario-id-body', async () => {
    const test_body = {nombre: 'Homero Simpson',
    correoElectronico: 'hom@example.com', contrasena: '12345678', numeroCelular: '123987', direccion: 'Calle falsa 123', rol: 'usuario'};
    const {status, body} = await request (app).put('/usuarios/1').send(test_body).set('Accept', 'application/json');
    expect(body).toStrictEqual(test_body);
} );

test ('route-usuario-id-error', async () => {
    const test_body = {nombre: 'Homero Simpson',
    correoElectronico: 'hom@example.com', contrasena: '12345678', numeroCelular: '123987', direccion: 'Calle falsa 123', rol: 'usuario'};
    const {status} = await request (app).put('/usuarios/2').send(test_body).set('Accept', 'application/json');
    expect(status).toBe(400);
} );

//usuarios/:id/deshabilitar

test ('route-usuario-id-deshabilitar', async () => {
    const response = await request (app).put('/usuarios/1/deshabilitar').send({habilitado: false}).set('Accept', 'application/json');
    expect(response.status).toBe(200);
});

});