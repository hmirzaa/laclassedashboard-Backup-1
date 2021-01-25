import React, {
  useRef,
  useState
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { logout } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  ButtonBase,
  Button,
  Hidden,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1)
  },
  popover: {
    width: 200
  }
}));

function Account() {
  const classes = useStyles();
  const history = useHistory();
  const ref = useRef(null);
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout= () =>{
    dispatch(logout(logout));
    history.push('/auth/login');
  }
 

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        ref={ref}
      >
        <Hidden smDown>
         
          <Button
            color="inherit"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Hidden>
      </Box>
    </>
  );
}

export default Account;
