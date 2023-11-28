const request = require('supertest');
const app = require('../../index'); 

describe('productos routes', () => {

    // pruebas unitarias de la ruta productos

test ('route-producto', async () => { 
    const restaurante = await Restaurante.findOne({ nombre: 'Restaurante de Prueba' });  
    const nuevoProducto = {
        nombre: 'Nuevo Producto',
        descripcion: 'Descripción del nuevo producto',
        precio: 15.99,
        restauranteId: restaurante._id,
      };

      const response = await request
      .post('/productos')
      .send(nuevoProducto);

    
    expect(response.status).toBe(200);
    
} );

test ('route-producto-body', async () => {  
    const restaurante = await Restaurante.findOne({ nombre: 'Restaurante de Prueba' });  
    const nuevoProducto = {
        nombre: 'Nuevo Producto',
        descripcion: 'Descripción del nuevo producto',
        precio: 15.99,
        restauranteId: restaurante._id,
      };

      const response = await request
      .post('/productos')
      .send(nuevoProducto);

    
      expect(response.body.message).toBe('Producto creado con éxito');
    
} );

test ('route-producto-error', async () => {
      const response = await request
      .post('/productos')
      .send({ nombre: 'Nuevo Producto Incompleto' });

      expect(response.status).toBe(400);
    
} );

test ('route-producto-error-body', async () => {
    const response = await request
    .post('/productos')
    .send({ nombre: 'Nuevo Producto Incompleto' });

    expect(response.body.error).toBe('Todos los campos son obligatorios.');
  
} );

//productos/busqueda

test ('route-producto-busqueda', async () => {
    const response = await request (app).get('/productos/busqueda').query({nombre: 'ProductoX'});
    expect(response.status).toBe(201);
});

test ('route-producto-busqueda-id', async () => {
    const response = await request (app).get('/productos/busqueda').query({restauranteId: '1'});
    expect(response.status).toBe(201);
});

test ('route-producto-busqueda-id-error', async () => {
    const response = await request (app).get('/productos/busqueda').query({restauranteId: '2'});
    expect(response.status).toBe(400);
});

test ('route-producto-busqueda-id-error-body', async () => {
    const response = await request (app).get('/productos/busqueda').query({restauranteId: '2'});
    expect(response.body.error).toBe('ID de restaurante no válido');
});


test ('route-producto-busqueda-error', async () => {
    const response = await request (app).get('/productos/busqueda').query({nombre: 'ProductoX'});
    expect(response.status).toBe(500);
});

test ('route-producto-busqueda-error-body', async () => {
    const response = await request (app).get('/productos/busqueda').query({nombre: 'ProductoX'});
    expect(response.body.error).toBe('Error al buscar productos.');
});

//productos/:id

test ('route-producto-id', async () => {
    const response = await request (app).get('/productos/1');
    expect(response.status).toBe(201);
});

test ('route-producto-id-error', async () => {
    const response = await request (app).get('/productos/2');
    expect(response.status).toBe(404);
});

test ('route-producto-id-error-body', async () => {
    const response = await request (app).get('/productos/2');
    expect(response.body.error).toBe('Producto no encontrado');
});

//productos/:id put

test ('route-producto-id-put', async () => {
    const producto = await Producto.findOne({ nombre: 'Producto de Prueba' });
    const datosActualizados = {
      nombre: 'Producto Actualizado',
      descripcion: 'Descripción actualizada',
      precio: 24.99,
    };
    const response = await request
      .put(`/productos/${producto._id}`)
      .send(datosActualizados);
    expect(response.status).toBe(200);
});

test ('route-producto-id-put-body', async () => {
    const producto = await Producto.findOne({ nombre: 'Producto de Prueba' });
    const datosActualizados = {
      nombre: 'Producto Actualizado',
      descripcion: 'Descripción actualizada',
      precio: 24.99,
    };
    const response = await request
      .put(`/productos/${producto._id}`)
      .send(datosActualizados);
      expect(response.body.message).toBe('Producto actualizado con éxito');
});

test ('route-producto-id-put-error', async () => {
    const datosActualizados = {
        nombre: 'Producto Actualizado',
        descripcion: 'Descripción actualizada',
        precio: 24.99,
      };
    const response = await request
      .put('/productos/2')
      .send(datosActualizados);
    expect(response.status).toBe(400);
});

test ('route-producto-id-put-error-body', async () => {
    const datosActualizados = {
        nombre: 'Producto Actualizado',
        descripcion: 'Descripción actualizada',
        precio: 24.99,
      };
    const response = await request
      .put('/productos/2')
      .send(datosActualizados);
    expect(response.body.error).toBe('ID de producto no válido');
});

//productos/:id/deshabilitar

test ('route-producto-id-deshabilitar', async () => {
    const producto = await Producto.findOne({ nombre: 'Producto de Prueba' });
    const response = await request
      .patch(`/productos/${producto._id}/inhabilitar`);
    expect(response.status).toBe(200);
});

test ('route-producto-id-deshabilitar-body', async () => {
    const producto = await Producto.findOne({ nombre: 'Producto de Prueba' });
    const response = await request
      .patch(`/productos/${producto._id}/inhabilitar`);
      expect(response.body.message).toBe('Producto inhabilitado con éxito');
});

test ('route-producto-id-deshabilitar-error', async () => {
    const productoIdNoExistente = mongoose.Types.ObjectId();
    const response = await request
      .patch(`/productos/${productoIdNoExistente}/inhabilitar`);
    expect(response.status).toBe(404);
});

test ('route-producto-id-deshabilitar-error-body', async () => {
    const productoIdNoExistente = mongoose.Types.ObjectId();
    const response = await request
      .patch(`/productos/${productoIdNoExistente}/inhabilitar`);
    expect(response.body.error).toBe('Producto no encontrado');
});

});