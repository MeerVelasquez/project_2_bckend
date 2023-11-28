const request = require('supertest');
const app = require('../../index'); 
const mongoose = require('mongoose');
const Restaurante = require('../../restaurantes/restaurantes.model');

jest.mock('.../restaurantes/restaurantes.model');

describe('Controlador de Restaurantes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Crear Restaurante', () => {
    test('debería crear un restaurante correctamente', async () => {
      const mockRestaurante = { nombre: 'Nuevo Restaurante', categoria: 'Comida Rápida', popularidad: 4 };

      Restaurante.prototype.save.mockResolvedValueOnce();

      const response = await request(app)
        .post('/restaurantes')
        .send(mockRestaurante);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ mensaje: 'Restaurante creado con éxito' });
    });

    test('debería crear un restaurante correctamente - body', async () => {
        const mockRestaurante = { nombre: 'Nuevo Restaurante', categoria: 'Comida Rápida', popularidad: 4 };
  
        Restaurante.prototype.save.mockResolvedValueOnce();
  
        const response = await request(app)
          .post('/restaurantes')
          .send(mockRestaurante);
  
   
        expect(response.body).toEqual({ mensaje: 'Restaurante creado con éxito' });
      });

      test('Debería retornar un error cuando falta la popularidad del restaurante', async () => {
        const restauranteData = {
          nombre: 'Nuevo Restaurante',
          categoria: 'Comida Rápida',
        };
    
        const response = await supertest(app)
          .post('/restaurantes')
          .send(restauranteData);
    
        expect(response.status).toBe(400);

     
      });

      test('Debería retornar un error cuando falta la popularidad del restaurante -- body', async () => {
        const restauranteData = {
          nombre: 'Nuevo Restaurante',
          categoria: 'Comida Rápida',
        };
    
        const response = await supertest(app)
          .post('/restaurantes')
          .send(restauranteData);
    

        expect(response.body.success).toBe(false);
     
      });

   
  });

  describe('Buscar Restaurantes', () => {

    afterEach(() => {
        jest.clearAllMocks();
      });
    test('Debería retornar una lista de restaurantes filtrados por categoría y nombre', async () => {
      const response = await supertest(app)
        .get('/restaurantes/busqueda')
        .query({ categoria: 'Comida Rápida', nombre: 'Restaurante Ejemplo' });
  
      expect(response.status).toBe(201);

    });

    test('Debería retornar una lista de restaurantes filtrados por categoría y nombre --body', async () => {
        const response = await supertest(app)
          .get('/restaurantes/busqueda')
          .query({ categoria: 'Comida Rápida', nombre: 'Restaurante Ejemplo' });

        expect(response.body).toHaveLength(1); 
      });
  
    test('Debería retornar una lista vacía si no se encuentran restaurantes', async () => {
      const response = await supertest(app)
        .get('/restaurantes/busqueda')
        .query({ categoria: 'Categoria Inexistente' });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No se encontraron restaurantes que coincidan con los criterios de búsqueda.');
    });

    test('Debería retornar un error 500 si hay un error en el servidor al buscar restaurantes', async () => {
        jest.spyOn(Restaurante, 'find').mockRejectedValue(new Error('Error en la búsqueda'));
    
        const response = await supertest(app)
          .get('/restaurantes/busqueda')
          .query({ categoria: 'Comida Rápida' });
    
        expect(response.status).toBe(500);
  
      });

      test('Debería retornar un error 500 si hay un error en el servidor al buscar restaurantes -- body', async () => {
        jest.spyOn(Restaurante, 'find').mockRejectedValue(new Error('Error en la búsqueda'));
    
        const response = await supertest(app)
          .get('/restaurantes/busqueda')
          .query({ categoria: 'Comida Rápida' });
    
        expect(response.body.error).toBe('Error al buscar restaurantes.');
      });
 
  });
  

  describe('Obtener Restaurante por ID', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
      test('Debería retornar un restaurante cuando se proporciona un ID válido', async () => {
   
        const restauranteExistente = {
          _id: '605a49e8b7707e14f8d891f6', 
          nombre: 'Restaurante de Prueba',
          categoria: 'Comida Rápida',
          popularidad: 4.5,
        };
    
        const response = await supertest(app)
          .get(`/restaurantes/${restauranteExistente._id}`);
    
        expect(response.status).toBe(201);
        expect(response.body).toEqual(restauranteExistente); 
      });

      test('Debería retornar un restaurante cuando se proporciona un ID válido-- body', async () => {
   
        const restauranteExistente = {
          _id: '605a49e8b7707e14f8d891f6', 
          nombre: 'Restaurante de Prueba',
          categoria: 'Comida Rápida',
          popularidad: 4.5,
        };
    
        const response = await supertest(app)
          .get(`/restaurantes/${restauranteExistente._id}`);
    
 
        expect(response.body).toEqual(restauranteExistente); 
      });
    
      it('Debería retornar un error 404 si el restaurante no existe ', async () => {

        const restauranteNoExistenteId = '605a4a0bb7707e14f8d891f7'; 
    
        const response = await supertest(app)
          .get(`/restaurantes/${restauranteNoExistenteId}`);
    
        expect(response.status).toBe(404);

      });

      it('Debería retornar un error 404 si el restaurante no existe', async () => {

        const restauranteNoExistenteId = '605a4a0bb7707e14f8d891f7'; 
    
        const response = await supertest(app)
          .get(`/restaurantes/${restauranteNoExistenteId}`);

        expect(response.body.error).toBe('Restaurante no encontrado');
      });
  });

  describe('Actualizar Restaurante por ID', () => {
    test('Debería actualizar un restaurante cuando se proporciona un ID válido', async () => {
      
        const restauranteExistente = {
          _id: '605a49e8b7707e14f8d891f6', 
          nombre: 'Restaurante de Prueba',
          categoria: 'Comida Rápida',
          popularidad: 4.5,
        };
    
        const nuevoNombre = 'Nuevo Restaurante';
    
        const response = await supertest(app)
          .put(`/restaurantes/${restauranteExistente._id}`)
          .send({ nombre: nuevoNombre, categoria: restauranteExistente.categoria, popularidad: restauranteExistente.popularidad });
    
        expect(response.status).toBe(200);

      });

      test('Debería actualizar un restaurante cuando se proporciona un ID válido --body', async () => {
      
        const restauranteExistente = {
          _id: '605a49e8b7707e14f8d891f6', 
          nombre: 'Restaurante de Prueba',
          categoria: 'Comida Rápida',
          popularidad: 4.5,
        };
    
        const nuevoNombre = 'Nuevo Restaurante';
    
        const response = await supertest(app)
          .put(`/restaurantes/${restauranteExistente._id}`)
          .send({ nombre: nuevoNombre, categoria: restauranteExistente.categoria, popularidad: restauranteExistente.popularidad });
    
 
        expect(response.body.nombre).toBe(nuevoNombre);
      });

      test('Debería retornar un error 404 si el restaurante no existe', async () => {
        const restauranteNoExistenteId = '605a4a0bb7707e14f8d891f7'; 
    
        const response = await supertest(app)
          .put(`/restaurantes/${restauranteNoExistenteId}`)
          .send({ nombre: 'Nuevo Restaurante', categoria: 'Comida Rápida', popularidad: 4.5 });
    
        expect(response.status).toBe(404);
  
      });

      test('Debería retornar un error 404 si el restaurante no existe-body', async () => {
        const restauranteNoExistenteId = '605a4a0bb7707e14f8d891f7'; 
    
        const response = await supertest(app)
          .put(`/restaurantes/${restauranteNoExistenteId}`)
          .send({ nombre: 'Nuevo Restaurante', categoria: 'Comida Rápida', popularidad: 4.5 });

        expect(response.body.error).toBe('Restaurante no encontrado');
      });
    
   
    });

  });

  describe('Deshabilitar Restaurante por ID', () => {
    test('Debería deshabilitar un restaurante cuando se proporciona un ID válido', async () => {
     
        const restauranteExistente = {
          _id: '605a49e8b7707e14f8d891f6', 
          nombre: 'Restaurante de Prueba',
          categoria: 'Comida Rápida',
          popularidad: 4.5,
          habilitado: true, 
        };
    
        const response = await supertest(app)
          .patch(`/restaurantes/${restauranteExistente._id}/deshabilitar`)
          .send();
    
        expect(response.status).toBe(200);

      });

      test('Debería deshabilitar un restaurante cuando se proporciona un ID válido', async () => {
     
        const restauranteExistente = {
          _id: '605a49e8b7707e14f8d891f6', 
          nombre: 'Restaurante de Prueba',
          categoria: 'Comida Rápida',
          popularidad: 4.5,
          habilitado: true, 
        };
    
        const response = await supertest(app)
          .patch(`/restaurantes/${restauranteExistente._id}/deshabilitar`)
          .send();
    
 
        expect(response.body.message).toBe('Restaurante deshabilitado con éxito');
      });

      test('Debería retornar un error 400 si se proporciona un ID de restaurante no válido', async () => {
        const restauranteIdInvalido = 'id-no-valido';
    
        const response = await supertest(app)
          .patch(`/restaurantes/${restauranteIdInvalido}/deshabilitar`)
          .send();
    
        expect(response.status).toBe(400);

      });

      test('Debería retornar un error 400 si se proporciona un ID de restaurante no válido -- body', async () => {
        const restauranteIdInvalido = 'id-no-valido';
    
        const response = await supertest(app)
          .patch(`/restaurantes/${restauranteIdInvalido}/deshabilitar`)
          .send();

        expect(response.body.error).toBe('ID de restaurante no válido');
      });
   
  });
