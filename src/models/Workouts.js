const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
    excercises : [
        {
            title:{type: String},
            warmupImage:{type: String},
            warmupBodypart:{type: String},
            tutorialVideoLink:{type: String},
            excerciseIllustrationImage:{type: String},
            numberOfSets:{type: Number},
            numberOfRepetitions:{type: Number},
            breakBetweenSets:{type: Number},
        }
    ]
})

const Workout = module.exports = mongoose.model('Workout', WorkoutSchema)