import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { useDropzone } from 'react-dropzone';
import { google, outlook, office365, yahoo, ics } from "calendar-link";
import validate from 'validate.js';
import {
  Button,
  Divider,
  Drawer,
  Typography,
  Grid,
  Collapse
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import city from '../../mock/villeMaroc';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactGA from 'react-ga';
import * as API from '../../services2';

// import array from json
let calenderValues = ["google", "outlook", "office365", "yahoo", "ics"]
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
  bordercalendar: {
    marginTop: '10px',
    width: '350px',
    height: '140px',
    border: '2px solid #c1c1c1'
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

function AddCalendar({
  setIsCalender,
  open,
  onClose,
  className,
  currentClasseId,
  theCourse,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandAddCalendar, setExpandAddCalendar] = useState(true);

  const history = useHistory();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);


  const event = {
    title: "My birthday party",
    description: "Be there!",
    start: "2019-12-29 18:00:00 +0100",
    duration: [3, "hour"],
  };

  const [getCalenderShowValue, getCalenderShow] = useState([])

  // useEffect(() => {
  //   if (!setIsCalender) return
  //   if (calenderValues) {
  //     for (let i = 0; i < calenderValues.length; i++)
  //       getCalender(calenderValues[i])
  //   }

  // }, [setIsCalender])


  // const getCalender = (type) => {
  //   API.getCalenderValues(thecours.id, type, token)
  //     .then((data) => {
  //       console.log("The Get Calender::::::", data.data)
  //       // let 
  //       // getCalenderShow(getCalenderShowValue => getCalenderShowValue.concat(Object.values(data.data)));
  //       //with react-js element need to have label value ( just for UI Reason )
  //     }).catch((error) => { console.log(error); });
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    ReactGA.event({
      category: 'Classe',
      action: 'Create classe!'
    });

    setDisableSubmit(true);

  };

  const handleClick=(type)=>{
   
    API.addRoomToCalendar(theCourse.id, type, token)
    .then((response) => {
      window.open(response.data)
    })
  }
  const handleToggleAddCalendar = () => {
    setExpandAddCalendar((prevExpandProject) => !prevExpandProject);
  };


  useEffect(() => {    
  }, []);

  console.log("The Best value of Calender::::".getCalenderShowValue)
  return (

    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={() => { onClose();}}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        id='AddCalendarForm'
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
              onClick={handleToggleAddCalendar}
            >
              <Typography variant="h5">{t('Add to calendar')}</Typography>
              {expandAddCalendar ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandAddCalendar}>
              <div className={classes.contentSectionContent}>
                <Divider />
                <Grid xs={12} style={{ padding: "20px 0px 20px 25px" }}>
                  <Grid container justify="space-around" alignItems="center" style={{flexWrap:'nowrap'}}>
                    <div
                       onClick={() => handleClick("outlook")}

                    // onClick={() => window.open(outlook(event), "https://outlook.live.com/calendar/0/deeplink/compose?body=d&enddt=2021-09-16T08:05:00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2021-09-16T06:05:00&subject=1")}
                    >
                      <Grid item xs={6} style={{ textAlign: 'center' }}>
                        <img src={window.location.origin +"/images/icons/outlook.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography >
                          Add to Outlook
                          Calendar
                        </Typography>
                      </Grid>
                    </div>
                    <div
                      onClick={() => handleClick("google")}

                    // onClick={() => window.open(google(event), "https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20210916T060500Z%2F20210916T080500Z&details=d&text=1")}
                    // onClick={() => { window.open(google(event), ""
                    >

                      <Grid item xs={6} style={{ textAlign: 'center' }}>
                        <img src={window.location.origin +"/images/icons/calendar.png"} style={{ width: '60px', height: '60px' }} ></img>
                        <Typography>
                          Add to Google
                          Calendar
                        </Typography>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
                <Grid xs={12} style={{ padding: "20px 0px 20px 20px" }} >
                  <Grid container justify="space-around" alignItems="center" style={{flexWrap:'nowrap'}}>
                    <div onClick={() => handleClick("ical")}>
                      <Grid item xs={6} style={{ textAlign: 'center' }}>
                        <img src={window.location.origin +"/images/icons/icalendar.jpg"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography>
                          Add to
                          iCalendar
                        </Typography>
                      </Grid>
                    </div>
                    <div
                      onClick={() => handleClick("office365")}

                    // onClick={() => window.open(office365(event), "https://outlook.office.com/calendar/0/deeplink/compose?body=d&enddt=2021-09-16T08:05:00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2021-09-16T06:05:00&subject=1")}
                    >
                      <Grid item xs={6} style={{ textAlign: 'center' }}>
                        <img src={window.location.origin +"/images/icons/logo_office.png"} style={{ width: '60px', height: 'auto' }}></img>
                        <Typography>
                          Add to Office365
                              </Typography>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
                <Grid xs={12} style={{ padding: "20px 0px 20px 42px" }}>
                  <Grid container justify="flex-start" alignItems="center" style={{flexWrap:'nowrap'}}>
                    <div
                      onClick={() => handleClick("yahoo")}

                    // onClick={() => window.open(yahoo(event), "https://calendar.yahoo.com/?desc=d&et=20210916T080500Z&st=20210916T060500Z&title=1&v=60")}
                    >
                      <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <img src={window.location.origin +"/images/icons/yahooCalendar.png"} style={{ width: '60px', height: 'auto' }}></img>
                        <Typography >
                          Add to Yahoo
                            </Typography>
                      </Grid>
                    </div>
                    <Grid item xs={6}>

                    </Grid>
                  </Grid>
                </Grid>


              </div>
            </Collapse>
          </div>
        </div>
        <Divider />

        {/* Submit Button */}
        {/* <div className={classes.actions}>
          <Button
            style={{ backgroundColor: disableSubmit ? '#9b9ea1' : '#f7b731 ', color: 'white', borderRadius: "20px" }}
            variant="contained"
            fullWidth
            type="submit"
            form="AddCalendarForm"
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
        </div> */}
      </form>
    </Drawer >

  );
}

AddCalendar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default AddCalendar;
