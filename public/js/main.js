const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const { username, room, password } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();



socket.emit('joinRoom', { username, room, password });


socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
 // p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }

 socket.on('gif', url => {
  console.log(url);
  outputGif(url);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputGif(message){
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  //p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const img = document.createElement('img');
  img.src=message.url;
  div.appendChild(img);
  document.querySelector('.chat-messages').appendChild(div);
}



 
 $("#msg").on("input", function() {
    console.log($("#msg").val());
  if ( $("#msg").val()[0] == '/'){
  var $select = $('#gifOptions');
  $select.show();
  }
     else {
         $('#gifOptions').hide();
     }
});


    $('#gifOptions').on('click', function(e) {
    e.preventDefault;
  var value = $(this).val().toString();
  var search=$("#msg").val();
  search = search.substring(1).replace(/\s/g,'');
  console.log(search);
  socket.emit('apiRequest', {value, search})
});

$(document).ready( () =>{
     var myOptions = {
        val1 : 'Gif /',
        val2: 'Random gif',
        val3: 'Weather'
    };
    var gifOptions = $('#gifOptions');
    gifOptions.hide();
    $.each(myOptions, function(val, text) {
        gifOptions.append(
            $('<option></option>').val(val).html(text)
        );
    });
}
)

function findRooms() {
  var availableRooms = [];
  var rooms = socket.sockets.adapter.rooms;
  if (rooms) {
      for (var room in rooms) {
          if (!rooms[room].hasOwnProperty(room)) {
              availableRooms.push(room);
          }
      }
  }
  console.log(availableRooms);
  return availableRooms;
}





