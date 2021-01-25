import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  learnMoreButton: {
    width: '100%',
    color: 'white',
    fontSize: "12px",
    justifyContent: 'revert',
    backgroundColor: '#c30d0d',
    '&:hover': {
      backgroundColor: '#c30d0d'
    }
  },
  ArrowButton: {
    flexGrow: 1,
    fontSize:'20px',
    textAlign: 'left'
  },
}));

function NoRequest({ className, onSubmitSuccess, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (   
        <form
          className={clsx(classes.root, className)}
      //    onSubmit={handleSubmit}
          {...rest}
        >
        <Grid item xs={12}>
          <Grid container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <img src={window.location.origin +"/static/images/icons/emptyElement.png"}></img>
            <Typography variant="h1" style={{color:'#c30d0d'}}>
                No Request is available
            </Typography>
          </Grid>
        </Grid> 
      </form>
  );
}

// LoginForm.propTypes = {
//   className: PropTypes.string,
//   onSubmitSuccess: PropTypes.func
// };

// LoginForm.defaultProps = {
//   onSubmitSuccess: () => {}
// };

export default NoRequest;
