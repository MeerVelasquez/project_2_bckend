const request = require('supertest');
const app = require('../../index');
const mongoose = require('mongoose');


describe('Pruebas de ruta pedidos', () => {
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











});






