import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Pophover from './Pophover';
import Pophover2 from './Pophover2';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import VideocamIcon from '@material-ui/icons/Videocam';
import SearchIcon from '@material-ui/icons/Search';
import Paginate from 'src/components/Paginate';
import CoursGenericMoreButton from './CoursGenericMoreButton';
import getInitials from '../utils/getInitials';
import sha1 from 'sha1';
import ListStudents from '../views/newModal/ListStudents';
import ListClass from '../views/newModal/ListClass';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Typography,
  colors,
  Avatar,
  IconButton,
  Paper,
  Input
}
  from '@material-ui/core';
import { InfoSnackbar } from '../views/Snackbars';
import { useTranslation } from 'react-i18next';
import * as API from '../services';
import Label from 'src/components/Label';
import moment from 'moment';
import ReactGA from 'react-ga';
const useStyles = makeStyles(theme => ({
  root: {},
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  iconbutton: {
    fontSize: "16px",
    color: 'black',
    '&:focus': {
      outline: 'revert'
    },
    padding: 'revert'

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
  paginate: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
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
    fontWeight: 'bold',
    width: '100%',
    color: 'black',
    justifyContent: 'revert',
    borderRadius: '10rem',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  learnMoreButtonwatch: {
    fontWeight: 'bold',
    width: '100%',
    color: 'black',
    justifyContent: 'revert',
    borderRadius: '10rem',
    backgroundColor: '#babcbe',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },

  learnMoreButtonUnsubscribe: {
    width: '100%',
    color: 'white',
    backgroundColor: theme.palette.secondary.unsubscribeButton,
    '&:hover': {
      backgroundColor: theme.palette.secondary.unsubscribeButton
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
  coursTitle: {
    color: theme.palette.coursTitle,
    'text-decoration': 'underline'
  },
  search: {
    flexGrow: 1,
    height: 42,
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  searchInput: {
    flexGrow: 1,
    placeholder: '#afaaaa'

  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  }
}));


function CoursCard({ className, theCours, ...rest }) {
  //  console.log('theCours', theCours)
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const moveToUrl = (url) => {
    window.location.href = url
  }

  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.userData);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isBoxHover, setIsBoxHover] = useState(false);
  const [errorMessage, setErrorMessage] = useState('copied !');
  const [startLoadingCours, setStartLoadingCours] = useState(false);
  const [subscribers, setSubscribers] = useState(theCours.subscribers || 0);
  const [openStudentList, setOpenStudentList] = useState(false);
  const [openClassList, setOpenClassList] = useState(false);

  let coursParticipants = theCours.participants || 0;

  if (coursParticipants !== 0) {
    coursParticipants -= 1;
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleStudentListOpen = () => {
    setOpenStudentList(true);
  };
  const handleStudentListClose = () => {
    setOpenStudentList(false);
  };
  const handleClassListOpen = () => {
    setOpenClassList(true);
  };
  const handleClassListClose = () => {
    setOpenClassList(false);
  };

  const startCours = () => {
    if (!theCours.isActive) {
      setErrorMessage(t('the course is archived'));
      setOpenSnackbar(true);
      return false;
    }

    setStartLoadingCours(true);

    ReactGA.event({
      category: 'Cours',
      action: 'Start cours!'
    });

    let queryString =
      '' +
      'meetingID=' +
      theCours.meetingID +
      '&fullName=' +
      encodeURIComponent(user.fullName) +
      '&password=' +
      (user._id === theCours?.creator?._id
        ? theCours.moderatorPW
        : theCours.attendeePW) +
      '&redirect=true';
    //"&redirect=true";

    let checksum = sha1(
      'join' + queryString + process.env.REACT_APP_BBB_SECRET
    );
    let coursRedirectURL =
      process.env.REACT_APP_BBB_HOST +
      '/join?' +
      queryString +
      '&checksum=' +
      checksum;

    let coursData = {
      roomQueryString: queryString,
      roomChecksum: checksum,
      roomRedirectURL: coursRedirectURL,
      roomId: theCours._id,
      meetingID: theCours.meetingID,
      roomName: theCours.roomName,
      moderatorPW: theCours.moderatorPW,
      attendeePW: theCours.attendeePW
    };

    API.startVerifyRoom(coursData, token)
      .then(response => {
        if (response.isRoomOn) {
          //window.open(response.roomRedirectURL, '_blank');
          window.location.href = response.roomRedirectURL;
        } else {
          setStartLoadingCours(false);
          // Cours is moved to archive automatically
        }
      })

      .catch(error => {
        setStartLoadingCours(false);
      });
  };
  let classRoom;
  if (theCours?.classRooms) {
    classRoom = theCours?.classRooms.filter((value) => {
      return value.isActive == true
    })
  }
  var dateTime = moment.utc(theCours.startDateTime).format('YYYY-MM-DD HH:mm').split(" ")
  
  return (
    <Fragment>
      <Grid container direction="row" spacing={3} key={theCours.url}>
        <Grid item xs={12} sm={12} md={12}>
          <Card {...rest} className={clsx(classes.root, className)} key={theCours.url + 1}>
            <Grid container style={{ textAlign: "left" }}>
              <Grid item xs={12}>
                <div className="card-badges">
                  <span className="shadow-none badge badge-danger badge-pill" style={{ backgroundColor: '#f7b731', color: 'black' }}>
                    {theCours.urlCode}
                  </span>
                </div>
              </Grid>
            </Grid>
            <Grid container style={{ flexWrap: 'nowrap' }}>
              <Grid item style={{ marginInlineStart: "15px" }}>
                <Avatar
                  alt="cours"
                  className={classes.avatar}
                  src={theCours?.creator?.profileImage}
                >
                  {/* {console.log('theCours----->',theCours)} */}
                  {getInitials(t(theCours?.creator?.fullName))}
                </Avatar>
              </Grid>

              <Grid item xs={8} style={{ marginInlineStart: "15px" }}>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <Grid container style={{ lineHeight: "1.0" }}>
                      <Grid item >
                        <div style={{ display: 'flex' }}>
                          <Typography variant="h5">
                            {theCours.roomName}
                          </Typography>
                          {theCours.description &&
                            <Pophover
                              theCours={theCours}
                            />
                          }
                        </div>
                      </Grid>
                      {/* <Grid item xs={1}>
                        {theCours.description &&
                          <Pophover
                            theCours={theCours}
                          />
                        }
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={3} >
                  <Grid item xs>
                    <Typography varient="body2" style={{ marginTop: "-10px", color: 'grey' }}>
                      {`By:  ${theCours?.creator?.fullName}`}
                    </Typography>
                  </Grid>
                </Grid>

              </Grid>

              <Grid item xs={1} style={{ textAlign: "right" }} >


                <Pophover2
                  theCours={theCours}
                />
              </Grid>
            </Grid>
            <CardContent className="p-3">
              <Divider />
              <div style={{ marginTop: "20px" }}>
                <Grid
                alignItems="center"
                container
                justify="space-between"
                spacing={2}
                style={{ marginTop: "20px" }}
                style={{ flexWrap: 'nowrap' }}
              >
                <Grid item>
                  <Typography variant="h5">Start Date</Typography>
                  <center>
                    <Typography variant="body2">
                      {dateTime[0]}<br></br>{dateTime[1]}
                    </Typography>
                  </center>
                </Grid>
                <Grid item>
                  <div className={classes.actions}>
                    {user.isModerator ?
                      <IconButton className={classes.iconbutton}>
                        <Typography variant="h5" onClick={!theCours?.category && handleClassListOpen}>{
                          !theCours?.category ? 'Class' : 'Category'}
                        </Typography>
                      </IconButton>
                      : <IconButton className={classes.iconbutton}>
                        <Typography variant="h5" onClick={!theCours?.category && handleClassListOpen}>{
                          !theCours?.category ? 'Class' : 'Category'}
                        </Typography>
                      </IconButton>
                    }
                  </div>
                  <center>
                    <Typography variant="body2">
                      <br></br>
                     
                      {theCours.status == 'public' ? theCours?.category?.name : theCours.activeClassesCount==0? "No Class":theCours.activeClassesCount }
                    </Typography>
                  </center>
                </Grid>

                <Grid item>

                  <div className={classes.actions}>
                    {user.isModerator ?
                      <IconButton className={classes.iconbutton}>
                        <Typography variant="h5" onClick={!theCours?.category && handleStudentListOpen}>{
                          !theCours?.category ? 'Students' : 'Participants'}
                        </Typography>
                        {/* <Typography variant="h5" onClick={handleStudentListOpen}>Students</Typography> */}
                      </IconButton>
                      :
                      <IconButton className={classes.iconbutton}>
                        <Typography variant="h5" onClick={!theCours?.category && handleStudentListOpen}>{
                          !theCours?.category ? 'Students' : 'Participants'}
                        </Typography>
                        {/* <Typography variant="h5" onClick={handleStudentListOpen}>Students</Typography> */}
                      </IconButton>
                    }
                  </div>
                  <center>
                    {/*TODO: change thecours.classes with participants*/}
                    <Typography variant="body2">
                      <br></br>
                      {!theCours?.category ? theCours.totalStudentsCount : theCours.participantsCount}
                    </Typography>
                  </center>

                </Grid>

              </Grid>
              </div>
              <div style={{ marginTop: "20px" }}>
                <Grid
                  alignItems="center"
                  container
                  justify="center"
                  spacing={1}
                >
                  <Grid item style={{ width: '50%' }}>
                    <Button
                      className={classes.learnMoreButton}
                      title="Start"
                      onClick={() => moveToUrl(theCours.url)}
                      endIcon={<PlayCircleOutlineIcon style={{ fontSize: '27px' }}></PlayCircleOutlineIcon>}
                    >
                      <span style={{ flexGrow: "1" }}>
                        Start
                      </span>

                    </Button>
                  </Grid>
                  {/* <Grid item style={{ width: '50%' }}>
                    <Button
                      className={classes.learnMoreButtonwatch}
                      title="Start"
                      endIcon={<VideocamIcon style={{ fontSize: '27px' }}></VideocamIcon>}
                    >
                      <span style={{ flexGrow: "1" }}>
                        Watch
                      </span>

                    </Button>
                  </Grid> */}

                </Grid>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {
        user.isModerator && theCours && openStudentList ?
          <ListStudents
            onClose={handleStudentListClose}
            open={openStudentList}
            theCours={theCours}
          />
          : null
      }
      {
        user.isModerator && theCours && openClassList ?
          <ListClass
            onClose={handleClassListClose}
            open={openClassList}
            theCours={theCours}
          /> : null
      }
    </Fragment>
  );
}
CoursCard.propTypes = {
  className: PropTypes.string,
  theCours: PropTypes.object.isRequired
};

export default CoursCard;