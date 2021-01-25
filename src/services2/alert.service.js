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

  
  export const getListRequests = token => axios({
    method: 'get',
    url: `${CONFIG.baseUrlSA}/get-list-requests`,
    headers: { token: token }
  
  }).then(response => response.data);