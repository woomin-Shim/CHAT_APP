const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');

const path = require('path');
const server = http.createServer(app); //http 통신
const io = socketio(server); 
const port = process.env.PORT || 5000;  //deployment || local

const router = require('./router');

if(process.env.NODE_ENV === 'production') {  //When running on AWS 
    app.use(express.static(path.join(__dirname, "../client/build")));
    
    app.get('*', (req, res) => {
        req.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    })
}

io.on('connection', (socket) => {  // 이 함수내에서 모든 교환이 이루어짐
    console.log('We have a new connection!!');

    socket.on('disconnect', () => {
        console.log('User had left!!!');
    })
});

app.use(router);


app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('Server running on port : ', port);
})