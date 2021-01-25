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
  Button
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as API from '../../services2';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-bootstrap/Spinner';

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
  }
}));

function CoursDeleteConfirmationModal({
  open, onClose, className, thecours, theClasse, ...rest
  }) {
    console.log('ccccccccc', thecours)
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);

  
  const onCoursDelete = async () => {

    setDisableDeleteButton(true);

    
    const classRooms = thecours.classRooms
    var newArray = classRooms.filter(x => {
        return x.classe != theClasse.data.id;
    })
    
    

      let roomData = {
        
        classe: newArray
      };
      API.deleteRoomClass(thecours.id, roomData, token)
        .then((res) => {
           
            window.location.reload();
    
          }).catch((error) => {
          setDisableDeleteButton(false);
        });
  
  };


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
        {/* <CardHeader title={t('delete course') + ' ' + thecours.classeName} /> */}
          <CardHeader title={t('delete course') } />
        <Divider />
        <CardContent>
          <Typography variant="body1">
            {t('delete message', { thingToDelete: t('course')})}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions className={classes.actions}>

          <Button onClick={onClose}>
            {t('dismiss')}
          </Button>

          <Button
           style={{backgroundColor : disableDeleteButton ? '#9b9ea1' : '#f7b731',color:'white',borderRadius:"20px"}}
          //  color="primary"
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

        </CardActions>
      </Card>
    </Modal>
  );
}

CoursDeleteConfirmationModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

CoursDeleteConfirmationModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default CoursDeleteConfirmationModal;
