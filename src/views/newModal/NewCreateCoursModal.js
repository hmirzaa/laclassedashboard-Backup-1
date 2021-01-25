import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Divider,
  Drawer,
  TextField, Typography,
  Collapse, Switch, FormControlLabel,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import Spinner from 'react-bootstrap/Spinner';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactGA from 'react-ga';
import * as API from '../../services2';
import moment from 'moment';
import { addLabelForSelectorClasse } from '../../utils/ListHelper';
import makeAnimated from 'react-select/animated/dist/react-select.esm';
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import momentLocalizer from 'react-widgets-moment';
import { ErrorSnackbar } from '../Snackbars';
import Moment from 'moment';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const animatedComponents = makeAnimated();
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
  switchPublicCourse: {
    marginTop: theme.spacing(2)
  },
  switchWhiteBoard: {
    marginTop: theme.spacing(2)
  },
  switchInstantCourse: {
    marginTop: theme.spacing(2)
  },
  datePickerStartDate: {
    marginTop: theme.spacing(2)
  },
  datePickerEndDate: {
    marginTop: theme.spacing(2)
  },
  dateTimePicker: {
    marginTop: theme.spacing(2)
  }
}));

const divStyle = {
  marginTop: '10px',
  marginBottom: '10px'
};

const initialValues = {
  coursName: '',
  description: '',
  classeId: 'none',
  startDate: moment().format('YYYY-MM-DDTHH:mm'),
  endDate: moment().add(1, 'h').format('YYYY-MM-DDTHH:mm')
};

function NewCreateCoursModal({
  open,
  onClose,
  currentClasseId,
  className,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const history = useHistory();
  const token = useSelector((state) => state.user.token);

  const [values, setValues] = useState({ ...initialValues });
  const [classesList, setClassesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState(t(''));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currentClasses, setCurrentClasses] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [isInstantCours, setIsInstantCours] = useState(false);
  const [isPublicCours, setIsPublicCours] = useState(false);
  const [isWhiteBoard, setIsWhiteBoard] = useState(false);
  const [expandCreateCours, setExpandCreateCours] = useState(true);
  const [expandAdvancedSettings, setExpandAdvancedSettings] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [dateTimePickerLanguage, setDateTimePickerLanguage] = useState('fr');
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [maxDateTime, setMaxDateTime] = useState();
  const [isAlert, setIsAlert] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsAlert(false)
    }, 1500);
  }, [isAlert])

  Moment.locale(dateTimePickerLanguage);
  momentLocalizer();

  const handleToggleCreateCours = () => {
    setExpandCreateCours((prevExpandProject) => !prevExpandProject);
  };

  const handleToggleAdvancedSettings = () => {
    setExpandAdvancedSettings((prevExpandProject) => !prevExpandProject);
  };

  const handleErrorSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };

  const handleInstantCours = () => {
    isInstantCours ? setIsInstantCours(false) : setIsInstantCours(true);
  };

  const handlePublicCours = () => {
    if (isPublicCours) {
      setIsPublicCours(false);

    } else {
      setIsPublicCours(true);
      setIsInstantCours(false);
    }
  };
  const handleWhiteBoard = () => {
    if (isWhiteBoard) {
      setIsWhiteBoard(false);

    } else {
      setIsWhiteBoard(true);
    }
  };

  const handleChangeClassesId = (option) => {
    setCurrentClasses(option)
  };

  const handleChangeCategoryId = (option) => {
    setCurrentCategories(option)
  };



  const handleFieldChange = (event, field, value) => {
    event.persist();
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  useEffect(() => {
    let mounted = true;

    //default Value to end meeting time Add to end Date two Hour default
    let tempStartDate = new Date(Moment(newStartDate).add(0, 'minutes'));
    setNewStartDate(tempStartDate);
    setNewEndDate(new Date(Moment(tempStartDate).add(2, 'hours')));
    setMaxDateTime(new Date(Moment(tempStartDate).add(10, 'hours')));


    const fetchClasses = () => {
      API.getConnectedUserClasses(token)
        .then((data) => {
          const { data: { classes } } = data
          if (mounted) {
            if (classes) {
              let claassList = classes.filter((value) => {
                if (value.isActive == true) {
                  return value
                }
              })
              setClassesList(addLabelForSelectorClasse(claassList));
            }
            //with react-js element need to have label value ( just for UI Reason )

          }
        }).catch((error) => { console.log(error); });

      API.getConnectedUserCategories(token)
        .then((data) => {
          const { data: { categories } } = data
          if (mounted) {
            //with react-js element need to have label value ( just for UI Reason )
            setCategoriesList(addLabelForSelectorClasse(categories));

          }
        }).catch((error) => { console.log(error); });

    };

    if (currentClasseId) {
      values.classeId = currentClasseId;
    }
    fetchClasses();


    return () => {
      mounted = false;
    };
  }, [token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    ReactGA.event({
      category: 'Cours',
      action: 'Create cours!'
    });

    // const duration = moment(newEndDate).get('hour')
    setDisableSubmit(true)

    // var ms = moment(newStartDate,"DD/MM/YYYY HH:mm:ss").diff(moment(newEndDate,"DD/MM/YYYY HH:mm:ss"));
    // var d = moment.duration(ms);
    // const duration = Math.abs(d.asHours())

    if (moment(newStartDate).isBefore(newEndDate)) {
      if (moment(newEndDate).diff(moment(newStartDate), 'hours') > 10) {
        setErrorSnackbarMessage(t('course duration is too long'));
        setOpenErrorSnackbar(true);
        setDisableSubmit(false);
      } else {
        let newDateStart = moment(newStartDate).format('YYYY-MM-DD HH:mm')
        let newDateEnd = moment(newEndDate).format('YYYY-MM-DD HH:mm')
        let roomData = {
          // duration: `${duration}`,
          roomName: values.coursName.replace(/'/g, ""),
          description: values.description,
          isInstant: (isInstantCours ? true : false),
          startDateTime: (!isInstantCours ? newDateStart : null),
          endDateTime: (!isInstantCours ? newDateEnd  : null),
          isPublic: isPublicCours,
          [!isPublicCours ? 'classe' : 'category']:
            !isPublicCours
              ? currentClasses.map(e => e.id)
              : currentCategories.value
        };
          if (isPublicCours && !currentCategories.value) {
            alert('Select Categories')
            setDisableSubmit(false);
          } else {
            API.createRoom(roomData, token)
              .then((res) => {
                if (window.location.pathname === '/cours') {
                  window.location.reload();
                }
                else {
                  history.push('/cours');
                }
              })
              .catch((error) => { setDisableSubmit(false); });
          }
      }
    }
    else {
      setErrorSnackbarMessage(t('Verify Date'));
      setOpenErrorSnackbar(true);
      setDisableSubmit(false);
    }
  };

  const handleCreateCoursOnClose = () => {
    setValues({ ...initialValues });
    setExpandAdvancedSettings(false);
    setExpandCreateCours(true);
  };
  console.log("Hellllllllllll>>>>>>>????????????????<<<<<<<>>>>>..........", currentClasses, classesList)

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={() => { onClose(); handleCreateCoursOnClose(); }}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        id='createCoursForm'
        onSubmit={handleSubmit}
      >
        {isAlert && <Alert severity="error">This is an error message!</Alert>}
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

          {/* Section Create Cours */}
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleCreateCours}
            >
              <Typography variant="h5">{t('Course Creation')}</Typography>
              {expandCreateCours ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandCreateCours}>
              <div className={classes.contentSectionContent}>
                {/* Input: Cours Name */}
                <div className={classes.formGroup}>
                  <TextField
                    fullWidth
                    label={t('course name')}
                    name="coursName"
                    onChange={(event) => handleFieldChange(event, 'coursName', event.target.value)}
                    value={values.coursName}
                    variant="outlined"
                    required={true}
                    inputProps={{ maxLength: 20 }}
                  />
                </div>

                {/* Input: Cours description */}
                <div className={classes.formGroup}>
                  <TextField
                    fullWidth
                    label={t('description')}
                    name="description"
                    required
                    onChange={(event) => handleFieldChange(event, 'description', event.target.value)}
                    value={values.description}
                    variant="outlined"
                    inputProps={{ maxLength: 100 }}

                  />
                </div>
                {/** Hide have whiteboard for now
                <FormControlLabel
                  className={classes.switchWhiteBoard}
                  control={(
                    <Switch
                      checked={isWhiteBoard}
                      name="white"
                      onChange={handleWhiteBoard}
                    />
                  )}
                  label={t('I want to have a white board')}
                />
                 **/}
              </div>
            </Collapse>
          </div>

          {/* Section Advanced Configurations */}
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleAdvancedSettings}
            >
              <Typography variant="h5">{t('Advanced Settings')}</Typography>
              {expandAdvancedSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandAdvancedSettings}>
              <div className={classes.contentSectionContent}>

                {/* Switch: Public Course */}

                <FormControlLabel
                  className={classes.switchPublicCourse}
                  control={(
                    <Switch
                      checked={isPublicCours}
                      name="instant"
                      onChange={handlePublicCours}
                    />
                  )}
                  label={t('public course')}
                />

                {/* Select: Add Classes to course */}

                {
                  !isPublicCours &&
                  <div style={divStyle} >
                    <div style={{ marginLeft: '10px' }}>
                      <Typography gutterBottom variant="caption">
                        {t('choose your class')}
                      </Typography>
                    </div>

                    <Select
                      action={'classe'}
                      classNamePrefix="select"
                      components={animatedComponents}
                      value={!isPublicCours && currentClasses}
                      onChange={(e) => handleChangeClassesId(e)}
                      className="basic-multi-select"
                      isMulti
                      options={classesList}
                    />
                  </div>
                }

                {/* Switch: Instant Course */}
                {
                  isPublicCours ? null :
                    <>
                      <FormControlLabel
                        className={classes.switchInstantCourse}
                        control={(
                          <Switch
                            checked={isInstantCours}
                            name="instant"
                            onChange={handleInstantCours}
                          />
                        )}
                        label={t('instant course')}
                      />
                      <Divider />
                    </>
                }
                {/* category */}
                {
                  isPublicCours &&
                  <div style={divStyle} >
                    <div style={{ marginLeft: '10px' }}>
                    </div>

                    <Select
                      classNamePrefix="select"
                      placeholder="Category *"
                      components={animatedComponents}
                      required={true}
                      value={currentCategories}
                      onChange={(e) => handleChangeCategoryId(e)}
                      className="basic-multi-select"
                      options={categoriesList}
                    />
                  </div>
                }
                {/* Start Date */}
                {
                  isInstantCours ? null :
                    <div className={classes.dateTimePicker}>
                      <Typography
                        gutterBottom
                        variant="h6" align='inherit'
                      >
                        {t('start date')}
                      </Typography>
                      <DateTimePicker
                        culture={dateTimePickerLanguage}
                        defaultValue={newStartDate}
                        min={new Date()}
                        onChange={(date) => {
                          setNewStartDate(date);
                        }}
                      />
                    </div>
                }

                {/* End Date */}
                {
                  isInstantCours ? null :
                    <div className={classes.dateTimePicker}>
                      <Typography
                        gutterBottom
                        variant="h6" align='inherit'
                      >
                        {t('end date')}
                      </Typography>
                      <DateTimePicker
                        culture={dateTimePickerLanguage}
                        min={newStartDate}
                        value={newEndDate}
                        onChange={date => setNewEndDate(date)}
                      />
                    </div>
                }

              </div>
            </Collapse>
          </div>
        </div>


        <Divider />

        {/* Submit Button */}
        <div className={classes.actions}>
          <Button
            style={{ backgroundColor: disableSubmit ? '#9b9ea1' : '#f7b731', color: 'white', borderRadius: "20px" }}
            variant="contained"
            fullWidth
            type="submit"
            form="createCoursForm"
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
        <ErrorSnackbar
          onClose={handleErrorSnackbarClose}
          open={openErrorSnackbar}
          errorMessage={errorSnackbarMessage}
        />
      </form>
    </Drawer>
  );
}

NewCreateCoursModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default NewCreateCoursModal;
