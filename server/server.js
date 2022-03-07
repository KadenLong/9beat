require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const {seed, saveSong, getSongs} = require('./controller.js')


app.use(express.json())
app.use(express.static('client'))
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});


app.post('/seed', seed)
app.post('/saveSong', saveSong)
app.get('/getSongs/:id', getSongs)

app.listen(process.env.SERVER_PORT, () => console.log(`Arc reactor pushing power to port ${process.env.SERVER_PORT}`))

// app.post('/songs', (req, res) => {
//     req.body.songNotes
// })