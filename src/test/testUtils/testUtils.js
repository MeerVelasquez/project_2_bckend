const faker = require('faker');
const mongoose = require('mongoose');
const Restaurante = require('../../restaurantes/restaurantes.model');
const createFakeRestauranteInDatabase = async () => {
    const fakeRestauranteData = generateFakeRestaurante();
    const restaurante = new Restaurante(fakeRestauranteData);
  
    try {
      const savedRestaurante = await restaurante.save();
      return savedRestaurante; // Make sure to return the saved document
    } catch (error) {
      console.error('Error saving fake restaurante:', error);
      throw error;
    }
  };

const createFakeRestauranteInDatabase = async () => {
  const fakeRestauranteData = generateFakeRestaurante();
  const restaurante = new Restaurante(fakeRestauranteData);
  await restaurante.save();
  return restaurante;
};

module.exports = {
  generateFakeRestaurante,
  createFakeRestauranteInDatabase,
};
