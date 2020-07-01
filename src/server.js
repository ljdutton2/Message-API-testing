require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')

// Set App Variable
const app = express()

// Use Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    const now = new Date().toString()
    console.log(`Requested ${req.url} at ${now}`)
    next()
})

// Database Setup
require('./config/db-setup.js')

// Routes
const router = require('./routes/index.js')
app.use(router)

const port = 2222

app.listen(port, () => console.log(` app listening at http://localhost:${port}`))

module.exports = app;
