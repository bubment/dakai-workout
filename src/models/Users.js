const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    psid:{type:Number},
    isWorkoutInProgress:{type: Boolean},
    hasUnfinishedWorkout:{type: Boolean},
    currentWorkout:{ type: [mongoose.Schema.Types.ObjectId], ref: 'Workout' },
    currentExcercise:{type:Number},
})

const User = module.exports = mongoose.model('User', UserSchema)