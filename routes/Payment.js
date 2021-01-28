const express = require('express');
const cors = require(`cors`);

const PaymentModel = require('./../models/Payment');
const PropertyModel = require('./../models/Property');
const payment = express.Router();

payment.use(cors());

payment.get('/payment/:propertyId', (req, res) => {
  PaymentModel
    .findOne({ propertyId: req.params.propertyId })
    .then(payment => res.send({ payment }))
    .catch(err => res.send(`Error: ${err}`));
});

payment.post('/payment/:propertyId/send', (req, res) => {
  paymentData = {
    propertyId: req.params.propertyId,
    paid: false,
    electricity: req.body.electricity,
    gas: req.body.gas,
    municipal: req.body.municipal,
    hotWater: req.body.hotWater,
    coldWater: req.body.coldWater,
    heating: req.body.heating,
    rent: req.body.rent,
    total: req.body.electricity + req.body.gas + req.body.municipal +
      req.body.hotWater + req.body.coldWater + req.body.heating +
      req.body.rent
  }

  PaymentModel
    .findOne({ propertyId: req.params.propertyId })
    .then(payment => {
      if (!payment) {
        addPayment();
      } else {
        PaymentModel
          .findOneAndDelete(
            { propertyId: req.params.propertyId },
            (err, item) => {
              if (err) res.send(err);
            }).then(() => {
              addPayment();
            }).catch(err => res.send(`Error: ${err}`));

      }
    }).catch(err => res.send(`Error: ${err}`));

  function addPayment() {
    PaymentModel
      .create(paymentData)
      .then(() => {
        updateProperty(false, req.params.propertyId);
        res.json({ success: `Mokėjimo pranešimas išsiųstas. Bendra suma: ${paymentData.total}` })
      }).catch(err => res.send(`Error: ${err}`));
  }

});

payment.put('/payment/:propertyId/pay', (req, res) => {
  PaymentModel
    .findOneAndUpdate(
      { propertyId: req.params.propertyId },
      { paid: true },
      (err, item) => {
        if (err) res.send(err);
        updateProperty(true, req.params.propertyId);
        res.send(item);
      })
});

function updateProperty(isPaid, propertyId) {
  PropertyModel
    .findOneAndUpdate(
      { propertyId: propertyId },
      { paid: isPaid },
      (err, item) => {
        if (err) res.send(err);
      }).catch(err => res.send(`Error: ${err}`));
}

module.exports = payment;