const express = require('express')
const bodyParser = require('body-parser')
const webhookRouter = require("./router")

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Init /webook router
webhookRouter(app)

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));