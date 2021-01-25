import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import validate from 'validate.js';
import {
  Button,
  Drawer,
  TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { validatePhoneNumber } from '../../../utils/ListHelper';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    width: 420,
    maxWidth: '100%'
  },
  header: {
    padding: theme.spacing(2, 1),
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(0, 3),
    flexGrow: 1
  },
  contentSection: {
    padding: theme.spacing(2, 0)
  },
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  contentSectionContent: {},
  formGroup: {
    padding: theme.spacing(2, 0)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  field: {
    marginTop: 0,
    marginBottom: 0
  },
  flexGrow: {
    flexGrow: 1
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  tags: {
    marginTop: theme.spacing(1)
  },
  minAmount: {
    marginRight: theme.spacing(3)
  },
  maxAmount: {
    marginLeft: theme.spacing(3)
  },
  radioGroup: {},
  actions: {
    padding: theme.spacing(3),
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));


const initialValues = {
  supportType: 'Other',
  supportTitle: '',
  supportDescription: '',
  preferredContactMethod: 'WhatsApp',
  supportPhone: ''
};

function ContactForm({
  open,
  onClose,
  onFilter,
  className,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const user = useSelector((state) => state.user.userData);

  const preferredContactMethodOptions = [
    {
      id: 'email',
      name: t('email address')
    },
    {
      id: 'whatsapp',
      name: t('whatsapp messages')
    },
    {
      id: 'phone',
      name: t('phone call')
    },
    {
      id: 'sms',
      name: 'SMS'
    }
  ];

  const supportTypeOptions = [t('Account'), t('Courses'), t('Classes'), t('Calendar'), t('Professor'), t('Students'), t('Other')];

  const [values, setValues] = useState({ ...initialValues });
  const [checkPhoneNumber, setCheckPhoneNumber] = useState(false);
  const [hasError, setHasError] = useState({
    supportType: false,
    supportTitle: false,
    supportDescription: false,
    preferredContactMethod: false,
    supportPhone: false
  });


  const handleFieldChange = (event, field, value) => {
    if (event) {
      event.persist();
    }

    if (field === 'preferredContactMethod') {
      if (value === 'whatsapp' || value === 'phone' || value === 'sms') {
        if (validatePhoneNumber(user.phone)) {
          setCheckPhoneNumber(false);
        } else {
          setCheckPhoneNumber(true);
        }
      } else {
        setCheckPhoneNumber(false);
      }
    }

    setValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onFilter) {

      let objectError = {
        supportType: (values.supportType === ''),
        supportTitle: (values.supportTitle === ''),
        supportDescription: (values.supportDescription === ''),
        preferredContactMethod: (values.preferredContactMethod === ''),
      };

      if (checkPhoneNumber === true) {
        objectError.supportPhone = !validatePhoneNumber(values.supportPhone);
      }

      setHasError(objectError);

      let isValid = Object.values(objectError).every(item => item === false);

      if (isValid) {
        onFilter(values);

        onClose();
        setValues({ ...initialValues });
      }
    }
  };

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        onSubmit={handleSubmit}
      >
        <div className={classes.header}>
          <Button
            onClick={onClose}
            size="small"
          >
            <CloseIcon className={classes.buttonIcon} />
            {t('Close')}
          </Button>
        </div>
        <div className={classes.content}>

          {/* Support Type/Topic */}
          <div className={classes.formGroup}>
            <TextField
              error={hasError.supportType}
              className={classes.field}
              fullWidth
              label={t('Topic')}
              margin="dense"
              name="supportType"
              onChange={(event) => handleFieldChange(
                event,
                'supportType',
                event.target.value
              )}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              value={values.supportType}
            >
              <option
                disabled
                value=""
              />
              {supportTypeOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </TextField>
          </div>

          {/* Support title */}
          <div className={classes.formGroup}>
            <TextField
              error={hasError.supportTitle}
              className={classes.field}
              fullWidth
              label={t('Title')}
              margin="dense"
              name="supportTitle"
              onChange={(event) => handleFieldChange(
                event,
                'supportTitle',
                event.target.value
              )}
              value={values.supportTitle}
              variant="outlined"
            />
          </div>

          {/* Support description */}
          <div className={classes.formGroup}>
            <TextField
              error={hasError.supportDescription}
              className={classes.field}
              fullWidth
              multiline
              rows={5}
              label={t('Description')}
              margin="dense"
              name="supportDescription"
              onChange={(event) => handleFieldChange(
                event,
                'supportDescription',
                event.target.value
              )}
              value={values.supportDescription}
              variant="outlined"
            />
          </div>

          {/* Preferred contact method */}
          <div className={classes.formGroup}>
            <TextField
              error={hasError.preferredContactMethod}
              className={classes.field}
              fullWidth
              label={t('Preferred contact method')}
              margin="dense"
              name="preferredContactMethod"
              onChange={(event) => handleFieldChange(
                event,
                'preferredContactMethod',
                event.target.value
              )}
              select
              SelectProps={{ native: true }}
              value={values.preferredContactMethod}
              variant="outlined"
            >
              <option
                disabled
                value=""
              />
              {preferredContactMethodOptions.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                >
                  {option.name}
                </option>
              ))}
            </TextField>
          </div>

          {/* Phone number input */}
          {
            checkPhoneNumber ?
              <div className={classes.formGroup}>
                <TextField
                  error={hasError.supportPhone}
                  className={classes.field}
                  fullWidth
                  label={t('phone number')}
                  margin="dense"
                  name="supportPhone"
                  onChange={(event) => handleFieldChange(
                    event,
                    'supportPhone',
                    event.target.value
                  )}
                  value={values.supportPhone}
                  variant="outlined"
                />
              </div>
            : null
          }

        </div>

        <div className={classes.actions}>
          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
          >
            {t('Send')}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

ContactForm.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  onFilter: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default ContactForm;
