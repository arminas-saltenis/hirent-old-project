const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: `Vardas yra privalomas`
  },
  lastname: {
    type: String,
    required: `Pavardė yra privaloma`
  },
  email: {
    type: String,
    required: `Elektroninis paštas yra privalomas`,
    unique: true
  },
  phone: {
    type: String
  },
  password: {
    type: String
  },
  landlord: {
    type: Boolean
  },
  userId: {
    type: String
  },
  created: {
    type: Date
  },
  modified: {
    type: Date,
    default: Date.now()
  },
  active: {
    type: Boolean
  },
  tenantInfo: {
    assignedProperty: {
      type: String
    },
    assignedLandlord: {
      type: String
    }
  }
});

module.exports = User = mongoose.model('user', UserSchema);