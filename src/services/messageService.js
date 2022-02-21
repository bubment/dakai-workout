const config = require("../config")
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
const workoutService = require("./workoutService")
const request = require('request')

const sendMessage = (senderPSID,response) => {
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
    let postbackResult;
    switch (true) {
        case (!isWorkoutInProgress && !hasUnfinishedWorkout):
            postbackResult = await workoutService.beginWorkoutQuestion()
            break;
        case isWorkoutInProgress:
            postbackResult = await workoutService.pauseQuestion()
            break;
        case hasUnfinishedWorkout:
            postbackResult = await workoutService.continueQuestion(userData)
            break;
    }
    sendMessage(userData.psid,postbackResult)
}

const handlePostback = async (userData,receivedPostback) => {
    let payload = JSON.parse(receivedPostback.payload);
    let { psid } = userData
    let messageObj;
    switch (payload.name) {
        case "welcome-1":
            switch (payload.option) {
                case "Yes":
                    messageObj = await workoutService.startNewWorkout(psid)
                    break;
                case "No":
                    messageObj = workoutService.comeBackLaterDefault()
                    
                    break;
            }
            break;
            case "pause-workout":
                switch (payload.option) {
                    case "Yes":
                        messageObj = await workoutService.pauseWorkout(psid)
                        break;
                    case "No":
                        messageObj = await workoutService.beginExcercise(userData)
                        break;
            }
            break;
            case "welcome-2":
                switch (payload.option) {
                    case "Continue":
                        messageObj = await workoutService.continueWorkout(userData)
                        break;
                    case "Start new":
                        messageObj = await workoutService.startNewWorkout(psid)
                        break;
                    case "Just leave":
                        messageObj = workoutService.comeBackLaterDefault()
                    break;
            }
            break;
            case "warmup":
                switch (payload.option) {
                    case "Start":
                        messageObj = await workoutService.beginExcercise(userData)
                        break;
                    case "Video instructions":
                        messageObj = await workoutService.videoInstructions(userData)
                        break;
                    case "Pause":
                        messageObj = await workoutService.pauseQuestion()
                    break;
            }
            break;
            case "do-excercise":
                switch (payload.option) {
                    case "Next":
                        messageObj = await workoutService.nextExcercise(userData)
                        break;
                    case "Video Instructions":
                        messageObj = await workoutService.videoInstructions(userData)
                        break;
                    case "Pause":
                        messageObj = await workoutService.pauseQuestion()
                        break;
            }
            break;
            case "excercise-tutorial-video":
                switch (payload.option) {
                    case "Start excercise":
                        messageObj = await workoutService.beginExcercise(userData)
                        break;
                    case "Skip excercise":
                        messageObj = await workoutService.nextExcercise(userData)
                        break;
                    case "Pause":
                        messageObj = await workoutService.pauseQuestion()
                        break;
            }
            break;
            case "workout-finish":
                switch (payload.option) {
                    case "Good":
                        messageObj = await workoutService.byeMessage()
                        break;
                    case "Avarage":
                        messageObj = await workoutService.byeMessage()
                        break;
                    case "Bad":
                        messageObj = await workoutService.byeMessage()
                        break;
            }
            break;
        default:
            break;
    }
    sendMessage(psid,messageObj)    
}


module.exports = {
    sendMessage: sendMessage,
    handleMessage: handleMessage,
    handlePostback: handlePostback
};