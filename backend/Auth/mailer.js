const nodemailer = require("nodemailer");
require("dotenv").config();

const user = process.env.GMAIL;
const pass = process.env.GMAIL_PASS;

const transport = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: user,
    pass: pass,
  },
});

const sendConfirmationEmail = (email, confirmationCode) => {
  //console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello</h2>
          <p>Thank you for creating an account. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:5000/api/auth/verify/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => {
      console.log(err);
      return false;
    });

  return true;
};

module.exports = { sendConfirmationEmail }
