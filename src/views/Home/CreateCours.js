import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card, Typography, Avatar, colors
} from '@material-ui/core';
import AirplayIcon from '@material-ui/icons/Airplay';
import gradients from 'src/utils/gradients';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import NewCreateCoursModal from './../newModal/NewCreateCoursModal';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
   // backgroundColor: theme.palette.secondary.main,
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    backgroundImage: gradients.yellow,
    height: 48,
    width: 48
  },
  typographyClick: {
    '&:hover': {
      color: theme.palette.secondary.main,
      cursor: 'pointer'
    }
  }
}));

function CreateCours({ coursesCount, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.userData);

  const [openCreateCours, setOpenCreateCours] = useState(false);

  const handleCreateCoursClose = () => {
    setOpenCreateCours(false);
  };

  const handleCreateCoursOpen= () => {
    setOpenCreateCours(true);
  };


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div>
        <Typography
          component="h3"
          gutterBottom
          variant="overline"
        >
          {`${coursesCount} ${t('courses')}`}
        </Typography>

        <div className={classes.details}>

          {
            user.isModerator ?
              <Typography
                variant="h3"
                onClick={handleCreateCoursOpen}
                className={classes.typographyClick}
              >
                {t('create a course')}
              </Typography>
            :
              <Typography
                variant="h3"
                className={classes.typographyClick}
                component={RouterLink}
                to="/cours"
              >
                {t('my courses')}
              </Typography>
          }
        </div>
      </div>
      <Avatar
        className={classes.avatar}
        src={'/images/icons/cours-icon.png'}
      >
        <AirplayIcon />
      </Avatar>

      {
        user.isModerator ?
          <NewCreateCoursModal
            onClose={handleCreateCoursClose}
            open={openCreateCours}
          />
        : null
      }
    </Card>
  );
}

CreateCours.propTypes = {
  className: PropTypes.string
};

export default CreateCours;
