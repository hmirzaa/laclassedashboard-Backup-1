import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Pophover from './Pophover';
import Pophover2 from './Pophover2';
import { Grid, colors, Button, Typography, Card, CardContent, Divider, Avatar, IconButton } from '@material-ui/core';
import CoursCard from 'src/components/CoursCard';
// import * as API from '../../services';
import * as API from '../../services2';
import VideocamIcon from '@material-ui/icons/Videocam';
import Paginate from 'src/components/Paginate';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Alert from 'src/components/Alert';
import getInitials from '../../utils/getInitials';
import EmptyElements from '../Empty/EmptyElements';
import moment from 'moment';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoadingElement from '../Loading/LoadingElement';

const useStyles = makeStyles((theme) => ({
  root: {},
  alert: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: colors.blue[700]
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  paginate: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    backgroundColor: theme.palette.secondary.main
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

}));

function Projects({ roomID, className, match, theCours, fetchClasse, theClasse, classeId, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [openAlert, setOpenAlert] = useState(false);

  const [classe, setClasse] = useState([]);
  const [roomsList, setRoomList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    fetchClasse()
    fetchAllcourse()
  }, [])
  const fetchAllcourse = () => {

    // API.getRoomsByID(roomID, token)
    // .then((response) => {
    //   // const { data: { results } } = response
    //   // const thisClassCourses = results.map((val, index) => {
    //   //   console.log('theCours---', theCours[index]?.room?.id)
    //   //   // if(theCours[index]?.room?.id === val.id) !== -1

    //   // })
    //   // setRoomList(thisClassCourses)
    //   console.log('response--', response)
    // })
    // API.getRoomsByID(roomID, token)
    //   .then(response => {
    //     console.log('response--', response)

    //   })

    //   .catch(error => {
    //     console.log('response--', error)
    //   });
  }

  console.log("The Project Courses are:::::", theCours)
  { console.log('log->room', roomsList) }
 

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid container direction="row" spacing={3}
      >

        {theCours.map((data) => {
          var dateTime = moment.utc(data?.room?.startDateTime).format('YYYY-MM-DD HH:mm').split(" ")
          const { room: theCours } = data
          return (
            <Grid item md={4} sm={6} xs={12}>
              <Card {...rest} className={clsx(classes.root, className)}
                key={theCours.creator && theCours.creator.id}
              >
                <Grid container style={{ textAlign: "left" }}>
                  <Grid item xs={12}>
                    <div className="card-badges">
                      <span className="shadow-none badge badge-danger badge-pill" style={{ backgroundColor: '#f7b731', color: 'black' }}>
                        {theCours?.urlCode || '--'}
                      </span>
                    </div>
                  </Grid>
                </Grid>
                <Grid container style={{ flexWrap: 'nowrap' }}>
                  <Grid item style={{ marginInlineStart: "15px" }}>
                    <Avatar
                      alt="cours"
                      className={classes.avatar}
                      src={theCours.creator.profileImage}
                    >
                      {getInitials(theCours.creator?.fullName)}
                    </Avatar>
                  </Grid>

                  <Grid item xs={8} style={{ marginInlineStart: "15px" }}>
                    <Grid container spacing={3}>
                      <Grid item xs>
                        <Grid container style={{ lineHeight: "1.0" }}>
                          <Grid item >
                            <Typography variant="h4">
                              {theCours?.roomName}
                            </Typography>
                          </Grid>
                          <Grid item >
                            <Pophover />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3} >
                      <Grid item xs>
                        <Typography varient="body2" style={{ marginTop: "-10px", color: 'grey' }}>
                          By: {theCours.creator?.fullName}
                        </Typography>
                      </Grid>
                    </Grid>

                  </Grid>

                  <Grid item xs={1} style={{ textAlign: "right" }} >
                    {/* action={
           <CoursGenericMoreButton thecours={theCours} />
           } */}

                    <Pophover2 roomId={theCours.id} creator={theCours.creator} theClasse={theClasse}></Pophover2>
                  </Grid>
                </Grid>
                <CardContent className="p-3">
                  <Divider />
                  <Grid
                    alignItems="center"
                    container
                    justify="space-between"
                    spacing={3}
                    style={{ marginTop: "20px" }}
                  >
                    <Grid item>
                      <Typography variant="body1">Start Date</Typography>
                      <center>
                        <Typography variant="body2">
                          {dateTime[0]}<br></br>{dateTime[1]}
                          {/* 2021-09-16<br></br>
                  11:05 AM */}
                        </Typography>
                      </center>
                    </Grid>
                    <Grid item>
                      <div className={classes.actions}>
                        {/* { user.isModerator ? */}
                        <IconButton className={classes.iconbutton}>
                          <span variant="body1"
                          //  onClick={handleClassListOpen}
                          >Class</span>
                        </IconButton>
                        {/* : null  
                } */}
                      </div>
                      <center>
                        <Typography variant="body2">
                          <br></br>
                          {theCours.activeClassesCount}
                          {/* {theCours.classRooms.length} */}
                        </Typography>
                      </center>
                    </Grid>

                    <Grid item>

                      <div className={classes.actions}>
                        {/* { user.isModerator ? */}
                        <IconButton className={classes.iconbutton}>
                          <Typography variant="body1"
                          //   onClick={handleStudentListOpen}
                          >Students</Typography>
                        </IconButton>
                        {/* : null  
                } */}
                      </div>
                      <center>
                        {/*TODO: change thecours.classes with participants*/}
                        <Typography variant="body2">
                          <br></br>
                          {/* {theCours.participantsCount} */}
                          {theCours.totalStudentsCount}
                        </Typography>
                      </center>

                    </Grid>

                  </Grid>
                  <div style={{ marginTop: "20px" }}>
                    <Grid
                      alignItems="center"
                      container
                      justify="center"
                      spacing={3}
                    >
                      <Grid item style={{ width: '70%' }}>
                        <Button
                          className={classes.learnMoreButton}
                          title="Start"
                          //   onClick={() => moveToUrl(theCours.url)}
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
          )
        })}


      </Grid>

      <Grid item xs={12}>
        <div {...rest} className={clsx(classes.root, className)}>
          <div className={classes.paginate}>
            {/* <Paginate /> */}
          </div>
        </div>
      </Grid>

      :
      {
        theCours.length == 0 && 
        < EmptyElements
          title={t('no courses')}
          description={user.isModerator ? t('create your first course') : t('Your teacher has not scheduled any lessons for you.')}
        />
      }
    </div>
  );
}

Projects.propTypes = {
  className: PropTypes.string
};

export default Projects;
