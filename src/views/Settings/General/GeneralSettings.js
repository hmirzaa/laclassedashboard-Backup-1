import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import city from '../../../mock/villeMaroc.json';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  TextField,
  Typography 
} from '@material-ui/core';
import { SuccessSnackbar } from '../../Snackbars';
import * as API from '../../../services2';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../../../actions/';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-bootstrap/Spinner';

// import array from json
const allCity = city.allcity;

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    width: '100px',
    backgroundColor: theme.palette.secondary.main,
    borderRadius:"25px",
    color: 'black',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  cancelButton: {
    width: '25%',
    backgroundColor: 'white',
    borderRadius:"25px",
    color: 'grey',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  options: {
    backgroundColor: theme.palette.secondary.main
  }
}));

const divStyle = {
  // marginTop: '10px' ,
  marginBottom: '20px',
};

const customStylesSelector = {
  option: (provided, state) => ({
    ...provided,
    // borderBottom: '1px dotted blue',
    color: state.isSelected ? 'black' : 'black',
    backgroundColor: state.isSelected ? 'white' : 'white',
    padding: 10
  }),
  menu: base => ({
    ...base,
    zIndex: 100
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  }
};

function GeneralSettings({ profile, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  //let myData =profile.data.data
  const [values, setValues] = useState({
    fullName: profile.data.data.fullName,
    email: profile.data.data.email,
    number: profile.data.data.phone,
    city: profile.data.data.cityName,
    etablissement: profile.data.data.etablissement
  });

  const [disableSaveChangeButton, setDisableSaveChangeButton] = useState(false);

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };

  const handleChangeCity = (newValue, actionMeta) => {
    values.city = newValue.label;
  };

 

  const handleSubmit = event => {
    event.preventDefault();
   
    
    setDisableSaveChangeButton(true);

    API.updateProfile(values, token)
      .then(userData => {
       
        dispatch(setProfileData(userData.data));
        setOpenSnackbar(true);
        setDisableSaveChangeButton(false);
     
      })
      .catch(error => {
        setDisableSaveChangeButton(false);
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <form onSubmit={handleSubmit}>
    <Card {...rest} className={clsx(classes.root, className)}
     style={{overflow:'visible'}}
    >
     
        <CardHeader title={t('profile')} />
        <Divider />
        <CardContent style={{padding:"55px 24px 55px 24px"}}>
          <Grid container spacing={4}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label={t('full name')}
                name="fullName"
                onChange={handleChange}
                required
                value={values.fullName}
                variant="outlined"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t('email address')}
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
                type="email"
                disabled
              />
            </Grid>

            <Grid item md={6} xs={12} style={{paddingTop:"9px"}}>
              {/* <div style={divStyle}> */}
                {/* <div style={{ marginLeft: '10px' }}>
                  <Typography gutterBottom variant="caption">
                    {t('city')} * :
                  </Typography>
                </div> */}
                {/* <Select
                  variant="h6"
                  styles={customStylesSelector}
                  //isMulti
                  defaultValue={allCity.filter(
                    option => option.label === values.city
                  )}
                  className="basic-multi-select"
                  placeholder={t('choose your city')}
                  onChange={handleChangeCity}
                  options={allCity}
                  name="city"
                /> */}
                 <TextField
                 style={{marginTop:'6px'}}
                fullWidth
                label={t('choose your city')}
                name="city"
                onChange={handleChange}
                required
                value={values.city}
                variant="outlined"
              />
              {/* </div> */}
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t('establishment')}
                name="etablissement"
                onChange={handleChange}
                // required
                value={values.etablissement}
                variant="outlined"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t('phone number')}
                name="number"
                onChange={handleChange}
                type="text"
                value={values.number}
                variant="outlined"
                //required
              />
            </Grid>

          
          </Grid>
        </CardContent>

      <SuccessSnackbar
        message={'Successfully saved changes'}
        onClose={handleSnackbarClose}
        open={openSnackbar}

      />
   </Card>
   <CardActions>
        <div style={{marginTop:"50px"}} >              
          <Button
            className={classes.saveButton}
           type="submit"
            size="large"
            variant="contained"
            
            disabled={disableSaveChangeButton}
          >
            {disableSaveChangeButton ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              t('Save')
            )}
          </Button>
        </div>
      </CardActions>

    </form>
  );
}

GeneralSettings.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default GeneralSettings;
