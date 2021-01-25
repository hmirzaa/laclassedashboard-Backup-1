import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TextField,
  Typography,
  InputAdornment
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import LocationCityIcon from '@material-ui/icons/LocationCity';

import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import * as API from '../../services2';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { ErrorSnackbar, InfoSnackbar } from '../Snackbars';
import city from '../../mock/villeMaroc.json';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import Spinner from 'react-bootstrap/Spinner';
import queryString from 'query-string';


const allCity = city.allcity;

const customStylesSelector = {
  option: (provided, state) => ({
    ...provided,
    // borderBottom: '1px dotted blue',
  }),

  menu: base => ({
    ...base,
    //zIndex: 100
  }),
};

const divStyle = {
  marginTop: '10px',
  marginBottom: '20px'
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px !important'
    },
    '& .MuiInput-root': {
      margin: '10px'
    },
    '& .css-yk16xz-control': {
      borderRadius: '12px',
      borderColor: '#fff',
      boxShadow: '1px 1px 6px 2px #eee',
      height: '50px',
      '&:focus': {
        borderColor: 'red'
      },
    }
  },
  fields: {
    margin: theme.spacing(-1),
    marginTop: theme.spacing(3),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  inputField: {
    boxShadow: '1px 1px 6px 2px #eee',
    borderRadius: '12px'
  },
  policy: {
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%',
    backgroundColor: '#f7b731',
    color: '#000',
    borderRadius: '20px',
    '&:hover': {
      color: '#fff'
    },
  },

  option: {
    display: 'inline-flex',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    maxWidth: 200,
    '& + &': {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(4)
    },
    // boxShadow: '0px 0px 15px 2px #eee',
    // borderRadius: '50%'
  },
  // selectedOption: {
  //   // border: `3px solid #f7b731`,
  //   // backgroundColor: colors.grey[100]
  // },
  optionRadio: {
    margin: -10,
  },
  optionDetails: {
    //marginLeft: theme.spacing(2),
    margin: '-3px 10px -3px 10px'
  }
}));

function RegisterForm({ className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const courseCode = queryString.parse(location.search) ? queryString.parse(location.search).code : null;

  const schema = {
    fullName: {
      presence: { allowEmpty: false, message: t('full name is required') },
      length: {
        maximum: 50,
        minimum: 4,
        message: t('FullName must be at least 4 characters')
      }
    },
    email: {
      presence: { allowEmpty: false, message: t('email is required') },
      email: {
        message: t('invalid email address')
      }
    },
    password: {
      presence: { allowEmpty: false, message: t('password is required') },
      length: {
        maximum: 100,
        minimum: 4,
        message: t('password must be at least 4 characters')
      }
    },
    confirm: {
      presence: { allowEmpty: false, message: t('password is required') },
      length: {
        maximum: 100,
        minimum: 4,
        message: t('password must be at least 4 characters')
      }
    }
  };

  const options = [
    {
      value: 'false',
     
      description: '',
      icon: '/images/icons/studentUnselected.png',
      selectedIcon: '/images/icons/studentSelected.png',
      title: t('student')
    },
    {
      value: 'true',
      description: '',
      icon: '/images/icons/teacherUnselected.png',
      selectedIcon: '/images/icons/teacherSelected.png',
      title: t('teacher'),

    }
  ];

 
  let params = new URLSearchParams(useLocation().search);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });


  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openInfoSnackbar, setOpenInfoSnackbar] = useState(false);
  const [RegisterMessage, setRegisterMessage] = useState(t('email already exists'));
  const [isRegisterButtonClicked, setIsRegisterButtonClicked] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('Sucessful');

  const handleChangeCity = (newValue, actionMeta) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      values: {
        ...prevFormState.values,
        'city': newValue ? newValue.label : null
      },
      touched: {
        ...prevFormState.touched,
        'city': true
      }
    }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleErrorSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };
  const handleInfoSnackbarClose = () => {
    setOpenInfoSnackbar(false);
  };
  //Valid password ??
  //const valid = values.password && values.password === values.confirm;

  const [isTeacher, setIsTeacher] = useState(options[0].value);
  const handleChangeIsTeacher = (event, option) => {
    setIsTeacher(option.value);
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
            :
            event.target.name === 'email' || event.target.name === 'confirm' || event.target.name === 'password' ? event.target.value.split(" ").join("") : event.target.value
      },
      touched: {
        ...prevFormState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSubmit = (event) => {
   
    event.preventDefault();
    setIsRegisterButtonClicked(true);

    ReactGA.event({
      category: 'Register',
      action: 'Create an Account!'
    });

    if (formState.values.password !== formState.values.confirm) {
      setErrorMsg(t('passwords not the same'));
      setOpenErrorSnackbar(true);
      setIsRegisterButtonClicked(false);
    } else {

      let userData = formState.values;
      userData.deviceId='null'
      // userData.number=''
      // userData.city=''
      // userData.establishment=''

      userData.isModerator = (isTeacher === 'true');

      API.register(userData)
        .then((user) => {

          if(user.status == 0) {
           
            setErrorMsg(userData.message);
            setOpenSnackbar(true)
            setIsRegisterButtonClicked(false);
            return
          }

          if (courseCode) {
            history.push('/live/' + courseCode);
          } else {
            setOpenInfoSnackbar(true)
            setTimeout(function() { 
              history.push('/auth/login');
            }.bind(this), 2000)
            
          }
          
        })
        .catch((error) => {
          setErrorMsg(t('email already exists'));
          setIsRegisterButtonClicked(false);
          setOpenErrorSnackbar(true);
        });
    }
  };

  const hasError = (field) => !!(formState.touched[field] && formState.errors[field]);

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
      <div>
        {options.map((option) => (
          <div
            className={clsx(classes.option, {
              [classes.selectedOption]: isTeacher === option.value
            })}
            key={option.value}
            onClick={(event) => handleChangeIsTeacher(event, option)}
          >
            {/*<Radio
              checked={isTeacher === option.value}
              className={classes.optionRadio}
              //color="primary"
              onClick={(event) => handleChangeIsTeacher(event, option)}
            />*/}

            <div className={classes.optionDetails}>
            { isTeacher !== option.value ?
              <img src={option.icon}
                style={{
                  width: 100,
                  height: 100,
                }}
                alt={""}
              />
              : <div></div>}
              { isTeacher === option.value ? 
                <img src={option.selectedIcon}
                style={{
                  width: 100,
                  height: 100,
                }}
                alt={""}
              />
            : <div></div>}
              <Typography
                gutterBottom
                variant="h5"
                style={{marginTop:"5px"}}
              >
                {option.title}
              </Typography>
              <Typography variant="body1">{option.description}</Typography>
            </div>
            
          </div>
        ))}
      </div>
      <div className={classes.fields}>
        <TextField
          error={hasError('fullName')}
          fullWidth
          helperText={
            hasError('fullName') ? formState.errors.fullName[0] : null
          }
          placeholder={t('full name')}
          className={classes.inputField}
          name="fullName"
          required
          onChange={handleChange}
          value={formState.values.fullName || params.get("fullName") || ''}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
        />
        {isTeacher == "true" ?

          <TextField
            error={hasError('establishment')}
            fullWidth
            helperText={
              hasError('establishment') ? formState.errors.establishment[0] : null
            }
            placeholder={t('establishment')}
            name="establishment"
            className={classes.inputField}
            onChange={handleChange}
            value={formState.values.establishment || ''}
            required
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceIcon />
                </InputAdornment>
              ),
            }}
          />
          : null}
        {isTeacher == "true" ?
          <div style={{ divStyle }} >
          <TextField
           error={hasError('cityName')}
            fullWidth
            helperText={
              hasError('cityName') ? formState.errors.city[0] : null
            }
            placeholder={t('choose your city')}
            name="city"
            required
            className={classes.inputField}
            onChange={handleChange}
            value={formState.values.city || ''}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon />
                </InputAdornment>
              ),
            }}
          />
            {/* <Select
              variant="h6"
              error={hasError('cityName')}
              styles={customStylesSelector}
              style={{ borderColor: 'red' }}
              name="cityName"
              //isMulti
              className="basic-single"
              classNamePrefix="select"
              placeholder={t('choose your city')}
              onChange={handleChangeCity}
              options={allCity}
              isClearable
              MenuProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            /> */}
          </div>
          : null}
        {isTeacher == "true" ?
          <TextField
            error={hasError('number')}
            fullWidth
            helperText={
              hasError('number') ? formState.errors.number[0] : null
            }
            placeholder={t('Phone number')}
            name="number"
            className={classes.inputField}
            onChange={handleChange}
            value={formState.values.number || ''}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
          : null}

        <TextField
          error={hasError('email')}
          fullWidth
          helperText={hasError('email') ? formState.errors.email[0] : null}
          placeholder={t('email address')}
          name="email"
          className={classes.inputField}
          required
          onChange={handleChange}
          value={formState.values.email || params.get("email") || ''}
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
          className={classes.inputField}
          required
          onChange={handleChange}
          type="password"
          value={formState.values.password || ''}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          error={hasError('confirm')}
          helperText={
            hasError('confirm') ? formState.errors.confirm[0] : null
          }
          fullWidth
          placeholder={t('confirm password')}
          name="confirm"
          className={classes.inputField}
          required
          onChange={handleChange}
          type="password"
          value={formState.values.confirm || ''}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />

        <div>
          <div className={classes.policy}>
            {/*
            <Checkbox
              checked={formState.values.policy || false}
              className={classes.policyCheckbox}
              color="primary"
              name="policy"
              onChange={handleChange}
            />
          */}
            <Typography
              color="textSecondary"
              variant="body1"
            >
              {t('i accept condition')}
              {' '}
              <a href="https://www.laclasse.ma/terms-and-privacy.html" target="_blank" style={{ color: '#f7b731' }}>{t('Terms and Conditions')}</a>
            </Typography>
          </div>

        </div>
      </div>
      <ErrorSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
        errorMessage={RegisterMessage}
      />
      <Button
        className={classes.submitButton}
        color="primary"
        disabled={!formState.isValid || isRegisterButtonClicked}
        size="large"
        type="submit"
        variant="contained"
   //     onClick={() => handleSubmit}
      >
        {
          isRegisterButtonClicked ?
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            :
            t('create account')
        }
      </Button>

      <ErrorSnackbar
        onClose={handleErrorSnackbarClose}
        open={openErrorSnackbar}
        errorMessage={errorMsg}
      />
      <InfoSnackbar
        onClose={handleInfoSnackbarClose}
        open={openInfoSnackbar}
        errorMessage={infoMsg}
      />

    </form>

  );
}

RegisterForm.propTypes = {
  className: PropTypes.string
};

export default RegisterForm;
