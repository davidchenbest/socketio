const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.origin
    }
})

io.on('connection', socket => {
    console.log(`user connected ${JSON.stringify({ socketid: socket.id })}`);

    socket.on('joinRoom', (data) => {
        socket.join(data.room)
        socket.broadcast.to(room).emit('joinRoom', data) //emit to everyone but the user

    })

    socket.on('leaveRoom', (data) => {
        const rooms = [...socket.rooms]
        for (let i = 1; i < rooms.length; i++) {
            const room = rooms[i];
            socket.broadcast.to(room).emit('leaveRoom', data)
        }
        // io.emit('message',JSON.stringify({message})) // emit to everyone
        // socket.emit('message',JSON.stringify({message})) // emit to the user connect
        // socket.broadcast.emit('message',JSON.stringify({message})) //emit to everyone but the user
    })

    // socket.on("disconnect", (reason) => {
    //     console.log(reason);
    // });
})

http.listen(process.env.PORT || 5000, () => console.log('server running'))