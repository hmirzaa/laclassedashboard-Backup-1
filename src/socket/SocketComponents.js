import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { user_connected } from './socketOnEvents';
import SocketContext from './socket-context';

function SocketComponents() {

  const socket = useContext(SocketContext);

  const user = useSelector((state) => state.user.userData);

  useEffect(() => {

    if (user && user._id && user.fullName) {
      user_connected(socket, user._id, user.fullName);
    }
  }, []);

  return (
    <>
    </>
  );
}

export default SocketComponents;
