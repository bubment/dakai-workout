const messageService = require("../services/messageService")
const config = require("../config")
const VERIFY_TOKEN = config.VERIFY_TOKEN;

const getWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
      
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);      
      }
    }
};

const postWebhook = async (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
      body.entry.forEach(function(entry) {
        let webhookEvent = entry.messaging[0];
        let userData = body.user
        if (webhookEvent.message) {
          messageService.handleMessage(userData);
      } else if (webhookEvent.postback) {
          messageService.handlePostback(userData, webhookEvent.postback);
      }
        // messageService.sendMessage(senderPSID)
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
};


module.exports = {
    getWebhook: getWebhook,
    postWebhook: postWebhook,
};