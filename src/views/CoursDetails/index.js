import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Container,
  Tabs,
  Tab,
  Divider,
  colors
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Connections from './Connections';
import Subscribers from './Subscribers';
import Classes from './Classes';
import { useTranslation } from 'react-i18next';
import * as API from '../../services2';
import { useSelector } from 'react-redux';
import { switchCase } from '@babel/types';

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    marginTop: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

function CoursDetails({ match, history }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const { id, tab: currentTab } = match.params;
  const tabs = [
    { value: 'studentsList', label: t('students list')},
    { value: 'subscribers', label: t('pending participation') },
    { value: 'classes', label: t('classes') },
  ];

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [room, setRoom] = useState({});
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [classesCount, setClassesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const handleStudentsCount = (count) => {
    setStudentsCount(count);
  };

  useEffect(() => {
    let mounted = true;

    const fetchRoom = () => {
      API.getRoomById(id, token)
        .then((room) => {
          if (mounted) {
            // setRoom(room);

            // Add count of resources in front of tabs
            setSubscribersCount(room.subscribers.length);
            setClassesCount(room.classes.length);
          }
        })
        .catch((error) => { console.log(error); });
    };

    fetchRoom();

    return () => {
      mounted = false;
    };
  }, []);


  if (!currentTab) {
    return <Redirect to={`/cours/details/${id}/studentsList`} />;
  }

  if (!tabs.find((tab) => tab.value === currentTab)) {
    return <Redirect to="/errors/error-404" />;
  }

  const renderTabs = (value, label) => {
    switch(value) {
      case 'studentsList':
        return label + ` (${studentsCount})`;
      case 'subscribers':
        return label + ` (${subscribersCount})`;
      case 'classes':
        return label + ` (${classesCount})`;
    }
  };

  return (
    <Page
      className={classes.root}
      title={t('course details')}
    >
      <Header
        room={room}
      />
      <Container maxWidth="lg">
        <Tabs
          onChange={handleTabsChange}
          scrollButtons="auto"
          value={currentTab}
          variant="scrollable"
        >
          <Tab
            key={'studentsList'}
            label={renderTabs('studentsList', t('students list'))}
            value={'studentsList'}
          />

          {
            room.isPublic ?
              <Tab
                key={'subscribers'}
                label={renderTabs('subscribers', t('pending participation'))}
                value={'subscribers'}
              />
            :
              null
          }

          {
            room.creator === user._id ?
              <Tab
                key={'classes'}
                label={renderTabs('classes', t('classes'))}
                value={'classes'}
              />
            :
              null
          }
        </Tabs>
        <Divider className={classes.divider} />
        <div className={classes.content}>
          {currentTab === 'studentsList' && <Connections room={room} roomId={id} studentCountCb={handleStudentsCount} />}
          {room.isPublic ? currentTab === 'subscribers' && <Subscribers room={room} roomId={id} /> : null}
          {room.creator === user._id ? currentTab === 'classes' && <Classes room={room} /> : null}
        </div>
      </Container>
    </Page>
  );
}

CoursDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default CoursDetails;
