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

export const getNotificationList = token => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/notifications`,
  headers: { token: token }

}).then(response => response.data);

export const getNotificationListById = (id,token) => axios({
    method: 'post',
    url: `${CONFIG.baseUrl}/seen-notify/${id}`,
    headers: { token: token }
  
  }).then(response => response.data);

  export const markAllNotificationSeen = (token) => axios({
    method: 'post',
    url: `${CONFIG.baseUrl}/mark-seen-all`,
    headers: { token: token }
  }).then(response => response.data);
  