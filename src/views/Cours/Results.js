import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { PrivetCourseCapitalizeCase } from '../../utils/commanFun';
import {
  Button,
  Grid, Input, Paper,
  Typography
} from '@material-ui/core';

import Paginate from 'src/components/Paginate';
import CoursCard from '../../components/CoursCard';
import * as API from '../../services2';
import { useSelector } from 'react-redux';

import EmptyElements from '../Empty/EmptyElements';
import LoadingElement from '../Loading/LoadingElement';
import { removeDuplicates } from '../../utils/ListHelper';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import CreateCoursModal from '../Classe/CreateCoursModal';
import NewCreateCoursModal from '../newModal/NewCreateCoursModal';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6)
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

  rootSearch: {
    display: 'flex',
    alignItems: 'center'
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
  search: {
    flexGrow: 1,
    height: 42,
    width: '330px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },

  searchInput: {
    flexGrow: 1,
    placeholder: '#afaaaa',
    marginRight: theme.spacing(3),
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  }
}));


function Projects({ className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const messageBody = user.isModerator ? t('create your first course') : t('Your teacher has not scheduled any lessons for you.');


  const [rooms, setRooms] = useState([]);
  const [roomsFiltered, setRoomsFiltered] = useState([]);

  //Pagination
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [pageRooms, setPageRooms] = useState([]);


  // const [emptySubMessage, setEmptySubMessage] = useState(messageBody);


  const [coursesCount, setCoursesCount] = useState(0);

  const pageMaxCount = 9;


  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [openCreateCours, setOpenCreateCours] = useState(false);

  const [openCreateCoursModal, setOpenCreateCoursModal] = useState(false);




  const handleCreateCoursClose = () => {
    setOpenCreateCours(false);
  };

  const handleCreateCoursOpen = () => {
    setOpenCreateCours(true);
  };



  const handlePageClick = data => {
    console.log('data', data)
    let selected = data.selected;
    const offset = selected * pageMaxCount;
    setOffset(offset);

    const slice = rooms.slice(offset, offset + pageMaxCount);
    setPageRooms(slice);
  };


  // const handleFilter = (values) => {
  //   if (values.roomName.trim() === '' && values.profName.trim() === '') {
  //     window.location.reload();
  //   }

  //   setIsLoading(true);

  //   if (values.searchCoursType === 'publicCourses') {
  //     setIsSearching(true);
  //   } else {
  //     setIsSearching(false);
  //   }


  //   let data = {
  //     roomName: values.roomName,
  //     profName: values.profName,
  //     searchType: values.searchCoursType
  //   };

  //   API.searchRooms(data, token)

  //     .then(response => {
  //       const allRooms = (response.Rooms.reverse());
  //       setRooms(allRooms);s

  //       /////////////////////Pagination ////////////////
  //       setPageCount(Math.ceil(allRooms.length / pageMaxCount));
  //       const slice = allRooms.slice(offset, offset + pageMaxCount);
  //       setPageRooms(slice);
  //       /////////////////////Pagination ////////////////

  //       setIsLoading(false);
  //     })

  //     .catch(error => {
  //       setIsLoading(false);
  //     });
  // };

  useEffect(() => {
    let mounted = true;

    const fetchRooms = () => {
      API.getRooms(token)
        .then((rooms) => {
          if (mounted) {
            let _allRooms = removeDuplicates(rooms.data.results, '_id') || [];
            let get_Rooms = _allRooms.filter((value) => {
              return value.isActive == true
            })
            // const allRooms = get_Rooms.reverse();
            const allRooms = get_Rooms
            setRooms(PrivetCourseCapitalizeCase(allRooms));


            const objectArray = Object.entries(allRooms);
            objectArray.forEach(([key, value]) => {
              if (value.creator == null) {
                API.deleteCourseWithoutTeacher(value._id)
                setIsLoading(true);
              }
            });
           
            /////////////////////Pagination ////////////////
            setPageCount(Math.ceil(allRooms.length / pageMaxCount));
            const slice = allRooms.slice(offset, offset + pageMaxCount);
            setPageRooms(slice);
            /////////////////////Pagination ////////////////
            setIsLoading(false);
            
            setCoursesCount(_allRooms.length);
          }
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    // setIsSearching(false);
    fetchRooms();

    return () => {
      mounted = false;
    };
  }, []);

  const searchHandler = (e) => {
    setIsSearch(true)
    if (!e.target.value) {
      setIsSearch(false)
    }
    let inputText = e.target.value.toLowerCase();
    console.log('inputTextinputText', inputText)
    if (inputText.length) {
      let filteredArray = rooms.filter(
        (val) =>
          val.roomName.toLowerCase().indexOf(inputText) !== -1 ||
          val.category && val.category.name.toLowerCase().indexOf(inputText) != -1 ||
          val.creator.fullName.toLowerCase().indexOf(inputText) != -1
      );
      { console.log('filteredArray ---> ', filteredArray) }
      setRoomsFiltered([...filteredArray]);
    } else {
      setRoomsFiltered(rooms);
    }
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      {console.log('pageRooms ---> ', pageRooms)}
      <div className={classes.header} >

        <Typography
          className={classes.title}
          variant="h3"
        >
          {
            isLoading ? '...' : coursesCount
          }
          {' '}
          {t('courses')}
        </Typography>


      </div>
      <Grid item xs={12}>
        <Grid container
          spacing={3}
          direction="row"
          justify="space-between"
          // alignItems="center"
          style={{ marginBlockEnd: "20px", marginTop: '40px' }}
        >
          <Grid item >
            <div className={classes.actions}>
              {
                user.isModerator ?
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleCreateCoursOpen}
                    style={{ borderRadius: "20px" }}
                  >

                    {t('create a course')}
                    <AddIcon className={classes.addIcon} />
                  </Button>
                  : null
              }
            </div>

          </Grid>
          <Grid item>
            <div>
              <Paper
                className={classes.search}
                elevation={1}
              // style={{padding:"revert"}}
              >
                <div className={classes.searchIcon} />
                <Input
                  className={classes.searchInput}
                  disableUnderline
                  placeholder="Search by title, teacher, name, category"
                  onChange={searchHandler}
                  style={{ fontStyle: 'italic', }}
                />
                <button type="submit" class="searchButton">
                  <SearchIcon className={classes.searchIcon} />
                </button>
              </Paper>
            </div>
          </Grid>
        </Grid>
      </Grid>

      {/*
      openAlert ? (
        <Alert
          className={classes.alert}
          style={{marginBottom: '20px'}}
          variant = "info"
          message={infoAlertMessage}
          onClose={handleAlertClose}
        />
      ) : null
    */}




      {
        !isSearch ? (isLoading ? <LoadingElement /> :
          pageRooms.length > 0 ?
            <Grid
              spacing={3}
              container
              direction="row"
            >
              {
                pageRooms.map((room) => (
                  <Grid
                    item
                    key={room._id}
                    md={4}
                    sm={6}
                    xs={12}
                    md={4}
                    lg={4}
                  >
                    <CoursCard theCours={room} />

                  </Grid>
                ))
              }
            </Grid>
            :
            <EmptyElements
              title={t('no courses')}
              description={messageBody}
            />)

          : (isLoading ? <LoadingElement /> :
            pageRooms.length > 0 ?
              <Grid
                spacing={3}
                container
                direction="row"
              >
                {
                  roomsFiltered.map((room) => (
                    <Grid
                      item
                      key={room._id}
                      md={4}
                      sm={6}
                      xs={12}
                      md={4}
                      lg={4}
                    >
                      <CoursCard theCours={room} />

                    </Grid>
                  ))
                }
              </Grid>
              :
              <EmptyElements
                title={t('no courses')}
                description={messageBody}
              />)
      }


      {
        user.isModerator ?
          <NewCreateCoursModal
            onClose={() => handleCreateCoursClose(false)}
            open={openCreateCours}
          />
          : null
      }

      {/* <SearchedCoursCard theCours={rooms} /> */}
      {/* <CoursCard theCours={rooms} /> */}

      {/* {
        pageRooms.length > 0 &&  !isLoading ?
          <div className={classes.paginate}>
            <Paginate pageCount={pageCount}
                      onPageChange={handlePageClick} />
                     { console.log('pageCount', pageCount)}
          </div>
          : null
      } */}

      {
        (pageRooms.length > 0 && !isLoading) ?
          <div className={classes.paginate}>
            <Paginate pageCount={pageCount}
              onPageChange={handlePageClick} />
          </div> : null
      }

      <CreateCoursModal
        onClose={() => setOpenCreateCoursModal(false)}
        open={openCreateCoursModal}
      />
    </div>
  );
}

Projects.propTypes = {
  className: PropTypes.string
};

export default Projects;


// Private Course : - i found it only in my courses - i can be partipant there if teachers or owner invited me to this cours through class ( if yes i will show the course in my courses ) - i can't partipate in private course with button only invitation
// Public Course : - i found it in explore - if i click under participate button -> course need to visible too in my courses and explore ( with start button ) - i cannot invited sameone to public course they need to click under participate to participate to this course
// i try to sumarize again !