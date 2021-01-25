import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip, colors
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import getInitials from 'src/utils/getInitials';
import Spinner from 'react-bootstrap/Spinner';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import * as API from '../../services';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ErrorSnackbar } from '../Snackbars';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  author: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(1)
  },
  tags: {
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  },
  actions: {
    justifyContent: 'flex-end'
  },
  arrowForwardIcon: {
    marginLeft: theme.spacing(1)
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
}));

function LatestSubscribers({ latestSubscribersObject, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);

  const [disabledButtons, setDisabledButtons] = useState([]);
  const [isAcceptButton, setIsAcceptButton] = useState(false);
  const [isRefuseButton, setIsRefuseButton] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, serErrorMessage] = useState(t('something went wrong'));

  const handleSubscriptions = (accept, userID) => {
    API.handleSubscriptionsToRoom(latestSubscribersObject.roomID, userID, accept, token)
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

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title={t('Latest Course Subscribers')}
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar options={{ suppressScrollY: true }}>
          <div className={classes.inner}>
            {
              latestSubscribersObject.subscribers && latestSubscribersObject.subscribers.length > 0 ?
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sortDirection="desc">
                        <Tooltip
                          enterDelay={300}
                          title="Sort"
                        >
                          <TableSortLabel
                            active
                            direction="desc"
                          >
                            {t('course name')}
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>

                      <TableCell>{t('Participant')}</TableCell>

                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      latestSubscribersObject.subscribers && latestSubscribersObject.subscribers.length > 0 ?
                        latestSubscribersObject.subscribers.map((participant) => (
                          <TableRow
                            hover
                            key={participant.subscriberID}
                          >
                            <TableCell>{latestSubscribersObject.roomName}</TableCell>

                            <TableCell>
                              <div className={classes.author}>
                                <Avatar
                                  alt="Author"
                                  className={classes.avatar}
                                  src={participant.subscriberProfileImage}
                                >
                                  {getInitials(participant.subscriberName)}
                                </Avatar>
                                {participant.subscriberName}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Button
                                className={classes.acceptButton}
                                size="small"
                                variant="contained"
                                onClick={() => {setDisabledButtons([participant.subscriberID]); handleStudentAccept(participant.subscriberID);}}
                                disabled={disabledButtons.indexOf(participant.subscriberID) !== -1}
                              >
                                {
                                  isAcceptButton &&  (disabledButtons.indexOf(participant.subscriberID) !== -1) ?
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

                              <Button
                                className={classes.removeButton}
                                size="small"
                                variant="contained"
                                onClick={() => {setDisabledButtons([participant.subscriberID]); handleStudentRefuse(participant.subscriberID);}}
                                disabled={disabledButtons.indexOf(participant.subscriberID) !== -1}
                              >
                                {
                                  isRefuseButton && (disabledButtons.indexOf(participant.subscriberID) !== -1) ?
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
                            </TableCell>
                          </TableRow>
                        ))
                        :
                        null
                    }
                  </TableBody>
                </Table>
              :
                <EmptyPlaceholder emptyMessage={t('No participation request!')} />
            }
          </div>
        </PerfectScrollbar>
      </CardContent>

      {
        latestSubscribersObject.subscribers && latestSubscribersObject.subscribers.length > 0 ?
          <CardActions className={classes.actions}>
            <Button
              color="primary"
              component={RouterLink}
              size="small"
              to={`/cours/details/${latestSubscribersObject.roomID}/subscribers`}
              variant="text"
            >
              See all
              <ArrowForwardIcon className={classes.arrowForwardIcon} />
            </Button>
          </CardActions>
        :
          null
      }

      <ErrorSnackbar
        errorMessage={errorMessage}
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Card>
  );
}

LatestSubscribers.propTypes = {
  className: PropTypes.string
};

export default LatestSubscribers;
