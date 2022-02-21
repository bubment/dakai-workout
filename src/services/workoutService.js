
const Interaction = require("../models/Interactions")
const Workout = require("../models/Workouts")
const User = require("../models/Users")


const beginWorkoutQuestion = async () => {
    let currentInteraction = await Interaction.getByName('welcome-1')
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}

const pauseQuestion = async () => {
    let currentInteraction = await Interaction.getByName('pause-workout')
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}

const continueQuestion = async () => {
    let currentInteraction = await Interaction.getByName('welcome-2')
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}

const pauseWorkout = async (psid) => {
    await User.pauseWorkout(psid)
    let currentInteraction = await Interaction.getByName('pause-message')
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}

const startNewWorkout = async (psid) => {
    let newWorkout = await Workout.getRandomWorkout()
    await User.addWorkout(psid,newWorkout._id)
    let warmupPostback = await getWarmupPostback(newWorkout,0)
    return warmupPostback;
}

const continueWorkout = async (userData) => {
    await User.continueWorkout(userData.psid)
    let currentWorkout = await Workout.getById(userData.currentWorkout)
    let warmupPostback = await getWarmupPostback(currentWorkout,userData.currentExcercise)
    return warmupPostback;
}

const comeBackLaterDefault = () => {
    let responseText = { "text": "Come back later if you are in a workoout mood ;)" }
    return responseText;
}

const getWarmupPostback = async (workout,excerciseNumber) => {
    let currentInteraction = await Interaction.getByName('warmup')
    let currentExcercise = workout.excercises[excerciseNumber]
    let modTitle = currentInteraction.title.replace(/{{excerciseName}}/g,currentExcercise.title)
    let modSubtitle = currentInteraction.subtitle.replace(/{{warmupBodyPart}}/g,currentExcercise.warmupBodypart)
    currentInteraction.title = modTitle;
    currentInteraction.subtitle = modSubtitle;
    let postbackBody = createPostbackBody(currentInteraction,currentExcercise.warmupImage)
    return postbackBody;
}

const beginExcercise = async (userData) => {
    let currentInteraction = await Interaction.getByName('do-excercise')
    let currentWorkout = await Workout.getById(userData.currentWorkout)
    let currentExcercise = currentWorkout.excercises[userData.currentExcercise]
    let modTitle = currentInteraction.title.replace(/{{excerciseName}}/g,currentExcercise.title)
    let modSubtitle = currentInteraction.subtitle
    modSubtitle = modSubtitle.replace(/{{numberOfSets}}/g,currentExcercise.numberOfSets)
    modSubtitle = modSubtitle.replace(/{{numberOfRepetitions}}/g,currentExcercise.numberOfRepetitions)
    modSubtitle = modSubtitle.replace(/{{breakLength}}/g,currentExcercise.breakBetweenSets)
    currentInteraction.title = modTitle;
    currentInteraction.subtitle = modSubtitle;
    let postbackBody = createPostbackBody(currentInteraction,currentExcercise.excerciseIllustrationImage)
    return postbackBody;
}

const nextExcercise = async (userData) => {
    let currentWorkout = await Workout.getById(userData.currentWorkout)
    let currentInteraction, postbackBody;
    if (currentWorkout.excercises.length == (userData.currentExcercise + 1)) {
        await User.finishWorkout(userData.psid)
        currentInteraction = await Interaction.getByName('workout-finish')
        postbackBody = createPostbackBody(currentInteraction)
    }else{
        //TODO: ITT MEGNÉZNI, HOGY MIT RETURNOL AZ UPDATEONE (és ha jó azt használni a függvényhíváshoz)
        await User.increaseCurrentExcercise(userData.psid)
        userData.currentExcercise++;
        postbackBody = await getWarmupPostback(currentWorkout,(userData.currentExcercise+1))
    }
}

const videoInstructions = async (userData) => {
    let currentInteraction = await Interaction.getByName('excercise-tutorial-video')
    let currentWorkout = await Workout.getById(userData.currentWorkout)
    let currentExcercise = currentWorkout.excercises[userData.currentExcercise]
    let modTitle = currentInteraction.title.replace(/{{excerciseTutorialVideo}}/g,currentExcercise.tutorialVideoLink)
    currentInteraction.title = modTitle;
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}

const byeMessage = async () =>{
    let currentInteraction = await Interaction.getByName('bye-message')
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}


const createPostbackBody = (interaction,imageLink) => {
    switch (interaction.type) {
        case "postback":
            let postbackDefaultBody = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": []
                    }
                }
            }
            let elementItem = {};
            if(interaction.title) elementItem.title = interaction.title;
            if(interaction.subtitle) elementItem.subtitle = interaction.subtitle;
            if(imageLink) elementItem.image_url = imageLink;
            if(interaction.options){
                elementItem.buttons = []
                interaction.options.forEach(option=>{
                    elementItem.buttons.push({
                        type: "postback",
                        title: option,
                        payload:JSON.stringify({
                            name:interaction.name,
                            option:option
                        })
                    })
                })
            }
            postbackDefaultBody.attachment.payload.elements.push(elementItem)
            return postbackDefaultBody;
        case "message":
            return { "text": interaction.title || 'There was an error during communication'}
        default:
            return { "text": 'There was an error during communication'}
    }
}

module.exports = {
    beginWorkoutQuestion: beginWorkoutQuestion,
    pauseQuestion:pauseQuestion,
    continueQuestion:continueQuestion,
    pauseWorkout:pauseWorkout,
    startNewWorkout: startNewWorkout,
    continueWorkout:continueWorkout,
    beginExcercise:beginExcercise,
    nextExcercise:nextExcercise,
    videoInstructions:videoInstructions,
    comeBackLaterDefault:comeBackLaterDefault,
    byeMessage:byeMessage
};