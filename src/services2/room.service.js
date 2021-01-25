import axios from 'axios';
import CONFIG from '../config';
import qs from 'qs';
import { logout } from '../actions';
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
    token: token
  },
  data: data

}).then(response => response.data);

export const updateRoomById = (id, data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/update-room/${id}`,
  headers: {
    token: token
  },
  data: qs.stringify(data),

}).then(response => response.data);


export const deleteRoomClass = (id, data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/delete-room-class/${id}`,
  headers: {
    token: token
  },
  data: qs.stringify(data),

}).then(response => response.data);

export const getRooms = (token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms`,
  headers: {
    token: token
  },
}).then(response => response.data);

export const getRoomsByID = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/room/${id}`,
  headers: {
    token: token
  },
}).then(response => response.data);

export const getRoomByCode = (code, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/room-by-code/${code}`,
  headers: { token: token }

}).then(response => response.data);

export const getRoomById = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/${!token ? 'get-room-of-event-open' : 'get-room-of-event'}/${id}`,
  headers: { token: token }
})
  .then(response => {
    return response.data
  });

export const getCategory = (token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/categories`,
  headers: { token: token }

}).then(response => response.data);


export const hideCourse = (id, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/hide-room/${id}`,
  headers: { token: token }

}).then(response => response.data);

export const getCategoryWithoutAuth = () => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/get-categories`,
  headers: {}

}).then(response => response.data);

export const cancelRoomByTeacher = (id, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/room/${id}/cancel`,
  headers: { token: token }

}).then(response => response);

export const deleteParticipantfromRoom = (id, data, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/room/${id}/cancel-user-participation`,
  headers: { token: token },
  data: qs.stringify(data)

}).then(response => response);

export const participateInRoomByStudent = (id, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/room/${id}/participate`,
  headers: { token: token }

}).then(response => response.data);

export const cancelParticpateRoom = (id, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/room/${id}/cancel-participation`,
  headers: { token: token }

}).then(response => response);

export const deleteCours = (id, token) => axios({
  method: 'delete',
  url: `${CONFIG.baseUrl}/room/${id}`,
  headers: { token: token },
});

export const deleteCourseWithoutTeacher = (id) => axios({
  method: 'delete',
  url: `${CONFIG.baseUrl}/room/${id}/noteacher`,
  headers: {},
});

export const getAllPublicRooms = (token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms/list-public`,
  headers: { token: token }

}).then(response => response.data);

export const getAllPublicRoomsWithoutAuth = () => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms/list-rooms`,
  headers: {}

}).then(response => response.data);

export const getAllPublicRoomsByCategory = (categoryId, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms/list-public?category=${categoryId}`,
  headers: { token: token }

}).then(response => response.data);

export const getAllPublicRoomsByCategoryWithoutAuth = (categoryId) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/rooms/list-rooms?category=${categoryId}`,
  headers: {}

}).then(response => response.data);

export const sendFromInvite = (id, data, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/room/${id}/invite`,
  headers: {
    token: token
  },
  data: qs.stringify(data)

}).then(response => response.data.Room);

export const getRoomParticipant = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/classe/${id}/participants`,
  headers: { token: token }

}).then(response => response.data);

export const getRoomParticipantsbyStudent = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/room/${id}/participants`,
  headers: { token: token }

}).then(response => response.data);

export const getClassParticipant = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/classe/${id}`,
  headers: { token: token }

}).then(response => response.data);

export const addRoomToCalendar = (id, type, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/add-to-calendar/${id}?type=${type}`,
  headers: { token: token }

}).then(response => response.data);