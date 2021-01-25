import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  colors,
  Typography,
  Checkbox
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

import * as API from '../../services';
import { useSelector } from 'react-redux';
import EmptyElements from '../Empty/EmptyElements';
import RemoveStudentModal from './RemoveStudentModal';
import { useTranslation } from 'react-i18next';
import Paginate from '../../components/Paginate';
import Spinner from 'react-bootstrap/Spinner';
import { ErrorSnackbar } from '../Snackbars';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingTop: 0
  },
  search: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    color: theme.palette.text.secondary
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '14px'
  },
  avatar: {
    height: 60,
    width: 60
  },
  listItem: {
    flexWrap: 'wrap'
  },
  listItemText: {
    marginLeft: theme.spacing(2)
  },
  connectButton: {
    marginLeft: 'auto'
  },
  pendingButton: {
    marginLeft: 'auto',
    color: theme.palette.common.white,
    backgroundColor: colors.grey[600],
    '&:hover': {
      backgroundColor: colors.grey[900]
    }
  },
  connectedButton: {
    marginLeft: 'auto',
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  removeButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    }
  },
  acceptButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  paginate: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  selectAllCheckbox: {
    paddingLeft: theme.spacing(3),
    display: 'flex',
    alignItems: 'center'
  },
  acceptAllButton: {
    display: 'flex',
    alignItems: 'right'
  }
}));

//TODO change the position to helper to use it everywhere Function to get INITIAL
var getInitials = function (string) {
    var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

function Subscribers({ className, roomId, room, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [isLoading, setIsLoading] = useState(true);

  //Pagination
  const [offset , setOffset] = useState(0);
  const [pageCount , setPageCount] = useState(0);
  const [currentPage , setCurrentPage] = useState(0);
  const [pageStudents, setStudents] = useState([]);

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [isAcceptButton, setIsAcceptButton] = useState(false);
  const [isRefuseButton, setIsRefuseButton] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, serErrorMessage] = useState(t('something went wrong'));

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [disableAcceptAllButton, setDisableAcceptAllButton] = useState(false);
  const [isLoadingAcceptAllButton, setIsLoadingAcceptAllButton] = useState(false);

  const [disableRefuseAllButton, setDisableRefuseAllButton] = useState(false);
  const [isLoadingRefuseAllButton, setIsLoadingRefuseAllButton] = useState(false);

  const pageMaxCount = 20 ;


  const handlePageClick = data => {
    let selected = data.selected;
    const offset = selected * pageMaxCount;
    setOffset(offset);
    setCurrentPage(selected);
    const slice = pageStudents.slice(offset, offset + pageMaxCount);
    setStudents(slice);

  };

  const handleSubscriptions = (accept, userID) => {
    API.handleSubscriptionsToRoom(roomId, userID, accept, token)
      .then((response) => {

        if (response.isRoomFull) {
          setOpenSnackbar(true);
          serErrorMessage(t('the maximum participants per course is 80'));
          setIsAcceptButton(false);
          setIsRefuseButton(false);
          setDisabledButtons([]);
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        setIsAcceptButton(false);
        setIsRefuseButton(false);
        setDisabledButtons([]);
      });

  };

  const handleStudentAccept = (userID) => {
    setIsAcceptButton(true);
    handleSubscriptions(true, userID);
  };

  const handleStudentRefuse = (userID) => {
    setIsRefuseButton(true);
    handleSubscriptions(false, userID);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Search
  const handleStudentSearch = (event) => {
    //event.persist();
    const query = event.target.value;
    const newquery = query.replace(/ /g,'');
    const results = pageStudents.filter(participant => {
      return Object.keys(participant).some(key =>
        participant[key].toString().toLowerCase().includes(newquery)
      );
    });
    /////////////////////Pagination ////////////////
    setPageCount(Math.ceil(results.length / pageMaxCount));
    const slice = results.slice(offset, offset + pageMaxCount);
    setStudents(slice);
    /////////////////////Pagination ////////////////
  };

  useEffect(() => {
    let mounted = true;
    const fetchRoomSubscribers = () => {
      let subscribersObject = room.subscribers || [];
      /////////////////////Pagination ////////////////
      setPageCount(Math.ceil(subscribersObject.length / pageMaxCount));
      const slice = subscribersObject.slice(offset, offset + pageMaxCount);
      setStudents(slice);
      /////////////////////Pagination ////////////////

      setIsLoading(false);
    };

    fetchRoomSubscribers();

    return () => {
      mounted = false;
    };
  }, [room]);

  const handleSelectAll = (event) => {
    const selectedStudents = event.target.checked
      ? pageStudents.map((customer) => customer.id)
      : [];

    setSelectedStudents(selectedStudents);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedStudents.indexOf(id);
    let newSelectedStudents = [];

    if (selectedIndex === -1) {
      newSelectedStudents = newSelectedStudents.concat(selectedStudents, id);
    } else if (selectedIndex === 0) {
      newSelectedStudents = newSelectedStudents.concat(
        selectedStudents.slice(1)
      );
    } else if (selectedIndex === selectedStudents.length - 1) {
      newSelectedStudents = newSelectedStudents.concat(
        selectedStudents.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedStudents = newSelectedStudents.concat(
        selectedStudents.slice(0, selectedIndex),
        selectedStudents.slice(selectedIndex + 1)
      );
    }

    setSelectedStudents(newSelectedStudents);
  };

  const handleAllSubscriptions = (accept) => {

    let userIDs = selectedStudents.toString();

    API.handleManySubscriptionsToRoom(roomId, userIDs, accept, token)
      .then((response) => {

        if (response.isRoomFull) {
          // Accept All Button
          setDisableAcceptAllButton(false);
          setIsLoadingAcceptAllButton(false);

          // Refuse All Button
          setDisableRefuseAllButton(false);
          setIsLoadingRefuseAllButton(false);

          setOpenSnackbar(true);
          serErrorMessage(t('the maximum participants per course is 80'));
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        // Accept All Button
        setDisableAcceptAllButton(false);
        setIsLoadingAcceptAllButton(false);

        // Refuse All Button
        setDisableRefuseAllButton(false);
        setIsLoadingRefuseAllButton(false);
      });

  };

  const handleStudentAcceptAll = () => {

    if (selectedStudents.length === 0) {
      return false;
    }
    setDisableAcceptAllButton(true);
    setDisableRefuseAllButton(true);
    setIsLoadingAcceptAllButton(true);
    handleAllSubscriptions(true);
  };

  const handleStudentRefuseAll = () => {

    if (selectedStudents.length === 0) {
      return false;
    }
    setDisableRefuseAllButton(true);
    setDisableAcceptAllButton(true);
    setIsLoadingRefuseAllButton(true);
    handleAllSubscriptions(false);
  };


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Divider />
      <div className={classes.search}>
        <SearchIcon
          className={classes.searchIcon}
          color="inherit"
        />
        <Input
          className={classes.searchInput}
          disableUnderline
          placeholder={t('search')}
          onChange={handleStudentSearch}
        />
      </div>
      <Divider />

      <Divider />
      <CardContent className={classes.content}>

        {
          (room.creator === user._id && pageStudents && !isLoading && pageStudents.length > 0) ?
            <List disablePadding>
              <ListItem
                className={classes.listItem}
                disableGutters
                divider
                key={"SubsHeader"}
              >
                <Checkbox
                  checked={selectedStudents.length === pageStudents.length}
                  color="primary"
                  indeterminate={
                    selectedStudents.length > 0
                    && selectedStudents.length < pageStudents.length
                  }
                  onChange={handleSelectAll}
                />

                <ListItemText
                  primary={'Select all'}
                />

                <Button
                  className={classes.acceptButton}
                  size="small"
                  variant="contained"
                  onClick={() => {handleStudentAcceptAll();}}
                  disabled={disableAcceptAllButton}
                >
                  {
                    isLoadingAcceptAllButton ?
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      :
                      t('Accept All')
                  }
                </Button>

                <Button
                  className={classes.removeButton}
                  size="small"
                  variant="contained"
                  onClick={() => {handleStudentRefuseAll();}}
                  disabled={disableRefuseAllButton}
                >
                  {
                    isLoadingRefuseAllButton ?
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      :
                      t('Refuse All')
                  }
                </Button>

              </ListItem>
            </List>

            : null
        }

        {(pageStudents && !isLoading && pageStudents.length > 0) ?
          <PerfectScrollbar>
            <List disablePadding>
              {pageStudents ? pageStudents.map((connection, i) => (
                room.creator === connection._id ? null :
                  <ListItem
                    className={classes.listItem}
                    disableGutters
                    divider={i < pageStudents.length - 1}
                    key={connection._id}
                  >
                    {
                      room.creator === user._id ?
                        <Checkbox
                          checked={
                            selectedStudents.indexOf(connection._id) !== -1
                          }
                          color="primary"
                          onChange={(event) => handleSelectOne(event, connection._id)}
                          value={selectedStudents.indexOf(connection._id) !== -1}
                        />
                      :
                        null
                    }

                    <ListItemAvatar>
                      <Avatar
                        alt="Profile"
                        className={classes.avatar}
                        // component={RouterLink}
                        src={connection.profileImage && connection.profileImage !== '' ? connection.profileImage : null}
                      >
                        { getInitials(connection.fullName) }

                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      className={classes.listItemText}
                      primary={connection.fullName}
                      secondary={
                        room.creator === user._id ?
                          <Typography variant="body2">
                            {connection.email}
                            <br/>
                            {connection.phone}
                          </Typography>
                        :
                          null
                      }
                    />

                    {
                      room.creator === user._id ?
                        <Button
                          className={classes.acceptButton}
                          size="small"
                          variant="contained"
                          onClick={() => {setDisabledButtons([connection._id]); handleStudentAccept(connection._id);}}
                          disabled={disabledButtons.indexOf(connection._id) !== -1}
                        >
                          {
                            isAcceptButton &&  (disabledButtons.indexOf(connection._id) !== -1) ?
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              :
                              <CheckIcon />
                          }
                        </Button>
                      :
                        null
                    }

                    {
                      room.creator === user._id ?
                        <Button
                          className={classes.removeButton}
                          size="small"
                          variant="contained"
                          onClick={() => {setDisabledButtons([connection._id]); handleStudentRefuse(connection._id);}}
                          disabled={disabledButtons.indexOf(connection._id) !== -1}
                        >
                          {
                            isRefuseButton && (disabledButtons.indexOf(connection._id) !== -1) ?
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              :
                              <ClearIcon />
                          }
                        </Button>
                      :
                        null
                    }

                  </ListItem>
              )) : null}
            </List>
          </PerfectScrollbar>
          : !isLoading ?
            <EmptyElements title={''} description={t('there is no pending participants')}/>
            : null }

        {
          (pageStudents.length > 19 && !isLoading  ) ?
            <div className={classes.paginate}>
              <Paginate pageCount={pageCount}
                        onPageChange={handlePageClick} />
            </div> : null
        }

      </CardContent>

      <ErrorSnackbar
        errorMessage={errorMessage}
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />

    </Card>
  );
}

Subscribers.propTypes = {
  className: PropTypes.string
};

export default Subscribers;
