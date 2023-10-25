const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const dotenv = require("dotenv")
const uuid = require("uuid")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

// let rooms = {}

// const joinRoom = (socket, roomName, room) => {
//         const index = room.sockets.indexOf(socket.id)
//         if (index > -1) {
//             socket.emit("room:join:error", "User is already in the room")
//             return
//         }
//     socket.join(roomName)
//     room.sockets.push(socket.id)
//     // console.log(socket.id)
//     console.log(`joined ${roomName}`)
//     console.log(room.sockets)
//     console.log(rooms)
//     socket.to(roomName).emit("user:join")
// }

// io.on("connection", (socket) => {
//     socket.on("room:create", (roomName) => {
//         if(!rooms[roomName]) {
//             rooms[roomName] = {
//                 password: null,
//                 sockets: []
//             }
//         } else {
//             socket.emit("room:create:error", "Room already exist")
//         }
//     })

//     socket.on("room:join", (roomName, password) => {
//         const room = rooms[roomName]
//         if (room) {
//             if (room.password) {
//                 if (room.password == password) {
//                     joinRoom(socket, roomName, room)
//                 } else {
//                     socket.emit("room:join:error", "Incorrect Password")
//                 }
//             } else {
//                 joinRoom(socket, roomName, room)
//             }
//         } else {
//             socket.emit("room:join:error", "Room does not exist")
//         }
//     })

//     socket.on("room:leave", (roomName) => {
//         socket.leave(roomName)
//         console.log("left room1")
//     })

//     socket.on("messageFromPeer", (message) => {
//         socket.emit("messageFromPeer", message)
//     })

    
// })

// io.of("/").adapter.on("leave-room", (room, id) => {
//     const theRoom = rooms[room]
//     if (theRoom){
//     const index = theRoom.sockets.indexOf(id)
    
//     if (index > -1) {
//         theRoom.sockets.splice(index, 1)
//     }
//     console.log(rooms)
//     console.log(theRoom.sockets)
// }
// })

// tyw-nfua-wmu

io.on("connection", (socket) => {
    socket.on("join", (roomName) => {
        const {rooms} = io.sockets.adapter
        const room = rooms.get(roomName)

        if (room === undefined){
            socket.join(roomName)
            socket.emit("created")
        } else if (room.size === 1) {
            socket.join(roomName)
            socket.emit("joined")
        } else {
            socket.emit("full")
        }
        console.log(rooms)
    })

    socket.on("ready", (roomName) => {
        socket.broadcast.to(roomName).emit("ready")
    })

    socket.on("ice-candidate", (candidate, roomName) => {
        console.log(candidate)
        socket.broadcast.to(roomName).emit("ice-candidate")
    })

    socket.on("offer", (offer, roomName) => {
        socket.broadcast.to(roomName).emit("offer")
    })

    socket.on("answer", (answer, roomName) => {
        socket.broadcast.to(roomName).emit("answer")
    })

    socket.on("leave", (roomName) => {
        socket.leave(roomName)
        socket.broadcast.to(roomName).emit("leave")
    })
})

server.listen(5000, () => {
    console.log('listening on port 5000')
})