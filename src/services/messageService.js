const config = require("../config")
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
const workoutService = require("./workoutService")
const request = require('request')

const sendMessage = (senderPSID,response) => {
    // messengerResponseObject = {
    //     "text": `This is a test message for you`
    // }

    let reqBody = {
        "recipient": {
            "id": senderPSID
        },
        "message": response
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

const handleMessage = async (userData) => {
    let { isWorkoutInProgress, hasUnfinishedWorkout} = userData
    if (!isWorkoutInProgress && !hasUnfinishedWorkout) {
        //Wanna start a new workout?
        let postbackResult = await workoutService.beginWorkoutQuestion()
        sendMessage(userData.psid,postbackResult)

        return;
    }
    if (isWorkoutInProgress) {
        //Wanna pause?
    }
    if(hasUnfinishedWorkout){
        //Wanna continue or start a new?
        return
    }
}

const handlePostback = (userData,receivedPostback) => {
    
}


module.exports = {
    sendMessage: sendMessage,
    handleMessage: handleMessage,
    handlePostback: handlePostback
};