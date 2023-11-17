const UserModel = require('../models/userModel');
const { createJwtToken } = require('../util/tokenUtil');
const requestIp = require('request-ip');
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  const clientIp = requestIp.getClientIp(req);

  // Send OTP via SMS (use your SMS service integration here)
  client.messages.create({
    body: `Your GameX OTP is ${otp}. Please do not share it with anyone. It is valid for 5 minutes.`,
    from: process.env.PHONE_NUMBER,
    to: phoneNumber,
  })
    .then(message => console.log(message.sid));

  const user = await UserModel.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    const newUser = new UserModel({
      otp: otp,
      phoneNumber: phoneNumber,
      point: '10',
      ip: clientIp,
    });

    newUser.save()
      .then(savedOTP => {
        console.log('OTP saved:', savedOTP);
      })
      .catch(error => {
        console.error('Error saving OTP:', error);
      });
  } else {
    user.otp = otp;
    user.ip = clientIp;
    user.save()
      .then(savedOTP => {
        console.log('OTP saved:', savedOTP);
      })
      .catch(error => {
        console.error('Error saving OTP:', error);
      });
  }

  res.json({ message: 'OTP sent successfully' });
};

exports.verifyOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const userEnteredOTP = req.body.otp;

  const otpDocument = await UserModel.findOne({ phoneNumber: phoneNumber });
  if (otpDocument) {
    const storedOTP = otpDocument.otp;

    if (userEnteredOTP === storedOTP) {
      const token = createJwtToken({ phoneNumber: otpDocument.phoneNumber });
      console.log(token);
      res.json({ message: 'Logged in successfully' });
      otpDocument.otp = '';
      otpDocument.save();
    } else {
      res.json({ message: 'Invalid OTP' });
    }
  } else {
    res.json({ message: 'No OTP found' });
  }
};
