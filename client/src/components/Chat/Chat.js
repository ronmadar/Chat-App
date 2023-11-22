
import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { useLocation } from 'react-router-dom';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = () => {

    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT  = 'http://localhost:5000'; 

    useEffect(() => {
      const { name , room}= queryString.parse(location.search);
      
      socket = io(ENDPOINT, { transports: ['websocket'] });

      setName(name);
      setRoom(room);
 
      socket.emit('join', { name , room } , () => {
    
      });

      return () => {
        socket.emit('disconnect');
        socket.off();
      }

    }, [ENDPOINT, location.search]);

    useEffect(() => {
      socket.on('message', message => {
        setMessages([ ...messages, message ]);
      });
    }, [messages]);

    const sendMessage = (event) => {
      event.preventDefault();
  
      if(message) {
        socket.emit('sendMessage', message, () => setMessage(''));
      }
    }

    console.log(message , messages);
    
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users}/>
        </div>
    );
};

export default Chat;