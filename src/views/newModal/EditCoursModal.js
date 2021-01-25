import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import validate from 'validate.js';
import {
  Button, CardActions, CardContent, Chip, Divider,
  Drawer,
  TextField, Typography,
  Collapse, Switch, FormControlLabel,
} from '@material-ui/core';
import {
  ListItemIcon,
  ListItemText,

  MenuItem
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import AddIcon from '@material-ui/icons/Add';
import Spinner from 'react-bootstrap/Spinner';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import city from '../../mock/villeMaroc';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactGA from 'react-ga';
import * as API from '../../services2';
import moment from 'moment';
import { addLabelForSelectorClasse } from '../../utils/ListHelper';
import DatePicker from 'react-datepicker';
import makeAnimated from 'react-select/animated/dist/react-select.esm';
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import momentLocalizer from 'react-widgets-moment';
import Moment from 'moment';
import { ErrorSnackbar } from '../Snackbars';

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


function EditCoursModal({
  isEdited,
  open,
  onClose,
  onChange,
  currentClasseId,
  theCours,
  className,
  ...rest
}) {

  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const history = useHistory();
  const token = useSelector((state) => state.user.token);


  if (window.location.pathname != '/explore' || window.location.pathname == '/explore') {

    window.$initialValues = {
      coursName: theCours?.roomName,
      description: theCours?.description,
      classeName: theCours?.classRooms.length > 0 ? theCours?.classRooms[0]._id : 'none',
      startDate: (!theCours?.isInstant ? moment(startDate).format('YYYY-MM-DDTHH:mm') : null),
      endDate: (!theCours?.isInstant ? moment(endDate).format('YYYY-MM-DDTHH:mm') : null),
      isInstant: theCours?.isInstant,
      category: theCours?.category
    };
  }
  const initialValues = window.$initialValues
  //  console.log("Hamza Ayub"+ JSON.stringify(initialValues.classeName))

  const [values, setValues] = useState({ ...initialValues });
  const [classesList, setClassesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState(t('Verify Date'));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currentClasses, setCurrentClasses] = useState();
  const [currentCategories, setCurrentCategories] = useState([]);
  const [isInstantCours, setIsInstantCours] = useState(false);
  const [isPublicCours, setIsPublicCours] = useState(false);
  const [currentClasse, setCurrentClasse] = useState([]);
  const [isWhiteBoard, setIsWhiteBoard] = useState(false);
  const [expandCreateCours, setExpandCreateCours] = useState(true);
  const [expandAdvancedSettings, setExpandAdvancedSettings] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [dateTimePickerLanguage, setDateTimePickerLanguage] = useState('fr');
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [isCLassesEmpty, setIsClassesEmpty] = useState(true);
  const [maxDateTime, setMaxDateTime] = useState();
  const [changestartEdit, changeStartEdit] = useState(false);
  const [changeendEdit, changEendEdit] = useState(false);
  const [isAlert, setIsAlert] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsAlert(false)
    }, 1500);

  }, [isAlert])

  useEffect(() => {

    if (!isEdited) return
    fetchClasses()
    if (values.category != null) {
      setIsPublicCours(true)
      const data = {
        id: values.category.id,
        label: values.category.name,
        name: values.category.name,
        type: "categories",
        value: values.category.id,
        _id: values.category.id,
      }
      setCurrentCategories(data)
      fetchCategories()

    }


  }, [isEdited])




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
  };
  const handleWhiteBoard = () => {
    if (isWhiteBoard) {
      setIsWhiteBoard(false);

    } else {
      setIsWhiteBoard(true);
    }
  };

  const handleChange = (newValue) => {
    console.log("newValue", newValue)
    var classesIds = [];
    if (newValue && newValue.length > 0) {
      setIsClassesEmpty(false);
      // newValue.map(option => (classesIds.push(option._id)));
      // values.classeId = classesIds;
      setCurrentClasses(newValue);


    } else {
      setIsClassesEmpty(true);
      setCurrentClasses(newValue);
    }

  };
  const handleChangeClassesId = (option) => {
    setCurrentClasses(option)
  };

  const handleChangeCategoryId = (option) => {
    console.log("The setCurrentCategories ::", option)
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
    console.log("hamza Aslam" + theCours)

    //default Value to end meeting time Add to end Date two Hour default
    // if (values?.startDate) {
    //   let value = moment.utc(theCours?.startDateTime).toDate().toString()
    //   setNewStartDate(value);
    // }
    // else {
    // let tempStartDate = new Date(Moment(newStartDate).add(30, 'minutes'));
    // setNewStartDate(tempStartDate);
    // setNewEndDate(new Date(Moment(tempStartDate).add(2, 'hours')));
    // setMaxDateTime(new Date(Moment(tempStartDate).add(10, 'hours')));
    // // }


    return () => {
      mounted = false;
    };
  }, [token]);


  const fetchClasses = () => {
    if (classesList.length) return
    API.getConnectedUserClasses(token)
      .then((data) => {
        const { data: { classes } } = data
        if (classes) {
          let claassList = classes.filter((value) => {
            if (value.isActive == true) {
              return value
            }
          })
          let showClasses;
          if (values.classeName) {
            showClasses = claassList?.filter((value) => {
              if (theCours.classRooms.find(id => value.id == id.classe)) {
                return value
              }
            })
            setCurrentClasses(showClasses)
            setClassesList(addLabelForSelectorClasse(claassList));
            // setCurrentClasse(currentClasses)
            // showClassArray.push(showClasses)
          }
        }
        //with react-js element need to have label value ( just for UI Reason )
        // setClassesList(addLabelForSelectorClasse(classes));
      }).catch((error) => { console.log(error); });
  };


  const fetchCategories = () => {
    if (categoriesList.length) return
    API.getConnectedUserCategories(token)
      .then((data) => {
        const { data: { categories } } = data
        //with react-js element need to have label value ( just for UI Reason )
        setCategoriesList(addLabelForSelectorClasse(categories));
      }).catch((error) => { console.log(error); });
  };


  if (currentClasseId) {
    values.classeId = currentClasseId;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const duration = moment(newEndDate).get('hour')
    setDisableSubmit(true)
    let clasees;
    if (currentClasses) {
      clasees = currentClasses.map((value) => {
        return value.id
      })
    }
    else {
      clasees = [];
    }
    let checkValue = moment(newStartDate).isBefore(newEndDate) == true ? moment(newStartDate).isBefore(newEndDate) : (myStartDate && myEndDate)

    console.log("", newStartDate, newEndDate)
    if (checkValue || theCours.isInstant) {
      if (moment(newEndDate).diff(moment(newStartDate), 'hours') > 10) {
        setErrorSnackbarMessage(t('course duration is too long'));
        setOpenErrorSnackbar(true);
        setDisableSubmit(false);
      } else {

        let newDateStart = moment(newStartDate).isBefore(newEndDate) == true ? moment(newStartDate).format('YYYY-MM-DD HH:mm') : moment(myStartDate).format('YYYY-MM-DD HH:mm')
        let newDateEnd = moment(newStartDate).isBefore(newEndDate) == true ? moment(newEndDate).format('YYYY-MM-DD HH:mm') : moment(myEndDate).format('YYYY-MM-DD HH:mm')
        // console.log("STARTDATEIS"+newDateStart)
        let roomData = {
          roomName: values.coursName,
          description: values.description,
          // duration: theCours.duration,
          category: values.category == null ? null : values.category.id,
          classe: clasees,
          startDateTime: (!theCours.isInstant ? newDateStart : null),
          endDateTime: (!theCours.isInstant ? newDateEnd : null),
          isInstant: theCours.isInstant.toString(),
          // isCLassesEmpty: isPublicCours ? true : isCLassesEmpty,
          isPublic: isPublicCours.toString()
        };
        console.log("The Data:::::::", roomData, theCours.id, token)
        API.updateRoomById(theCours.id, roomData, token)
          .then((result) => {
            console.log("The Successsor", result)
            if (window.location.pathname === '/cours') {

              window.location.reload();

            } else if (window.location.pathname.includes('/explore')) {
              window.location.reload();
            }
            else if (window.location.pathname.includes('classe/')) {
              window.location.reload();

            }
            else {
              history.push('/cours');
            }
          })
          .catch((error) => {
            console.log("errorerrorerrorerrorerrorerror", error)
            setDisableSubmit(false);

          });
      }
    } else {
      setErrorSnackbarMessage(t('Verify Date'));
      setOpenErrorSnackbar(true);
      setDisableSubmit(false);

    }
  };
  const onchageValue = () => {
    changeStartEdit(true)
  }
  const onchageValueEnd = () => {
    changEendEdit(true)
  }
  const handleCreateCoursOnClose = () => {
    setValues({ ...initialValues });
    setExpandAdvancedSettings(false);
    setExpandCreateCours(true);
  };
  // let showClassArray;
  var myStartDate = moment.utc(theCours?.startDateTime).format('YYYY-MM-DD HH:mm')
  var myEndDate = moment.utc(theCours?.endDateTime).format('YYYY-MM-DD HH:mm')
  var myStartDateChange = moment.utc(theCours?.startDateTime).format('YYYY-MM-DD HH:mm')
  var myEndDateChange = moment.utc(theCours?.endDateTime).format('YYYY-MM-DD HH:mm')

  console.log("The Edit Model is::::::", theCours, currentClasses, values.category, values)
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
        id='EditCoursForm'
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
              <Typography variant="h5">{t('Edit Course')}</Typography>
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
                  />
                </div>

                {/* Input: Cours description */}
                <div className={classes.formGroup}>
                  <TextField
                    fullWidth
                    label={t('description')}
                    name="description"
                    onChange={(event) => handleFieldChange(event, 'description', event.target.value)}
                    value={values.description}
                    variant="outlined"
                  />
                </div>
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
                      disabled={!isPublicCours && true}

                    />
                  )}
                  label={t('public course')}
                />

                {/* Select: Add Classes to course */}

                {

                  !isPublicCours &&
                  <div style={divStyle}>
                    <div style={{ marginLeft: '10px' }}>
                      <Typography gutterBottom variant="caption">
                        {t('choose your class')}
                      </Typography>
                    </div>

                    <Select
                      action={'classe'}
                      closeMenuOnSelect={false}
                      classNamePrefix="select"
                      components={animatedComponents}
                      value={!isPublicCours && currentClasses}
                      // value={showClasses}
                      //  defaultValue={{ label: initialValues.classeName,  value: initialValues.classeName}}
                      onChange={(e) => handleChange(e)}
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
                            disabled={true}
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
                      closeMenuOnSelect={false}
                      classNamePrefix="select"
                      placeholder="Category"
                      components={animatedComponents}
                      value={currentCategories}
                      onChange={(e) => handleChangeCategoryId(e)}
                      className="basic-multi-select"
                      options={categoriesList}
                    />
                  </div>
                }
                <Divider />
                {/* Start Date */}
                {
                  changestartEdit == false &&
                  values?.startDate &&
                  <>
                    <div style={{ marginLeft: '70%', with: '90%', alignSelf: 'center' }}>
                      <MenuItem onClick={() => onchageValue()} >
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('edit')} />
                      </MenuItem>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: 5 }}>
                      <div style={{ cursor: 'pointer' }} onClick={() => onchageValue()}>
                        <Typography
                          gutterBottom
                          variant="h6" align='inherit'
                          style={{ marginTop: '5px' }}
                        >
                          {t('start date')}
                        </Typography>
                        <h7 style={{ marginTop: 10 }}>{myStartDate}</h7>

                        <Typography
                          gutterBottom
                          variant="h6" align='inherit'
                          style={{ marginTop: '10px' }}
                        >
                          {t('end date')}
                        </Typography>

                        <h7 style={{ marginTop: 10 }}>{myEndDate}</h7>
                      </div>
                    </div>

                  </>
                }
                {
                  changestartEdit &&
                  (

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
                          defaultValue={new Date(myStartDateChange)}
                          min={new Date()}
                          // value={newStartDate}
                          onChange={(date) => {
                            setNewStartDate(date);

                          }}
                        />
                      </div>
                  )
                }

                {/* End Date */}

                {
                  changestartEdit &&
                  (
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
                          defaultValue={new Date(myEndDateChange)}
                          // value={newEndDate}
                          onChange={date => setNewEndDate(date)}
                        />
                      </div>
                  )
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
            form="EditCoursForm"
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

EditCoursModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default EditCoursModal;
