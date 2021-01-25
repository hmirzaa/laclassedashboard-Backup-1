import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Link,
  Typography,
  colors,
  Avatar, Tooltip
} from '@material-ui/core';
import CoursGenericMoreButton from './CoursGenericMoreButton';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faFileAlt,
  faCopy,
  faHourglass
} from '@fortawesome/free-regular-svg-icons';

import { InfoSnackbar } from '../views/Snackbars';
import { useTranslation } from 'react-i18next';
import * as API from '../services';
import palette from '../theme/palette';
import Label from './Label';
import getInitials from '../utils/getInitials';

const useStyles = makeStyles(theme => ({
  root: {},
  header: {
    paddingBottom: 2
  },
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
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
    backgroundColor: theme.palette.secondary.main,
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
  }
}));

function SearchedCoursCard({ className, theCours, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.userData);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(theCours.isSubscribe);
  const [subscribers, setSubscribers] = useState(theCours.subscribers || 0);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const subscribeHandler = () => { 

    let subscribe = !isSubscribed;

    API.subscribeToRoom(theCours._id, subscribe, token)

      .then(response => {
        if (response.isSubscribe) {
          setIsSubscribed(true);

          setSubscribers(subs => {
            return subs + 1;
          });
        } else {
          setIsSubscribed(false);

          setSubscribers(subs => {
            if (subs === 0) {
              return subs
            } else {
              return subs - 1;
            }
          });
        }
      })

      .catch(error => {
        setErrorMessage(t('something went wrong'));
      });
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        // onMouseEnter={() => setIsBoxHover(true) }
        // onMouseLeave={() => setIsBoxHover(false) }
        action={
          user._id === theCours.creator._id ? (
            <CoursGenericMoreButton thecours={theCours} />
          ) : null
        }
        avatar={
          <Avatar
            alt="cours"
            className={classes.avatar}
            src={theCours.creator.profileImage}
          >
            { getInitials(theCours.creator.fullName) }
          </Avatar>
        }
        className={classes.header}
        disableTypography
        subheader={
          <Typography variant="body2">
            {`${t('by')} ${theCours.creator.fullName} ${theCours.isInstant ? '' : '| ' + moment(theCours.startDateTime).local().format('DD/MM/YYYY HH:mm')}`}
            <br/>

            {
              isSubscribed ?
                <Label
                  color={palette.coursTags.waiting}
                  key={theCours._id}
                >
                  {t('waiting')}
                </Label>
                : null
            }
          </Typography>
        }
        title={
          <Link
            className={classes.coursTitle}
            color="textPrimary"
            variant="h4"
            component={RouterLink}
            to={"/cours/details/" + theCours._id}
          >
            <Tooltip title={theCours.roomName}>
              <span>
                {
                  theCours.roomName.length > 10 ? theCours.roomName.substring(0, 10) + '...' : theCours.roomName
                }
              </span>
            </Tooltip>
          </Link>
        }
      />
      <Divider />
      <CardContent
        className={classes.content}
      >
        <div className={classes.description}>
          <Typography color="textSecondary" variant="subtitle2">
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{ marginRight: '10px', marginLeft: '10px' }}
            />
            {theCours.description ? theCours.description : t('no description')}
          </Typography>
        </div>

        <Divider />
        <div className={classes.details}>
          <Grid
            alignItems="center"
            container
            justify="space-between"
            spacing={3}
          >
            <Grid item>
              {/*TODO: add modal show all classes */}
              <Typography variant="body2">{t('duration')}</Typography>
              <center>
                <Typography variant="h6">
                  {
                    theCours.isInstant ? 'N/A' :
                      moment(theCours.endDateTime).local().diff(moment(theCours.startDateTime).local(), 'hours') + ' ' + t('hours')
                  }
                </Typography>
              </center>
            </Grid>
            <Grid item>
              {/*TODO: change city */}
              <Typography variant="body2">{t('waiting')}</Typography>
              <center>
                <Typography variant="h6">
                  {subscribers}
                </Typography>
              </center>
            </Grid>
            <Grid item>
              <Typography variant="body2">{t('participants')}</Typography>
              <center>
                {/*TODO: change thecours.classes with participants*/}
                <Typography variant="h6">
                  {theCours.participants ? theCours.participants : '0'}
                </Typography>
              </center>
            </Grid>
          </Grid>
        </div>
        {/*

      */}
        <Divider />
        <div className={classes.details}>
          <Grid
            alignItems="center"
            container
            justify="space-between"
            spacing={3}
          >
            <Grid item style={{ width: '100%' }}>
              <Button
                className={isSubscribed ? classes.learnMoreButtonUnsubscribe : classes.learnMoreButton}
                size="large"
                color="primary"
                onClick={() => subscribeHandler()}
              >
                {
                  isSubscribed ?
                    t('unsubscribe')
                    :
                    t('subscribe')
                }
              </Button>
            </Grid>
          </Grid>
        </div>
      </CardContent>
      <InfoSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
        errorMessage={errorMessage}
      />
    </Card>
  );
}

SearchedCoursCard.propTypes = {
  className: PropTypes.string,
  theCours: PropTypes.object.isRequired
};

export default SearchedCoursCard;
