const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const path = require('path');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);
const router = require('./router');
const port = process.env.PORT || 5000;

app.use(cors());

if(process.env.NODE_ENV === 'production') {  //When running on AWS 
    app.use(express.static(path.join(__dirname, "../client/build")));
    
    app.get('*', (req, res) => {
        req.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    })
};

io.on('connection', (socket) => {  // 이 함수내에서 모든 교환이 이루어짐
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room});  //addUser 함수에서 error, user return 
        
        //error 났을 떄 callback 함수 client로 전송
        if(error) {
            callback(error);
        }

        //server -> client
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`});
        
        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback();
        
    });

    //waiting on sendMessage Event
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users : getUsersInRoom(user.room)});

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', {user:'admin', text: `${user.name} has left.` })
        }
        console.log('User had left!!!');
    })
});

server.listen(port, () => console.log(`Server has started on port ${port}`));

