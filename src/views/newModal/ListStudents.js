import React, { Fragment, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactGA from 'react-ga';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Spinner from 'react-bootstrap/Spinner';
import { ErrorSnackbar, SuccessSnackbar } from '../Snackbars';

import SearchIcon from '@material-ui/icons/Search';
import LoadingElement from '../Loading/LoadingElement';
import * as API from "../../services2";
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {

  CardContent,

  Typography,
  Collapse,

  Drawer,

  Divider,

  Avatar,
  Button
} from '@material-ui/core';
// import ManageStudents from '../Classe/ManageStudents';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import EmptyElements from '../Empty/EmptyElements';
// import RemoveStudentModal from './RemoveStudentModal';
// import Paginate from '../../components/Paginate';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    width: 550,
    maxWidth: '100%'
  },
  confirmbutton: {
    width: "85%",
    color: 'white',
    marginBottom: "20px",
    borderRadius: "20px"
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
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  removeButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: 'gray',
    '&:hover': {
      backgroundColor: 'gray'
    }
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    marginRight: '1rem',
    backgroundColor: '#d5d3d3'
  },
  inner: {
    minWidth: 400,
    height: "470px"
  },
  container: {
    marginTop: theme.spacing(3),
    height: 200
  },
  actions: {
    justifyContent: 'flex-end',
    textAlign: 'center'
  }
}));

function ListStudents({ theCours, open, onClose, className, roomId, room, studentCountCb, isClasse, thisthingid, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);

  const user = useSelector((state) => state.user.userData);

  const [participantsStudent, setParticipants] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandListStudents, setExpandListStudents] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalRemoveStudent, setModalRemoveStudent] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  // const initialValues = {
  //   classeName: '',
  //   etablissement: user.etablissement,
  //   ville: user.cityName,
  //   email: '',
  //   fullName: '',
  //   tags: []
  // };
  //Pagination
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageStudents, setStudents] = useState([]);
  const pageMaxCount = 20;
  // const [values, setValues] = useState({ ...initialValues });

  // const handlePageClick = data => {
  //   let selected = data.selected;
  //   const offset = selected * pageMaxCount;
  //   setOffset(offset);
  //   setCurrentPage(selected);
  //   const slice = participants.slice(offset, offset + pageMaxCount);
  //   setStudents(slice);

  // };
  // const resetFormsOnClose = () => {
  //   setValues({ ...initialValues });
  // };
  const handleToggleListStudents = () => {
    setExpandListStudents((prevExpandProject) => !prevExpandProject);
  };
  const handleModalRemoveStudent = (student) => {
    setModalRemoveStudent(true);
  };

  const handleCloseModalRemoveStudent = () => {
    setModalRemoveStudent(false);
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    ReactGA.event({
      category: 'Classe',
      action: 'Create classe!'
    });

    setDisableSubmit(true);

  };
  // Search
  // const handleStudentSearch = (event) => {
  //   //event.persist();
  //   const query = event.target.value;
  //   const newquery = query.replace(/ /g, '');
  //   const results = participants.filter(participant => {
  //     return Object.keys(participant).some(key =>
  //       participant[key].toString().toLowerCase().includes(newquery)
  //     );
  //   });
  //   /////////////////////Pagination ////////////////
  //   setPageCount(Math.ceil(results.length / pageMaxCount));
  //   const slice = results.slice(offset, offset + pageMaxCount);
  //   setStudents(slice);
  //   // setParticipants(results);
  //   /////////////////////Pagination ////////////////
  // };

  useEffect(() => {
    let mounted = true;
    const fetchRoomParticipants = (classe) => {
      setIsLoading(true);

      API.getRoomParticipant(classe, token)
        .then((participants) => {
          if (mounted) {
            // Search
            /**
            const results = participants.filter(participant => {
              return Object.keys(participant).some(key =>
                participant[key].toString().toLowerCase().includes(searchTerm)
              );
            });
            **/
            // let participantsCount = participants.length;
            // if (participantsCount !== 0) {
            //   participantsCount -= 1;
            // }
            // studentCountCb(participantsCount);

            /////////////////////Pagination ////////////////
            // setPageCount(Math.ceil(participants.length / pageMaxCount));
            // const slice = participants.slice(offset, offset + pageMaxCount);
            // setStudents(slice);
            if (participants?.data?.participants?.length > 0) {
              // let participantsValue = [{ class: classe }];
              let participantsUser;
              participantsUser = participants?.data?.participants.filter((value) => {
                return (
                  value.isModerator == false
                )
              })

              participantsUser = participantsUser.map((value) => {
                return (
                  participantsUser = {
                    ...value,
                    class: classe
                  }
                )
              })
              // participantsValue = participantsValue.concat(participantsUser)
              console.log('The Final result is: ', participantsUser)
              setParticipants(participantsStudent => participantsStudent.concat(participantsUser));
              // participantsClass => participantsClass.concat
            }
            // setParticipants(participants);
            /////////////////////Pagination ////////////////

            // setParticipants(results);
            setIsLoading(false);
          }
        })
        .catch((error) => { console.log("Eorrrrooororororoo", error); });
      setIsLoading(false);
    };
    if (theCours?.classRooms.length > 0) {
      for (let i = 0; i < theCours?.classRooms.length; i++) {
        fetchRoomParticipants(theCours?.classRooms[i].classe);
      }
    }
    return () => {
      mounted = false;
    };
  }, []);

  if (!open) {
    return null;
  }

  const handleSuccessSnackbarClose = () => {
    setOpenSuccessSnackbar(false);
  };
  const handleErrorSnackbarClose = () => {
    setErrorSnackbar(false);
  };
  const handleRemoveUser = (value) => {


    if (value) {
      let data = {
        email: value.email
      };

      API.CancelParticipationFromClass(value.class, data, token)
        .then(response => {
          if (response.status == 1) {
            setOpenSuccessSnackbar(true);
            window.location.reload()
          } else {
            console.log("response.message::::", response)
            setErrorMessage(response.message)
            setErrorSnackbar(true)
          }


        })
        .catch((error) => { });
    }
  };
  console.log("The List of Student is Bhai jan :::::::::", theCours, participantsStudent)

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={() => { onClose(); }}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        id='ListStudentsForm'
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
              onClick={handleToggleListStudents}
            >
              <Typography variant="h5">{t('List of Students')}</Typography>
              {expandListStudents ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandListStudents}>
              <div className={classes.contentSectionContent}>
                <Divider />
                <CardContent className="p-3">
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <div className="table-responsive">
                        <table className="text-nowrap mb-0 table table-borderless table-hover">
                          <tbody>
                            {
                              participantsStudent.length == 0 ?
                                <EmptyElements title={t('No Students')} />
                                :
                                isLoading ? <LoadingElement /> :
                                  participantsStudent.map((value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <Avatar className={classes.avatar} />
                                            <div>
                                              <Typography variant="h4">
                                                {value.fullName}
                                              </Typography>
                                              <Typography varient="body2" style={{ color: 'grey' }}>
                                                {value.email}
                                              </Typography>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          <Button
                                            className={classes.removeButton}
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleRemoveUser(value)}
                                          >
                                            <DeleteOutlineOutlinedIcon />
                                          </Button>
                                        </td>
                                      </tr>
                                    )
                                  })

                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </CardContent>

              </div>


            </Collapse>
          </div>
        </div>
        {/* <Divider style={{ marginBottom: "20px" }} /> */}

        {/* Submit Button */}
        {/* <div className={classes.actions}>
          <Button
            style={{ backgroundColor: disableSubmit ? '#9b9ea1' : '#f7b731 ' }}
            className={classes.confirmbutton}
            variant="contained"
            fullWidth
            type="submit"
            form="ListStudentsForm"
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
          <SuccessSnackbar
            onClose={handleSuccessSnackbarClose}
            open={openSuccessSnackbar}
            message={'Deleted Successfully'}
          />
          <ErrorSnackbar
            onClose={handleErrorSnackbarClose}
            open={errorSnackbar}
            errorMessage={errorMessage}
          />
        </div> */}
      </form>
    </Drawer>

  );
}

ListStudents.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

ListStudents.defaultProps = {
  open: false,
  onClose: () => { }
};

export default ListStudents;

