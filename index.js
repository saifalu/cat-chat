
const express = require('express')
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000

http.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/static'))

app.get('/',(req,resp)=>{
    resp.sendFile('/index.html')
})


const io = require('socket.io')(http,{
    cors: {
        origin: "https://cat-chat.azurewebsites.net",
        methods: ["GET", "POST"]
    }
})

const users = {}


io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log(name,'joined the site')
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    
    socket.on('send', message=>{
            console.log({message: message, name: users[socket.id]})
            socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    })

    socket.on('disconnect', data=>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
})

