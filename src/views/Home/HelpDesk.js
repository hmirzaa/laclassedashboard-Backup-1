import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography, Avatar } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTranslation } from 'react-i18next'
import ContactForm from './Support/ContactForm';
import * as API from '../../services';
import { useSelector } from 'react-redux';
import { ErrorSnackbar, SuccessSnackbar } from '../Snackbars';
import { validatePhoneNumber } from '../../utils/ListHelper';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  avatar: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    height: 48,
    width: 48,
  }
}));

function HelpDesk({ className, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);

  const [openSupport, setOpenSupport] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

  const handleContactFormSend = (values) => {
    let dataToSend = {
      type: values.supportType,
      title: values.supportTitle,
      description: values.supportDescription,
      preferredContactMethod: values.preferredContactMethod
    };

    if (validatePhoneNumber(values.supportPhone)) {
      dataToSend.phone = values.supportPhone;
    }

    API.createSupportQuestion(dataToSend, token)
      .then(() => {
        setOpenSuccessSnackbar(true);
      })
      .catch((error) => {
        setOpenErrorSnackbar(true);
      });
  };

  const handleSupportOpen= () => {
    setOpenSupport(true);
  };

  const handleSupportClose = () => {
    setOpenSupport(false);
  };

  const handleErrorSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };

  const handleSuccessSnackbarClose = () => {
    setOpenSuccessSnackbar(false);
  };

  return (
    <>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
        onClick={handleSupportOpen}
      >
        <div>
          <Typography
            color="inherit"
            component="h3"
            gutterBottom
            variant="overline"
          >
            {t('contact us')}
          </Typography>
          <div className={classes.details}>
            <Typography
              color="inherit"
              variant="h3"
            >
              {t('need help?')}
            </Typography>
          </div>
        </div>
        <Avatar
          className={classes.avatar}
          color="inherit"
          onClick={handleSupportOpen}
        >
          <HelpOutlineIcon />
        </Avatar>
      </Card>

      <ContactForm
        onClose={handleSupportClose}
        onFilter={handleContactFormSend}
        open={openSupport}
      />

      <ErrorSnackbar
        errorMessage={t('There is a problem while sending your question!')}
        onClose={handleErrorSnackbarClose}
        open={openErrorSnackbar}
      />

      <SuccessSnackbar
        message={t('Your question sent successfully!')}
        onClose={handleSuccessSnackbarClose}
        open={openSuccessSnackbar}
      />
    </>
  );
}

HelpDesk.propTypes = {
  className: PropTypes.string
};

export default HelpDesk;
