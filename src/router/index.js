const express = require('express')
const controller = require("../controllers/messageController")

let router = express.Router();

module.exports = (app) => {
    router.get("/webhook", controller.getWebhook);
    router.post("/webhook", controller.postWebhook);
    
    return app.use("/", router);
}