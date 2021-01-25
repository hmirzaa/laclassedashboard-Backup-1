import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container, Grid } from '@material-ui/core';
import Page from 'src/components/Page';


import Header from './Header';
// import LatestSubscribers from './LatestSubscribers';
// import HomePublicCourses from './HomePublicCourses';
import Joincourse from './Joincourse';
import Currentnews from './Currentnews';
// import NewProjects from './NewProjects';
// import RealTime from './RealTime';
import HelpDesk from './HelpDesk';
import UpComingCourses from './UpComingCourses';
import CreateClasse from './CreateClasse';
//import PerformanceOverTime from './PerformanceOverTime';
import { useSelector } from 'react-redux';
import * as API from '../../services2';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import CreateCours from './CreateCours';
import PublicCours from './PublicCours';
import LoadingElement from '../Loading/LoadingElement'
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  statistics: {
    marginTop: theme.spacing(3)
  },
  notifications: {
    marginTop: theme.spacing(6)
  },
  projects: {
    marginTop: theme.spacing(6)
  },
  todos: {
    marginTop: theme.spacing(6)
  },
  rootPublicClasses: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  header: {
    marginBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  loadingCintainer:{ display: 'flex',
    justifyContent: 'center',
     alignItems: 'center', 
    width: '100%',
    height: '100vh'}
}));

function HomeView() {
  const classes = useStyles();
  const { t } = useTranslation();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [homePageData, setHomePageData] = useState({});
  const [eventData, setEventData] = useState([]);
  const [upComingCoursesData, setUpComingCoursesData] = useState([]);
  const [publicRooms, setPublicRooms] = useState([]) 
  const [status, setStatus] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchHomePageData = async () => {
      await API.getHomePageData(token)
        .then((data) => {
          const { status } = data
          setStatus(status)
          if ( status !== 1 ) return
          if (mounted) {

            setHomePageData(data);
            setEventData(data.data.events)
            setUpComingCoursesData(data.data.upcomingCourses)

            
        
            // let myEvents = data.data.events

            // myEvents.map((event) => {
        
            //   if(event.urlType=="course")
            //   {
                
            //     API.getRoomById(event.room, token)
            //     .then((data) => {

            //       let creator = data.data.creator
            //       let status = data.status

            //       if(status==0 || creator ==undefined)
            //         API.deleteEventById(event._id)

            //     })
            //     .catch((error) => {
            //       console.log(error);
            //     });
            //   }
            // })

                      
    
          }
        })
        .catch((error) => { console.log(error); });

        // API.getHomePageData(token)
        // .then((data) => {
        //   const { status } = data
        //   setStatus(status)
        //   if ( status !== 1 ) return
        //   if (mounted) {
        //     setHomePageData(data);
        //     setEventData(data.data.events)
        //     setUpComingCoursesData(data.data.upcomingCourses)
 
    
        //   }
        // })
        // .catch((error) => { console.log(error); });

    };


 

    fetchHomePageData();

    return () => {
      mounted = false;
    };
  }, []);

  /*if (!user.isModerator) {
    return <Redirect to={`/cours`} />;
  }*/


  return (
    <Page
      className={classes.root}
      title={t('home')}
    >
       { status === 1 ? 
       <Container style={{maxWidth:'revert'}}>
        <Grid container spacing={3} className={classes.grid}>
        
            <Grid item xs={12}>
              <Currentnews propsEvents={eventData} />
            </Grid>
        
            <Grid  item
            lg={4}
            xl={4}
            xs={12}>
              <Joincourse profile={user} />
            </Grid>

            <Grid  item
            lg={8}
            xl={8}
            xs={12}>
              <UpComingCourses upComingCoursesObject={upComingCoursesData} />
            </Grid>
        </Grid>
      </Container> :
      <div className={classes.loadingCintainer}>
        <LoadingElement />
      </div>
      }
    </Page>
  );
}

export default HomeView;
