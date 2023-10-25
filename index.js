const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const dotenv = require("dotenv")

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

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('sdp', data => {
        console.log(data)
        socket.broadcast.emit('sdp', data)
    })

    socket.on('candidate', data => {
        console.log(data)
        socket.broadcast.emit('candidate', data)
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected`)
    })
})

server.listen(5000, () => {
    console.log('listening on port 5000')
})