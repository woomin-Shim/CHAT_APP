import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import './Chat.css';

let socket;
const ENDPOINT = 'localhost:80';


const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState(''); //single message
    const [messages, setMessages] = useState([]);  //전체 메세지
    

    useEffect(() => {

        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, () => {
            
        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect( () => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages] ); //messages array 바뀔때만 useEffect 실행

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);

    return  (
        <div className="outerContainer">
        <div className="container">
            <InfoBar room={room}/>
          {/* <input
          value = {message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
          /> */}
          <Messages messages={messages} name={name}/>
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
    );
}

export default Chat;