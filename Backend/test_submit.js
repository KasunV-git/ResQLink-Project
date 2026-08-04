const fs = require('fs');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    fs.writeFileSync('dummy.jpg', 'fake image content');

    const token = jwt.sign({ id: 180015, role: 'Citizen' }, 'resqlink_secret_key_2026');

    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let body = '';
    
    const appendField = (name, value) => {
      body += '--' + boundary + '\r\n';
      body += 'Content-Disposition: form-data; name="' + name + '"\r\n\r\n';
      body += value + '\r\n';
    };

    appendField('type', 'Landslide');
    appendField('severity', 'CRITICAL');
    appendField('location', '8.7081, 80.7881');
    appendField('lat', '6.708071');
    appendField('lng', '80.788086');
    appendField('peopleAffected', '150+');
    appendField('description', 'fwiff wflwf cocnc wn[flc wwlwfbc] wolwnw wfolwl');

    body += '--' + boundary + '\r\n';
    body += 'Content-Disposition: form-data; name="media"; filename="dummy.jpg"\r\n';
    body += 'Content-Type: image/jpeg\r\n\r\n';
    body += fs.readFileSync('dummy.jpg') + '\r\n';
    body += '--' + boundary + '--\r\n';

    const res = await fetch('http://localhost:5000/api/disasters/report', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: body
    });

    const data = await res.json();
    console.log('STATUS:', res.status, res.statusText);
    console.log('DATA:', data);
  } catch (err) {
    console.log('REQ ERROR:', err.message);
  } finally {
    if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
  }
})();
