const express = require('express')
const bodyParser = require('body-parser')
const webhookRouter = require("./router")
const config = require("./config")
const mongoose = require('mongoose');

mongoose.connect(config.DB_URL)
.catch(error => {
  console.log(`Mongoose connection has the followin error:\n\n${error}`)
  process.exit(1)
});
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Init /webook router
webhookRouter(app)

const PORT = process.env.PORT || 1337
app.listen(PORT, () => console.log(`App is listening on posrt ${PORT}`));