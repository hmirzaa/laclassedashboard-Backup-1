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
import city from '../../mock/villeMaroc';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FilesDropzoneManageStudents from 'src/components/FilesDropzoneManageStudents';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactGA from 'react-ga';
import * as API from '../../services2';

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
  } ,
  fullName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 100
    }
  }
};

const divStyle = {
  // marginTop: '10px' ,
  marginBottom:'15px'
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

function EditClassModal({
  open, onClose, className, theclasse, onChange,
  currentClasseId,
  ...rest
}) 
{
  console.log(theclasse)
  
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandCreateClass, setExpandCreateClass] = useState(true);

  const history = useHistory(); 
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

 if (theclasse!==undefined)  {
   window.$userId=theclasse.id;
  window.$initialValues = {
  classeName: theclasse.classeName,
   etablissement: theclasse.schoolName,
   ville: theclasse.city
  };
}

const initialValues= window.$initialValues;
  const [values, setValues] = useState({ ...initialValues });
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const  handleChangeCity = (newValue, actionMeta) => {
    values.ville = newValue.label;
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

  const handleSubmit = async (event) => {
    event.preventDefault();

   onChange=true;

    let classeData = {
      classeName: values.classeName,
      schoolName: values.etablissement,
      city: values.ville
    };

    const myUserId = window.$userId;

    API.updateClasse(myUserId, classeData, token)
      .then(() => {
        if (window.location.pathname === '/classes') {
          window.location.reload();
        } else {
          history.push('/classes');
         onChange=false;
        }
      })
      .catch((error) => {
       onChange=false;
      });
  };

  const resetFormsOnClose = () => {
    setValues({ ...initialValues });
  };

  const handleToggleCreateClass = () => {
    setExpandCreateClass((prevExpandProject) => !prevExpandProject);
  };

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
      onClose={() => {onClose(); resetFormsOnClose();}}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        id='editClassForm'
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
              <Typography variant="h5">{t('edit class')}</Typography>
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
        
        </div>
        <Divider />

        

        {/* Submit Button */}
        <div className={classes.actions}>
          <Button
            style={{backgroundColor : disableSubmit ? '#9b9ea1' : '#f7b731 ' , color:'white', borderRadius:"20px"}}
            variant="contained"
            fullWidth
            type="submit"
            form="editClassForm"
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

EditClassModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  theclasse: PropTypes.object.isRequired
};

export default EditClassModal;
