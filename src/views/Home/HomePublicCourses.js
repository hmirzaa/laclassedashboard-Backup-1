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
  Tooltip
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axios from 'src/utils/axios';
import getInitials from 'src/utils/getInitials';
import Label from 'src/components/Label';
import GenericMoreButton from 'src/components/GenericMoreButton';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import * as API from '../../services';
import { useSelector } from 'react-redux';
import PublicCourseHomeItem from './PublicCourseHomeItem';
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
  learnMoreButton: {
    width: '100%',
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  learnMoreButtonUnsubscribe: {
    width: '100%',
    color: 'white',
    backgroundColor: theme.palette.secondary.unsubscribeButton,
    '&:hover': {
      backgroundColor: theme.palette.secondary.unsubscribeButton
    }
  },
}));

function HomePublicCourses({ latestPublicCoursesObject, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector(state => state.user.token);

  const [isSubscribed, setIsSubscribed] = useState(false);


  const subscribeHandler = (publicCourse) => {

    let subscribe = !isSubscribed;

    /*API.subscribeToRoom(theCours._id, subscribe, token)

      .then(response => {
        if (response.isSubscribe) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      })

      .catch(error => {
        //setErrorMessage(t('something went wrong'));
      });*/
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Latest Public Courses"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar options={{ suppressScrollY: true }}>
          <div className={classes.inner}>
            {
              latestPublicCoursesObject && latestPublicCoursesObject.length ?
                <Table>

                  <TableHead>
                    <TableRow>
                      <TableCell>Course Name</TableCell>

                      <TableCell>Creator</TableCell>

                      <TableCell>Start Date</TableCell>

                      <TableCell>Actions</TableCell>

                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      latestPublicCoursesObject ?
                        latestPublicCoursesObject.map((publicCourse) => (
                          <PublicCourseHomeItem publicCourse={publicCourse} />
                        ))
                        :
                        null
                    }
                  </TableBody>
                </Table>
              :
                <EmptyPlaceholder emptyMessage={t('No public course!')} />
            }
          </div>
        </PerfectScrollbar>
      </CardContent>

      {
        latestPublicCoursesObject && latestPublicCoursesObject.length ?
          <CardActions className={classes.actions}>
            <Button
              color="primary"
              component={RouterLink}
              size="small"
              to="/cours/public"
              variant="text"
            >
              See all
              <ArrowForwardIcon className={classes.arrowForwardIcon} />
            </Button>
          </CardActions>
        :
          null
      }
    </Card>
  );
}

HomePublicCourses.propTypes = {
  className: PropTypes.string
};

export default HomePublicCourses;
