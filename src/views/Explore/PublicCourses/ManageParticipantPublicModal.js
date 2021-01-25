import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactGA from 'react-ga';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Spinner from 'react-bootstrap/Spinner';
import SearchIcon from '@material-ui/icons/Search';
import LoadingElement from '../../Loading/LoadingElement';
import { SuccessSnackbar } from '../../Snackbars';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EmptyElements from '../../Empty/EmptyElements'
import getInitials from '../../../utils/getInitials'
import {
  Paper,
  CardContent,
  Grid,
  Typography,
  Collapse,
  Drawer,
  Divider,
  Avatar,
  Button,
  Input
} from '@material-ui/core';
// import ManageStudents from '../Classe/ManageStudents';
import { useTranslation } from 'react-i18next';
import * as API from '../../../services2';
import { useSelector } from 'react-redux';
import { LocalStorage } from '../../../services/localstorage.service';
// import EmptyElements from '../Empty/EmptyElements';
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
  },
  search: {
    flexGrow: 1,
    height: 42,
    width: '420px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  searchInput: {
    flexGrow: 1,
    placeholder: '#afaaaa',
    marginRight: theme.spacing(3),
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  }
}));

function ManageParticipantPublicModal({ userCreater, userEmail, theCour, open, onClose, className, roomId, room, studentCountCb, isClasse, thisthingid, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [participants, setParticipants] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandManageparticipantsPublic, setExpandManageparticipantsPublic] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const [modalRemoveStudent, setModalRemoveStudent] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [IsAuth, setIsAuth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const initialValues = {
    classeName: '',
    etablissement: user.etablissement,
    ville: user.cityName,
    email: '',
    fullName: '',
    tags: []
  };
  //Pagination
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageStudents, setStudents] = useState([]);
  const [roomsFiltered, setRoomsFiltered] = useState(false);

  const pageMaxCount = 20;
  const [values, setValues] = useState({ ...initialValues });


  const resetFormsOnClose = () => {
    setValues({ ...initialValues });
  };
  const handleToggleManageparticipantsPublic = () => {
    setExpandManageparticipantsPublic((prevExpandProject) => !prevExpandProject);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    ReactGA.event({
      category: 'Classe',
      action: 'Create classe!'
    });

    setDisableSubmit(true);

  };


  useEffect(() => {
    if (open === false) return
    fetchRoomParticipants()

    const userToken = LocalStorage.getItem('userToken');

    if (!userToken || userToken === '') {
      setIsAuth(false)
    } else {
      setIsAuth(true)
    }


  }, [open])

  const fetchRoomParticipants = () => {
    console.log("Agar Aya na tuuuu::::", roomId, token)
    // IsAuth ? (
    setIsLoading(true)
    API.getRoomParticipantsbyStudent(roomId, token)
      .then((participants) => {
        console.log('res participants', participants)
        setParticipants(participants);
        setIsLoading(false);

      })
      .catch((error) => {
        console.log("getRoomParticipantsbyStudent Error", error);
        setIsLoading(false);
      })
    // ) 
    // : (
    //     setIsLoading(false)
    //   )

  }
  const onCoursDelete = async (id) => {
    const data = {
      user: id
    }
    console.log("The Delete user is: ", id, token)

    API.deleteParticipantfromRoom(theCour?.id, data, token)

      .then((value) => {
        console.log("Yes the Delete is:::", value)
        setSuccessMessage(value.data.message)
        window.location.reload();

      }).catch((error) => {
        console.log("The Error is:  ", error)
      })
  };
  const searchHandler = (e) => {
    setIsSearch(true)
    if (!e.target.value) {
      setIsSearch(false)
    }
    let inputText = e.target.value.toLowerCase();
    console.log('inputTextinputText', participants)
    if (inputText.length) {
      let filteredArray = participants?.data?.participants.filter(
        (val) =>
          val.fullName.toLowerCase().indexOf(inputText) != -1
      );
      console.log('filteredArray ---> ', filteredArray)
      setRoomsFiltered([...filteredArray]);
    }
    else {
      setRoomsFiltered(false);
    }
  };
  const { data } = participants
  console.log('filteredArray ---> ', data)

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
        id='ManageparticipantForm'
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
              onClick={handleToggleManageparticipantsPublic}
            >
              <Typography variant="h5">{t('Manage Participants')}</Typography>
              {expandManageparticipantsPublic ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandManageparticipantsPublic}>
              <div className={classes.contentSectionContent}>
                <Divider />
                <CardContent className="p-3">
                  <PerfectScrollbar>
                    <Grid container justify="flex-start" alignItems="center">
                      <Grid item>
                        <div>
                          <Paper
                            className={classes.search}
                            elevation={1}
                          >
                            <SearchIcon className={classes.searchIcon} />
                            <Input
                              className={classes.searchInput}
                              disableUnderline
                              placeholder="Search by title"
                              style={{ fontStyle: 'italic', }}
                              onChange={searchHandler}
                            />
                          </Paper>
                        </div>
                      </Grid>
                    </Grid>
                    <div className={classes.inner}>
                      <div className="table-responsive">
                        <table className="text-nowrap mb-0 table table-borderless table-hover">
                          {
                            roomsFiltered.length == 0 ?
                              <EmptyElements title={t("No Participants")} />
                              :
                              roomsFiltered.length > 0 ?
                                <tbody>
                                  {
                                    roomsFiltered.map((participant) => {
                                      const {
                                        fullName,
                                        email,
                                        isModerator,
                                        status,
                                        _id,
                                        isInvited,
                                        profileImage,
                                      } = participant

                                      // if (status !== 'accepted' || isInvited || !isModerator) return null
                                      return (
                                        <tr>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <Avatar
                                                className={classes.avatar}
                                                src={profileImage}
                                              >
                                                {getInitials(fullName)}

                                              </Avatar>
                                              <div>
                                                <Typography variant="h4">
                                                  {fullName}
                                                </Typography>
                                                <Typography varient="body2" style={{ color: 'grey' }}>
                                                  {email}
                                                </Typography>
                                              </div>
                                            </div>
                                          </td>
                                          {
                                            // isModerator && 
                                            userCreater === userEmail &&
                                            <td className="text-center">
                                              <Button
                                                className={classes.removeButton}
                                                size="small"
                                                variant="contained"
                                                onClick={() => { onCoursDelete(_id) }}
                                              >
                                                <DeleteOutlineOutlinedIcon />
                                              </Button>
                                            </td>}
                                        </tr>
                                      )
                                    })
                                  }

                                </tbody>
                                :

                                <tbody>
                                  {
                                    isLoading ?
                                      <LoadingElement /> :
                                      data?.participants.length == 0 ? <EmptyElements title={t("No Participants")} />
                                        :
                                        data?.participants.map((participant) => {
                                          const {
                                            fullName,
                                            email,
                                            isModerator,
                                            status,
                                            _id,
                                            isInvited,
                                            profileImage,
                                          } = participant

                                          // if (status !== 'accepted' || isInvited || !isModerator) return null
                                          return (
                                            <tr>
                                              <td>
                                                <div className="d-flex align-items-center">
                                                  <Avatar
                                                    className={classes.avatar}
                                                    src={profileImage}
                                                  >
                                                    {getInitials(fullName)}

                                                  </Avatar>
                                                  <div>
                                                    <Typography variant="h4">
                                                      {fullName}
                                                    </Typography>
                                                    <Typography varient="body2" style={{ color: 'grey' }}>
                                                      {email}
                                                    </Typography>
                                                  </div>
                                                </div>
                                              </td>
                                              {
                                                // isModerator && 
                                                userCreater === userEmail &&
                                                <td className="text-center">
                                                  <Button
                                                    className={classes.removeButton}
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() => { onCoursDelete(_id) }}
                                                  >
                                                    <DeleteOutlineOutlinedIcon />
                                                  </Button>
                                                </td>}
                                            </tr>
                                          )
                                        })
                                  }

                                </tbody>
                          }
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
            form="ManageparticipantForm"
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
          <SuccessSnackbar open={successMessage} message={successMessage} />

        </div> */}
      </form>
    </Drawer>

  );
}

ManageParticipantPublicModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

ManageParticipantPublicModal.defaultProps = {
  open: false,
  onClose: () => { }
};

export default ManageParticipantPublicModal;

