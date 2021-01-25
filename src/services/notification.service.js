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

export const getSocketNotifications = token => axios({
  method: 'get',
  url: `${CONFIG.baseUrl}/socket/notifications`,
  headers: { Authorization: token }

}).then(response => response.data);
