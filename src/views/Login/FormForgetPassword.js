import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import {
  Card,
  CardContent,
  Typography,
  TextField, 
  colors ,
  Grid,
  InputAdornment
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Page from 'src/components/Page';
// import gradients from 'src/utils/gradients';
import { useHistory } from 'react-router';
// import * as API from '../../services';
// import { Link as RouterLink } from 'react-router-dom';
// import ModalForgetPassword from './ModalForgetPassword';
// import { SuccessSnackbar } from '../Snackbars';
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
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px !important',
    },
    '& .MuiInput-root': {
      margin: '10px'
    }
  },
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%',
    backgroundColor: '#388e3c',
    color:'white',
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  inputField: {
    borderRadius: '12px',
    boxShadow: '1px 1px 6px 2px #eee',
  },

  card: {
    width: theme.breakpoints.values.sm,
    maxWidth: '100%',
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%'
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
  Lockcircle:{
    width:"120px",
    height:"100%",
    border: 'solid 1px #fff',
    borderRadius:"267px",
    backgroundColor: '#ffffff',
    boxShadow:  "0 0 10px  rgb(216 211 211 / 60%)",

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
  loginForm: {
    marginTop: theme.spacing(3),
    marginMargin: theme.spacing(3)
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
  },
  createAccountBtn: {
    marginTop: theme.spacing(2),
    width: '100%',
    borderRadius: '20px',
    color: '#393939',
    textTransform: 'uppercase',
  },
  title: {
    marginTop:"25px",
    marginBottom:"15px",
    color: '#000'
  },
  logo: {
    display: "inline-block",
    marginBottom: "20px"
  },
  

}));

function FormForgetPassword() {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const history = useHistory();

  const inscrireHandler = () => {
    history.push('/auth/forgetFormPassword');
  };

  //let params = new URLSearchParams(useLocation().search);

  //if (!params.get("email") || !params.get("token")) {
  //  history.push('/');
 // }
  return (
    <Page
      className={classes.root}
      title={t('sign in')}
    >
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          {//<LockIcon className={classes.icon} />
          }
           <Grid container
          direction="column"
          justify="center"
          alignItems="center"        
          >
        {/* <Grid item xs={12}>
          <div className={classes.logo}>
            <Link href="https://www.laclasse.ma/">
              <img
                alt="Logo"
                src="/images/logos/logo.png"
                height="70"
              />
            </Link>
          </div>
          </Grid> */}
          <Grid item xs={12}>
            <div  className={classes.Lockcircle}>
              <LockOutlinedIcon style={{fontSize:"80px", width:"1.2em" , height:"1.5em"}}></LockOutlinedIcon>
            </div>
            </Grid>
            <Grid item xs={12}>
          <Typography
            className={classes.title}
            gutterBottom
            variant="h2"
          >
            ENTER YOUR PASSWORD
          </Typography>

          <div className={classes.fields}>
            <TextField
              fullWidth
              placeholder={t('password')}
              name="password"
              // onChange={handleChange}
              type="password"
              className={classes.inputField}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />

              <TextField
                fullWidth
                placeholder={t('confirm password')}
                name="password"
                // onChange={handleChange}
                type="password"
                className={classes.inputField}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

          <Button
            className={classes.createAccountBtn}

            color="secondary"
            size="large"
            onClick={inscrireHandler}
            variant="contained"
          >
            {t('confirm')}
          </Button>
          </Grid>
        </Grid>
      </CardContent>

    </Card>

    </Page>
  );
}

export default FormForgetPassword;


