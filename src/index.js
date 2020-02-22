// server side js code
const express = require(`express`)
const http = require(`http`)
const path = require(`path`)
const socketio = require(`socket.io`)

const app = express();
const publicDirectoryPath = path.join(__dirname,`../public`)
const port = 3000
const server = http.createServer(app)
const io = socketio(server)
const {addUser,removeUser,getUser,getUsersInRoom} = require("../src/utils/user")
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join',({username,room},callback)=>{
        const {error,user} = addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', 'Admin','Welcome!')
        socket.broadcast.to(user.room).emit('message', `${user.username} has joined!`)
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })
    //for location
    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', user.username,message)
        callback()
    })

    socket.on('sendLocation', (coords) => {
        io.emit('locationMessage', `https://www.google.com/maps?q=${coords.lat},${coords.long}`)
    })

    //built in method
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', 'Admin',`${user.username} has left!`)
            io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
            })
        }
        
    })
})

server.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    
})