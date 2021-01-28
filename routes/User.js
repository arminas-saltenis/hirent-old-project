const express = require('express');
const cors = require(`cors`);
const uniqid = require(`uniqid`);
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const user = express.Router();
const UserModel = require(`../models/User`);
const PropertyModel = require('../models/Property');

user.use(cors());

user.post('/register', (req, res) => {
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    landlord: true,
    active: true,
    userId: uniqid(),
    created: new Date()
  }

  UserModel
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        bcrypt
          .hash(req.body.password, 10, (err, hash) => {
            if (err) return res.send(`Error: ${err}`);
            userData.password = hash;
            UserModel
              .create(userData)
              .then(user => {
                return res.json({ success: `Vartotojas ${user.email} sėkmingai užregistruotas` })
              })
              .catch(err => res.send(`Error ${err}`));
          })
          .catch(err => res.send(`Error ${err}`));
      } else {
        return res
          .status(404)
          .send({ error: `Vartotojas su tokiu elektroniniu paštu jau egzistuoja` });
      }
    })
    .catch(err => res.send(`Error: ${err}`));
});

user.post('/login', (req, res) => {
  UserModel
    .findOne({ email: req.body.email })
    .then(user => {
      if (user && !user.active) {
        res.status(404).send({ error: `Vartotojas nepatvirtinas` })
      }
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          return res.json({ userData: user });
        } else {
          res.status(404).send({ error: `Blogai įvesti vartotojo duomenys` });
        }
      } else {
        res.status(404).send({ error: `Toks vartotojas neegzistuoja` });
      }
    })
    .catch(err => res.send(`Error: ${err}`));
});

user.get('/profile/:id', (req, res) => {
  UserModel
    .findOne({ userId: req.params.id })
    .then(user => res.send({ user }))
    .catch(err => res.send(`Error: ${err}`));
});

user.put('/profile/:id/edit', (req, res) => {
  let userData = {};

  UserModel
    .findOne({ userId: req.params.id })
    .then(user => {
      userData = {
        firstname: req.body.firstname || user.firstname,
        lastname: req.body.lastname || user.lastname,
        email: req.body.email || user.email,
        phone: req.body.phone || user.phone,
        modified: new Date()
      }

      if (req.body.active) {
        userData = {
          ...userData,
          active: req.body.active
        }
      }
    })
    .then(() => {
      bcrypt
        .hash(req.body.password, 10, (err, hash) => {
          if (err) return res.send(`Error: ${err}`);
          userData.password = hash;
          UserModel
            .findOneAndUpdate({ userId: req.params.id }, userData, (err, item) => {
              if (err) res.send(err);
              res.send(item);
            });
        });
    })
    .catch(err => res.send(`Error: ${err}`));;
});

user.delete('/delete/:propertyId/:tenantId', (req, res) => {
  UserModel
    .findOneAndDelete({userId: req.params.tenantId}, (err, item) =>{
      if (err) res.send(err);

      PropertyModel
        .findOneAndUpdate(
          {propertyId: req.params.propertyId},
          {tenantId: ''},
          (err, item) => {
            if (err) res.send(err);
        })
        .catch(err => res.send(`Error: ${err}`));

      res.json(`Gyventojas sėkmingai ištrintas`);
    })
    .catch(err => res.send(`Error: ${err}`));
});

user.post('/send-invite/:landlordId/:propertyId', (req, res) => {
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: '',
    password: '',
    landlord: false,
    userId: uniqid(),
    active: false,
    tenantInfo: {
      assignedProperty: req.params.propertyId,
      assignedLandlord: req.params.landlordId
    }
  }

  UserModel
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        UserModel
          .create(userData)
          .then(user => {
            sendMail();

            PropertyModel
              .findOneAndUpdate(
                {propertyId: req.params.propertyId}, 
                {tenantId: userData.userId}, 
                (err, item) => {
                  if (err) res.send(err);
                }
              );

            return res.json({ success: `Kvietimas vartotojui ${user.email} išsiųstas!` })
          })
          .catch(err => res.send(`Error ${err}`));
      } else {
        return res
          .status(404)
          .send({ error: `Vartotojas su tokiu elektroniniu paštu jau egzistuoja` })
      }
    })
    .catch(err => res.send(`Error ${err}`));

  function sendMail() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hirent.bakalauras@gmail.com',
        pass: 't2qH4FFSqdXRAkC'
      }
    });


    const mailOptions = {
      from: 'HiRent',
      to: req.body.email,
      subject: `Invitation to sign up to HiRent`,
      html: `
        <div style="text-align: justify; width: 75%; border: 1px solid #eee;
        border-radius: 3px; padding: 1rem; font-size: 18px;">
          <p style="text-align: center; font-weight: 500">
          Sveikas, ${userData.firstname} ${userData.lastname}!
          </p>
          <p>
          Tu buvai pakviestas prisijungti prie HiRent, kur galėsi matyti savo naujo 
          nuomojamo buto informaciją, mokesčius bei galėsi vienu paspaudimu sumokėti
          už nuoma!
          Paspaudęs žemiau esantį mygtuką, galėsi užsiregistruoti ir iškarto matysi
          informaciją apie nuomojamą butą!
          </p>
          <div>
            <div style="width: 25%; background: #ffca28; padding: 2rem; 
                      text-align: center; margin: auto;">
              <a style="font-size: 24px; font-weight: 500; color: #505050; text-decoration: none"
                href="https://hirent.herokuapp.com/invitation/${userData.userId}">
                Užsiregistruoti
              </a>
            </div>
          </div>
        </div>
      `
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log('Mail error: ', err);
        res.status(404).send(`Error`);
      } else {
        console.log('mail sent');
        res.send(`Pakvietimas išsiųstas: ${info}`);
      }
    });
  }
});


module.exports = user;