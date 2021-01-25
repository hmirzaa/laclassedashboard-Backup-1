import React, { useRef, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// import ReactFlagsSelect from 'react-flags-select';
import Select from 'react-select';

import { makeStyles } from '@material-ui/styles';
import {
  Card,
  TextField,
  MenuItem,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  CardHeader,
  Grid,
  Divider,

} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import * as API from '../../../services2';
import { setProfileData } from '../../../actions';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import Spinner from 'react-bootstrap/Spinner';
import { SuccessSnackbar } from '../../Snackbars';
import { LocalStorage } from '../../../services/localstorage.service';

const languages = [
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'en', label: 'English' },
];

const useStyles = makeStyles(
  theme => (
    {
      root: {},
      content: {
        display: 'flex',
        padding: "20px",
        alignItems: 'center',
        flexDirection: 'column',
        textAlgin: 'center'
      },
      ReactFlagsSelect:{
      width:'2.3em',
      position:'revert'
      },
      name: {
        marginTop: theme.spacing(1)
      },
      default_select: {
        height: 40,
        width: 80,
        marginTop:10
      },
      flag:{
        marginLeft:"20px",
        '& img' : {
          top:'auto'
        }
      },
      avatar: {
        height: 100,
        width: 100
      },
      uploadButton: {
        width: '50%',
        backgroundColor:'Grey',
        color: 'white',
        borderRadius:"25px",
        '&:hover': {
          backgroundColor: theme.palette.secondary.main
        }
      },
      removeButton: {
        width: '50%',
        backgroundColor: '#E10000',
        color: 'white',
        borderRadius:"25px",
        '&:hover': {
          backgroundColor: '#E10009'
        }
      }
    }
  )
);
const divStyle = {
  // marginTop: '10px' ,
  marginBottom: '20px'
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

function ProfileDetails({ profile, className, ...rest }) {
  console.log('profile', profile)
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const token = useSelector(state => state.user.token);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [userProfileImage, setUserProfileImage] = useState(
    profile.data.data.profileImage
  );
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [disableUploadButton, setDisableUploadButton] = useState(false);
  const [flag, setFlag] = useState();

  const handleRemoveClick = () => {
    setDisableDeleteButton(true);
    API.deleteProfileImage(token)
      .then(userData => {
        setOpenSnackbar(true);
        setUserProfileImage(null);
        // dispatch(setProfileData(userData));
        setDisableDeleteButton(false);
      //  window.location.reload();
      })
     
      .catch(error => {
        setDisableDeleteButton(false);
      });
  };

  const handleChangeFlag = selectedOption => {
    setFlag(selectedOption)
    if(selectedOption.value=='fr')
    {
      LocalStorage.setItem('language','fr');
    }else if(selectedOption.value=='en')
    {
      LocalStorage.setItem('language','en');
    }else if(selectedOption.value=='ar')
    {
      LocalStorage.setItem('language','ar');
    }
    
    window.location.reload()
  };

  useEffect(() => {
    let mounted = true;
   
    
    let userLang = LocalStorage.getItem('language');
    if (mounted) {
      if(userLang=='fr')
      {
        setFlag({label:'French',value:'fr'})
      }else if(userLang=='en')
      {
        setFlag({label:'English',value:'en'})
      }else if(userLang=='ar')
      {
        setFlag({label:'Arabic',value:'ar'})
      }
    }

    return () => {
      mounted = false;
    };
  }, [])


  const handleClick = () => {
    fileInput.current.click();
  };

const handleSubmit = e => {
e.preventDefault();

};

  const handleFileChange = e => {
    e.preventDefault();

    setDisableUploadButton(true);

    let reader = new FileReader();
    let profileImage = e.target.files[0];

    if (profileImage) {
      reader.onload = e => {
        setUserProfileImage(e.target.result);

        API.updateProfileImage(
          profileImage, token
        )

          .then(userData => {
            dispatch(setProfileData(userData.data));
            setOpenSnackbar(true);
            setDisableUploadButton(false);
         //   window.location.reload();
          })
          .catch(error => {
            setDisableUploadButton(false);
          });
      };

      reader.readAsDataURL(profileImage);
    } else {
      setDisableUploadButton(false);
    }
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  let myData = profile.data.data;
  
  return (

  <Grid container 
    direction="column" 
    spacing={2} >  
    <Grid item md={12} xs={12}> 
      <Card {...rest} className={clsx(classes.root, className)}>
      
      <CardContent className={classes.content}>
        <Avatar
          onClick={() => handleClick()}
          className={classes.avatar}
          src={userProfileImage}
        >
            {getInitials(myData.fullName)}
            
        </Avatar>
     

        <Typography className={classes.name} gutterBottom variant="h3">
          {myData.fullName}
        </Typography>

        <Typography color="textSecondary" variant="body1">
          {myData.email}
        </Typography>
      </CardContent>
      
      <CardActions style={{padding:"1px 24px 16px"}}>
        <input
          type="file"
          name="profileImage"
          onChange={e => handleFileChange(e)}
          ref={fileInput}
          hidden
          accept={'image/*'}
        />

        <Button
          className={classes.uploadButton}
          variant="text"
          size="large"
          onClick={() => handleClick()}
          disabled={disableUploadButton}
        >
          {disableUploadButton ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            t('Upload')
          )}
        </Button>

        <Button
          className={classes.removeButton}
          variant="text"
          size="large"
          onClick={() => handleRemoveClick()}
          disabled={disableDeleteButton}
        >
         {disableDeleteButton ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            t('Delete')
          )}
        </Button>
      </CardActions>
      <SuccessSnackbar
        message={'Successfully saved changes'}
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
      </Card>
    </Grid>

    <Grid item md={12} xs={12}>
      <Card {...rest} className={clsx(classes.root, className)}
     style={{overflow:'visible', height:"150px"}}
      >
        <form onSubmit={handleSubmit}>
          <CardHeader title={t('Languages')} />
          <Divider />
            <Grid item md={12} xs={12}>
              <div style={divStyle}>
                <div style={{margin:"12px" }}>
                  <Typography gutterBottom variant="body1">
                    Change Language:
                  </Typography>
                </div>
                <div style={{margin:'12px'}}>
                  <Select
                  variant="h6"
                  defaultValue={flag}
                  className="basic-multi-select"
                  placeholder={t('Change Your Language')}
                  onChange={handleChangeFlag}
                  options={languages}
                  value={flag}
                  name="city"
                //  style={{margin:'12px'}}
                  />
                </div>
              </div>
            </Grid>
        </form>
       </Card>
    </Grid>

  </Grid>


  );
}

ProfileDetails.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default ProfileDetails;
