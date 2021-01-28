const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaxSchema = new Schema({
  propertyId: {
    type: String
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
  }
});

module.exports = Tax = mongoose.model('tax', TaxSchema);