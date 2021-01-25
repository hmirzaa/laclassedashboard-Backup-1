/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { LocalStorage } from '../../services2/localstorage.service';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { login } from 'src/actions';
// import * as API from '../../services';
import * as API from '../../services2';
import { ErrorSnackbar } from '../Snackbars';
import { useTranslation } from 'react-i18next'; 
import ReactGA from 'react-ga';
import Spinner from 'react-bootstrap/Spinner';
import SocketContext from '../../socket/socket-context';
import SOCKET_CONSTANTS from '../../socket/socket_constants';
import { configureStore } from '../../store';
const { store } = configureStore();

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px !important',
    },
    '& .MuiInput-root': {
      margin: '10px'
    }
  },
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%',
    backgroundColor: '#393939',
    color: '#fff',
    borderRadius: '20px',
    '&:hover': {
      color: '#000'
    },
  },
  inputField: {
    borderRadius: '12px',
    boxShadow: '1px 1px 6px 2px #eee',
  }
}));

function LoginForm({ props, className, ...rest }) {
  const {isAuth, pathFromCard} = props
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const socket = useContext(SocketContext);
  
  const history = useHistory();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loginMessage, setLoginMessage] = useState(t('authentication failed'));
  const [disableSubmit, setDisableSubmit] = useState(false);
  
  const schema = {
    email: {
      presence: { allowEmpty: false, message: t('email is required') },
      email: {
        message: t('invalid email address')
      }
    },
    password: {
      presence: { allowEmpty: false, message: t('password is required') },
      length: {
        minimum: 4,
        message: t('password must be at least 4 characters')
      }
    }
  };


  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleChange = (event) => {
    event.persist();

    setFormState((prevFormState) => ({
      ...prevFormState,
      values: {
        ...prevFormState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value.split(" ").join("")
      },
      touched: {
        ...prevFormState.touched,
        [event.target.name]: true
      }
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setDisableSubmit(true);

    ReactGA.event({
      category: 'Login',
      action: 'Login to Account!'
    });
    
    formState.values.acc_type ='email'
    if(window.deviceId){ formState.values.deviceId = window.deviceId }else{ formState.values.deviceId = 'null' }
    

    API.login(formState.values)
      .then(userData => {
        if(userData.status == 0) {
          setLoginMessage(userData.message);
          setOpenSnackbar(true)
          setDisableSubmit(false);
          return
        }
        
      dispatch(login(userData.data));
    
      if(isAuth){ LocalStorage.setItem('userToken', userData.data.token); }
      let path;
        
          !isAuth ? path = '/' : path = pathFromCard
          history.push(path);
      
      })
      .catch((error) => {
        setDisableSubmit(false);
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes('403')) {
          setLoginMessage(t('user is not activated'));
        } 
        //  else {
        //   setLoginMessage(t('authentication failed'));
        // } 
        setOpenSnackbar(true);
      });
  };

  const hasError = (field) => (!!(formState.touched[field] && formState.errors[field]));

  useEffect(() => {
    const errors = validate(formState.values, schema, { fullMessages: false });
    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {}
    }));
  }, [formState.values]);

  return (
    <form
      {...rest}
      className={clsx(classes.root, className)}
      onSubmit={handleSubmit}
    >
      <div className={classes.fields}>
        <TextField
          fullWidth
          placeholder={t('email address')}
          name="email"
          onChange={handleChange}
          className={classes.inputField}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          error={hasError('password')}
          fullWidth
          helperText={
            hasError('password') ? formState.errors.password[0] : null
          }
          placeholder={t('password')}
          name="password"
          onChange={handleChange}
          type="password"
          value={formState.values.password || ''}
          className={classes.inputField}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      
      <ErrorSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
        errorMessage={loginMessage}
      />
      <Button
        className={classes.submitButton}
        //color="primary"
        disabled={!formState.isValid || disableSubmit}
        size="large"
        type="submit"
        variant="contained"
      >
        {
          disableSubmit ?
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            :
            t('sign in')
        }
      </Button>
    </form>
  );
}

LoginForm.propTypes = {
  className: PropTypes.string
};

export default LoginForm;
