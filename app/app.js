const express = require('express')
const routes = require('./routes')
const bodyParser = require("body-parser")

// Create Express App
const app = express()

app.use(bodyParser.json())

// Routes
app.use('/', routes)

module.exports = app
