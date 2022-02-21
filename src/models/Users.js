const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    psid:{
        type:Number,
        required:true,
    },
    isWorkoutInProgress:{
        type: Boolean,
        default: false
    },
    hasUnfinishedWorkout:{
        type: Boolean,
        default: false
    },
    currentWorkout:{ type: [mongoose.Schema.Types.ObjectId], ref: 'Workout' },
    currentExcercise:{type:Number},
})

const User = module.exports = mongoose.model('User', UserSchema)

const getByPsid = async (psid) => {
    const result = await User.findOne({psid})
    return result;
}

module.exports.getByPsid = getByPsid;