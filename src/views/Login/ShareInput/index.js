import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent, Grid,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useTranslation } from 'react-i18next';
import SchoolIcon from '@material-ui/icons/School';
import * as API from '../../../services2';
import { useSelector } from 'react-redux';
import SharedCoursCard from './SharedCoursCard';
import SharedPublicCoursCard from './SharedPublicCoursCard';
import LoadingElement from '../../Loading/LoadingElement';
import EmptyPlaceholder from '../../../components/EmptyPlaceholder';
import EmptyElements from 'src/views/Empty/EmptyElements';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor:'#f1f1f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 6),
    '& .MuiPaper-elevation1': {
      boxShadow: '0 0 0 1px #fff, 0 1px 3px 0 #fff'
    }
  },
  card: {
    width: theme.breakpoints.values.sm,
    maxWidth: '100%',
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%'
    }
  },
  content: {
    padding: theme.spacing(8, 4, 3, 4)
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: 'absolute',
    top: -32,
    left: theme.spacing(3),
    height: 64,
    width: 64,
    fontSize: 32
  },
  ReForgetPasswordForm: {
    marginTop: theme.spacing(3),
    marginMargin: theme.spacing(3)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  person: {
    marginTop: theme.spacing(2),
    display: 'flex'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  createAccountBtn: {
    marginTop: theme.spacing(2),
    width: '100%'
  }
}));

function ReForgetPassword() {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const { id } = useParams();

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [room, setRoom] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRoom, setIsRoom] = useState(false);


  useEffect(() => {
    let mounted = true;

    setIsLoading(true);

    // const fetchRoom = () => {
    //   let userID = null;
    //   if (user && user._id) {
    //     userID = user._id;
    //   }
    //   API.getRoomByCode(id, userID)
    //     .then((data) => {
    //       if (mounted) {
    //         setRoom(data);

    //         if (token === '' || token === null) {
    //           setIsAuthenticated(false);
    //         } else {
    //           setIsAuthenticated(true);
    //         }
    //         setIsLoading(false);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // };

    // fetchRoom();

    const fetchRoom = () => {
      let userID = null;
      if (user && user._id) {
        userID = user._id;
      }
      API.getRoomById(id, token)
        .then((data) => {

          if (mounted) {
            setRoom(data);
            const objLength = Object.keys(data.data).length
            if(objLength > 0) {
              setIsRoom(true)
            }
            // console.log('objLength', objLength);

            if(data.isActive == true)
            {
              if(data.creator==null)
              {
                API.deleteCourseWithoutTeacher(id)
                .then((data)=>{
                
                  
                  if(data.status==0)
                    setIsRoom(false)
                })
                .catch((error) => {
                  console.log(error);
                });
              }
            }

            if (token === '' || token === null) {
              setIsAuthenticated(false);
            } else {
              setIsAuthenticated(true);
            }
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchRoom();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <Page className={classes.root} title={t('title share email')}>
          {/* <Grid
            container
            justify="center"
            alignItems="center"
            alignContent='center'
            spacing={15}
           style={{width:'30%', height:'auto'}}
          >
            <Grid
              item
              key={'roomCard'}
              md={12}
              sm={12}
              xs={12}
            > */}
                <Card className={classes.card}>
              {
                isLoading
                  ? <LoadingElement />
                  : isRoom ?
                    room.data.status && token
                      ? <SharedPublicCoursCard courseCode={id} theCours={room ? room : {}} isAuthenticated={isAuthenticated} />
                      : <SharedCoursCard courseCode={id} theCours={room ? room : {}} isAuthenticated={token} />
                  : <EmptyElements title={t('The requested course does not exist!')}  style={{height:'auto', width:'50%'}}/>
              }

            {/* </Grid>
          </Grid> */}

          {/*<ShareForm roomCode={id} className={classes.ShareForm} />*/}
          </Card>
    </Page>
  );
}

export default ReForgetPassword;
