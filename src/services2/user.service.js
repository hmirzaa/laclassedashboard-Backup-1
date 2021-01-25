import axios from 'axios';
import CONFIG from '../config';
import { logout } from '../actions';
import { configureStore } from '../store';
import qs from 'qs';
const { store } = configureStore();

axios.interceptors.response.use(null, (error) => {
  if (error.response && error.response.data === 'Unauthorized') {
    store.dispatch(logout());
  }
  return Promise.reject(error);
});

export const login = credentials => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/login`,
  data: credentials,
}).then(response => response.data)


export const register = userData => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/register`,
  data: userData,
}).then(response => response.data);

export const turnOnOffNotification = (token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/notify-state`,
  headers: { token: token },
});

export const myProfile = (token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/my-profile`,
  headers: { token: token },
});

export const forgotPassword = (data) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/forgot-password`,
  data: data

}).then(response => response);

// export const updateProfileImage = (data , token) => axios({
//   method: 'post',
//   url: `${CONFIG.baseUrl}/update-profile`,
//   headers: { token: token },
//   data: qs.stringify(data)

// }).then(response => response.data);


export function updateProfile(values, token) {
  var bodyFormData = new FormData();
  bodyFormData.append('fullName', values.fullName)
  bodyFormData.append('city', values.city)
  bodyFormData.append('establishment', values.etablissement)
  bodyFormData.append('number', values.number)
  return axios({
    method: 'post',
    url: `${CONFIG.baseUrl}/update-profile`,
    data: bodyFormData,
    headers: { 
      'Content-Type': 'multipart/form-data',
      'token': token     
    }
  }).then(response => response.data);

}

export function updateProfileImage(profileImage, token) {
  var bodyFormData = new FormData();
  
  bodyFormData.append('profileImage', profileImage)
  return axios({
    method: 'post',
    url: `${CONFIG.baseUrl}/update-profile`,
    data: bodyFormData,
    headers: { 
      'Content-Type': 'multipart/form-data',
      'token': token     
    }
  }).then(response => response.data);

}


export function deleteProfileImage(token) {

  return axios({
    method: 'post',
    url: `${CONFIG.baseUrl}/update-profile`,
    headers: { token: token },
    params: { delProfileImage: 'yes' }
  }).then(response => response.data);

}




export const deleteAccount = (token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/delete-account`,
  headers: { token: token },
});

export const inviteUsers = (id, data, token) => axios({
  method: 'post',
  url: `${CONFIG.baseUrl}/room/:${id}/invite`,
  headers: {
    Authorization: token
  },
  data: qs.stringify(data)

}).then(response =>{
  return response.data.Invited
  });


  export const changePassword = (data, token) => axios({
    method: 'post',
    url: `${CONFIG.baseUrl}/change-password`,
    headers: {
      token: token,
    },
    data: qs.stringify(data),
  
  }).then(response => response.data);