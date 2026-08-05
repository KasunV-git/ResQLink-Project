require('dotenv').config();
const { sendEmail } = require('./src/services/emailService');

async function test() {
  console.log('Testing Brevo API...');
  await sendEmail('vinod.kasun23@gmail.com', 'Kasun', 'Test Email', '<p>Test</p>');
}
test();
