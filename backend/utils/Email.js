const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    // 1. Create a "Transporter" (unga mailman)
    // Namma Gmail use pannurom (test panna easy-ah irukkum)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // .env la irunthu varum
        pass: process.env.EMAIL_PASS  // .env la irunthu varum
      }
    });

    // 2. Mail options-a set pannurom
    const mailOptions = {
      from: `"Dude Quizz" <${process.env.EMAIL_USER}>`, // Unga "from" name
      to: to,         // User-oda email
      subject: subject, // Subject line
      html: html      // Greeting message
    };

    // 3. Mail-a anuppurom
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return true;

  } catch (error) {
    console.error('Error sending greeting email:', error);
    return false; 
  }
};

module.exports = sendEmail;