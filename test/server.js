const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

// Firebase and Twilio dependencies
const admin = require('firebase-admin');
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Models
const UserModel = require('./models/userModel');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Successfully Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Phone OTP Authentication API');
});

// Routes
const routes = require('./routes/route');
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});