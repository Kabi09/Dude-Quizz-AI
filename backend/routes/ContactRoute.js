const Contact = require('../models/contact');
const sendEmail = require('../utils/Email'); // <-- 1. Import pannunga

const handleContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    // 1. DB-la save pannu
    const newContact = await Contact.create({
      name,
      email,
      message
    });

    // === 2. GREETING MAIL ANUPPUROM ===
    const subject = "Thanks for contacting Dude Quizz!";
    const html = `
      <h3>Hi ${name},</h3>
      <p>Thanks for reaching out to us!</p>
      <p>We received your message and will get back to you soon.</p>
      <br/>
      <p>Best Regards,</p>
      <p>Dude AI Team</p>
    `;

    // Mail anuppuratha try pannurom
    // Ithu fail aanaalum, user-ku success kaattanum (DB la save aagiruchu)
    try {
      await sendEmail(email, subject, html);
    } catch (emailError) {
      console.error('Email sending failed, but DB save was successful:', emailError);
    }
    // ===================================

    // 3. User-ku success message anuppurom
    res.status(201).json({ message: 'Message received successfully!', data: newContact });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
};

module.exports = { handleContactForm };