const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  propertyId: {
    type: String
  },
  paid: {
    type: Boolean
  },
  rent: {
    type: Number
  },
  electricity: {
    type: Number
  },
  gas: {
    type: Number
  },
  municipal: {
    type: Number
  },
  hotWater: {
    type: Number
  },
  coldWater: {
    type: Number
  },
  heating: {
    type: Number
  },
  total: {
    type: Number
  }
});

module.exports = Payment = mongoose.model('payment', PaymentSchema);