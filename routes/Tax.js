const express = require('express');
const cors = require(`cors`);

const tax = express.Router();
const TaxModel = require('./../models/Tax');

tax.use(cors());

tax.get('/tax/property/:id', (req, res) => {
  TaxModel
    .findOne({ propertyId: req.params.id })
    .then(property => res.send({ property }))
    .catch(err => res.send(`Error: ${err}`));
});

tax.put('/tax/property/:id/update', (req, res) => {
  const taxData = {
    electricity: req.body.electricity,
    gas: req.body.gas,
    municipal: req.body.municipal,
    hotWater: req.body.hotWater,
    coldWater: req.body.coldWater,
    heating: req.body.heating,
    rent: req.body.rent
  }

  TaxModel
    .findOneAndUpdate({propertyId: req.params.id}, taxData, (err, item) => {
      if (err) res.send(err);
      res.send(item);
    });
});

module.exports = tax;