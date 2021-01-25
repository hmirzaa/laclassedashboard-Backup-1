import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  ListItem,
  ListItemText,
  Tooltip,
  colors, Avatar, Button
} from '@material-ui/core';
import getInitials from '../../../utils/getInitials';
import Spinner from 'react-bootstrap/Spinner';
import ReactGA from 'react-ga';
import sha1 from 'sha1';
import * as API from '../../../services';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import palette from '../../../theme/palette';
import Label from '../../../components/Label';

const useStyles = makeStyles((theme) => ({
  root: {},
  critical: {
    '& $indicator': {
      borderColor: colors.red[600]
    }
  },
  indicator: {
    height: 12,
    width: 12,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: colors.grey[100],
    borderRadius: '50%'
  },
  viewButton: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    marginRight: theme.spacing(1)
  },
  learnMoreButton: {
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  learnMoreButtonDisable: {
    color: 'white',
    backgroundColor: '#A9A9A9',
    '&:hover': {
      backgroundColor: '#A9A9A9'
    },
    '&:disabled': {
      color: 'white'
    }
  },
}));

function UpComingCourseItem({ course, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.userData);

  const [startLoadingCours, setStartLoadingCours] = useState(false);

  let deadline = 'N/A';
  let critical = false;

  if (course.startDateTime) {
    const now = moment();
    const deadlineMoment = moment(course.startDateTime);

    if (deadlineMoment.isAfter(now) && deadlineMoment.diff(now, 'hours') < 1) {
      deadline = `${deadlineMoment.diff(now, 'minutes')} minutes remaining`;
      critical = true;

    } else if (deadlineMoment.isAfter(now) && deadlineMoment.diff(now, 'hours') > 24) {
      deadline = `${deadlineMoment.diff(now, 'days')} days remaining`;
      critical = true;
    } else {
      deadline = `${deadlineMoment.diff(now, 'hours')} hours remaining`;
      critical = true;
    }
  }

  const startCours = () => {
    setStartLoadingCours(true);

    ReactGA.event({
      category: 'Cours',
      action: 'Start cours!'
    });

    let queryString =
      '' +
      'meetingID=' +
      course.meetingID +
      '&fullName=' +
      encodeURIComponent(user.fullName) +
      '&password=' +
      (user._id === course.creator._id
        ? course.moderatorPW
        : course.attendeePW) +
      '&redirect=true';

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
      roomId: course._id,
      meetingID: course.meetingID,
      roomName: course.roomName,
      moderatorPW: course.moderatorPW,
      attendeePW: course.attendeePW
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

  return (
    <ListItem
      {...rest}
      className={clsx(
        classes.root,
        { [classes.critical]: critical },
        className
      )}
    >
      {/*
      <ListItemIcon>
        <span className={classes.indicator} />
      </ListItemIcon>
      */}

      <Avatar
        alt="Author"
        className={classes.avatar}
        src={course.creator.profileImage}
      >
        {getInitials(course.creator.fullName)}
      </Avatar>

      <ListItemText
        className={classes.listItemText}
        primary={
          <>
            <Tooltip title={course.roomName}>
              <span>
                {
                  course.roomName.length > 10 ? course.roomName.substring(0, 10) + '...' : course.roomName
                }
              </span>
            </Tooltip>
            {' '}
            <Label
              color={course.isPublic ? palette.coursTags.backgroundIsPublic : palette.coursTags.backgroundIsPrivate}
              key={course._id}
            >
              {
                course.isPublic ?
                  t('public')
                  :
                  t('private')
              }
            </Label>
          </>
        }
        primaryTypographyProps={{ variant: 'h6', noWrap: true }}
        secondary={deadline}
      />


      <Tooltip title={t('start')}>
        <Button
          className={classes.learnMoreButton}
          color="primary"
          edge="end"
          size="small"
          variant="outlined"
          disabled={startLoadingCours}
          onClick={() => startCours()}
        >
          {
            startLoadingCours ?
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            :
              t('start')
          }
        </Button>
      </Tooltip>
    </ListItem>
  );
}

UpComingCourseItem.propTypes = {
  className: PropTypes.string,
  course: PropTypes.object.isRequired
};

export default UpComingCourseItem;
