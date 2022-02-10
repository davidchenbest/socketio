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
        socket.broadcast.to(data.room).emit('joinRoom', data) //emit to everyone but the user
        console.log(`user joinRoom ${JSON.stringify({ socketid: socket.id, data })}`);
    })

    socket.on('leaveRoom', (data) => {
        const rooms = [...socket.rooms]
        for (let i = 1; i < rooms.length; i++) {
            const room = rooms[i];
            socket.broadcast.to(room).emit('leaveRoom', data)
        }
        console.log(`user leaveRoom ${JSON.stringify({ socketid: socket.id, data })}`);
        // io.emit('message',JSON.stringify({message})) // emit to everyone
        // socket.emit('message',JSON.stringify({message})) // emit to the user connect
        // socket.broadcast.emit('message',JSON.stringify({message})) //emit to everyone but the user
    })

    socket.on("disconnect", (reason) => {
        console.log(`user disconnected ${JSON.stringify({ socketid: socket.id, reason })}`);
    });
})

http.listen(process.env.PORT || 5000, () => console.log('server running'))