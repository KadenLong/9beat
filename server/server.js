const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.listen(5000, "Arc reactor pushing power to port 5000")

// app.post('/songs', (req, res) => {
//     req.body.songNotes
// })