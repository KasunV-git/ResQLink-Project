const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: 'vinod.kasun23@gmail.com'
    });
    console.log('Response:', res.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}
test();
