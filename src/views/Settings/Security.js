import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Button,
  Divider,
  InputAdornment,
  TextField,
  colors, IconButton
} from '@material-ui/core';
import * as API from '../../services2';
import { useSelector } from 'react-redux';
import {ErrorSnackbar, SuccessSnackbar} from '../Snackbars';
import { useTranslation } from 'react-i18next';
import AccountDeleteConfirmationModal from './AccountDeleteConfirmationModal';
import { useHistory } from 'react-router';
import { LocalStorage } from '../../services/localstorage.service';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  saveButton: {
    color: theme.palette.common.white,
    backgroundColor: '#f7b62a',
    '&:hover': {
      backgroundColor: '#f7b62a'
    },
    borderRadius:"20px"
  },
  deleteButton: {
    color: theme.palette.common.white,
    backgroundColor: '#f7b62a',
    '&:hover': {
      backgroundColor: '#f7b62a'
    },
    borderRadius:"20px"
  }
}));


function Security({className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const history = useHistory();
  const [error, setError] = useState()
  const [errorPassword, setErrorPassword] = useState()
  const [passwordButton, setPasswordButton] = useState(false)
  
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const schema = {
    change_password: {  
      length: {
        maximum: 100,
        minimum: 4,
        message: t('password must be at least 4 characters')
      }
    },
    confirm_password: {
      length: {
        maximum: 100,
        minimum: 4,
        message: t('password must be at least 4 characters')
      }
    }
  };
  const [values, setValues] = useState({
    change_password: '',
    confirm_password: '',
    accountEmail: ''
  });



  // const handleChange = (event) => {
  //   event.persist()
  //   setFormState((prevFormState) => ({
  //     ...prevFormState,
  //     values: {
  //       ...prevFormState.values,
  //       [event.target.name]:
  //         event.target.type === 'checkbox'
  //           ? event.target.checked
  //           : event.target.value.split(" ").join("")
  //     },
  //     touched: {
  //       ...prevFormState.touched,
  //       [event.target.name]: true
  //     }
  //   }));
  // };
  const handleChange = (event) => {
    if(event.target.name=="change_password" && event.target.value.length <4)
    {
      setError("Password must be at least 4 characters")
    }else{
      setError("")
    }
    if(event.target.name=="confirm_password" && event.target.value.length <4)
    {
      setErrorPassword("Password must be at least 4 characters")
    }else{
      setErrorPassword("")
    }
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handlePasswordChange = () => {

    API.updateProfile({
      change_password: values.change_password
    }, token)

      .then(() => {
        setOpenSnackbar(true);
        setValues({
          change_password: '',
          confirm_password: ''
        });
      })
      .catch((error) => { console.log(error); });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleErrorSnackbarClose = () => {
    setErrorSnackbar(false);
  };

  const valid = values.change_password && values.change_password === values.confirm_password;

  let deleteAccountButtonValid;
  if (values.accountEmail) {
    deleteAccountButtonValid = values.accountEmail.toLowerCase() === user.email.toLowerCase();
  }

  const hasError = (field) => (!!(formState.touched[field] && formState.errors[field]));
  const [userData, setUserData] = useState(null);
 
  // useEffect(() => {
  //   const errors = validate(formState.values, schema, { fullMessages: false });
  //   setFormState((prevFormState) => ({
  //     ...prevFormState,
  //     isValid: !errors,
  //     errors: errors || {}
  //   }));
  // }, [formState.values]);


  useEffect(() => {
    
    let mounted = true;
   
    const fetchUserData = () => {
      API.myProfile(token)
        .then((thisUser) => {
          if (mounted) {
            setUserData(thisUser);
          }
        })
        .catch((error) => { console.log(error); });
    };

    fetchUserData();

    return () => {
      mounted = false;
    };
  }, []);


  const handleSubmit =  (event) => {
    event.preventDefault();


    let data = {
      pass: values.change_password,
      cpass: values.confirm_password,
      userid: userData.data.data.id
    };

    API.changePassword(data, token)
    .then( response => {
      if(response.status==1)
      {
        setOpenSnackbar(true);
        ['userToken'].forEach(propName => LocalStorage.removeItem(propName));
        ['persist:root'].forEach(propName => LocalStorage.removeItem(propName));
        history.push('/auth/login');
      }else{
        
        setErrorMessage(response.message)
        setErrorSnackbar(true)
      }
        

      
      
    })
    .catch((error) => { console.log(error); });
   
    
  };

 // const { getFieldDecorator } = props.form;
  return (
    <>
    <form
      {...rest}
      onSubmit={handleSubmit}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader title={t('change password')} />
        <Divider />
        <CardContent>
          
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={4}
                sm={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  error=""
                  label={t('password')}
                  name="change_password"
                  helperText={t(error)}
                  onChange={handleChange}
                  type="password"
                  value={values.change_password}
                  variant="outlined"
                  pattern=".{4,}"   
                  required 
                  title="4 characters minimum"
                  
                />
              </Grid>
              <Grid
                item
                md={4}
                sm={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label={t('confirm password')}
                  helperText={t(errorPassword)}
                  name="confirm_password"
                  onChange={handleChange}
                  type="password"
                  value={values.confirm_password}
                  variant="outlined"
                  
                />
              </Grid>
            </Grid>
          
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.saveButton}
            disabled={passwordButton}
            variant="contained"
           type="submit"
          >
            {t('save changes')}
          </Button>
        </CardActions>

        <SuccessSnackbar
          message={t('Password updated successfully! please login')}
          onClose={handleSnackbarClose}
          open={openSnackbar}
        />
        <ErrorSnackbar
          onClose={handleErrorSnackbarClose}
          open={errorSnackbar}
          errorMessage={errorMessage}
        />
      </Card>
      </form>
      {/* Delete Account card*/}

      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader title={t('delete account')} />
        <Divider />
        <CardContent>
          <form>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={12}
                sm={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  label={t('email address')}
                  name="accountEmail"
                  onChange={handleChange}
                  type="email"
                  value={values.accountEmail}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.deleteButton}
            disabled={!deleteAccountButtonValid}
            variant="contained"
            color="secondary"
            onClick={() =>  {setOpenDeleteAccountModal(true)}}
          >
            {t('delete account')}
          </Button>
        </CardActions>

        <AccountDeleteConfirmationModal
          onClose={() => setOpenDeleteAccountModal(false)}
          open={openDeleteAccountModal}
        />
      </Card>
    </>
  );
}

Security.propTypes = {
  className: PropTypes.string
};

export default Security;
