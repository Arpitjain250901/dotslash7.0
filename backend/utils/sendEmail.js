const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
     host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    auth: {
      user: 'arpitdeveloper2511@gmail.com',
      pass: 'arpit@123developer',
    },
  });

  const mailOptions = {
    from:'arpitdeveloper2511@gmail.com' ,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
