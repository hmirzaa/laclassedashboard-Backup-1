/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import EmailIcon from '@material-ui/icons/Email';
import { ErrorSnackbar } from '../../Snackbars';
import Spinner from 'react-bootstrap/Spinner';
// import * as API from '../../services2';
import LockIcon from '@material-ui/icons/Lock';
import { Button, TextField, colors , InputAdornment } from '@material-ui/core';
import * as API from '../../../services2';
import validate from 'validate.js';
import { useTranslation } from 'react-i18next';


const schema = {
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 100,
      minimum: 5
    }
  },
   confirm: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 100,
      minimum: 5
    }
  },
};


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
  createAccountBtn: {
    marginTop: theme.spacing(4),
    width: '100%',
    borderRadius: '20px',
    color: '#393939',
    textTransform: 'uppercase',
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

const initialValues = {
  email: ''
};

function ForgetForm({ className,onClose, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

   const history = useHistory();
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [forgotMessage, setforgotMessage] = useState(t('authentication failed'));
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  // const [openFailedSnackbar, setFailedSnackbar] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(t('something went wrong'));
  const [values, setValues] = useState({ ...initialValues });
  // let params = new URLSearchParams(useLocation().search);

  const [isSuccessEmail , setIsSuccessEmail ] = useState(false);

  useEffect(() => {
    let mounted = true;
    return () => {
      mounted = false;
    };
  }, []);

  // const handleFieldChange = (event, field, value) => {
  //   event.persist();
  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     [field]: value
  //   }));
  // };

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
    }));
  };

  // const inscrireHandler = () => {
  //   history.push('/auth/forgetFormPassword');
  // };
  

    const handleSubmit = async (event) => {
    event.preventDefault();

    API.forgotPassword(formState.values)
      .then(data => {
       
        dispatch((data));
        
        setforgotMessage(t('activation email has been sent'));
        setOpenSnackbar(true);
        
      })
      .catch((error) => {
        setDisableSubmit(false);
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes('403')) {
          setforgotMessage(t('user is not activated'));
        } else {
          setforgotMessage(t('authentication failed'));
        }
        setOpenSnackbar(true);
      });
  };

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
        required
        onChange={handleChange}
        className={classes.inputField}
        value={formState.values.email || ''}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />
        <ErrorSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
        errorMessage={forgotMessage}
      />
       <Button
            type='submit'
            className={classes.createAccountBtn}
            color="secondary"
            size="large"
            // onClick={btnHandler}
            variant="contained"
        >
            {t('confirm')}
        </Button>
    
    </div>
  </form>
    
    );
} 

ForgetForm.propTypes = {
  className: PropTypes.string
};

export default ForgetForm;
