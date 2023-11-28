const supertest = require('supertest');
const app = require('../../index'); 

describe('Pruebas de Integración para Productos', () => {

    test('Crea un pedido exitosamente', async () => {
        const nuevoPedido = {
          usuarioId: '655f9afc958d8ea1da2cab0f',
          restauranteId: 'ID_DEL_RESTAURANTE',
          productos: [ 'ID_DEL_PRODUCTO_1', 'ID_DEL_PRODUCTO_2' ],
          total: 50.0,
          estado: 'pendiente',
        };
      
        const response = await supertest(app)
          .post('/pedidos')
          .send(nuevoPedido);
      
        expect(response.status).toBe(201);
      });

      test('Crea un pedido exitosamente -body', async () => {
        const nuevoPedido = {
          usuarioId: '655f9afc958d8ea1da2cab0f',
          restauranteId: 'ID_DEL_RESTAURANTE',
          productos: [ 'ID_DEL_PRODUCTO_1', 'ID_DEL_PRODUCTO_2' ],
          total: 50.0,
          estado: 'pendiente',
        };
      
        const response = await supertest(app)
          .post('/pedidos')
          .send(nuevoPedido);
    
        expect(response.body).toHaveProperty('mensaje', 'Pedido creado exitosamente');
      });

      test('Obtiene pedidos filtrados exitosamente', async () => {
        const response = await supertest(app)
          .get('/pedidos/filtrados')
          .query({ usuarioId: '655f9afc958d8ea1da2cab0f' }); 
      
        expect(response.status).toBe(200);
      });
      
      test('Actualiza un pedido exitosamente', async () => {
        const nuevosDatos = {
          productos: [ 'ID_DEL_PRODUCTO_1', 'ID_DEL_PRODUCTO_2', 'ID_DEL_PRODUCTO_3' ], 
          total: 75.0,
          estado: 'realizado',
        };
      
        const response = await supertest(app)
          .put(`/pedidos/${pedidoId}`)
          .send(nuevosDatos);
      
        expect(response.status).toBe(200);
      });

      test('Actualiza un pedido exitosamente --body', async () => {
        const nuevosDatos = {
          productos: [ 'ID_DEL_PRODUCTO_1', 'ID_DEL_PRODUCTO_2', 'ID_DEL_PRODUCTO_3' ], 
          total: 75.0,
          estado: 'realizado',
        };
      
        const response = await supertest(app)
          .put(`/pedidos/${pedidoId}`)
          .send(nuevosDatos);

        expect(response.body).toHaveProperty('mensaje', 'Pedido modificado exitosamente');
      });

      test('Inhabilita un pedido exitosamente --status', async () => {
        const response = await supertest(app)
          .put(`/pedidos/inhabilitar/${pedidoId}`);
      
        expect(response.status).toBe(200);
   
      });

      test('Inhabilita un pedido exitosamente --body', async () => {
        const response = await supertest(app)
          .put(`/pedidos/inhabilitar/${pedidoId}`);

        expect(response.body).toHaveProperty('mensaje', 'Pedido inhabilitado exitosamente');
      });
      
      
      
      

});