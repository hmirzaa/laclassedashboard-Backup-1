import React, { Suspense, useState, useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { useSelector } from 'react-redux';
import { LocalStorage } from '../../services/localstorage.service';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    '@media all and (-ms-high-contrast:none)': {
      height: 0 // IE11 fix
    }
  },
  content: {
    paddingTop: 64,
    flexGrow: 1,
    maxWidth: '100%',
    overflowX: 'hidden',
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: 56
    }
  },
  myContent: {
    paddingTop: 64,
    flexGrow: 1,
    maxWidth: '100%',
    overflowX: 'hidden',
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 0
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: 56
    }
  },
  
}));

function Dashboard({ route }) {
  const classes = useStyles();
  const [openNavBarMobile, setOpenNavBarMobile] = useState(false);
  const user = useSelector((state) => state.user);
  const [IsAuth, setIsAuth] = useState(false);

  useEffect(() => {
      const userToken = LocalStorage.getItem('userToken');
  
      if (!userToken || userToken === '') {
          setIsAuth(false)
      }else{
        setIsAuth(true)
      }
  })

  return (
    <>
      <TopBar onOpenNavBarMobile={() => setOpenNavBarMobile(true)} />
      {IsAuth  ?(
        <NavBar
          onMobileClose={() => setOpenNavBarMobile(false)}
          openMobile={openNavBarMobile}
        />
      ):""}

      <div className={classes.container}>
          <div className={IsAuth ? classes.content : classes.myContent}>

          <Suspense fallback={<LinearProgress />}>
            {renderRoutes(route.routes)}
          </Suspense>
        </div>
      </div>
    </>
  );
}

Dashboard.propTypes = {
  route: PropTypes.object
};

export default Dashboard;
