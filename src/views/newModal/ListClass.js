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
import LoadingElement from '../Loading/LoadingElement';
import { ErrorSnackbar, SuccessSnackbar } from '../Snackbars';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';
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
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    marginRight: '1rem',
    backgroundColor: theme.palette.secondary.main
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

function ListClass({ theCours, open, onClose, className, roomId, room, studentCountCb, isClasse, thisthingid, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const token = useSelector((state) => state.user.token);


  const user = useSelector((state) => state.user.userData);

  const [participantsClass, setParticipants] = useState([]);
  const [StudentList, setStudentList] = useState([]);

  const [createrClass, CreaterClasss] = useState();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandListClass, setExpandListClass] = useState(true);
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
  const handleToggleListClass = () => {
    setExpandListClass((prevExpandProject) => !prevExpandProject);
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
  //   //setParticipants(results);
  //   /////////////////////Pagination ////////////////
  // };
  useEffect(() => {
    let mounted = true;
    const fetchRoomParticipants = (classe) => {
      setIsLoading(true);
      console.log("AYyayay___________**((______", theCours?.classRooms.length, token)
      API.getClassParticipant(classe, token)
        .then((participants) => {
          console.log("The Successs___________**((______", participants)
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

            // /////////////////////Pagination ////////////////
            // setPageCount(Math.ceil(participants.length / pageMaxCount));
            // const slice = participants.slice(offset, offset + pageMaxCount);
            // setStudents(slice);
            if (participants?.data?.roomsList.length > 0) {

              let data = {
                name: participants?.data?.classeName,
                id: participants?.data?.id
              }

              setParticipants(participantsClass => participantsClass.concat(data))

              CreaterClasss(participants?.data?.creator?.fullName)
              setStudentList(StudentList => StudentList.concat(participants?.data?.studentList))
              // setParticipants(participants?.data?.roomsList);
              setIsLoading(false);
            }
            /////////////////////Pagination ////////////////
            setIsLoading(false);
            // setParticipants(results);
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
  const handleRemoveUser = (classData) => {
    var newArray = theCours?.classRooms.filter(x => {
      return x.classe != classData?.id;
    })
    let data = {

      classe: newArray
    }
    console.log("The Index is::", data, newArray,)

    API.removeClassfromCourse(theCours.id, data, token)
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

  };

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={() => { onClose() }}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        id='ListClassForm'
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
              onClick={handleToggleListClass}
            >
              <Typography variant="h5">{t('List of Class')}</Typography>
              {expandListClass ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandListClass}>
              <div className={classes.contentSectionContent}>
                <Divider />
                <CardContent className="p-3">
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <div className="table-responsive">
                        <table className="text-nowrap mb-0 table table-borderless table-hover">
                          <tbody>
                            {
                              participantsClass.length == 0 ?
                                <EmptyElements title={t('No Classes')} /> :
                                isLoading ? <LoadingElement /> :
                                  participantsClass.map((value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <Avatar className={classes.avatar} />
                                            <div>
                                              <Typography variant="h3">
                                                {value.name}
                                              </Typography>
                                              <Typography varient="body2" style={{ color: 'grey' }}>
                                                {`By: ${createrClass}`}
                                              </Typography>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
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
            form="ListClassForm"
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

ListClass.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

ListClass.defaultProps = {
  open: false,
  onClose: () => { }
};

export default ListClass;

