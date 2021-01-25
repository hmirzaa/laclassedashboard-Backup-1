import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing(3)
  },
  image: {
    //height: 240,
    // backgroundImage: 'url("/images/icons/noevents.png")',
    // backgroundPositionX: 'right',
    //backgroundPositionY: 'center',
    //backgroundRepeat: 'no-repeat',
    //backgroundSize: 'cover'
  },
  outlinedIcon: {
    color: theme.palette.secondary.main,
    fontSize: 140
  },
  emptyimage:{
    height:'auto',
    width:'35%'
  }
}));

function EmptyElements({ className, title, description, ...rest }) {
  const classes = useStyles();


  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.image} />
      {/* <InfoOutlinedIcon className={classes.outlinedIcon} /> */}
      <img src={window.location.origin + "/images/icons/emptyElement.png"} className={classes.emptyimage}></img>
      <Typography variant="h2" style={{marginTop:'10px'}}>{title} </Typography>
      <Typography variant="caption" type="caption">
        {description}
      </Typography>
    </div>
  );
}

EmptyElements.propTypes = {
  className: PropTypes.string
};

export default EmptyElements;
