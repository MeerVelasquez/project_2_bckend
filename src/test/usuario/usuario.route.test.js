const request = require('supertest');
const app = require('.../index'); 
const mongoose = require('mongoose');
const Usuario = require('.../usuario/usuario.model');


jest.mock('.../usuario/usuario.model');

describe('Usuario routes', () => {

});