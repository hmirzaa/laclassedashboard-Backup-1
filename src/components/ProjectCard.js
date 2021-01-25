import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Link,
  Typography,
  colors,
  Avatar
} from '@material-ui/core';
import ClasseGenericMoreButton from './ClasseGenericMoreButton';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import getInitials from '../utils/getInitials';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: "15px"
  },
  header: {
    paddingBottom: 20,
    '&:hover': {
      color: '#f7b62a'
    }
  },
  linkcolor: {
    '&:hover': {
      color: '#f7b62a'
    }
  },
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  description: {
    padding: theme.spacing(2, 3, 1, 3)
  },
  tags: {
    padding: theme.spacing(0, 3, 2, 3),
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  },
  learnMoreButton: {
    width: '70%',
    borderRadius: "20px",
    backgroundColor: theme.palette.secondary.dark,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
      color: '#FFFFFF'
    }
  },
  likedButton: {
    color: colors.yellow[600]
  },
  shareButton: {
    marginLeft: theme.spacing(1)
  },
  details: {
    padding: theme.spacing(2, 3)
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    backgroundColor: theme.palette.secondary.main
  },
  avatarHover: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 55,
    width: 55,
    backgroundColor: '#388e3c'
  },
  cardheader: {
    padding: "16px 4px 24px 24px !important"
  }
}));

function ProjectCard({ theClasse, className, classID, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const user = useSelector(state => state.user.userData);


  console.log("aabc", theClasse)
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader

        style={{ padding: "16px 4px 24px 24px" }}
        action={
          <ClasseGenericMoreButton theclasse={theClasse} classID={classID} isCreator={user._id === theClasse.creator._id} />
          // user.isModerator && user._id === theClasse.creator._id ? (
          //   <ClasseGenericMoreButton theclasse={theClasse} classID={classID} />
          // ) :   null
        }
        avatar={
          <Avatar
            alt="classe"
            className={classes.avatar}
            src={theClasse.creator.profileImage}
          >
            {getInitials(theClasse.creator.fullName)}
          </Avatar>
        }
        className={classes.header}
        disableTypography
        subheader={
          <Typography variant="body2">
            By: {theClasse.creator.fullName}
          </Typography>
        }
        title={
          <Link
            color="textPrimary"
            variant="h3"
            component={RouterLink}
            className={classes.linkcolor}
            to={'/classe/' + (theClasse ? theClasse._id : 'null')}
          >
            {theClasse ? theClasse.classeName : ''}
          </Link>
        }
      />

      <CardContent
        className={classes.content}
      >
        <Divider />
        <div className={classes.details}>
          <Grid
            alignItems="center"
            container
            justify="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography variant="h5">{t('school')}</Typography>
              <Typography variant="body2">
                {!theClasse.schoolName ? 'No school' : theClasse.schoolName}
              </Typography>
            </Grid>

          </Grid>
          <Grid
            alignItems="center"
            container
            justify="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography variant="h5">{t('student')}</Typography>
              <Typography variant="body2">
                {theClasse ? theClasse.students : ''}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">{t('teacher')}</Typography>
              <Typography variant="body2">
                {theClasse.teachers}
              </Typography>
            </Grid>

            <Grid item style={{ width: '100%', textAlign: 'center' }}>
              <Button
                className={classes.learnMoreButton}
                size="large"
                color="primary"
                component={RouterLink}
                to={'/classe/' + (theClasse ? theClasse._id : 'null')}
              >
                {t('access')}
              </Button>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
}

ProjectCard.propTypes = {
  className: PropTypes.string,
  theClasse: PropTypes.object.isRequired,
  classID: PropTypes.string
};

export default ProjectCard;
