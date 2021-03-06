require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const ctrl = require('./controller.js')


app.use(express.json())
app.use(express.static('client'))
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});


app.post('/seed', ctrl.seed)
app.post('/saveSong', ctrl.saveSong)
app.get('/getUserBeats/:id', ctrl.getUserBeats)
app.get('/getAllBeats', ctrl.getAllBeats)
app.get('/getUserInfo', ctrl.getUserInfo)
app.post('/login', ctrl.login)
app.post('/signUp', ctrl.signUp)
app.delete('/deleteBeat/:id', ctrl.deleteBeat)

app.listen(process.env.SERVER_PORT, () => console.log(`Arc reactor pushing power to port ${process.env.SERVER_PORT}`))
