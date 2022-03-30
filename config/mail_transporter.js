import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SERVICE_MAIL, // generated ethereal user
    pass: process.env.SERVICE_MAIL_PWD, // generated ethereal password
  },
});

export default transporter;