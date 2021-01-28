const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  propertyId: {
    type: String
  },
  created: {
    type: Date
  },
  propertyType: {
    type: String
  },
  modified: {
    type: Date,
    default: Date.now()
  },
  landlordId: {
    type: String
  },
  tenantId: {
    type: String
  },
  title: {
    type: String
  },
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  description: {
    type: String
  },
  paid: {
    type: Boolean
  },
  tenantId: {
    type: String
  }
});

module.exports = Property = mongoose.model('property', PropertySchema);