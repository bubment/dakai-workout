const mongoose = require('mongoose')

const InteractionSchema = new mongoose.Schema({
    name: { type: String },
    type: {
        type: String,
        enum: ['postback', 'message'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: { type: String },
    imageUrl: { type: String },
    options: [{ type: String }],
})

const Interaction = module.exports = mongoose.model('Interaction', InteractionSchema)

const getByName = async (name) => {
    const result = await Interaction.findOne({ name })
    return result;
}

module.exports.getByName = getByName;