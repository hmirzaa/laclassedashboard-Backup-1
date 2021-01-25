import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card, Typography, Avatar, colors
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CallToActionIcon from '@material-ui/icons/CallToAction';
import Label from 'src/components/Label';
import gradients from 'src/utils/gradients';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateClassModal from '../Classe/CreateClassModal';
import { useSelector } from 'react-redux';
import NewCreateClasseModal from './../newModal/NewCreateClasseModal';
import * as API from '../../services';

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

function CreateClasse({ classesCount, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const user = useSelector((state) => state.user.userData);

  const [openCreateClasse, setOpenCreateClasse] = useState(false);


  const handleCreateClasseClose = () => {
    setOpenCreateClasse(false);
  };

  const handleCreateClasseOpen= () => {
    setOpenCreateClasse(true);
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
          {`${classesCount} ${t('classes')}`}
        </Typography>

        {
          user.isModerator ?
            <div className={classes.details}>
              <Typography
                variant="h3"
                onClick={handleCreateClasseOpen}
                className={classes.typographyClick}
              >
                {t('create a class')}
              </Typography>
            </div>
          :
            <div className={classes.details}>
              <Typography
                variant="h3"
                className={classes.typographyClick}
                component={RouterLink}
                to="/classes"
              >
                {t('my classes')}
              </Typography>
            </div>
        }
      </div>

      <Avatar
        className={classes.avatar}
        src={'/images/icons/classe-icon.png'}
      >
        <CallToActionIcon />
      </Avatar>

      {
        user.isModerator ?
          <NewCreateClasseModal
            onClose={handleCreateClasseClose}
            open={openCreateClasse}
          />
        : null
      }
    </Card>
  );
}

CreateClasse.propTypes = {
  className: PropTypes.string
};

export default CreateClasse;
