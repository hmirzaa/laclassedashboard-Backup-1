import { USER_LOGIN, USER_TOKEN, PROFILE_DATA, PROFILE_TOKEN } from 'src/actions';

const initialState = {
  isAuthenticated: false,
  userData: {},
  token: '',
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN: {
      return {
        ...state,
        isAuthenticated: action.userData.status,
        userData: action.userData.user
      };
    }

    case USER_TOKEN: {
      return {
        ...state,
        token: action.token,
      };
    }

    case PROFILE_DATA: {
      return {
        ...state,
        userData: action.userData
      };
    }

    case PROFILE_TOKEN: {
      return {
        ...state,
        token: action.token,
      };
    }

    /*case actionTypes.SESSION_LOGOUT: {
      return {
        ...state,
        loggedIn: false,
        user: {
          role: 'GUEST'
        }
      };
    }*/

    default: {
      return state;
    }
  }
};

export default sessionReducer;
