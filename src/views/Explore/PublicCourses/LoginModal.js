import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import LoginView from '../../Login'
import CloseIcon from '@material-ui/icons/Close';
import {
  Modal,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton
} from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    // boxShadow: theme.shadows[20],
    width: 600,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  uploadButton: {
    width: '120px',
    backgroundColor:'#f7b731',
    color: 'white',
    borderRadius:"25px",
    '&:hover': {
      backgroundColor: '#f7b731'
    }
  },
  removeButton: {
    width: '120px',
    backgroundColor: 'black',
    color: 'white',
    borderRadius:"25px",
    '&:hover': {
      backgroundColor: 'black'
    }
  },
  container: {
    marginTop: theme.spacing(3),
    height: 200
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

function LoginModal({
  open, onClose, ...rest
  }) {
  const classes = useStyles();
 

  if (!open) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        // {...rest}
        className={clsx(classes.root)}
      >
       <Grid  container
          direction="row"
          justify="flex-end"
          alignItems="flex-start">
          <IconButton>
            <CloseIcon onClick={onClose}/>
          </IconButton>
      </Grid>
        <Divider />
        <LoginView />
      </Card>
    </Modal>
  );
}

LoginModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

LoginModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default LoginModal;
