const express = require('express');
const webpush = require('web-push');
const NotificationModel = require('./../models/Notification');
const PropertyModel = require(`../models/Property`);
const PaymentModel = require('./../models/Payment');

const notifications = express.Router();

const publicVapidKey = '***'; // This was deleted for privacy purposes
const privateVapidKey = '****'; // This was deleted for privacy purposes
webpush.setVapidDetails('mailto:arminas.saltenis@gmail.com', publicVapidKey, privateVapidKey);

notifications.post('/subscribe', (req, res) => {
  const subscription = req.body.subscription;
  const userId = req.body.userId;

  const notificationData = {
    userId: userId,
    subscription: subscription
  }

  NotificationModel
    .findOne({ userId: userId })
    .then(subscription => {
      if (!subscription) {
        addSubscription();
      } else {
        NotificationModel
          .findOneAndDelete(
            { userId: userId },
            (err, item) => {
              if (err) res.send(err);
            }
          ).then(() => {
            addSubscription();
          }).catch(err => res.send(`Error: ${err}`));
      }
    })
    .catch(err => res.send(`Error: ${err}`));

  function addSubscription() {
    NotificationModel
      .create(notificationData)
      .then(() => res.json({ success: `Pranešimų informaciją išsaugota!` }))
      .catch(err => res.send(`Error: ${err}`));
  }
});

notifications.post('/send-notification', (req, res) => {
  const propertyId = req.body.propertyId;
  console.log('PropertyId to send notification: ', propertyId);

  PropertyModel
    .findOne({ propertyId: propertyId })
    .then(property => {
      if (property) {
        console.log('Property data: ', property);
        PaymentModel
          .findOne({ propertyId: propertyId })
          .then(payment => {
            console.log('Payment data: ', payment);
            sendNotification(property.tenantId, payment.total);
          }).catch(err => res.send(`Error: ${err}`));
      }
    })
    .catch(err => res.send(`Error: ${err}`));

  function sendNotification(userId, sumToPay) {
    console.log(userId, sumToPay);
    NotificationModel
      .findOne({ userId: userId })
      .then(notificationData => {
        if (notificationData && notificationData.subscription) {
          console.log(userId)
          res.status(201).json({ subscription: notificationData.subscription });
          const payload = JSON.stringify({
            title: 'Sąskaita - HiRent',
            content: `Jums atsiųsta ${Math.round(sumToPay * 100) / 100}€ sąskaita.`
          });
          webpush
            .sendNotification(notificationData.subscription, payload)
            .catch(error => console.log(error));
          console.log('Notification sent');
        }
      })
      .catch(err => res.send(`Error: ${err}`));
  }
});



module.exports = notifications;