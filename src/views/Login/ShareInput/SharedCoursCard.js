import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Pophover from './Pophover';
import Pophover2 from './Pophover2';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  colors,
  Avatar,
  IconButton, TextField, Link
} from '@material-ui/core';
import sha1 from 'sha1';
import { useDispatch, useSelector } from 'react-redux';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import LaunchIcon from '@material-ui/icons/Launch';
import Label from 'src/components/Label';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faFileAlt,
  faCopy,
  faHourglass
} from '@fortawesome/free-regular-svg-icons';
import {
  faShareAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import * as API from '../../../services';
import ReactGA from 'react-ga';
import Spinner from 'react-bootstrap/Spinner';
import palette from './../../../theme/palette';
import getInitials from '../../../utils/getInitials';
import validate from 'validate.js';
import { login } from '../../../actions';
import { ErrorSnackbar } from '../../Snackbars';
import { Link as RouterLink } from 'react-router-dom';
import Login from '../../Login'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px !important',
    },
    '& .MuiInput-root': {
      margin: '10px'
    }
  },
  header: {
    paddingBottom: 2
  },
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
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
  inputField: {
    width:"500px",
    borderRadius: '12px',
    boxShadow: '1px 1px 6px 2px #eee',
    '& .MuiInput-underline:before': {
      content:'revert'
    },
  },

  description: {
    padding: theme.spacing(2, 3, 1, 3)
  },
  tags: {
    padding: theme.spacing(0, 3, 2, 3),
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  },

  learnMoreButton: {
    width: '100%',
    color: 'white',
    borderRadius:"20px",
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  register: {
    width: '100%',
    color: 'white',
    borderRadius:"20px",
    backgroundColor: '#383838',
    '&:hover': {
      backgroundColor: '#383838'
    }
  },
  learnMoreButtonTextDisabled: {
    width: '100%',
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: '#9b9ea1',
    '&:hover': {
      backgroundColor: '#9b9ea1'
    }
  },
  learnMoreButtonDisable: {
    width: '100%',
    color: 'white',
    backgroundColor: '#A9A9A9',
    '&:hover': {
      backgroundColor: '#A9A9A9'
    },
    '&:disabled': {
      color: 'white'
    }
  },
  
  likedButton: {
    color: colors.yellow[600]
  },
  shareButton: {
    marginLeft: theme.spacing(1)
  },
  details: {
    padding: theme.spacing(2, 3)
  },

  PlayCircleFilled: {
    marignRight: theme.spacing(3),
    color: 'white'
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    backgroundColor: theme.palette.secondary.main
  },
  avatarHover: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 55,
    width: 55,
    backgroundColor: theme.palette.secondary.main
  },
  coursTitle: {
    color: theme.palette.coursTitle,
    'text-decoration': 'underline'
  },
  shareIcons: {
    padding: theme.spacing(2, 3, 1, 3),
  },
  icons: {
    //marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  calendarIcon: {
    color: 'black',
    backgroundColor: 'grey',
    marginRight: theme.spacing(1),
  },
  shareCalendarIcon: {
    //marginLeft: theme.spacing(1),
  },
  
}));

function SharedCoursCard({ className, courseCode, theCours, isAuthenticated, ...rest }) {


  
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [startLoadingCours, setStartLoadingCours] = useState(false);
  const [subscribers, setSubscribers] = useState(theCours.subscribers || 0);
  const [isStartButtonClicked, setIsStartButtonClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState(t('something went wrong'));
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

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
        minimum: 8,
        message: t('password must be at least 8 characters')
      }
    }
  };

  let coursParticipants = theCours.participants || 0;

  if (coursParticipants !== 0) {
    coursParticipants -= 1;
  }

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

  const handleSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };

  const startCours = () => {

    setIsStartButtonClicked(true);

    if (!isAuthenticated) {
      API.login(formState.values)
        .then(userData => { dispatch(login(userData)); })
        .then(() => {  })
        .catch((error) => {
          setIsStartButtonClicked(false);
          setErrorMessage(t('authentication failed'));
          setOpenErrorSnackbar(true);
        });
    } else {
      let data = {
        roomCode: theCours.urlCode,
        userEmail: user.email
      };

      API.startRoom(data, token)

        .then((response) => {

          if (response.isModerator) {
            setErrorMessage(t("as a professor you can't access your course in here!"));
            setIsStartButtonClicked(false);
            setOpenErrorSnackbar(true);
          } else {
            if (response.roomURL) {
              window.location.href = response.roomURL;
            } else {
              setErrorMessage(t("share denied"));
              setIsStartButtonClicked(false);
              setOpenErrorSnackbar(true);
            }
          }
        })
        .catch((error) => {
          setErrorMessage(t('something went wrong'));
          setIsStartButtonClicked(false);
          setOpenErrorSnackbar(true);
        });
    }
  };

  useEffect(() => {
    const errors = validate(formState.values, schema, {fullMessages: false});
    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {}
    }));
  }, [formState.values]);

  const hasError = (field) => (!!(formState.touched[field] && formState.errors[field]));

  const {
    urlCode,
      roomName ,
      creator : { fullName },
      startDateTime,
      classRooms,
      participantsCount,
      totalStudentsCount,
      activeClassesCount,
      status,
      category,
      id
    } = theCours.data

    let dateTime = moment(startDateTime).format('YYYY-MM-DD HH:mm')

  return (
 <form
      {...rest}
      className={clsx(classes.root, className)}
   //   onSubmit={handleSubmit}
    >
  
   
      <Grid container style={{textAlign:"left", marginBottom:"5px"}}>
          <Grid item xs={12}>
            <div className="card-badges">
              <span className="shadow-none badge badge-danger badge-pill" style={{backgroundColor:'#f7b731', color:'black'}}>
                {urlCode}
              </span>
            </div>
          </Grid>
      </Grid>
        <Grid container>
            <Grid item style={{marginInlineStart:"15px"}}>
              <Avatar
                  alt="cours"
                  className={classes.avatar}>
              </Avatar>
            </Grid>

            <Grid item xs={8} style={{marginInlineStart:"15px"}}>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Grid container style={{lineHeight:"1.0"}}>
                            <Grid item >
                                <Typography variant="h4">
                                  {roomName}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Pophover/>
                            </Grid>
                          </Grid>
                    </Grid>
                </Grid>
              <Grid container spacing={3} >
                <Grid item xs>
                  <Typography varient="body2" style={{marginTop:"-10px", color:'grey' }}>
                    By: { fullName }
                  </Typography>
                </Grid>
              </Grid>

          </Grid>
          
            <Grid item xs={1}  style={{textAlign:"right"}} >
                <IconButton
                    size="small"
                    >
                    <Pophover2/>
                </IconButton>
              
            </Grid>
        </Grid>   
         <CardContent className="p-3">
          <Divider/>
            <div style={{ marginTop:"20px", marginBottom:"20px"}}>
              <Grid
                alignItems="center"
                container
                justify="space-around"
                spacing={3}
                style={{flexWrap:'nowrap'}}
                 >
                  <Grid item>
                  <Typography variant="body1">Start Date</Typography>
                  <center>
                      <Typography variant="body2">
                      { dateTime.split(' ')[0]}<br></br>{dateTime.split(' ')[1]}
                      </Typography>
                  </center>
                  </Grid>
                  <Grid item>
                  {status == "public" ?
                  <Typography variant="body1">Category</Typography>
                  :
                  <Typography variant="body1">Class</Typography>
                  }
                    <center>
                        <Typography variant="body2">
                        <br></br>
                        {status == "public" ?category.name:activeClassesCount > 0? activeClassesCount: "No Class"}
                        </Typography>
                    </center>
                  </Grid>
                <Grid item>
                {status == "public" ?
                <Typography variant="body1">Participants</Typography>
                :
                <Typography variant="body1">Students</Typography>
                }
                  <center>
                      {/*TODO: change thecours.classes with participants*/}
                      <Typography variant="body2">
                      <br></br>
                      {status == "public" ?participantsCount:totalStudentsCount}
                      </Typography>
                  </center>
                </Grid>
              </Grid>
            </div>
          <Divider/>
          <Divider/>
          <Login
            isAuth={true}
            // pathFromCard={`/live/${courseCode}`} 
          
          />
{/*           
          <div style={{ marginTop:"20px"}}>
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                spacing={3}
            >
              <Grid item xs={12}>
                   <div className={classes.fields}>
                    <TextField
                      fullWidth
                      placeholder={t('email address')}
                      name="email"
                      onChange={handleChange}
                      className={classes.inputField}
                      // InputProps={{
                      //   disableUnderline: true,
                      //   startAdornment: (
                      //     <InputAdornment position="start">
                      //       <EmailIcon />
                      //     </InputAdornment>
                      //   ),
                      // }}
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
                    // InputProps={{
                    //   disableUnderline: true,
                    //   startAdornment: (
                    //     <InputAdornment position="start">
                    //       <LockIcon />
                    //     </InputAdornment>
                    //   ),
                    // }}
                  />
                 </div>
               </Grid>
            </Grid>
            </div>

            <div style={{ marginTop:"20px"}}>
            <Grid
                alignItems="center"
                container
                justify="flex-start"
                spacing={3}
            >
                <Grid item style={{ width: '100%' }}>
                    <Button title="Start" 
                    size="large"
                    type="submit"
                    variant="contained"
                    className={classes.learnMoreButton} >
                    {t('sign in')}
                    </Button>
                </Grid>
                <Grid item style={{ width: '100%' }}>
                  <Typography
                    variant="h5"
                    style={{
                      textTransform: 'uppercase'
                    }}
                  >
                    <center>{t('you dont have an account')}</center>
                  </Typography>
                </Grid>
                <Grid item style={{ width: '100%' }}>
                  <div style={{width:'100%' }}>
                      <Button
                      className={classes.register}
                  //    component={RouterLink}
                    //  to={"/auth/register?code=" + courseCode}
                    >
                      {t('register')}
                    </Button>
                  </div>
                </Grid>
            </Grid>
            </div>
         */}
        </CardContent>
    
   
   </form>
   
   
   
   



  //  <Card {...rest} className={clsx(classes.root, className)}>
  //     <CardHeader
  //       avatar={
  //         <Avatar
  //           alt="cours"
  //           className={classes.avatar}
  //           src={theCours.creator.profileImage}
  //         >
  //           { getInitials(theCours.creator.fullName) }
  //         </Avatar>
  //       }
  //       className={classes.header}
  //       disableTypography
  //       subheader={
  //         <Typography variant="body2">
  //           {`${t('by')} ${theCours.creator.fullName} ${theCours.isInstant ? '' : '| ' + moment(theCours.startDateTime).local().format('DD/MM/YYYY HH:mm')}`}
  //           <br/>

  //           <Label
  //             color={theCours.isPublic ? palette.coursTags.backgroundIsPublic : palette.coursTags.backgroundIsPrivate}
  //             key={theCours._id}
  //           >
  //             {
  //               theCours.isPublic ?
  //                 t('public')
  //                 :
  //                 t('private')
  //             }
  //           </Label>
  //         </Typography>
  //       }
  //       title={theCours ? theCours.roomName : ''}
  //     />
  //     <Divider />
  //     <CardContent
  //       className={classes.content}
  //     >
  //       <div className={classes.description}>
  //         <Typography color="textSecondary" variant="subtitle2">
  //           <FontAwesomeIcon
  //             icon={faFileAlt}
  //             style={{ marginRight: '10px', marginLeft: '10px' }}
  //           />
  //           {theCours.description ? theCours.description : t('no description')}
  //         </Typography>
  //       </div>

  //       <Divider />
  //       <div className={classes.details}>
  //         <Grid
  //           alignItems="center"
  //           container
  //           justify="space-between"
  //           spacing={3}
  //         >
  //           <Grid item>
  //             {/*TODO: add modal show all classes */}
  //             <Typography variant="body2">{t('duration')}</Typography>
  //             <center>
  //               <Typography variant="h6">
  //                 {
  //                   theCours.isInstant ? 'N/A' :
  //                     moment(theCours.endDateTime).local().diff(moment(theCours.startDateTime).local(), 'hours') + ' ' + t('hours')
  //                 }
  //               </Typography>
  //             </center>
  //           </Grid>
  //           <Grid item>
  //             {/*TODO: change city */}
  //             <Typography variant="body2">{t('waiting')}</Typography>
  //             <center>
  //               <Typography variant="h6">
  //                 {subscribers}
  //               </Typography>
  //             </center>
  //           </Grid>
  //           <Grid item>
  //             <Typography variant="body2">{t('participants')}</Typography>
  //             <center>
  //               {/*TODO: change thecours.classes with participants*/}
  //               <Typography variant="h6">
  //                 {coursParticipants}
  //               </Typography>
  //             </center>
  //           </Grid>
  //         </Grid>
  //       </div>
  //       <Divider />
  //       <div className={classes.details}>
  //         <Grid
  //           alignItems="center"
  //           container
  //           justify="space-between"
  //           spacing={3}
  //         >
  //           {
  //             isAuthenticated ? null :
  //               <Grid item style={{ width: '100%' }}>
  //                 <div className={classes.fields}>
  //                   <TextField
  //                     error={hasError('email')}
  //                     fullWidth
  //                     helperText={hasError('email') ? formState.errors.email[0] : null}
  //                     label={t('email address')}
  //                     name="email"
  //                     onChange={handleChange}
  //                     value={formState.values.email || ''}
  //                     variant="outlined"
  //                   />
  //                   <TextField
  //                     error={hasError('password')}
  //                     fullWidth
  //                     helperText={
  //                       hasError('password') ? formState.errors.password[0] : null
  //                     }
  //                     label={t('password')}
  //                     name="password"
  //                     onChange={handleChange}
  //                     type="password"
  //                     value={formState.values.password || ''}
  //                     variant="outlined"
  //                   />
  //                 </div>
  //               </Grid>
  //           }

  //           <Grid item style={{ width: '100%' }}>
  //             <Button
  //               className={
  //                 theCours.isActive
  //                   ? classes.learnMoreButton
  //                   : classes.learnMoreButtonDisable
  //               }
  //               size="large"
  //               color="primary"
  //               onClick={() => startCours()}
  //               disabled={isStartButtonClicked}
  //             >
  //               {
  //                 isStartButtonClicked ?
  //                   <Spinner
  //                     as="span"
  //                     animation="border"
  //                     size="sm"
  //                     role="status"
  //                     aria-hidden="true"
  //                   />
  //                 :
  //                   isAuthenticated ? t('start') : t('sign in')
  //               }
  //             </Button>

  //             {
  //               isAuthenticated ? null :
  //                 <div style={{marginTop:'15px' , width:'100%' }}>
  //                   <Link
  //                     color="primary"
  //                     component={RouterLink}
  //                     to={"/auth/register?code=" + courseCode}
  //                     underline="always"
  //                     variant="subtitle2"
  //                   >
  //                     {t('register')}
  //                   </Link>
  //                 </div>
  //             }
  //           </Grid>
  //         </Grid>
  //       </div>
  //     </CardContent>

  //     <ErrorSnackbar
  //       onClose={handleSnackbarClose}
  //       open={openErrorSnackbar}
  //       errorMessage={errorMessage}
  //     />
  //   </Card>
  
  );
}

SharedCoursCard.propTypes = {
  className: PropTypes.string,
  theCours: PropTypes.object.isRequired
};

export default SharedCoursCard;
