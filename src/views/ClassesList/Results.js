import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Paper,
  Input,
  Grid,
  Typography
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import Paginate from 'src/components/Paginate';

import ProjectCard from 'src/components/ProjectCard';
import * as API from '../../services2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import EmptyElements from '../Empty/EmptyElements';
import { removeDuplicates } from '../../utils/ListHelper';
import { useTranslation } from 'react-i18next';
import LoadingElement from '../Loading/LoadingElement';
import AddIcon from '@material-ui/icons/Add';
import CreateClassModal from '../Classe/CreateClassModal';
import NewCreateClasseModal from '../newModal/NewCreateClasseModal';


const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    //   marginBottom: theme.spacing(2)
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
    width: '330px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  searchSpace: {

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

  const [mode, setMode] = useState('grid');
  const [classesList, setClassesList] = useState([]);

  //Pagination
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageClasses, setPageClasses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [classesFiltered, setClassesFiltered] = useState([]);
  const pageMaxCount = 9;
  const history = useHistory();


  const [isLoading, setIsLoading] = useState(true);
  const [openCreateClasse, setOpenCreateClasse] = useState(false);

  const handleCreateClasseClose = () => {
    setOpenCreateClasse(false);
  };

  const handleCreateClasseOpen = () => {
    setOpenCreateClasse(true);
  };

  const handlePageClick = data => {
    setIsSearch(false)
    let selected = data.selected;
    const offset = selected * pageMaxCount;
    setOffset(offset);
    setCurrentPage(selected);
    const slice = classesList.slice(offset, offset + pageMaxCount);
    setPageClasses(slice);

  };


  const handleModeChange = (event, value) => {
    setMode(value);
  };

  useEffect(() => {
    let mounted = true;
    const fetchClasses = () => {
      console.log("The Token is::::", token)
      API.getClasses(token)
        .then((classes) => {

          console.log("The Get Classes are ::", classes)
          if (mounted) {
            //Todo need to check why we receive sometimes two elements instead of one
            let { status, data } = classes
            if (status !== 1) return
            var uniqueArray = removeDuplicates(data.classes, "_id");
            setClassesList(uniqueArray);


            const objectArray = Object.entries(uniqueArray);
            objectArray.forEach(([key, value]) => {
              if (value.creator == null) {
                API.deleteClassWithoutTeacher(value._id)
                setIsLoading(true);
              }

            });

            /////////////////////Pagination ////////////////
            setPageCount(Math.ceil(uniqueArray.length / pageMaxCount));
            const slice = uniqueArray.slice(offset, offset + pageMaxCount);
            setPageClasses(slice);

            /////////////////////Pagination ////////////////

            setIsLoading(false);
          }
        })
        .catch((error) => { console.log("The Classssssss))))))))", error); });
    };

    setIsSearch(false);
    fetchClasses();

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
      let filteredArray = classesList.filter(
        (val) =>
          val.schoolName.toLowerCase().indexOf(inputText) != -1 ||
          val.creator?.fullName.toLowerCase().indexOf(inputText) != -1 ||
          val.classeName.toLowerCase().indexOf(inputText) != -1
      );
      { console.log('filteredArray ---> ', filteredArray) }
      setClassesFiltered([...filteredArray]);
    } else {
      setClassesFiltered(classesList);
    }
  };
  console.log("THe Classssss: ", pageClasses)
  return (

    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.header}
      >
        {/* {console.log(classesList)} */}

        <Typography
          className={classes.title}
          variant="h3"
        >
          {
            isLoading ? '...' : pageClasses ? pageClasses.length : '0'
          }
          {' '}
          {t('classes')}
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
                    onClick={handleCreateClasseOpen}
                    style={{ borderRadius: "20px" }}
                  >

                    {t('create a class')}
                    <AddIcon className={classes.addIcon} />
                  </Button>
                  : null
              }
            </div>
          </Grid>

          <Grid item >
            <div>
              <Paper
                className={classes.search}
                elevation={1}
              >
                <div className={classes.searchIcon} />
                <Input
                  className={classes.searchInput}
                  disableUnderline
                  placeholder="Search by title, teacher, name"
                  style={{ fontStyle: 'italic', }}
                  onChange={searchHandler}
                />
                <button type="submit" className="searchButton">
                  <SearchIcon className={classes.searchIcon} />
                </button>
              </Paper>
            </div>
          </Grid>
        </Grid>
      </Grid>

      {
        !isSearch ? (isLoading ? <LoadingElement /> :
          pageClasses.length > 0 ?
            <Grid
              container
              spacing={3}
            >
              {
                pageClasses.map((theClasse) => (
                  <Grid
                    item
                    key={theClasse.id}
                    md={mode === 'grid' ? 4 : 12}
                    sm={mode === 'grid' ? 6 : 12}
                    xs={12}
                  >
                    <ProjectCard theClasse={theClasse} classID={theClasse._id} />
                  </Grid>
                ))
              }
            </Grid>
            :
            <EmptyElements title={t('no class')} description={user.isModerator ? t('create your first class') : t('you are not invited to any class')} />
        ) :
          (isLoading ? <LoadingElement /> :
            classesFiltered.length > 0 ?
              <Grid
                container
                spacing={3}
              >
                {
                  classesFiltered.map((theClasse) => (
                    <Grid
                      item
                      key={theClasse.id}
                      md={mode === 'grid' ? 4 : 12}
                      sm={mode === 'grid' ? 6 : 12}
                      xs={12}
                    >
                      <ProjectCard theClasse={theClasse} classID={theClasse._id} />
                    </Grid>
                  ))
                }
              </Grid>
              :
              <EmptyElements title={t('no class')} description={user.isModerator ? t('create your first class') : t('you are not invited to any class')} />
          )
      }

      
      {
        user.isModerator ?
          <NewCreateClasseModal
            onClose={handleCreateClasseClose}
            open={openCreateClasse}
          />
          : null
      }

      {
        (pageClasses.length > 0 && !isLoading) ?
          <div className={classes.paginate}>
            <Paginate pageCount={pageCount}
              onPageChange={handlePageClick} />
          </div> : null
      }

    </div>
  );
}

Projects.propTypes = {
  className: PropTypes.string
};

export default Projects;
