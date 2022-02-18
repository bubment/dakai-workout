const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express().use(bodyParser.json())

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.post('/webhook', (req, res) => {  
    let body = req.body;
    if (body.object === 'page') {
      body.entry.forEach(function(entry) {
        let webhookEvent = entry.messaging[0];
        let senderPSID = webhookEvent.sender.id;
        sendMessage(senderPSID)
        // console.log(webhook_event);
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);      
      }
    }
});

let sendMessage = (senderPSID) => {
    messengerResponseObject = {
        "text": `This is a test message for you`
    }

    let reqBody = {
        "recipient": {
            "id": senderPSID
        },
        "message": messengerResponseObject
    };

    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": reqBody
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));