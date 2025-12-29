const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1. Create Transporter (Using Gmail Service)
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // 👈 Automatically sets host to smtp.gmail.com & port to 587
      auth: {
        // 👇 These must match the names in your .env file
        user: process.env.EMAIL_USERNAME, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    // 2. Define Email Options
    const mailOptions = {
      from: '"SRT Support" <noreply@srtshipping.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html: options.html, // (Optional: Enable if you want to send HTML emails)
    };

    // 3. Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    // Throw error so the controller knows to send a 500 response
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;