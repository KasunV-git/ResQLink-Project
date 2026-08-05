const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'vinod.kasun23@gmail.com';
const SENDER_NAME = process.env.SENDER_NAME || 'ResQLink';

/**
 * Send a simple transactional email using Brevo
 * @param {string} toEmail 
 * @param {string} toName 
 * @param {string} subject 
 * @param {string} htmlContent 
 */
async function sendEmail(toEmail, toName, subject, htmlContent) {
  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured in environment variables.');
    return false;
  }

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    console.log('Email sent successfully:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending email via Brevo:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Send Password Reset OTP
 */
async function sendPasswordResetEmail(toEmail, toName, code) {
  const subject = 'Your ResQLink Password Reset Code';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #1e3a8a; text-align: center;">ResQLink Password Reset</h2>
      <p style="color: #475569; font-size: 16px;">Hello ${toName || 'User'},</p>
      <p style="color: #475569; font-size: 16px;">We received a request to reset your password. Here is your secure 6-digit reset code:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 15px 30px; background-color: #f1f5f9; color: #0f172a; font-size: 28px; font-weight: bold; letter-spacing: 5px; border-radius: 8px;">
          ${code}
        </span>
      </div>
      <p style="color: #475569; font-size: 14px;">This code will expire in 15 minutes.</p>
      <p style="color: #475569; font-size: 14px;">If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} ResQLink. All rights reserved.</p>
    </div>
  `;
  return await sendEmail(toEmail, toName, subject, htmlContent);
}

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};
