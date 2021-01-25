import React from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Container,
  Avatar,
  Typography,
  colors
} from '@material-ui/core';

import palette from '../../theme/palette';
import Label from '../../components/Label';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {},
  cover: {
    position: 'relative',
    height: 80,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    '&:before': {
      position: 'absolute',
      content: '" "',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      backgroundColor: theme.palette.secondary.dark
      //backgroundImage: 'linear-gradient(-180deg, rgba(0,0,0,0.00) 58%, rgba(0,0,0,0.32) 100%)'
    },
    '&:hover': {
      '& $changeButton': {
        visibility: 'visible'
      }
    }
  },
  changeButton: {
    visibility: 'hidden',
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: colors.blueGrey[900],
    color: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      top: theme.spacing(3),
      bottom: 'auto'
    },
    '&:hover': {
      backgroundColor: colors.blueGrey[900]
    }
  },
  addPhotoIcon: {
    marginRight: theme.spacing(1)
  },
  container: {
    padding: theme.spacing(2, 3),
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 120,
    width: 120,
    top: -60,
    left: theme.spacing(3),
    position: 'absolute',
    backgroundColor: theme.palette.secondary.dark
  },
  details: {
    marginLeft: 136
  },
  actions: {
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1)
    },
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  },
  pendingButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    }
  },
  personAddIcon: {
    marginRight: theme.spacing(1)
  },
  mailIcon: {
    marginRight: theme.spacing(1)
  }
}));

function Header({ className, room, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div
        className={classes.cover}
      >
      </div>
      <Container
        maxWidth="lg"
        className={classes.container}
      >
        <Avatar
          alt="Person"
          className={classes.avatar}
          src={'/images/icons/cours-home 2.png'}
        />
        <div className={classes.details}>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            {room.schoolName}
            {' '}
            <Label
              color={room.isPublic ? palette.coursTags.backgroundIsPublic : palette.coursTags.backgroundIsPrivate}
              key={room._id}
            >
              {
                room.isPublic ?
                  t('public')
                  :
                  t('private')
              }
            </Label>

          </Typography>
          <Typography
            component="h1"
            variant="h4"
          >
            {room.roomName}
          </Typography>
        </div>
      </Container>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
