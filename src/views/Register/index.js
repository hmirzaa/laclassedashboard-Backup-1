import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Link,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAddOutlined';
import gradients from 'src/utils/gradients';
import Page from 'src/components/Page';
import RegisterForm from './RegisterForm';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    backgroundColor:'#f1f1f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 6),
    '& .MuiPaper-elevation1': {
      boxShadow: '0 0 0 1px #fff, 0 1px 3px 0 #fff'
    }
  },
  card: {
    width: theme.breakpoints.values.sm,
    maxWidth: '100%',
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '100%',
      width: '100%'
    }
  },
  content: {
    padding: theme.spacing(8, 4, 3, 4),
    textAlign: "center"
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  icon: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: 'absolute',
    top: -32,
    left: theme.spacing(3),
    height: 64,
    width: 64,
    fontSize: 32
  },
  registerForm: {
    marginTop: theme.spacing(3)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  person: {
    marginTop: theme.spacing(2),
    display: 'flex'
  },
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

function RegisterView({ location }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  //const { isTeacher } = queryString.parse(location.search);
  // (isTeacher === 'true')

  return (
    <Page
      className={classes.root}
      title={t('register')}
    >
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography
            gutterBottom
            variant="h3"
          >
            {t('sign up')}
          </Typography>
          <Typography variant="subtitle2">
            {t('sign up on the internal platform')}
          </Typography>

          <RegisterForm
            className={classes.registerForm}
          />

          {
            //<Divider className={classes.divider} />
          }
          <Link
            align="center"
            color="primary"
            component={RouterLink}
            to="/auth/login"
            underline="hover"
            variant="subtitle2"
          >
            {t('have an account')}
          </Link>
        </CardContent>
        {/*
        <CardMedia
          className={classes.media}
          image="/images/auth.png"
          title="Cover"
        >
        </CardMedia>
        */}
      </Card>
    </Page>
  );
}

export default RegisterView;
