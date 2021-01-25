import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Chip,
  Collapse,
  Divider,
  Drawer,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';

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
  },
  toggleButton: {
    color: 'gray',
    '& + &:before': {
      color: 'red',
    },
  }
}));

const initialValues = {
  roomName: '',
  profName: '',
  searchCoursType: 'allCourses'
};
function Filter({
  open,
  onClose,
  onFilter,
  onClear,
  isPublicCours,
  className,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const [values, setValues] = useState({ ...initialValues });

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const handleFieldChange = (event, field, value) => {
    if (event) {
      event.persist();
    }

    setValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onFilter) {
      onFilter(values);
    }

    setValues({ ...initialValues });
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
            {t('close')}
          </Button>
        </div>
        <div className={classes.content}>
          <div className={classes.contentSection}>
            <div className={classes.contentSectionContent}>
              <div className={classes.contentSectionContent}>

                {
                  isPublicCours === 'true' ? null :
                    <div className={classes.formGroup}>
                      <ToggleButtonGroup
                        exclusive
                        onChange={(event, value) => value && handleFieldChange(event, 'searchCoursType', value)}
                        size="medium"
                        value={values.searchCoursType}
                        variant="outlined"
                      >
                        <ToggleButton
                          value="allCourses"
                          className={classes.toggleButton}
                        >
                          {t('all')}
                        </ToggleButton>

                        <ToggleButton
                          value="publicCourses"
                          className={classes.toggleButton}
                        >
                          {t('public courses')}
                        </ToggleButton>

                        <ToggleButton
                          className={classes.toggleButton}
                          value="privateCourses"
                        >
                          {t('private courses')}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                }

                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label={t('course name')}
                    margin="dense"
                    name="roomName"
                    onChange={(event) => handleFieldChange(
                      event,
                      'roomName',
                      event.target.value
                    )}
                    value={values.roomName}
                    variant="outlined"
                  />
                </div>

                <div className={classes.formGroup}>
                  <TextField
                    className={classes.field}
                    fullWidth
                    label={t('professor name')}
                    margin="dense"
                    name="profName"
                    onChange={(event) => handleFieldChange(
                      event,
                      'profName',
                      event.target.value
                    )}
                    value={values.profName}
                    variant="outlined"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className={classes.actions}>
          <Button
            fullWidth
            onClick={handleClear}
            variant="contained"
          >
            <DeleteIcon className={classes.buttonIcon} />
            {t('clear')}
          </Button>
          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
            onClick={onClose}
          >
            {t('apply')}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

Filter.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  onFilter: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default Filter;
