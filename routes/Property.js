const express = require('express');
const cors = require(`cors`);
const uniqid = require(`uniqid`);

const property = express.Router();
const PropertyModel = require('./../models/Property');
const TaxModel = require('./../models/Tax');
const UserModel = require('./../models/User');

property.use(cors());

property.get('/:landlordId/all', (req, res) => {
  PropertyModel
    .find({ landlordId: req.params.landlordId })
    .then(properties => res.send(properties))
    .catch(err => res.send(`Error: ${err}`));
});

property.post('/property/add', (req, res) => {

  const propertyData = {
    propertyId: uniqid(),
    created: new Date(),
    modified: new Date(),
    landlordId: req.body.landlordId,
    title: req.body.title,
    address1: req.body.address1,
    address2: req.body.address2,
    description: req.body.description,
    paid: req.body.paid,
    propertyType: req.body.propertyType,
    tenantId: req.body.tenantId
  }

  const taxData = {
    electricity: req.body.taxes.electricity,
    gas: req.body.taxes.gas,
    municipal: req.body.taxes.municipal,
    hotWater: req.body.taxes.hotWater,
    coldWater: req.body.taxes.coldWater,
    heating: req.body.taxes.heating,
    rent: req.body.taxes.rent
  }

  PropertyModel
    .findOne({
      address1: req.body.address1,
      address2: req.body.address2,
      landlordId: req.body.landlordId
    })
    .then(property => {
      if (!property) {
        PropertyModel
          .create(propertyData)
          .then(property => {
            res.json({ success: `Nauja patalpa '${property.title}' įkelta!`,
                       propertyId: propertyData.propertyId });

            TaxModel
              .findOne({ propertyId: property.propertyId })
              .then(taxes => {
                if (!taxes) {
                  TaxModel
                    .create({ ...taxData, propertyId: property.propertyId })
                    .catch(err => res.send(`Error: ${err}`));
                }
              })
              .catch(err => res.send(`Error: ${err}`));
          })
          .catch(err => res.send(`Error: ${err}`));
      }
    })
    .catch(err => res.send(`Error: ${err}`));
});

property.get('/property/:id', (req, res) => {
  PropertyModel
    .findOne({ propertyId: req.params.id })
    .then(property => res.send({ property }))
    .catch(err => res.send(`Error: ${err}`));
});

property.put('/property/:id/update', (req, res) => {
  const propertyData = {
    modified: new Date(),
    title: req.body.title,
    address1: req.body.address1,
    address2: req.body.address2,
    description: req.body.description
  }

  PropertyModel
    .findOneAndUpdate({ propertyId: req.params.id }, propertyData, (err, item) => {
      if (err) res.send(err);
      res.send(item);
    });
});

property.delete('/property/:id/delete', (req, res) => {
  PropertyModel
    .findOneAndDelete({ propertyId: req.params.id }, (err, item) => {
      if (err) res.send(err);
      TaxModel
        .findOneAndDelete({ propertyId: req.params.id }, (err, item) => {
          if (err) res.send(err);
        })
        .catch(err => res.send(`Error: ${err}`));
      if (item && item.tenantId) {
        UserModel
          .findOneAndDelete({ userId: item.tenantId }, (err, item) => {
            if (err) res.send(err);
          })
          .catch(err => res.send(`Error: ${err}`));
      }
      res.send(item);
    })
    .catch(err => res.send(`Error: ${err}`));
});

module.exports = property;