import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card, Typography, Avatar
} from '@material-ui/core';

//import CallToActionIcon from '@material-ui/icons/CallToAction';

import PublicIcon from '@material-ui/icons/Public';

import gradients from 'src/utils/gradients';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

function PublicCours({ publicCoursesCount, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation();

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
          {`${publicCoursesCount} ${t('courses')}`}
        </Typography>

        <div className={classes.details}>
          <Typography
            variant="h3"
            component={RouterLink}
            to="/cours/public"
            className={classes.typographyClick}
          >
            {t('public courses')}
          </Typography>
        </div>
      </div>
      <Avatar className={classes.avatar}>
        <PublicIcon />
      </Avatar>
    </Card>
  );
}

PublicCours.propTypes = {
  className: PropTypes.string
};

export default PublicCours;
