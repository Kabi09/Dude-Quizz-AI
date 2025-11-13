const Subscriber = require('../models/SubscribeEmails');
const sendEmail = require('../utils/Email');

const handleSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // 1. Email already irukka-nu check pannurom
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'You are already subscribed!' });
    }

    // 2. DB-la save pannurom
    await Subscriber.create({ email: email.toLowerCase() });

    // 3. Greeting mail anuppurom
    const subject = "Welcome to Dude Quizz!";
    const DUDEQUIZZ_URL = process.env.PORT || "https://dude-quiz.vercel.app/";

const html = `
  <h3>Hi there,</h3>
  <p>Thanks for subscribing to <strong>Dude Quizz</strong>!</p>
  <p>You'll now receive all the latest updates and new quizzes directly to your inbox.</p>

  <p>
    You can visit here:
    <br/>
    <a 
      href="${DUDEQUIZZ_URL}" 
      target="_blank" 
      style="color: #4f46e5; text-decoration: underline;"
    >
      ${DUDEQUIZZ_URL}
    </a>
  </p>

  <br/>

  <a 
    href="${DUDEQUIZZ_URL}" 
    target="_blank"
    style="
      background: #4f46e5;
      padding: 10px 18px;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
    "
  >
    Visit Dude Quizz
  </a>

  <br/><br/>

  <p>Best Regards,</p>
  <p>Dude AI Team</p>
`;


    // Try to send email (fail aanaalum, problem illa, DB la save aagiruchu)
    try {
      await sendEmail(email, subject, html);
    } catch (emailError) {
      console.error('Email sending failed (but DB save was ok):', emailError);
    }

    // 4. Success response anuppurom
    res.status(201).json({ message: 'Subscribed successfully! Check your email.' });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
};

module.exports = { handleSubscription };