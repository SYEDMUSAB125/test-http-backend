const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/sns', (req, res) => {
  const messageType = req.header('x-amz-sns-message-type');
  const message = req.body;

  console.log('Received SNS message type:', messageType);
  console.log('Full message:', message);

  if (messageType === 'SubscriptionConfirmation') {
    // Confirm the subscription
    const https = require('https');
    https.get(message.SubscribeURL, (resp) => {
      console.log('Subscription confirmed!');
    });
  } else if (messageType === 'Notification') {
    console.log('Notification received:', message.Message);
  }

  res.status(200).end();
});


app.get("/status",(req,res)=>{
  res.send("SNS Endpoint is running perfectly")
})





app.listen(3000, () => {
  console.log('SNS HTTP endpoint running on port 3000');
});
