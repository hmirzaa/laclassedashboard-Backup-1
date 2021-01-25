/* eslint-disable no-unused-vars */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Select from 'react-select';
import {
  Button,
  TextField,
  Card,
  Grid,
  Typography,
  CardContent,
  InputAdornment,
} from '@material-ui/core';

// import * as API from '../../services';
import { useTranslation } from 'react-i18next';
import Page from 'src/components/Page';
import Spinner from 'react-bootstrap/Spinner';

const divStyle = {
    marginTop: '10px',
    marginBottom: '20px'
  };
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    backgroundColor:'#f1f1f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: theme.spacing(6, 6),
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
      flexBasis: '50%',
      width: '50%'
    }
  },
  content: {
    padding:  theme.spacing(8, 4, 3, 4) ,
    textAlign: "center"
  },
  createAccountBtn: {
    marginTop: theme.spacing(15),
    width: '100%',
    borderRadius: '20px',
    color: '#393939',
    textTransform: 'uppercase',
  },
  fields: {
    marginTop: theme.spacing(10),    
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
    backgroundColor: '#393939',
    color: '#fff',
    borderRadius: '20px',
    '&:hover': {
      color: '#000'
    },
  },
  inputField: {
    borderRadius: '12px',
    boxShadow: '1px 1px 6px 2px #eee',
  }
}));
const customStylesSelector = {
    option: (provided, state) => ({
      ...provided,
      // borderBottom: '1px dotted blue',
    }),
  
    menu: base => ({
      ...base,
      //zIndex: 100
    }),
  };

function LaclassePro({ props, className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  return (
    <Page
    className={classes.root}
    title={t('sign in')}
  >
    <Card className={classes.card}>
      <CardContent className={classes.content}>
          <Grid container spacing={3}  justify="center" alignItems="center">
              <Grid item xs={12}>
                  <Typography  variant="h3">
                  {t('welcome')}
                  </Typography>
              </Grid>
              <Grid item xs={12}>
                  <Typography  variant="body1">
                  {t('choose your school from this list')}
                  </Typography>
              </Grid>
          </Grid>
      
      <div className={classes.fields}>
        <div style={{ divStyle }} >
        <Select
        variant="h6"
        // error={hasError('laclasse')}
    // styles={customStylesSelector}
        style={{ borderColor: 'red' }}
        name="laclasse"
        //isMulti
        className="basic-single"
        classNamePrefix="select"
        placeholder={t('Choose your School')}
        isClearable
    />
      </div>
      </div>
            <Grid container spacing={3}  justify="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography  variant="body1">
                  {t('choose your school this version is functional only for partner schools')}
                  </Typography>
                </Grid>
            </Grid>
      
        <Button
            className={classes.createAccountBtn}
            color="secondary"
            size="large"
            variant="contained"
          >
            {t('access')}
        </Button>
           
        </CardContent>
      </Card>
    </Page>
  );
}

LaclassePro.propTypes = {
  className: PropTypes.string
};

export default LaclassePro;
