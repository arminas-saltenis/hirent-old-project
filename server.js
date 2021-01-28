const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const db = require('./config/keys').mongoURI;
const User = require('./routes/User');
const Property = require('./routes/Property');
const Tax = require('./routes/Tax');
const Payment = require('./routes/Payment');
const Notifications = require('./routes/Notifications');


const app = express();
const PORT = process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'development';

const forceSSL = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
  }
  return next();
}

if (env === 'production') {
  app.use(forceSSL);
}

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(error));

app.use('/api/users', User);
app.use('/api/properties', Property);
app.use('/api/taxes', Tax);
app.use('/api/payments', Payment);
app.use('/api/notifications', Notifications);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
