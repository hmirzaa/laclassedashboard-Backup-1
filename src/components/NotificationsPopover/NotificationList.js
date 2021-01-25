import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles'; 
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import gradients from 'src/utils/gradients';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as API from '../../services';
import { getNotificationMessage } from '../../utils/ListHelper';

const useStyles = makeStyles((theme) => ({
  root: {},
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      textdecoration:'none'
    }
  },
  avatarBlue: {
    backgroundImage: gradients.blue
  },
  avatarGreen: {
    backgroundImage: gradients.green
  },
  avatarOrange: {
    backgroundColor: '#ffa726'
  },
  avatarIndigo: {
    backgroundImage: gradients.indigo
  },
  arrowForwardIcon: {
    color: theme.palette.icon
  }
}));

function NotificationList({ notifications, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);

  const [reNotifications, setReNotifications] = useState(notifications);


  useEffect(() => {
    let mounted = true;

    const fetchNotifications = () => {
      API.getSocketNotifications(token)
        .then((response) => {
          if (mounted) {
            setReNotifications(response.Notifications);
          }
        })
        .catch((error) => { console.log(error); });
    };

    fetchNotifications();

    return () => {
      mounted = false;
    };
  }, []);


  const avatars = {
    notification: (
      <Avatar className={classes.avatarOrange}>
        <img src={window.location.origin +"/images/icons/Vector-Smart-ObjectT.png"}
            style={{ height:'20px', width:'auto' }}  
            />
        {/* <img src="./images/icons/Vector_Smart_Objec.png"
           style={{ height:'20px', width:'auto' }}  
        /> */}
      </Avatar> 
      
    ),
  };

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
      disablePadding
    >

      {reNotifications.map((notification, i) => (
        <ListItem
      
          className={classes.listItem}
      //  component={RouterLink}
          divider={i < reNotifications.length - 1}
          key={notification._id}
          underline="none"
         // to="#"
        >
          <ListItemAvatar>{avatars.notification}</ListItemAvatar>
          <ListItemText
      
            primary={getNotificationMessage(notification, t)}
            primaryTypographyProps={{ variant: 'body1' }}
            secondary={moment(notification.createdAt).fromNow()}
          />
          <ArrowForwardIcon className={classes.arrowForwardIcon} />
        </ListItem>
      ))}
    </List>
  );
}

NotificationList.propTypes = {
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired
};

export default NotificationList;
