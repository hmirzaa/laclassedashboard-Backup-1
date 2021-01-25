import axios from 'axios';
import CONFIG from '../config';
import qs from 'qs';
import { logout } from '../../src/actions';
import { configureStore } from '../store';
const { store } = configureStore();

axios.interceptors.response.use(null, (error) => {
  if (error.response && error.response.data === 'Unauthorized') {
    store.dispatch(logout());
  }
  return Promise.reject(error);
});

export const createRoom = (data, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/rooms`,
  headers: {
    Authorization: token
  },
  data: qs.stringify(data)

}).then(response => response.data.Room);

export const getRooms = (searchType, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms?searchType=${searchType}`,
  headers: { Authorization: token }

}).then(response => response.data);

export const getRoom = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms/${id}`,
  headers: { Authorization: token }

}).then(response => response.data.Room);

export const getRoomByCode = (code, userID) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/room/${code}/list${userID === null ? '' : '?userID=' + userID}`

}).then(response => response.data.Room);

export const deleteCours = (id, token) => axios({
  method: 'delete',
  url: `${CONFIG.baseUrl}/rooms/${id}`,
  headers: { Authorization: token },
});

export const updateRoom = (id, data = {}, token) => axios({
  method: 'put',
  url: `${CONFIG.baseUrl}/rooms/${id}`,
  headers: {
    Authorization: token,
  },
  data: qs.stringify(data),

}).then(response => response.data.success);

export const startRoom = (data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/rooms/start`,
  headers: {
    Authorization: token,
  },
  data: qs.stringify(data),

}).then(response => response.data);

export const startVerifyRoom = (data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/rooms/start_verify`,
  headers: {
    Authorization: token,
  },
  data: qs.stringify(data),

}).then(response => response.data);

export const verifyRoom = (roomCode, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms/verify_room/${roomCode}`,
  headers: {
    Authorization: token,
  }
}).then(response => response.data);

export const searchRooms = (data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/rooms/search?searchType=${data.searchType}&roomName=${data.roomName}&profName=${data.profName}`,
  headers: {
    Authorization: token,
  }

}).then(response => response.data);

export const subscribeToRoom = (roomID, subscribe, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/rooms/subscribe?roomID=${roomID}&subscribe=${subscribe}`,
  headers: {
    Authorization: token,
  }

}).then(response => response.data);

export const handleSubscriptionsToRoom = (roomID, userID, accept, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/rooms/handle-subscribe?roomID=${roomID}&userID=${userID}&accept=${accept}`,
  headers: {
    Authorization: token,
  }

}).then(response => response.data);

export const handleManySubscriptionsToRoom = (roomID, userIDs, accept, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/rooms/handle-many-subscribe?roomID=${roomID}&userIDs=${userIDs}&accept=${accept}`,
  headers: {
    Authorization: token,
  }

}).then(response => response.data);

export const getRoomParticipant = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/room/participants?roomID=${id}`,
  headers: { Authorization: token }

}).then(response => response.data.Participants);

export const deleteUserFromRoom = (userId, roomId, token) => axios({
  method: 'delete',
  url: `${CONFIG.baseUrl}/room/${roomId}/user/${userId}`,
  headers: { Authorization: token },
});

export const getAllPublicRooms = (token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms/public-rooms/list`,
  headers: { Authorization: token }

}).then(response => response.data.Rooms);

export const exportRoomStudents = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/export-room-students?roomID=${id}`,
  headers: { Authorization: token }

}).then(response => response.data);

export const getRoomRecordings = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/get-room-recordings?meetingID=${id}`,
  headers: { Authorization: token }

}).then(response => response.data);
