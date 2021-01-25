import { LocalStorage } from '../services/localstorage.service';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_TOKEN = 'USER_TOKEN';
export const PROFILE_TOKEN = 'PROFILE_TOKEN';
export const PROFILE_DATA = 'PROFILE_DATA';

const clearAuthDataFromStorage = () => {
  ['userToken'].forEach(propName => LocalStorage.removeItem(propName));
};

export const login = (userData = {}) => (dispatch) => {
  LocalStorage.setItem('userToken', userData.token || '');
  dispatch({ type: USER_TOKEN, token: userData.token });
  dispatch({ type: USER_LOGIN, userData: userData });
  console.log('userData DDD', userData)
  return Promise.resolve();
};

export const logout = () => (dispatch) => {
  dispatch({
    type: USER_LOGIN,
    userData: {
      success: false,
      userData: {}
    },
  });
  dispatch({ type: USER_TOKEN, token: '' });
  clearAuthDataFromStorage();

  return Promise.resolve();
};

export const setProfileData = (userData = {}) => (dispatch) => {
  LocalStorage.setItem('userToken', userData.token || '');
  dispatch({ type: PROFILE_TOKEN, token: userData.token });
  dispatch({ type: PROFILE_DATA, userData: userData.user });

  return Promise.resolve();
};
