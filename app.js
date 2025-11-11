const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

// Force JSON parsing even if content-type isn't application/json
app.use(bodyParser.text({ type: '*/*' }));

app.post('/sns', (req, res) => {
  const messageType = req.header('x-amz-sns-message-type');
  let message;

  try {
    message = JSON.parse(req.body);
  } catch (err) {
    console.error('Error parsing SNS message body:', err);
    console.log('Raw body:', req.body);
    return res.status(400).send('Invalid SNS message');
  }

  console.log('Received SNS message type:', messageType);
  console.log('Full message:', message);

  if (messageType === 'SubscriptionConfirmation') {
    const subscribeURL = message.SubscribeURL;
    console.log('SubscribeURL:', subscribeURL);

    if (subscribeURL) {
      https.get(subscribeURL, (resp) => {
        console.log('✅ Subscription confirmed!');
      }).on('error', (err) => {
        console.error('❌ Error confirming subscription:', err.message);
      });
    } else {
      console.error('❌ SubscribeURL is missing!');
    }
  } else if (messageType === 'Notification') {
    console.log('Notification received:', message.Message);
  }

  res.status(200).end();
});

app.get('/status', (req, res) => {
  res.send('SNS Endpoint is running perfectly');
});

app.listen(3000, () => {
  console.log('SNS HTTP endpoint running on port 3000');
});
