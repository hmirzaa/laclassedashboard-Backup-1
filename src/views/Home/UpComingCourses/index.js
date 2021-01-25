import React,{ useEffect, useState } from 'react';
import moment from 'moment';
import clsx from 'clsx';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import EmptyElements from '../../Empty/EmptyElements';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { makeStyles } from '@material-ui/styles';
import { capitalizeCase } from '../../../utils/commanFun'
import * as API from '../../../services2';
import time from 'moment'
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Divider,
  Avatar,

} from '@material-ui/core';
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius:"15px"
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 400,
    height:"282px"
  },
  Button: {
    width: '100%',
    paddingTop:'revert',
    borderRadius:"6px",
    backgroundColor: '#f7b731',
    color: 'white',
    '&:hover': {
      backgroundColor: '#f7b731'
    }
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    marginRight: '1rem',
    backgroundColor: '#d5d3d3'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  arrowForwardIcon: {
    marginLeft: theme.spacing(1) ,
    fontSize: '15px',
    color:'gray'
  }
}));

function UpComingCourses({ upComingCoursesObject, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const token = useSelector((state) => state.user.token);
  const [publicRooms, setPublicRooms] = useState([]) 

  const courseMoveTO = (whiteBoard, url) => {
    if ( whiteBoard === true ) window.location.href = url
    else window.location.href = url
  }

  useEffect(() => {
    API.getAllPublicRooms(token).then((res) => {
      const {data: { results }, status } = res
      if (status !== 1) return   
        setPublicRooms(capitalizeCase(results))        
    })
  }, [])

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}

    >
      <CardHeader
        title='Upcoming courses'
      />
      <Divider />

      <CardContent className="p-3">
      {
          upComingCoursesObject && upComingCoursesObject.length > 0 ?

        <PerfectScrollbar>
         <div className={classes.inner}>
         <div className="table-responsive">
            <table className="text-nowrap mb-0 table table-borderless table-hover">
              <tbody>
                {upComingCoursesObject.map((upComingCourse) => {
                  let dateTime = moment(upComingCourse.startDateTime).format('YYYY-MM-DD HH:mm')
                  return (
                <tr key={upComingCourse.id || upComingCourse._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Avatar   className={classes.avatar} />
                      <div>
                        <Typography variant="h4">
                          {upComingCourse.roomName}
                        </Typography>
                        <Typography varient="body2" style={{ color:'grey' }}>
                           By: {upComingCourse.creator.fullName}
                       </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <Typography variant="body2">
                      { dateTime.split(' ')[0]}<br></br>{dateTime.split(' ')[1]}
                    </Typography>
                  </td>

                  <td className="text-center">
                      <Button
                        variant="text"
                        size="large"
                        className={classes.Button}
                        endIcon={<PlayCircleOutlineIcon style={{fontSize:'27px'}}></PlayCircleOutlineIcon>}
                        onClick={() => courseMoveTO(upComingCourse.whiteBoard, upComingCourse.url)}
                        >
                          Start
                      </Button>
                  </td>
                </tr>
                  )
                })}
                {publicRooms.filter(filterRoom => moment(filterRoom.startDateTime).isAfter(moment()) &&
                filterRoom.checkParticipation == true).map((room) => {
                  let dateTime = moment(room.startDateTime).format('YYYY-MM-DD HH:mm')
                  return (
                <tr key={room.id || room._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Avatar   className={classes.avatar} />
                      <div>
                        <Typography variant="h4">
                          {room.roomName}
                        </Typography>
                        <Typography varient="body2" style={{ color:'grey' }}>
                           By: {room.creator.fullName}
                       </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <Typography variant="body2">
                      { dateTime.split(' ')[0]}<br></br>{dateTime.split(' ')[1]}
                    </Typography>
                  </td>

                  <td className="text-center">
                      <Button
                        variant="text"
                        size="large"
                        className={classes.Button}
                        endIcon={<PlayCircleOutlineIcon style={{fontSize:'27px'}}></PlayCircleOutlineIcon>}
                        onClick={() => courseMoveTO(room.whiteBoard, room.url)}
                        >
                          Start
                      </Button>
                  </td>
                </tr>
                  )
                })}
              </tbody>
              </table>
            </div>
          </div>
          </PerfectScrollbar>
       :
       <EmptyElements title={t('No Upcoming course')}  />
   }

      
      </CardContent>

            {/* <Divider />
            <CardActions className={classes.actions}>
              <Button
                style={{color:'gray'}}
                size="small"
                variant="text"
              >
                See all
                <ArrowForwardIosIcon className={classes.arrowForwardIcon} />
              </Button>
            </CardActions> */}
    </Card>
  );
}

export default UpComingCourses;
