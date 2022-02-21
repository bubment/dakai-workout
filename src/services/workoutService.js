
const Interaction = require("../models/Interactions")

const beginWorkoutQuestion = async () => {
    let currentInteraction = await Interaction.getByName('welcome-1')
    let postbackBody = createPostbackBody(currentInteraction)
    return postbackBody;
}

const createPostbackBody = (interaction) => {
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
    beginWorkoutQuestion: beginWorkoutQuestion
};