import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card, Typography, Avatar, colors, TableCell, Button, TableRow
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import getInitials from '../../utils/getInitials';
import moment from 'moment';
import * as API from '../../services';

const useStyles = makeStyles((theme) => ({
  root: {},
  author: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(1)
  },
  learnMoreButtonUnsubscribe: {
    width: '100%',
    color: 'white',
    backgroundColor: theme.palette.secondary.unsubscribeButton,
    '&:hover': {
      backgroundColor: theme.palette.secondary.unsubscribeButton
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
}));

function PublicCourseHomeItem({ publicCourse, classesCount, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.userData);
  const token = useSelector(state => state.user.token);

  const [isSubscribed, setIsSubscribed] = useState(publicCourse.isSubscribe);
  const [errorMessage, setErrorMessage] = useState('');


  const subscribeHandler = () => {

    let subscribe = !isSubscribed;

    API.subscribeToRoom(publicCourse._id, subscribe, token)

      .then(response => {
        if (response.isSubscribe) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      })

      .catch(error => {
        setErrorMessage(t('something went wrong'));
      });
  };

  return (
    <TableRow
      {...rest}
      hover
      key={publicCourse._id}
      className={clsx(classes.root, className)}
    >
      <TableCell>{publicCourse.roomName}</TableCell>

      <TableCell>
        <div className={classes.author}>
          <Avatar
            alt="Author"
            className={classes.avatar}
            src={publicCourse.creator.profileImage}
          >
            {getInitials(publicCourse.creator.fullName)}
          </Avatar>
          {publicCourse.creator.fullName}
        </div>
      </TableCell>

      <TableCell>{moment(publicCourse.startDateTime).local().format('DD/MM/YYYY HH:mm')}</TableCell>

      <TableCell>
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
      </TableCell>
    </TableRow>
  );
}

PublicCourseHomeItem.propTypes = {
  className: PropTypes.string
};

export default PublicCourseHomeItem;

