const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1. Create Transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Explicitly set host
      port: 465,              // 👇 USE PORT 465 (SSL) - Much more reliable on Cloud
      secure: true,           // Must be true for port 465
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // 👇 KEY FIX 1: Force IPv4 (Prevents hanging on Render/Docker)
      family: 4, 
      // 👇 KEY FIX 2: Prevent certificate errors
      tls: {
        rejectUnauthorized: false, 
      },
    });

    // 2. Define Email Options
    const mailOptions = {
      // Best Practice: The 'From' address should match your authenticated email
      from: `"SRT Support" <${process.env.EMAIL_USERNAME}>`, 
      to: options.email,
      subject: options.subject,
      text: options.message, // Plain text body
      // html: options.message.replace(/\n/g, '<br>'), // Simple fallback if you want HTML
    };

    // 3. Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
