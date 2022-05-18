const nodeMailer = require('nodemailer');

exports.sendEmail = async (options) => {
console.log('options',options)
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,// incase gmail not work
    port: 587,
    // service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD
    }
  })
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  await transporter.sendMail(mailOptions)
}