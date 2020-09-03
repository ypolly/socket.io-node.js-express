const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {formatMessage, formatGif} = require('./utils/messages');


const request= require('request');
const {apiRequest, apiRequestRandom,apiRequestWeather} = require('./utils/api');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const {roomCreate,rooms} = require('./utils/rooms');

var roomsList=[];

const app = express();
const server = http.createServer(app);
const io = socketio(server);




app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

io.on('connection', socket => {
   
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    
    socket.on('createRoom',({ room, password }) =>{
        roomsList= roomCreate(room, password);
    } );

    socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

      io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('apiRequest',  ({value, search, callback}) =>{
      switch(value){
          case 'val1':
           { apiRequest(search).then(data => {
                var img = JSON.parse(JSON.stringify(data));
                //console.log('Data:', img.data[0].images.original.url);
                const user = getCurrentUser(socket.id);
                io.to(user.room).emit('gif', formatGif(user.username, img.data[0].images.original.url));
     
             })
                              .catch(err => console.log('Error:', err));
              break;
            }

            case 'val2':
                    { apiRequestRandom().then(data => {
                        var img = JSON.parse(JSON.stringify(data));
                        //console.log('Data:', data);
                        const user = getCurrentUser(socket.id);
                        io.to(user.room).emit('gif', formatGif(user.username, img.data.images.original.url));
             
                     })
                                      .catch(err => console.log('Error:', err));
                      break;
                    }
                    case 'val3':
                    { apiRequestWeather().then(data => {
                        var weather = JSON.parse(JSON.stringify(data));
                        console.log('Data:', data);
                        const user = getCurrentUser(socket.id);
                        var msg='The weather in Gothenburg is: '+weather.current.temperature+'Cº, '+weather.current.weather_descriptions;
                        io.to(user.room).emit('message', formatMessage(user.username, msg ));
             
                     })
                                      .catch(err => console.log('Error:', err));
                      break;
                    }
      }
       
       
        //console.log(api)
    });

    socket.on('roomCreate',  ({ roomName, password }) =>{
        var room=roomCreate(roomName, password);
        console.log(room);
    })

    
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

app.get('/test',(req,res)=>{
    //res.sendFile(__dirname +'./public/index.html',);
    res.json({title: roomsList});
})

app.get('/render',(req,res)=>{
    res.sendFile(__dirname +'/public/index.html');
})


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));