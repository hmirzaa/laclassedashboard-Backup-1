import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Switch from "@material-ui/core/Switch";
import { useDropzone } from "react-dropzone";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import validate from "validate.js";
import {
  Button, CardActions, CardContent, Chip, Divider,
  Drawer,
  TextField,
  Typography,
  IconButton,
  FormControlLabel,
  Collapse
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import AddIcon from "@material-ui/icons/Add";
import Spinner from "react-bootstrap/Spinner";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import city from "../../mock/villeMaroc";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import FilesDropzoneManageStudents from "src/components/FilesDropzoneManageStudents";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactGA from "react-ga";
import * as API from "../../services2";


import { ErrorSnackbar } from "../Snackbars";

// import array from json
const allCity = city.allcity;

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

function NewCreateClasseModal({
  open,
  onClose,
  className,
  currentClasseId,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const childRef = useRef();

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandCreateClass, setExpandCreateClass] = useState(true);
  const [expandInviteStudents, setExpandInviteStudents] = useState(false);
  const [expandInviteTeachers, setExpandInviteTeachers] = useState(false);
  const [isPublicCours, setIsPublicCours] = useState(false);
  const [isInstantCours, setIsInstantCours] = useState(true);
  
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState(t('something went wrong'));

  const history = useHistory();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  // Switch
  const handlePublicCours = () => {
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
    emailStudent: '',
    fullNameStudent: '',
    // emailTeacher: '',
    // fullNameTeacher: '',
    tags: []
  };
  const initialValuess = {
    emailTeacher: '',
    fullNameTeacher: '',
    tags: []
  };

  const [values, setValues] = useState({ ...initialValues });
  const [valuesTeacher, setValuesTeacher] = useState({ ...initialValuess });
  const [invitedStudents, setInvitedStudents] = useState([]);

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
    setValuesTeacher((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleTagAddStudent = () => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      if (formState.isValid && newValues.emailStudent.trim() && newValues.fullNameStudent.trim() && !newValues.tags.includes(newValues.emailStudent) && !newValues.tags.includes(newValues.fullNameStudent)) {
        let isDuplicated = false;

        // Check new invites
        for (let _newInvitedUser of values.tags) {
          if (_newInvitedUser.split(",")[1] === newValues.emailStudent) {
            isDuplicated = true;
          }
        }

        if (!isDuplicated) {
          newValues.tags = [...newValues.tags];
          newValues.tags.push(newValues.fullNameStudent + ',' + newValues.emailStudent + ',' + false);
        }
      }

      newValues.emailStudent = '';
      newValues.fullNameStudent = '';

      return newValues;
    });
  };
  const handleTagAddTeacher = () => {
    setValuesTeacher((prevValues) => {
      const newValues = { ...prevValues };

      if (formState.isValid && newValues.emailTeacher.trim() && newValues.fullNameTeacher.trim() && !newValues.tags.includes(newValues.emailTeacher) && !newValues.tags.includes(newValues.fullNameTeacher)) {
        let isDuplicated = false;

        // Check new invites
        for (let _newInvitedUser of values.tags) {
          if (_newInvitedUser.split(",")[1] === newValues.emailTeacher) {
            isDuplicated = true;
          }
        }

        if (!isDuplicated) {
          newValues.tags = [...newValues.tags];
          newValues.tags.push(newValues.fullNameTeacher + ',' + newValues.emailTeacher + ',' + true);
        }
      }

      newValues.emailTeacher = '';
      newValues.fullNameTeacher = '';

      return newValues;
    });
  };

  const handleTagDeleteStudent = (emailStudent) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      newValues.tags = newValues.tags.filter((t) => t !== emailStudent);

      return newValues;
    });
  };
  const handleTagDeleteTeacher = (emailTeacher) => {
    setValuesTeacher((prevValues) => {
      const newValues = { ...prevValues };

      newValues.tags = newValues.tags.filter((t) => t !== emailTeacher);

      return newValues;
    });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();

    ReactGA.event({
      category: 'Classe',
      action: 'Create classe!'
    });

    setDisableSubmit(true);
    let inviteUser;
    if (isPublicCours) {
      childRef.current.handleUploadFile();
      inviteUser = invitedStudents

    } else {
      inviteUser = values.tags.concat(valuesTeacher.tags)
    }
    let classeData = {
      classeName: values.classeName,
      schoolName: values.etablissement,
      city: values.ville,
      invitedUsers: inviteUser
    };
    API.createClasse(classeData, token)
      .then((res) => {
        const { status } = res
        if( status == 0)
        {
          setErrorSnackbarMessage(t(res.message));
          setOpenErrorSnackbar(true);
          setTimeout(() => {
            setOpenErrorSnackbar(false);
            setDisableSubmit(false)
          }, 1500);
        }
        if( status == 1)
        {
          onClose();
          setValues({ ...initialValues });
          setValuesTeacher({ ...initialValues });
  
          if (window.location.pathname === '/classes') {
            window.location.reload();
          } else {
            history.push('/classes');
          }
        }
        
      })
      .catch((error) => {
        setDisableSubmit(false);
      });
  };

  const resetFormsOnClose = () => {
    setValues({ ...initialValues });
    setValuesTeacher({ ...initialValues });
  };

  const handleToggleCreateClass = () => {
    setExpandCreateClass((prevExpandProject) => !prevExpandProject);
  };

  const handleToggleInviteStudents = () => {
    setExpandInviteStudents((prevExpandProject) => !prevExpandProject);
  };
  const handleToggleInviteTeachers = () => {
    setExpandInviteTeachers((prevExpandProject) => !prevExpandProject);
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

          {/* Section Create Class */}
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleCreateClass}
            >
              <Typography variant="h5">{t('class creation')}</Typography>
              {expandCreateClass ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandCreateClass}>
              <div className={classes.contentSectionContent}>
                {/* Input: Class Name */}
                <div className={classes.formGroup}>
                  <TextField
                    fullWidth
                    label={t('class name')}
                    name="classeName"
                    onChange={(event) => handleFieldChange(event, 'classeName', event.target.value)}
                    value={values.classeName}
                    variant="outlined"
                    required
                    inputProps={{ maxLength: 30 }}
                  />
                </div>

                {/* Input: Establishment */}
                <div className={classes.formGroup}>
                  <TextField
                    fullWidth
                    label={t('establishment')}
                    name="etablissement"
                    onChange={(event) => handleFieldChange(event, 'etablissement', event.target.value)}
                    value={values.etablissement}
                    variant="outlined"
                    required
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                {/* Select: City */}
                {/* <div style={divStyle} >
                  <div style={{marginLeft:'10px'}}>
                    <Typography gutterBottom variant="caption">
                      {t('city')}:
                    </Typography>
                  </div>
                  <Select variant="h6"
                          styles={customStylesSelector}
                          defaultValue={allCity.filter(option => option.label === user.cityName) }
                          className="basic-single"
                          classNamePrefix="select"
                          placeholder={t('choose your city')}
                          onChange={handleChangeCity}
                          options = { allCity }
                          isClearable
                  />
                </div> */}

                {/* Message */}
                <Typography
                  className={classes.fieldHint}
                  variant="body2"
                >
                  * {t('by default the class takes the city and the establishment in your profile')}
                </Typography>
              </div>
            </Collapse>
          </div>

          {/* Section Invite Students */}
          <div className={classes.contentSection} >
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

                        onChange={(event) => handleFieldChange(event, 'fullNameStudent', event.target.value)}
                        value={values.fullNameStudent}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "10px" }}
                      />

                      <TextField
                        error={hasError('email')}
                        label={t('email address')}
                        name="email"
                        onChange={(event) => handleFieldChange(event, 'emailStudent', event.target.value)}
                        value={values.emailStudent}
                        variant="outlined"
                        fullWidth
                      />
                      <div className={classes.inviteAddButton}>
                        <Button
                          style={{ backgroundColor: '#393939', color: 'white', borderRadius: "20px" }}
                          onClick={handleTagAddStudent}
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
                      {/* <div
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
                      </div> */}
                       <IconButton
                        aria-label="delete"
                        className={classes.margin}
                        href={'https://bucket.mwsapp.com/laclasse/bulkAdd.csv'}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                      <FilesDropzoneManageStudents 
                      ref={childRef}
                      setInvitedStudents={setInvitedStudents}
                      invitedStudents={invitedStudents}
                      errorMessage={setErrorSnackbarMessage}
                      isErrorSnackbar={setOpenErrorSnackbar}
                      inviteTeacher={false}
                      newClass={true}
                      />

                    </div>
                }


                {/* Tags */} 

                <div className={classes.tags}>
                  {values.tags.map((emailStudent) => (
                    <Chip
                      deleteIcon={<CloseIcon />}
                      key={emailStudent}
                      label={emailStudent}
                      onDelete={() => handleTagDeleteStudent(emailStudent)}
                    />
                  ))}
                </div>
              </div>
            </Collapse>

          </div>

          {/* Section Invite Teachers */}
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleInviteTeachers}
            >
              <Typography variant="h5">{t('Adding Teachers')}</Typography>
              {expandInviteTeachers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />

            <Collapse in={expandInviteTeachers}>
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

                        onChange={(event) => handleFieldChange(event, 'fullNameTeacher', event.target.value)}
                        value={valuesTeacher.fullNameTeacher}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "10px" }}
                      />

                      <TextField
                        error={hasError('email')}
                        label={t('email address')}
                        name="email"

                        onChange={(event) => handleFieldChange(event, 'emailTeacher', event.target.value)}
                        value={valuesTeacher.emailTeacher}
                        variant="outlined"
                        fullWidth
                      />
                      <div className={classes.inviteAddButton}>
                        <Button
                          style={{ backgroundColor: '#393939', color: 'white', borderRadius: "20px" }}
                          onClick={handleTagAddTeacher}
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
                      <IconButton
                        aria-label="delete"
                        className={classes.margin}
                        href={'https://bucket.mwsapp.com/laclasse/bulkAdd.csv'}
                      >
                        <CloudDownloadIcon />
                      </IconButton>

                      <FilesDropzoneManageStudents 
                      ref={childRef}
                      setInvitedStudents={setInvitedStudents}
                      invitedStudents={invitedStudents}
                      errorMessage={setErrorSnackbarMessage}
                      isErrorSnackbar={setOpenErrorSnackbar}
                      inviteTeacher={true}
                      />

                    </div>
                }


                {/* Tags */}

                <div className={classes.tags}>
                  {valuesTeacher.tags.map((emailTeacher) => (
                    <Chip
                      deleteIcon={<CloseIcon />}
                      key={emailTeacher}
                      label={emailTeacher}
                      onDelete={() => handleTagDeleteTeacher(emailTeacher)}
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

      <ErrorSnackbar
         onClose={setOpenErrorSnackbar}
         open={openErrorSnackbar}
         errorMessage={errorSnackbarMessage}
      />
    </Drawer>
  );
}

NewCreateClasseModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default NewCreateClasseModal;
