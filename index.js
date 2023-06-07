'use strict'

const app = require('express')()
const serverHttp = require('http').Server(app)
const PORT = 3000
const io = require('socket.io')(serverHttp)

const myMessages = [];
const MessageLimit = 300;

io.on('connection', function(socket) {

    //Si hay mensajes los envío al conectarme
    if(myMessages.length!=0){
        socket.emit('text-event',myMessages)
        socket.broadcast.emit('text-event',myMessages)
    }

    //Cuando 'send-message'
    socket.on('send-message', function(data) {

        //Si hay más de 10 mensajes borro el primero
        if(myMessages.length>=MessageLimit){
            myMessages.shift()
            myMessages.push(data)
        }
        else{
            myMessages.push(data)
        }
        
        //Emite 'text-event'
        socket.emit('text-event', myMessages)
        //Emite para todos 'text-event'
        socket.broadcast.emit('text-event', myMessages)
    })
})



serverHttp.listen(3000, () => {
    console.log(`Server running on port ${3000}`)
})
