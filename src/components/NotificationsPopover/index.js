import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Popover,
  CardHeader,
  Divider,
  colors
} from '@material-ui/core';
import NotificationList from './NotificationList';

import EmptyElements from '../../views/Empty/EmptyElements';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles(() => ({
  root: {
    width: 350,
    maxWidth: '100%',
    '&:MuiPopover-paper': {
      maxHeight:'calc(70% - 32px)'
    }
    
  },
  popover:{
   
  },
  actions: {
    backgroundColor: colors.grey[50],
    justifyContent: 'center'
  }
}));

function NotificationsPopover({ notifications, anchorEl, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Popover
      {...rest}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
        
      }}
      style={{height:'70%'}}
    
    >
      <div className={classes.root}>
        <CardHeader title={t('notifications')} style={{backgroundColor:'#f7b62a'}}/>
        <Divider />

        {notifications.length > 0 ? (
          <NotificationList notifications={notifications} />
        ) : (
          <EmptyElements title={t('No Notifications')}  />
        )}
      </div>
    </Popover>
  );
}

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default NotificationsPopover;
