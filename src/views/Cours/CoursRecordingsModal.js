import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as API from '../../services';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-bootstrap/Spinner';
import getInitials from '../../utils/getInitials';
import LoadingElement from '../Loading/LoadingElement';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(3),
    height: 200
  },
  actions: {
    justifyContent: 'flex-end'
  },
  learnMoreButton: {
    width: '100%',
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
}));

function CoursRecordingsModal({
                                        open, onClose, className, thecours, ...rest
                                      }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const [recordingsURLs, setRecordingsURLs] = useState([]);
  const [disablePlayRecordingButton, setDisablePlayRecordingButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onRecordingPlay = (recordingURL) => {
    setDisablePlayRecordingButton(true);
    try {
      window.location.href = recordingURL;
    } catch (e) {
      setDisablePlayRecordingButton(true);
    }
  };

  if (open) {
    const fetchRoomRecordings = () => {
      API.getRoomRecordings(thecours.meetingID, token)
        .then((response) => {
          setRecordingsURLs(response.Recordings);
          setIsLoading(false);
        })
        .catch((error) => { setIsLoading(false); });
    };

    fetchRoomRecordings();
  }

  if (!open) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader title={t('Course recordings')} />
        <Divider />
        <CardContent>
          {
            isLoading ? <LoadingElement /> :
              recordingsURLs && recordingsURLs.length > 0 ?
                <List disablePadding>
                  {recordingsURLs.map((object, i) => (
                    <ListItem
                      divider={i < recordingsURLs.length - 1}
                      key={object.recordingID}
                    >
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          { getInitials(thecours.creator.fullName) }
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={object.recordingName}
                        primaryTypographyProps={{ variant: 'h6' }}
                      />
                      <Typography variant="subtitle2">
                        <Button
                          className={classes.learnMoreButton}
                          color="primary"
                          onClick={() => {onRecordingPlay(object.recordingURL)}}
                          variant="contained"
                          disabled={disablePlayRecordingButton}
                        >
                          {
                            disablePlayRecordingButton ?
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              :
                              t('start')
                          }
                        </Button>
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              :
                <EmptyPlaceholder emptyMessage={t('No recording available!')} />
          }
        </CardContent>
        <Divider />
        <CardActions className={classes.actions}>

          <Button onClick={onClose}>
            {t('dismiss')}
          </Button>

          {/*
            <Button
            color="primary"
            onClick={onCoursDelete}
            variant="contained"
            disabled={disableDeleteButton}
          >
            {
              disableDeleteButton ?
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                :
                t('confirm')
            }
          </Button>
          */}

        </CardActions>
      </Card>
    </Modal>
  );
}

CoursRecordingsModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

CoursRecordingsModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default CoursRecordingsModal;
