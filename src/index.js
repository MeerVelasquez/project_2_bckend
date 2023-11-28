const express = require('express');
const mongoose = require('mongoose');
const { config } = require('dotenv');
const routerPedido = require('./pedidos/pedidos.router');
const routerProducto = require('./productos/productos.router');
const routerUsuario = require('./usuario/usuario.router');
const routerRestaurante = require('./restaurantes/restaurantes.router');

config();

// Configura la conexión a la base de datos
mongoose.connect("mongodb://localhost/db_Proyecto2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const app = express(); // Use express() to create an instance of the app
const port = process.env.PORT || 3000;

app.use(express.json());

db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', async () => {
  console.log('Conexión a la base de datos exitosa.');
});

// Use your routers with appropriate paths
app.use('/pedidos', routerPedido);
app.use('/productos', routerProducto);
app.use('/usuarios', routerUsuario);
app.use('/restaurantes', routerRestaurante);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

