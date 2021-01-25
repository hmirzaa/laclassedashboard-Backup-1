import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing(3)
  },
  image: {
    height: 240,
    backgroundImage: 'url("/images/undraw_empty_xct9.svg")',
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain'
  },
  emptyText: {
    marginTop: theme.spacing(3)
  }
}));

function EmptyPlaceholder({ emptyMessage, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); // {t('notifications')}
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.image} />
      <Typography
        className={classes.emptyText}
        variant="h4"
      >
        {emptyMessage}
      </Typography>
    </div>
  );
}

EmptyPlaceholder.propTypes = {
  className: PropTypes.string
};

export default EmptyPlaceholder;
