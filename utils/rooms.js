const rooms = [];

function roomCreate(room, password) {
    var newRoom = {room: room, password: password};
    rooms.push(newRoom);
      return rooms;
}


  module.exports={roomCreate, rooms};