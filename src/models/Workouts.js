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

const getRandomWorkout = async () => {
    let count = await Workout.count()
    let random = Math.floor(Math.random() * count)
    const result = await Workout.findOne().skip(random)
    return result;
}

const getById = async (_id) => {
    const result = await Workout.findOne({_id})
    return result;
}

module.exports.getRandomWorkout = getRandomWorkout;
module.exports.getById = getById;