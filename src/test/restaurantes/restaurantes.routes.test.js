const request = require('supertest');
const app = require('../../index'); 

describe('restaurantes routes', () => {

    // pruebas unitarias de la ruta restaurante

test ('route-restaurante', async () => {
    const user_admin =  {userId: '1'}
    const response = await request
      .post('/restaurantes')
      .set('Authorization', `Bearer ${generateToken(usuarioAdmin.userId)}`) 
      .send({
        nombre: 'Nuevo Restaurante',
        categoria: 'Comida Rápida',
        popularidad: 5,
      });
    expect(response.status).toBe(201);
    
});

test ('route-restaurante-body', async () => {
    const user_admin =  {userId: '1'}
    const response = await request
    .post('/restaurantes')
    .set('Authorization', `Bearer ${generateToken(usuarioAdmin.userId)}`)  
    .send({
      nombre: 'Nuevo Restaurante',
      categoria: 'Comida Rápida',
      popularidad: 5,
    });
    expect(response.body.mensaje).toBe('Restaurante creado con éxito');
    
});

test ('route-restaurante-error', async () => {
    const user_admin =  {userId: '1'}
    const response = await request
    .post('/restaurantes')
    .set('Authorization', `Bearer ${generateToken(usuarioAdmin.userId)}`)  
    .send({
      nombre: 'Nuevo Restaurante',
      categoria: 'Comida Rápida',
    });
    expect(response.status).toBe(500);
    
});


//restaurantes/busqueda 

test ('route-restaurante-busqueda', async () => {
    const response = await request (app).get('/restaurantes/busqueda').query({nombre: 'RestauranteX'});
    expect(response.status).toBe(201);
});

test ('route-restaurante-busqueda-2', async () => {
    const response = await request (app).get('/restaurantes/busqueda').query({categoria: 'Comida Rápida'});
    expect(response.status).toBe(201);
});

test ('route-restaurante-busqueda-body', async () => {
    const response = await request (app).get('/restaurantes/busqueda').query({categoria: 'Comida Rápida'});
    expect(response.body.length).toBe(1);
});

test ('route-restaurante-busqueda-error', async () => {
    const response = await request (app).get('/restaurantes/busqueda').query({categoria: 'Comida'});
    expect(response.status).toBe(404);
});

//restaurantes/:id

test ('route-restaurante-id', async () => {
    const response = await request (app).get('/restaurantes/1');
    expect(response.status).toBe(201);
});

test ('route-restaurante-id-error', async () => {
    const response = await request (app).get('/restaurantes/2');
    expect(response.status).toBe(404);
});

//restaurantes/:id put 

test ('route-restaurante-id-put', async () => {
    const response = await request (app).put('/restaurantes/1').send({nombre: 'Nuevo Restaurante',
    categoria: 'Comida Rápida', popularidad: 5}).set('Accept', 'application/json');
    expect(response.status).toBe(200);
});

test ('route-restaurante-id-put-error', async () => {
    const response = await request (app).put('/restaurantes/2').send({nombre: 'Nuevo Restaurante',
    categoria: 'Comida Rápida', popularidad: 5}).set('Accept', 'application/json');
    expect(response.status).toBe(404);
});


});