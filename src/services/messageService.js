const config = require("../config")
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
const request = require('request')

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

module.exports = {
    sendMessage: sendMessage
};