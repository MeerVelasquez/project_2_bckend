const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('../../usuario/usuario.model');
const usuarioRouter = require('../../usuario/usuario.router');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = express();
jest.mock('../../usuario/usuario.model');



describe('User Routes', () => {
  it('should create a new user successfully', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nombre: 'John Doe',
        correoElectronico: 'john.doe@example.com',
        contrasena: 'password123',
        numeroCelular: '123456789',
        direccion: '123 Main Street',
        rol: 'user',
      });
      

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('mensaje', 'Usuario creado con éxito');
  });

  // Add more test cases for update, delete, and 2FA endpoints
});