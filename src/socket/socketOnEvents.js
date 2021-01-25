import SOCKET_CONSTANTS from './socket_constants';

function user_connected(socket, userID, userFullName) {

  socket.on('connect', () => {
    socket.emit(SOCKET_CONSTANTS.USER_CONNECTED, {
      userId: userID,
      fullName: userFullName,
      socketId: socket.id
    });
  });
}


function receivedNotifications(socket, t, cb) {

  socket.on(SOCKET_CONSTANTS.NOTIFICATION_FROM_SERVER, data => {

    switch (data.type) {
      case 'subscribe_to_room':
        cb(`${data.senderFullName} ${t(data.message)}`);
        break;

      case 'accepted_subscription':
        cb(`${data.senderFullName} ${t(data.message)} ${data.roomName}`);
        break;

      case 'invited_to_class':
        cb(`${data.senderFullName} ${t(data.message)} ${data.className}`);
        break;

      case 'invited_to_room':
        cb(`${data.senderFullName} ${t(data.message)} ${data.roomName}`);
        break;
    }
  });
}

export { receivedNotifications, user_connected };
