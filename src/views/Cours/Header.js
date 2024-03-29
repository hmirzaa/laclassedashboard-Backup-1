import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateCoursModal from '../Classe/CreateCoursModal';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NewCreateCoursModal from '../newModal/NewCreateCoursModal';

const useStyles = makeStyles((theme) => ({
  root: {},
  addIcon: {
    marginRight: theme.spacing(1)
  }
}));

function Header({ className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const user = useSelector((state) => state.user.userData);

  const [openCreateCours, setOpenCreateCours] = useState(false);

  const handleCreateCoursClose = () => {
    setOpenCreateCours(false);
  };

  const handleCreateCoursOpen= () => {
    setOpenCreateCours(true);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >

        
     
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
