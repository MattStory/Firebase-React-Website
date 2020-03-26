const functions = require('firebase-functions');
const nodemailer = require("nodemailer");
const cors = require("cors")({
    origin: true
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'collegecapteam@gmail.com',
        pass: 'adminadmin123'
    }
});

exports.submit = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      if (req.method !== 'POST') {
        return;
      }
  
      const mailOptions = {
        from: req.body.email,
        to: 'collegecapteam@gmail.com',
        subject: `${req.body.email} New Support Ticket`,
        text: req.body.content,
      };
  
      transporter.sendMail(mailOptions);
  
      res.status(200).send({ isEmailSend: true });
    });
  });

