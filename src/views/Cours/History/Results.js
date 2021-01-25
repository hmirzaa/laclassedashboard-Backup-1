import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Typography
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import Paginate from 'src/components/Paginate';
import CoursCard from '../../../components/CoursCard';
import * as API from '../../../services';
import { useSelector } from 'react-redux';
import EmptyElements from '../../Empty/EmptyElements';
import { useTranslation } from 'react-i18next';
import LoadingElement from '../../Loading/LoadingElement';

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
  }
}));


function Projects({ className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);

  const [mode, setMode] = useState('grid');
  const [rooms, setRooms] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  //Pagination
  const [offset , setOffset] = useState(0);
  const [pageCount , setPageCount] = useState(0);
  const [currentPage , setCurrentPage] = useState(0);
  const [pageRooms, setPageRooms] = useState([]);

  const pageMaxCount = 9 ;

  const handlePageClick = data => {
    let selected = data.selected;
    const offset = selected * pageMaxCount;
    setOffset(offset);
    setCurrentPage(selected);
    const slice = rooms.slice(offset, offset + pageMaxCount);
    setPageRooms(slice);

  };

  const handleModeChange = (event, value) => {
    setMode(value);
  };
  useEffect(() => {
    let mounted = true;

    const fetchRooms = () => {
      API.getRooms('archivedRooms', token)
        .then((rooms) => {
          if (mounted) {

            let archivedRooms = rooms.ArchivedRooms || [];
            const allRooms = (archivedRooms.reverse());
            setRooms(allRooms);

            /////////////////////Pagination ////////////////
             setPageCount(Math.ceil(allRooms.length / pageMaxCount));
            const slice = allRooms.slice(offset, offset + pageMaxCount);
            setPageRooms(slice);
            /////////////////////Pagination ////////////////

            setIsLoading(false);
          }
        })
        .catch((error) => { console.log(error); });
    };

    fetchRooms();

    return () => {
      mounted = false;
    };
  }, [token]);

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
            isLoading ? '...' : pageRooms ? pageRooms.length : '0'
          }
          {' '}
          {t('archived courses')}
        </Typography>
        <div className={classes.actions}>
          <ToggleButtonGroup
            exclusive
            onChange={handleModeChange}
            size="small"
            value={mode}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>


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
                    <CoursCard theCours={room} />

                  </Grid>
                ))
              }
            </Grid>
            :
            <EmptyElements title={t('no archived course')} description={''} />
      }


      {
        (pageRooms.length > 0 && !isLoading ) ?
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
