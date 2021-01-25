import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Grid, Input, Paper,
  Typography
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import Paginate from 'src/components/Paginate';
import CoursCard from '../../components/CoursCard';
import SearchedCoursCard from '../../components/SearchedCoursCard';
import * as API from '../../services';
import { useSelector } from 'react-redux';
import EmptyElements from '../Empty/EmptyElements';
import LoadingElement from '../Loading/LoadingElement';
import { useTranslation } from 'react-i18next';
import Alert from 'src/components/Alert';
import AddIcon from '@material-ui/icons/Add';
import CreateCoursModal from '../Classe/CreateCoursModal';
import SearchIcon from '@material-ui/icons/Search';
import SearchBar from '../Cours/SearchBar';

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2)
  },
  title: {
    position: 'relative',
    '&:after': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      content: '" "',
      height: 3,
      width: 48,
      backgroundColor: theme.palette.primary.main
    }
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  sortButton: {
    textTransform: 'none',
    letterSpacing: 0,
    marginRight: theme.spacing(2)
  },
  paginate: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  search: {
    flexGrow: 1,
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center'
  },
  rootSearch: {
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  searchInput: {
    flexGrow: 1
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  },
  toggleButton: {
    position: 'relative',
    color: 'grey',
    '& + &:before': {
      color: 'red',
    },
  },
  groupToggle: {
    position: 'relative',
    margin: theme.spacing(2)
  },
}));


function Projects({ className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [mode, setMode] = useState('grid');
  const [rooms, setRooms] = useState([]);

  //Pagination
  const [offset , setOffset] = useState(0);
  const [pageCount , setPageCount] = useState(0);
  const [currentPage , setCurrentPage] = useState(0);
  const [pageRooms, setPageRooms] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [openAlert, setOpenAlert] = useState(true);
  const [infoAlertMessage, setInfoAlertMessage] = useState(t('The following courses are all the courses available on the Laclasse platform.'));

  const pageMaxCount = 9 ;

  const [isLoading, setIsLoading] = useState(true);

  const messageBody = user.isModerator ? t('create your first course') : t('Your teacher has not scheduled any lessons for you.');

  const [coursTypes, setCoursTypes] = useState({
    coursTypeValue: 'allCourses'
  });
  const [emptyMessage, setEmptyMessage] = useState(t('no courses'));
  const [emptySubMessage, setEmptySubMessage] = useState(messageBody);
  const [coursesCount, setCoursesCount] = useState(0);

  const handleFieldChange = (event, field, value) => {
    if (event) {
      event.persist();
    }

    setCoursTypes((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleCoursType = (event, value) => {
    setIsLoading(true);

    setEmptyMessage(t('no courses'));
    setEmptySubMessage(messageBody);
    setInfoAlertMessage(t('Cours alert browser'));

    let searchType = '';

    if (value === 'publicCourses') {
      setInfoAlertMessage(t('The following list corresponds to my own public lessons.'));
      searchType = 'publicRooms';

    } else if (value === 'subscribedCourses') {
      setEmptyMessage(t('no subscription'));
      setEmptySubMessage(t('here you will find the list of courses to which you have subscribed.'));
      setInfoAlertMessage(t('The following courses are all public courses in which I participate.'));
      searchType = 'subscribedRooms';
    } else {
      setInfoAlertMessage(t('The following courses are all the courses available on the Laclasse platform.'));
      API.getAllPublicRooms(token)
        .then((rooms) => {
          const allRooms = (rooms.reverse());
          setRooms(allRooms);

          /////////////////////Pagination ////////////////
          setPageCount(Math.ceil(allRooms.length / pageMaxCount));
          const slice = allRooms.slice(offset, offset + pageMaxCount);
          setPageRooms(slice);
          /////////////////////Pagination ////////////////
          setIsLoading(false);

          setCoursesCount(rooms.length);
        })
        .catch((error) => {
          setIsLoading(false);
        });

      return true;
    }

    API.getRooms(searchType, token)
      .then((rooms) => {

        let allRooms;

        if (value === 'publicCourses') {
          let _publicRooms = rooms.PublicRooms || [];
          allRooms = (_publicRooms.reverse());
          setCoursesCount(_publicRooms.length);

        } else if (value === 'subscribedCourses') {
          let _subscribedRooms = rooms.SubscribedRooms || [];
          allRooms = (_subscribedRooms.reverse());
          setCoursesCount(_subscribedRooms.length);
        }
        setRooms(allRooms);

        /////////////////////Pagination ////////////////
        setPageCount(Math.ceil(allRooms.length / pageMaxCount));
        const slice = allRooms.slice(offset, offset + pageMaxCount);
        setPageRooms(slice);
        /////////////////////Pagination ////////////////
        setIsLoading(false);

      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleClear = () => {
    window.location.reload();
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const handleFilter = (values) => {
    if (values.roomName.trim() === '' && values.profName.trim() === '') {
      window.location.reload();
    }

    setIsLoading(true);

    setIsSearching(true);


    let data = {
      roomName: values.roomName,
      profName: values.profName,
      searchType: 'publicCourses'
    };

    API.searchRooms(data, token)

      .then(response => {
        const allRooms = (response.Rooms.reverse());
        setRooms(allRooms);

        /////////////////////Pagination ////////////////
        setPageCount(Math.ceil(allRooms.length / pageMaxCount));
        const slice = allRooms.slice(offset, offset + pageMaxCount);
        setPageRooms(slice);
        /////////////////////Pagination ////////////////

        setIsLoading(false);
      })

      .catch(error => {
        setIsLoading(false);
      });
  };

  const handlePageClick = data => {
    let selected = data.selected;
    const offset = selected * pageMaxCount;
    setOffset(offset);
    setCurrentPage(selected);
    const slice = rooms.slice(offset, offset + pageMaxCount);
    setPageRooms(slice);

  };

  useEffect(() => {
    let mounted = true;

    const fetchRooms = () => {
      API.getAllPublicRooms(token)
        .then((rooms) => {
          if (mounted) {

            const allRooms = (rooms.reverse());
            setRooms(allRooms);

            /////////////////////Pagination ////////////////
             setPageCount(Math.ceil(allRooms.length / pageMaxCount));
            const slice = allRooms.slice(offset, offset + pageMaxCount);
            setPageRooms(slice);
            /////////////////////Pagination ////////////////
            setIsLoading(false);

            setCoursesCount(rooms.length);
          }
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    setIsSearching(false);
    fetchRooms();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      {...rest}
      className={clsx(classes.root,  className)}
    >
      <div className={classes.header}>
        <Typography
          className={classes.title}
          variant="h3"
        >
          {
            isLoading ? '...' : coursesCount
          }
          {' '}
          {t('public courses')}
        </Typography>

        <div className={classes.formGroup}>
          <ToggleButtonGroup
            exclusive
            onChange={(event, value) => value && handleFieldChange(event, 'coursTypeValue', value)}
            size="small"
            className={classes.groupToggle}
            value={coursTypes.coursTypeValue}

            variant="outlined"
          >
            <ToggleButton
              value="allCourses"
              className={classes.toggleButton}
              onClick={handleCoursType}
            >
              {t('all')}
            </ToggleButton>

            {
              user.isModerator ?
                <ToggleButton
                  value="publicCourses"
                  className={classes.toggleButton}
                  onClick={handleCoursType}
                >
                  {t('my public courses')}
                </ToggleButton>
                : null
            }

            <ToggleButton
              className={classes.toggleButton}
              value="subscribedCourses"
              onClick={handleCoursType}
            >
              {t('my subscriptions')}
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className={classes.actions}>
          <SearchBar
            onFilter={handleFilter}
            onClear={handleClear}
            isPublicCours={'true'}
          />
        </div>
      </div>

      {
        openAlert ? (
          <Alert
            className={classes.alert}
            style={{marginBottom: '20px'}}
            variant = "info"
            message={infoAlertMessage}
            onClose={handleAlertClose}
          />
        ) : null
      }

      {
        isLoading ? <LoadingElement /> :
          pageRooms.length > 0 ?
            <Grid
              container
              spacing={3}
            >
              {
                pageRooms.map((room) => (
                  <Grid
                    item
                    key={room._id}
                    md={mode === 'grid' ? 4 : 12}
                    sm={mode === 'grid' ? 6 : 12}
                    xs={12}
                  >
                    {
                      room.isPublicSearch ?
                        <SearchedCoursCard theCours={room} />
                        :
                        <CoursCard theCours={room} />
                    }

                  </Grid>
                ))
              }
            </Grid>
            :
            <EmptyElements
              title={emptyMessage}
              description={emptySubMessage}
            />
      }


      {
        pageRooms.length > 0 &&  !isLoading ?
          <div className={classes.paginate}>
            <Paginate pageCount={pageCount}
                      onPageChange={handlePageClick} />
          </div>
          : null
      }
    </div>
  );
}

Projects.propTypes = {
  className: PropTypes.string
};

export default Projects;
