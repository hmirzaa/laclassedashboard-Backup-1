import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import { getRoomByCode } from '../../services2'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as API from "../../services2";
import { ErrorSnackbar } from './../Snackbars'

const useStyles = makeStyles(
  theme => (
    {
      root: {
        borderRadius: "15px"
      },
      content: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        textAlgin: 'center'
      },
      name: {
        marginTop: theme.spacing(1)
      },
      owner: {
        marginTop: theme.spacing(-1)
      },
      avatar:
      {
        height: 100,
        width: 100
      },
      disableStartButton: {
        width: '100%',
        backgroundColor: '#c1c1c1',
        color: 'white',
        '&:hover': {
          backgroundColor: '#c1c1c1'
        }
      },
      partcipateButton: {
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
        '&:hover': {
          backgroundColor: 'black'
        }
      },
      startButton: {
        width: '100%',
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        '&:hover': {
          backgroundColor: theme.palette.secondary.main
        }
      },
      learnMoreButton: {
        fontWeight: "bold",
        width: "100%",
        color: "white",
        borderRadius: "10rem",
        backgroundColor: "black",
        "&:hover": {
          backgroundColor: "black",
        },
      },

    }
  )
);

function Joincourse({ profile, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const token = useSelector(state => state.user.token);


  // Join Course Card //
  const [userProfileImage, setUserProfileImage] = useState('images/icons/user.png');
  const [titleCourseJoin, setTitleCourseJoin] = useState('Title Course');
  const [authorCourseJoin, setAuthorCourseJoin] = useState('Owner');
  const [urlCourseJoin, setUrlCourseJoin] = useState('');
  // const [disable, setdisable] = useState('');
  const [hasCourseUrl, setHasCourseUrl] = useState(false);

  const [ParticipationCode, checkParticipationCode] = useState([]);

  const [shortCourseCode, setShortCourseCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');




  const participateInRoomByStudent = (id) => {
    if(ParticipationCode.checkParticipation==false)
    {
      API.participateInRoomByStudent(id, token)
      .then(() => {
        let data = {
          checkParticipation : true
        }
        checkParticipationCode(data)
      });
    }
  };

  const onChange = e => {
    e.persist();
    setShortCourseCode(e.target.value);
    if (e.target.value.length < 5) {
      setUserProfileImage('images/icons/user.png')
      setTitleCourseJoin('Title Course')
      setAuthorCourseJoin('Owner')
      setUrlCourseJoin('')
      setHasCourseUrl(false)
      checkParticipationCode([])

    }
    if (e.target.value.length === 5) {
      fetchCourseInfo(e.target.value)
    }
  };


  const fetchCourseInfo = async (code) => {
    if (!code) {
      setIsError(true)
      setHasCourseUrl(false)
    }
    await getRoomByCode(code, token).then((res) => {
      const { status, data: { url }, message, data } = res
      console.log("THe URL CODE::::::::", res)
      if (!data.url) {

        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage('')
          setHasCourseUrl(false)
        }, 1500);
        return
      }
      if (status === 1) {
        //window.location.href = url
        setUserProfileImage(data.creator.profileImage)
        checkParticipationCode(data)
        setIsError(false)
        setAuthorCourseJoin(data.creator.fullName)
        setTitleCourseJoin(data.roomName)
        setUrlCourseJoin(url)
        setHasCourseUrl(true)
        return
      }
    }).catch((e) => {
      setHasCourseUrl(false)
    })
  }

  console.log("THe CheckParticipations::::::", ParticipationCode?.checkParticipation)
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Avatar
          className={classes.avatar}
          src={userProfileImage}
        >
          {getInitials(authorCourseJoin)}
        </Avatar>

        <Typography className={classes.name} gutterBottom variant="h3">
          {titleCourseJoin}
        </Typography>
        <Typography className={classes.owner} variant="body2">

          By:{authorCourseJoin}
        </Typography>
      </CardContent>
      <CardContent>
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
              error={!shortCourseCode && isError}
              fullWidth
              label={t('Enter Course Code')}
              name="coursecode"
              type="text"
              variant="outlined"
              required
              inputProps={{ maxLength: 5 }}
              value={shortCourseCode}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Button
          title="Start"
          className={
            ParticipationCode.checkParticipation !=null ?
              hasCourseUrl && ParticipationCode.checkParticipation == true?
              classes.startButton : classes.learnMoreButton
            :
            hasCourseUrl ? classes.startButton : classes.disableStartButton
          }
          endIcon={
            ParticipationCode.checkParticipation != null?
              hasCourseUrl && ParticipationCode.checkParticipation ==  true?
                <PlayCircleOutlineIcon style={{ fontSize: '27px' }}></PlayCircleOutlineIcon>
              :
                <PersonAddIcon style={{ fontSize: '27px' }}></PersonAddIcon>
            :
            <PlayCircleOutlineIcon style={{ fontSize: '27px' }}></PlayCircleOutlineIcon>
            
          }
          onClick={
            () => {
              if (hasCourseUrl && ParticipationCode.checkParticipation == true) {
                window.location.href = urlCourseJoin
              }else{
                participateInRoomByStudent(ParticipationCode.id)
              }
            }
          }
          
          
          disabled={!hasCourseUrl}
        >
          
          {
            ParticipationCode.checkParticipation != null ?
              hasCourseUrl && ParticipationCode.checkParticipation == true?
              'START' : 'PARTICIPATE'
            :
            'START'
          }
        </Button>
      </CardActions>
      <ErrorSnackbar
        open={errorMessage}
        errorMessage={errorMessage}
      />
    </Card>
  );
}

Joincourse.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default Joincourse;
