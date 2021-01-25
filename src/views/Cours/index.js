import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0)
  },
  header: {
    marginBottom: theme.spacing(3)
  },
  filter: {
    marginTop: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

function CoursView() {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  return (
    <Page
      className={classes.root}
      title={t('my courses')}
    >
      <Container maxWidth="lg">
        <Header className={classes.header} />
        <Results className={classes.results} />
      </Container>
    </Page>
  );
}

export default CoursView;
