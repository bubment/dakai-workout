
const Interaction = require("../models/Interactions")
const Workout = require("../models/Workouts")
const User = require("../models/Users")


const beginWorkoutQuestion = async () => {
    let currentInteraction = await Interaction.getByName('welcome-1')
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}

const startNewWorkout = async (psid) => {
    let newWorkout = await Workout.getRandomWorkout()
    await User.addWorkout(psid,newWorkout._id)
    let warmupPostback = await getWarmupPostback(newWorkout,0)
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

const createPostbackBody = (interaction,imageLink) => {
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
}

module.exports = {
    beginWorkoutQuestion: beginWorkoutQuestion,
    startNewWorkout: startNewWorkout,
    comeBackLaterDefault:comeBackLaterDefault
};