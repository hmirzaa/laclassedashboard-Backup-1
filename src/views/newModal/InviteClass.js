import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Switch from "@material-ui/core/Switch";
import { useDropzone } from "react-dropzone";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

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
import { ErrorSnackbar } from "../Snackbars";
import * as API from "../../services2";


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
const initialValues = {
  fullName: '',
  email: '',
  invitedUsers: [],
};

function InviteClass({
  isErrorSnackbar,
  onSuccess,
  open,
  onClose,
  isClasse,
  thisthingid,
  inviteStudents,
  inviteTeacher,
  errorMessage,
  className,
  classID,
  currentClasseId,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const childRef = useRef();

  const [values, setValues] = useState({ ...initialValues });
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [oldInvitedUsers, setOldInvitedUsers] = useState({ ...initialValues });
  const [snackbarMessage, setSnackbarMessage] = useState('Done!');
  const [isConfirmClicked, setIsConfirmClicked] = useState(false);

  const [expandInviteStudents, setExpandInviteStudents] = useState(true);
  const [expandInviteTeachers, setExpandInviteTeachers] = useState(true);
  const [invitedStudents, setInvitedStudents] = useState([]);


  const history = useHistory();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);


  const handleIsBulkUploadSwitch = (event) => {
    event.persist();
    setIsBulkUpload(event.target.checked);
    setIsConfirmClicked(false);
  };

  const handleFieldChange = (event, field, value) => {
    event.persist();
    setValues((prevValues) => ({
      ...prevValues,
      // isModerator: inviteTeacher ? true : false,
      [field]: value,
    }));

  };

  const resetFormsOnClose = () => {
    setValues({ ...initialValues });
  };
  const handleToggleInviteStudents = () => {
    setExpandInviteStudents((prevExpandProject) => !prevExpandProject);
  };
  const handleToggleInviteTeachers = () => {
    setExpandInviteTeachers((prevExpandProject) => !prevExpandProject);
  };

  const handleTagAdd = () => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      if (newValues.email.trim() && newValues.fullName.trim() && !newValues.invitedUsers.includes(newValues.email) && !newValues.invitedUsers.includes(newValues.fullName)) {
        let isDuplicated = false;
        // Check old invites
        for (let _oldInvitedUser of oldInvitedUsers.invitedUsers) {
          if (_oldInvitedUser.split(";")[1] === newValues.email) {
            isDuplicated = true;
          }
        }

        // Check new invites
        for (let _newInvitedUser of values.invitedUsers) {
          if (_newInvitedUser.split(";")[1] === newValues.email) {
            isDuplicated = true;
          }
        }

        if (!isDuplicated) {
          newValues.invitedUsers = [...newValues.invitedUsers];
          newValues.invitedUsers.push(newValues.fullName + ',' + newValues.email);
        }
      }

      newValues.email = '';
      newValues.fullName = '';

      return newValues;
    });
  };

  const handleAddInvitedUser = (value) => {
    setOldInvitedUsers((prevValues) => {
      const newValues = { ...prevValues };

      newValues.invitedUsers = [...newValues.invitedUsers];
      newValues.invitedUsers.push(value);

      return newValues;
    });

    setValues((prevValues) => {
      const newValues = { ...prevValues };

      newValues.invitedUsers = [...newValues.invitedUsers];
      newValues.invitedUsers.push(value);

      return newValues;
    });
  };


  const handleTagChips = (email) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };

      newValues.invitedUsers = newValues.invitedUsers.filter((t) => t !== email);

      return newValues;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsConfirmClicked(true);
    if (isBulkUpload) {
      childRef.current.handleUploadFile();
    } else {
      const { invitedUsers, email, fullName } = values
      // const data = {
      //   invitedUsers: invitedUsers,
      //   isModerator: inviteTeacher ? true : false
      // }
      API.sendInvitestoClass(classID, {
        invitedUsers: invitedUsers.length > 0 ? invitedUsers : [`${fullName + `,` + email}`],
        isModerator: inviteTeacher ? true : false
      }, token).then((res) => {
        const { status } = res
        if (status === 1) {
          onSuccess(true)
          setTimeout(() => {
            onClose()
            window.location.reload()
            setValues(initialValues)
          }, 1500);
        }
        if( status == 0)
        {
          errorMessage(t(res.message));
          isErrorSnackbar(true);
          setTimeout(() => {
            isErrorSnackbar(false);
            setIsConfirmClicked(false)
          }, 1500);
        }
      }).catch((e) => {
        setIsConfirmClicked(false)
        isErrorSnackbar(true)
      })
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //  onDrop: handleDrop,
    accept: '.csv'
  });

  console.log("the Class Invite user are us: :::::", values)
  return (
  <>
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={() => { onClose(); resetFormsOnClose(); }}
      open={open}
      variant="temporary"
    >
      {console.log('values --->', values)}
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

          {/* Section Invite Teachers */}

          <div style={{ display: inviteTeacher }} className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleInviteTeachers}
            >
              <Typography variant="h5">{inviteTeacher ? t('Adding Teachers') : t('Adding Student')}</Typography>
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
                  {t(`With the option of Bulk add, you can add more ${inviteTeacher ? 'teachers' : 'student'} using CSV file`)}
                </Typography>

                <FormControlLabel
                  className={classes.switchPublicCourse}
                  control={(
                    <Switch
                      checked={isBulkUpload}
                      name="instant"
                      onChange={handleIsBulkUploadSwitch}
                    />
                  )}
                />

                {/* Input: Invite Full Name */}
                {
                  isBulkUpload ? null :
                    <div className={classes.formGroup}>
                      <TextField
                        //    error={hasError('fullName')}
                        label={t('full name')}
                        name="fullName"
                        onChange={(event) => handleFieldChange(event, 'fullName', event.target.value)}
                        value={values.fullName}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "10px" }}
                      />

                      <TextField
                        //    error={hasError('email')}
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
                        {t(`these ${inviteTeacher ? 'teachers' : 'student'} will receive the invitation in their email addresses`)}
                      </Typography>
                    </div>
                }

                {
                  !isBulkUpload ? null :
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
                      onSuccess={onSuccess} 
                      ref={childRef} 
                      onClose={onClose} 
                      classID={classID}  
                      errorMessage={errorMessage}
                      isErrorSnackbar={isErrorSnackbar}
                      setIsConfirmClicked={setIsConfirmClicked}
                      inviteTeacher={inviteTeacher}
                      setInvitedStudents={setInvitedStudents}
                      invitedStudents={invitedStudents}
                      newClass={false}
                      />

                    </div>
                }


                {/* Tags */}

                <div className={classes.tags}>
                  {values.invitedUsers.map((email) => (
                    <Chip
                      deleteIcon={<CloseIcon />}
                      key={email}
                      label={email}
                      onDelete={() => handleTagChips(email)}
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
            style={{ backgroundColor: isConfirmClicked ? '#9b9ea1' : '#f7b731 ', color: 'white', borderRadius: "20px" }}
            variant="contained"
            fullWidth
            type="submit"
            form="createClassForm"
            disabled={isConfirmClicked}
          >
            {
              isConfirmClicked ?
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
     </>
  );
}

InviteClass.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  inviteStudents: PropTypes.string,
  inviteTeacher: PropTypes.string,
  classesList: PropTypes.array
};

export default InviteClass;

