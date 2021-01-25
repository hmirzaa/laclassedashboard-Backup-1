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

export const createClasse = (data, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/classes`,
  headers: {
    token: token
  },
  data: data

}).then(response => response.data);

export const getClasses = token => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/classes`,
  headers: { token: token }

}).then(response => response.data);

export const getClasse = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/classe/${id}`,
  headers: { token: token },
  // data: qs.stringify(data)

}).then(response => response.data);


export const sendInvitestoClass = (id, data, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/classe/${id}/invite`,
  headers: { token: token },
  data: data,
}).then(response => response.data);

export const sendRoomInvitetoCourse = (id, data, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/room/${id}/invite`,
  headers: { token: token },
  data: data,
}).then(response => response.data);


export const getClasseParticipants = (id, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/classe/${id}/participants`,
  headers: { token: token }
}).then(response => response.data);

export const deleteClasse = (id, token) => axios({
  method: 'delete',
  url: `${CONFIG.baseUrl}/classe/${id}`,
  headers: { token: token },
});

export const deleteClassWithoutTeacher = (id) => axios({
  method: 'delete',
  url: `${CONFIG.baseUrl}/classe/${id}/noteacher`,
  headers: {},
});

export const updateClasse = (id, data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/classe/${id}`,
  headers: {
    token: token,
  },
  data: qs.stringify(data),

}).then(response => response.data.success);

export const getConnectedUserClasses = (token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/classes-for-courses`,
  headers: { token: token }

}).then(response => response.data);

export const getConnectedUserCategories = (token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/categories`,
  headers: { token: token }

}).then(response => response.data);

export const getCalenderValues = (id, type, token) => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/add-to-calendar/${id}?type=${type}`,
  headers: { token: token }

}).then(response => response.data);

export const CancelParticipationFromClass = (classeId, data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/classe/${classeId}/deleteuser`,
  headers: {
    token: token
  },
  data: qs.stringify(data),

}).then(response => response.data);

export const removeClassfromCourse = (id, data = {}, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/delete-room-class/${id}`,
  headers: {
    token: token
  },
  data: qs.stringify(data),

}).then(response => response.data);


export const hideClass = (id, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/hide-class/${id}`,
  headers: { token: token }

}).then(response => response.data);