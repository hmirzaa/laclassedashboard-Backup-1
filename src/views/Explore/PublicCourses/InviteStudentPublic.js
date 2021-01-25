import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Switch from '@material-ui/core/Switch';
import { useDropzone } from 'react-dropzone';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import validate from 'validate.js';
import {
  Button, CardActions, CardContent, Chip, Divider,
  Drawer,
  TextField,
  Typography,
  IconButton,
  FormControlLabel,
  Collapse
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import AddIcon from '@material-ui/icons/Add';
import Spinner from 'react-bootstrap/Spinner';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FilesDropzoneManageStudents from 'src/components/FilesDropzoneManageStudents';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactGA from 'react-ga';
import * as API from '../../../services2';

// import array from json

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
  switchPublicCourse: {
    marginTop: theme.spacing(2)
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
  fieldHint: {
    margin: theme.spacing(1, 0)
  },
  students: {
    marginTop: 20
  },
  inviteAddButton: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    margin: theme.spacing(1, 0)
  },
}));

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 100
    }
  },
  fullName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 100
    }
  }
};

const divStyle = {
  // marginTop: '10px' ,
  marginBottom: '15px'
};

const customStylesSelector = {
  option: (provided, state) => ({
    ...provided,
    // borderBottom: '1px dotted blue',
  }),
  menu: base => ({
    ...base,
    zIndex: 100
  }),
};

function InviteStudentPublic({
  thecour,
  open,
  onClose,
  className,
  currentClasseId,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [inviteStudents, setInviteStudents] = useState('block');
  const [inviteTeacher, setInviteTeacher] = useState('block');
  const [expandInviteStudents, setExpandInviteStudents] = useState(true);
  const [isPublicCours, setIsPublicCours] = useState(false);
  const [isInstantCours, setIsInstantCours] = useState(true);

  const history = useHistory();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  // Switch
  const handlePublicCours = () => {
    console.log("the Public Course is::::: ", isPublicCours)
    if (isPublicCours) {
      setIsPublicCours(false);
      setIsInstantCours(true);
    } else {
      setIsPublicCours(true);
      setIsInstantCours(false);
    }
  };



  const initialValues = {
    classeName: '',
    etablissement: user.etablissement,
    ville: user.cityName,
    email: '',
    fullName: '',
    tags: []
  };

  const [values, setValues] = useState({ ...initialValues });
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const handleChangeCity = (newValue, actionMeta) => {
    if (newValue) values.ville = newValue.label;
  };

  const handleFieldChange = (event, field, value) => {
    event.persist();

    setFormState((prevFormState) => ({
      ...prevFormState,
      values: {
        ...prevFormState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...prevFormState.touched,
        [event.target.name]: true
      }
    }));

    setValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleTagAdd = () => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      if (formState.isValid && newValues.email.trim() && newValues.fullName.trim() && !newValues.tags.includes(newValues.email) && !newValues.tags.includes(newValues.fullName)) {
        let isDuplicated = false;

        // Check new invites
        for (let _newInvitedUser of values.tags) {
          if (_newInvitedUser.split(",")[1] === newValues.email) {
            isDuplicated = true;
          }
        }

        if (!isDuplicated) {
          newValues.tags = [...newValues.tags];
          newValues.tags.push(newValues.fullName + ',' + newValues.email);
        }
      }

      newValues.email = '';
      newValues.fullName = '';

      return newValues;
    });
  };

  const handleTagDelete = (email) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      newValues.tags = newValues.tags.filter((t) => t !== email);

      return newValues;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // ReactGA.event({
    //   category: 'Classe',
    //   action: 'Create classe!'
    // });

    setDisableSubmit(true);
    if (isPublicCours) {

    }
    else {
      let classeData = {
        fullName: values.fullName,
        email: values.email,
        invitedUsers: values.tags
      }
      console.log("The Handler Submit is:::::::", classeData)
      API.sendRoomInvitetoCourse(thecour._id, {
        invitedUsers: classeData.invitedUsers.length > 0 ? classeData.invitedUsers : [`${classeData.fullName + `,` + classeData.email}`]
      }, token).then((res) => {
        const { status } = res
        console.log("The Invite Student Success is: ", status)
        if (status === 1) {
          setTimeout(() => {
            onClose()
            window.location.reload()
            setValues(initialValues)
          }, 1500);
        }
      }).catch((e) => {
        console.log("The Invite Student Erro is: ", e)
        setDisableSubmit(false);
      })
    }

    // API.createClasse(classeData, token)
    //   .then(() => {
    //     onClose();
    //     setValues({ ...initialValues });

    //     if (window.location.pathname === '/classes') {
    //       window.location.reload();
    //     } else {
    //       history.push('/classes');
    //     }
    //   })
    //   .catch((error) => {
    //     setDisableSubmit(false);
    //   });
  };

  const resetFormsOnClose = () => {
    setValues({ ...initialValues });
  };


  const handleToggleInviteStudents = () => {
    setExpandInviteStudents((prevExpandProject) => !prevExpandProject);
  };

  const hasError = (field) => !!(formState.touched[field] && formState.errors[field]);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {}
    }));
  }, [formState.values]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //  onDrop: handleDrop,
    accept: '.csv'
  });

  console.log("The Public Student Invited are: ", values, thecour)
  return (

    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={() => { onClose(); resetFormsOnClose(); }}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        id='createClassForm'
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

          {/* Section Invite Students */}
          <div style={{ display: inviteStudents }} className={classes.contentSection} >
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleInviteStudents}
            >
              <Typography variant="h5">{t('adding students')}</Typography>
              {expandInviteStudents ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandInviteStudents}>
              <div className={classes.contentSectionContent}>
                {/* Bulk Add */}
                <Typography
                  variant="h5"
                  style={{ marginTop: '15px' }}
                >
                  {t('Bulk Add')}
                </Typography>
                <Typography
                  className={classes.fieldHint}
                  variant="body1"
                >
                  {t('With the option of Bulk add, you can add more students using CSV file')}
                </Typography>

                <FormControlLabel
                  className={classes.switchPublicCourse}
                  control={(
                    <Switch
                      checked={isPublicCours}
                      name="instant"
                      onChange={handlePublicCours}
                    />
                  )}
                />

                {/* Input: Invite Full Name */}
                {
                  isPublicCours ? null :
                    <div className={classes.formGroup}>
                      <TextField
                        error={hasError('fullName')}
                        label={t('full name')}
                        name="fullName"
                        onChange={(event) => handleFieldChange(event, 'fullName', event.target.value)}
                        value={values.fullName}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "10px" }}
                      />

                      <TextField
                        error={hasError('email')}
                        label={t('email address')}
                        name="email"
                        onChange={(event) => handleFieldChange(event, 'email', event.target.value)}
                        value={values.email}
                        variant="outlined"
                        fullWidth
                      />
                      <div className={classes.inviteAddButton}>
                        <Button
                          style={{ backgroundColor: '#393939', color: 'white', borderRadius: "20px" }}
                          onClick={handleTagAdd}
                          size="small"
                          fullWidth
                        >
                          <AddIcon className={classes.addIcon} />
                          {t('add')}
                        </Button>
                      </div>
                      <Typography
                        className={classes.fieldHint}
                        variant="body2"
                      >
                        {t('these students will receive the invitation in their email addresses')}
                      </Typography>
                    </div>
                }

                {
                  isInstantCours ? null :
                    <div>
                      <Typography
                        variant="h5"
                        style={{ marginTop: '15px' }}
                      >
                        {t('Download CSV Template')}
                      </Typography>
                      <div
                        className={clsx({
                          [classes.dropZone]: true,
                          [classes.dragActive]: isDragActive
                        })}
                        {...getRootProps()}
                      >
                        <IconButton>
                          <CloudDownloadIcon />
                          <input {...getInputProps()} accept="text/csv" multiple={false} />
                        </IconButton>
                      </div>
                      <FilesDropzoneManageStudents />

                    </div>
                }


                {/* Tags */}

                <div className={classes.tags}>
                  {values.tags.map((email) => (
                    <Chip
                      deleteIcon={<CloseIcon />}
                      key={email}
                      label={email}
                      onDelete={() => handleTagDelete(email)}
                    />
                  ))}
                </div>
              </div>
            </Collapse>

          </div>



        </div>
        <Divider />
        {/* Submit Button */}
        <div className={classes.actions}>
          <Button
            style={{ backgroundColor: disableSubmit ? '#9b9ea1' : '#f7b731 ', color: 'white', borderRadius: "20px" }}
            variant="contained"
            fullWidth
            type="submit"
            form="createClassForm"
            disabled={disableSubmit}
          >
            {
              disableSubmit ?
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                :
                t('confirm')
            }

          </Button>
        </div>
      </form>
    </Drawer>
  );
}

InviteStudentPublic.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default InviteStudentPublic;
