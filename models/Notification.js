const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  userId: {
    type: String
  },
  subscription: {
    type: Object
  }
});

module.exports = Notification = mongoose.model('notification', NotificationSchema);