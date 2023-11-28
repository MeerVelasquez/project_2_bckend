const supertest = require('supertest');
const app = require('../../index'); 

describe('Pruebas de Integración para Productos', () => {

  const productoEjemplo = {
    nombre: 'ProductoPrueba',
    descripcion: 'Descripción del producto de prueba',
    precio: 15.99,
    categoria: 'Categoría de prueba',
    restauranteId: '655f9afc958d8ea1da2cab0f', 
  };


  let productoId;

  // Prueba de creación de producto
  test('Crea un producto exitosamente', async () => {
    const response = await supertest(app)
      .post('/productos')
      .send(productoEjemplo);

    expect(response.status).toBe(200);
    productoId = response.body.producto._id; 
  });

  test('Crea un producto exitosamente --body', async () => {
    const response = await supertest(app)
      .post('/productos')
      .send(productoEjemplo);

    expect(response.body).toHaveProperty('message', 'Producto creado con éxito');
    productoId = response.body.producto._id; 
  });

  test('Crea un producto exitosamente --body2', async () => {
    const response = await supertest(app)
      .post('/productos')
      .send(productoEjemplo);

    expect(response.body).toHaveProperty('producto');
    productoId = response.body.producto._id; 
  });

  // Prueba de lectura de producto por ID
  test('Lee un producto por ID exitosamente', async () => {
    const response = await supertest(app)
      .get(`/pedidos/${productoId}`);

    expect(response.status).toBe(201);
  });

  test('Lee un producto por ID exitosamente -body1', async () => {
    const response = await supertest(app)
      .get(`/pedidos/${productoId}`);

    expect(response.body).toHaveProperty('nombre', 'ProductoPrueba');
  });

  test('Lee un producto por ID exitosamente -body2', async () => {
    const response = await supertest(app)
      .get(`/pedidos/${productoId}`);


    expect(response.body).toHaveProperty('descripcion', 'Descripción del producto de prueba');

  });
  test('Lee un producto por ID exitosamente --body3', async () => {
    const response = await supertest(app)
      .get(`/pedidos/${productoId}`);


    expect(response.body).toHaveProperty('precio', 15.99);

  });
  test('Lee un producto por ID exitosamente --body4', async () => {
    const response = await supertest(app)
      .get(`/pedidos/${productoId}`);

    expect(response.body).toHaveProperty('categoria', 'Categoría de prueba');
  });

  // Prueba de actualización de producto
test('Devuelve un estado 200 al actualizar un producto', async () => {
    const nuevosDatos = {
      nombre: 'ProductoModificado',
      precio: 19.99,
    };
  
    const response = await supertest(app)
      .put(`/pedidos/${productoId}`)
      .send(nuevosDatos);
  
    expect(response.status).toBe(200);
  });
  
  test('Devuelve un mensaje de éxito al actualizar un producto', async () => {
    const nuevosDatos = {
      nombre: 'ProductoModificado',
      precio: 19.99,
    };
  
    const response = await supertest(app)
      .put(`/pedidos/${productoId}`)
      .send(nuevosDatos);
  
    expect(response.body).toHaveProperty('message', 'Producto actualizado con éxito');
  });
  
  test('Devuelve un objeto "producto" al actualizar un producto', async () => {
    const nuevosDatos = {
      nombre: 'ProductoModificado',
      precio: 19.99,
    };
  
    const response = await supertest(app)
      .put(`/pedidos/${productoId}`)
      .send(nuevosDatos);
  
    expect(response.body).toHaveProperty('producto');
  });
  
  test('Devuelve el producto actualizado con los datos proporcionados', async () => {
    const nuevosDatos = {
      nombre: 'ProductoModificado',
      precio: 19.99,
    };
  
    const response = await supertest(app)
      .put(`/pedidos/${productoId}`)
      .send(nuevosDatos);
  
    expect(response.body.producto).toHaveProperty('nombre', 'ProductoModificado');
  });

  test('Devuelve el producto actualizado con los datos proporcionados --2', async () => {
    const nuevosDatos = {
      nombre: 'ProductoModificado',
      precio: 19.99,
    };
  
    const response = await supertest(app)
      .put(`/pedidos/${productoId}`)
      .send(nuevosDatos);

    expect(response.body.producto).toHaveProperty('precio', 19.99);
  });
  

  // Prueba de inhabilitación de producto
test('Devuelve un estado 200 al inhabilitar un producto', async () => {
    const response = await supertest(app).patch(`/pedidos/${productoId}/inhabilitar`);
  
    expect(response.status).toBe(200);
  });
  
  test('Devuelve un mensaje de éxito al inhabilitar un producto', async () => {
    const response = await supertest(app).patch(`/pedidos/${productoId}/inhabilitar`);
  
    expect(response.body).toHaveProperty('message', 'Producto inhabilitado con éxito');
  });
  
  test('Devuelve un objeto "producto" al inhabilitar un producto', async () => {
    const response = await supertest(app).patch(`/pedidos/${productoId}/inhabilitar`);
  
    expect(response.body).toHaveProperty('producto');
  });
  
  test('Devuelve el producto inhabilitado con la propiedad "habilitado" en false', async () => {
    const response = await supertest(app).patch(`/pedidos/${productoId}/inhabilitar`);
  
    expect(response.body.producto).toHaveProperty('habilitado', false);
  });
  

test('Devuelve un estado 200 al buscar productos', async () => {
    const response = await supertest(app)
      .get('/productos/busqueda')
      .query({ restauranteId: '655f9afc958d8ea1da2cab0f' }); 
  
    expect(response.status).toBe(200);
  });

  test('Devuelve una lista de productos con longitud 1 al buscar productos', async () => {
    const response = await supertest(app)
      .get('/productos/busqueda')
      .query({ restauranteId: '655f9afc958d8ea1da2cab0f' }); 
  
    expect(response.body).toHaveLength(1);
  });

  test('Devuelve un producto con el nombre "ProductoModificado" al buscar productos', async () => {
    const response = await supertest(app)
      .get('/productos/busqueda')
      .query({ restauranteId: '655f9afc958d8ea1da2cab0f' });
  
    expect(response.body[0]).toHaveProperty('nombre', 'ProductoModificado');
  });
  
});

