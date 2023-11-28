const supertest = require('supertest');
const app = require('../../index'); 
describe('Pruebas de Integración para Restaurantes', () => {

  const restauranteEjemplo = {
    nombre: 'RestaurantePrueba',
    categoria: 'Comida rápida',
    popularidad: 5,
  };

  let restauranteId;

  test('Crea un restaurante exitosamente', async () => {
    const response = await supertest(app)
      .post('/restaurantes')
      .send(restauranteEjemplo);

    expect(response.status).toBe(201);
    restauranteId = response.body.restaurante._id; 
  });

  test('Crea un restaurante exitosamente -- status', async () => {
    const response = await supertest(app)
      .post('/restaurantes')
      .send(restauranteEjemplo);

    expect(response.body).toHaveProperty('mensaje', 'Restaurante creado con éxito');
    expect(response.body).toHaveProperty('restaurante');
    restauranteId = response.body.restaurante._id; 
  });

  test('Crea un restaurante exitosamente -- object', async () => {
    const response = await supertest(app)
      .post('/restaurantes')
      .send(restauranteEjemplo);

    expect(response.body).toHaveProperty('restaurante');
    restauranteId = response.body.restaurante._id; 
  });


  // Prueba de lectura de restaurante por ID
  test('Lee un restaurante por ID exitosamente', async () => {
    const response = await supertest(app)
      .get(`/restaurantes/${restauranteId}`);

    expect(response.status).toBe(201);
  });

  test('Lee un restaurante por ID exitosamente --body/name', async () => {
    const response = await supertest(app)
      .get(`/restaurantes/${restauranteId}`);

    expect(response.body).toHaveProperty('nombre', 'RestaurantePrueba');
  });

  test('Lee un restaurante por ID exitosamente --body/categoria', async () => {
    const response = await supertest(app)
      .get(`/restaurantes/${restauranteId}`);

    expect(response.body).toHaveProperty('categoria', 'Comida rápida');

  });

  test('Lee un restaurante por ID exitosamente --body/categoria', async () => {
    const response = await supertest(app)
      .get(`/restaurantes/${restauranteId}`);

    expect(response.body).toHaveProperty('popularidad', 5);
  });

  // Prueba de actualización de restaurante
  test('Actualiza un restaurante exitosamente', async () => {
    const nuevosDatos = {
      nombre: 'RestauranteModificado',
      popularidad: 4,
    };

    const response = await supertest(app)
      .put(`/restaurantes/${restauranteId}`)
      .send(nuevosDatos);

    expect(response.status).toBe(200);
  });

  test('Actualiza un restaurante exitosamente - body/nombre', async () => {
    const nuevosDatos = {
      nombre: 'RestauranteModificado',
      popularidad: 4,
    };

    const response = await supertest(app)
      .put(`/restaurantes/${restauranteId}`)
      .send(nuevosDatos);

    expect(response.body).toHaveProperty('nombre', 'RestauranteModificado');
  });

  test('Actualiza un restaurante exitosamente - body/popularidad', async () => {
    const nuevosDatos = {
      nombre: 'RestauranteModificado',
      popularidad: 4,
    };

    const response = await supertest(app)
      .put(`/restaurantes/${restauranteId}`)
      .send(nuevosDatos);
    expect(response.body).toHaveProperty('popularidad', 4);
  });

  // Prueba de deshabilitar restaurante
  test('Deshabilita un restaurante exitosamente', async () => {
    const response = await supertest(app)
      .patch(`/restaurantes/${restauranteId}/deshabilitar`);

    expect(response.status).toBe(200);
  
  });

  test('Deshabilita un restaurante exitosamente --body', async () => {
    const response = await supertest(app)
      .patch(`/restaurantes/${restauranteId}/deshabilitar`);

    expect(response.body).toHaveProperty('message', 'Restaurante deshabilitado con éxito');
  });

  // Prueba de búsqueda de restaurantes
  test('Busca restaurantes exitosamente', async () => {
    const response = await supertest(app)
      .get('/restaurantes/busqueda')
      .query({ categoria: 'Comida rápida' });

    expect(response.status).toBe(201);

  });

  test('Busca restaurantes exitosamente --body', async () => {
    const response = await supertest(app)
      .get('/restaurantes/busqueda')
      .query({ categoria: 'Comida rápida' });

    expect(response.body).toHaveLength(1);
  });

  test('Busca restaurantes exitosamente --body/nombre', async () => {
    const response = await supertest(app)
      .get('/restaurantes/busqueda')
      .query({ categoria: 'Comida rápida' });

    expect(response.body[0]).toHaveProperty('nombre', 'RestauranteModificado');
  });
});
