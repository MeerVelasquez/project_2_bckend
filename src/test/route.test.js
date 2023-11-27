const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');


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


// pruebas unitarias de la ruta pedidos

test ('route-pedido', async () => {
    const usuarioIdExistente = mongoose.Types.ObjectId();
    const restauranteIdExistente = mongoose.Types.ObjectId();

    const pedidoData = {
      usuarioId: usuarioIdExistente,
      restauranteId: restauranteIdExistente,
      productos: [
       
        {
          productoId: mongoose.Types.ObjectId(), 
          cantidad: 2,
        },
        
      ],
      total: 50.0, 
      estado: 'En proceso', 
    };

    const response = await request
      .post('/pedidos')
      .send(pedidoData);
    expect(response.status).toBe(201);
}  );

test ('route-pedido-body', async () => {
    const usuarioIdExistente = mongoose.Types.ObjectId();
    const restauranteIdExistente = mongoose.Types.ObjectId();

    const pedidoData = {
      usuarioId: usuarioIdExistente,
      restauranteId: restauranteIdExistente,
      productos: [
       
        {
          productoId: mongoose.Types.ObjectId(), 
          cantidad: 2,
        },
        
      ],
      total: 50.0, 
      estado: 'En proceso', 
    };

    const response = await request
      .post('/pedidos')
      .send(pedidoData);
      expect(response.body.message).toBe('Pedido creado exitosamente');
}  );

test ('route-pedido-error', async () => {
    const usuarioIdExistente = mongoose.Types.ObjectId();
    const restauranteIdExistente = mongoose.Types.ObjectId();

    const pedidoData = {
      usuarioId: usuarioIdExistente,
      restauranteId: restauranteIdExistente,
      productos: [
       
        {
          productoId: mongoose.Types.ObjectId(), 
          cantidad: 2,
        },
        
      ],
      total: 50.0, 
      estado: 'En proceso', 
    };

    const response = await request
      .post('/pedidos')
      .send(pedidoData);
    expect(response.status).toBe(500);
}  );

test ('route-pedido-error-body', async () => {
    const usuarioIdExistente = mongoose.Types.ObjectId();
    const restauranteIdExistente = mongoose.Types.ObjectId();

    const pedidoData = {
      usuarioId: usuarioIdExistente,
      restauranteId: restauranteIdExistente,
      productos: [
       
        {
          productoId: mongoose.Types.ObjectId(), 
          cantidad: 2,
        },
        
      ],
      total: 50.0, 
      estado: 'En proceso', 
    };

    const response = await request
      .post('/pedidos')
      .send(pedidoData);
    expect(response.body.error).toBe('Error al crear pedido');
}  );

//pedidos/filtrado 

test ('route-pedido-filtrado', async () => {
    const filtro = {
        usuarioId: mongoose.Types.ObjectId(), 
        restauranteId: mongoose.Types.ObjectId(), 
        enviadoPor: 'admin', 
        fechaInicio: '2023-01-01T00:00:00.000Z', 
        fechaFin: '2023-12-31T23:59:59.999Z', 
      };
  
      const response = await request
        .get('/pedidos/filtrados')
        .query(filtro);
  
    
      expect(response.status).toBe(200);

}  );

test ('route-pedido-filtrado-error', async () => {
    const filtro = {
        usuarioId: mongoose.Types.ObjectId(), 
        restauranteId: mongoose.Types.ObjectId(), 
        enviadoPor: 'admin', 
        fechaInicio: '2023-01-01T00:00:00.000Z', 
        fechaFin: '2023-12-31T23:59:59.999Z', 
      };
  
      const response = await request
        .get('/pedidos/filtrados')
        .query(filtro);
  
    
      expect(response.status).toBe(500);

}  );

//pedidos/enviados-sin-aceptar

test ('route-pedido-enviados-sin-aceptar', async () => {
    const response = await request (app).get('/pedidos/enviados-sin-aceptar');
    expect(response.status).toBe(200);
});

test ('route-pedido-enviados-sin-aceptar-body', async () => {
    const response = await request (app).get('/pedidos/enviados-sin-aceptar');
    expect(response.body.length).toBe(1);
});

test ('route-pedido-enviados-sin-aceptar-error', async () => {
    const response = await request (app).get('/pedidos/enviados-sin-aceptar');
    expect(response.status).toBe(500);
});

//pedidos/:id

test ('route-pedido-id', async () => {
    const response = await request (app).get('/pedidos/1');
    expect(response.status).toBe(200);
});

test ('route-pedido-id-error', async () => {
    const response = await request (app).get('/pedidos/2');
    expect(response.status).toBe(404);
});

test ('route-pedido-id-error-body', async () => {
    const response = await request (app).get('/pedidos/2');
    expect(response.body.error).toBe('Pedido no encontrado');
});

//pedidos/:id put 

test ('route-pedido-id-put', async () => {
    const pedido = await Pedido.findOne({ productos: { $size: 1 } , total: 50.0, estado: 'En proceso' });
    const datosActualizados = {
      estado: 'Enviado',
    };
    const response = await request
      .put(`/pedidos/${pedido._id}`)
      .send(datosActualizados);
    expect(response.status).toBe(200);
});

test ('route-pedido-id-put-body', async () => {
    const pedido = await Pedido.findOne({ productos: { $size: 1 } , total: 50.0, estado: 'En proceso' });
    const datosActualizados = {
      estado: 'Enviado',
    };
    const response = await request
      .put(`/pedidos/${pedido._id}`)
      .send(datosActualizados);
      expect(response.body.message).toBe('Pedido modificado exitosamente');
});

test ('route-pedido-id-put-error', async () => {
    const pedido = await Pedido.findOne({ productos: { $size: 1 } , total: 50.0, estado: 'Enviado' });
    const datosActualizados = {
        estado: 'Enviado',
      };
    const response = await request
      .put(`/pedidos/${pedido._id}`)
      .send(datosActualizados);
    expect(response.status).toBe(403);
});

test ('route-pedido-id-put-error2', async () => {
    const pedido = await Pedido.findOne({ productos: { $size: 1 } , total: 50.0, estado: 'En proceso' });
    const datosActualizados = {
        estado: 'Enviado',
      };
    const response = await request
      .put(`/pedidos/${pedidoId}`)
      .send(datosActualizados);
    expect(response.status).toBe(404);
});

///pedidos/inhabilitar/:id

test  ('route-pedido-id-inhabilitar', async () => {
    const pedidoId = await Pedido.findOne({ habilitado: true }).select('_id');

    const response = await request
      .put(`/pedidos/inhabilitar/${pedidoId}`)
      .set('Authorization', `Bearer ${generateToken(usuarioAdmin.userId)}`);  
    expect(response.status).toBe(200);
} );

test  ('route-pedido-id-inhabilitar-error', async () => {
    const pedidoId = await Pedido.findOne({ habilitado: true }).select('_id');

    const response = await request
      .put(`/pedidos/inhabilitar/${pedidoId}`)
      .set('Authorization', `Bearer ${generateToken(usuarioAdmin.userId)}`);  
    expect(response.status).toBe(404);
} );










