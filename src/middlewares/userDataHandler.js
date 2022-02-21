const User = require("../models/Users")

const initUserData = async (req,res,next) => {
    let senderPSID = null;
    try {
        senderPSID = req.body.entry[0].messaging[0].sender.id
    } catch (error) {
        //TEMPORARY
        //---------------------------------
        senderPSID = 7867867876
        //---------------------------------
        //FINAL
        //---------------------------------
        // next()
        // return;
        //---------------------------------
    }
    currentUser = await User.getByPsid(senderPSID)
    if (!currentUser) currentUser = await createUserData(senderPSID)
    req.body.user = currentUser;
    next()
}

const createUserData = async (senderPSID) => {
    let result = await User.create({ psid: senderPSID })
    return result;
}

module.exports = {
    initUserData: initUserData,
};