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
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {
  Modal,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Collapse,
  CardActions,
  Drawer,
  colors,
  Tooltip,
  Divider,
  IconButton,
  Avatar,
  Button,
  Input
} from '@material-ui/core';
// import ManageStudents from '../Classe/ManageStudents';
import { useTranslation } from 'react-i18next';
import * as API from '../../../services2';
import { useSelector } from 'react-redux';
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
  confirmbutton:{
    width:"85%",
    color:'white',
    marginBottom:"20px",
    borderRadius:"20px"
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
    height:"470px"
  },
  container: {
    marginTop: theme.spacing(3),
    height: 200
  },
  actions: {
    justifyContent: 'flex-end',
    textAlign:'center'
  },
  search: {
    flexGrow: 1,
    height: 42,
    width:'420px',
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
    placeholder:'#afaaaa',
    marginRight: theme.spacing(3),
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  }
}));

function ManageParticipantsModal({open, onClose, className,roomId, room, studentCountCb, isClasse, thisthingid, ...rest}) 
{
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [participants, setParticipants] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandManageparticipants, setExpandManageparticipants] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalRemoveStudent, setModalRemoveStudent] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const initialValues = {
    classeName: '',
    etablissement: user.etablissement,
    ville: user.cityName,
    email: '',
    fullName: '',
    tags: []
  };
  //Pagination
  const [offset , setOffset] = useState(0);
  const [pageCount , setPageCount] = useState(0);
  const [currentPage , setCurrentPage] = useState(0);
  const [pageStudents, setStudents] = useState([]);
  const pageMaxCount = 20 ;
  const [values, setValues] = useState({ ...initialValues });


  const handlePageClick = data => {
    let selected = data.selected;
    const offset = selected * pageMaxCount;
    setOffset(offset);
    setCurrentPage(selected);
    const slice = participants.slice(offset, offset + pageMaxCount);
    setStudents(slice);

  };
  const resetFormsOnClose = () => {
    setValues({ ...initialValues });
  };
  const handleToggleManageparticipants = () => {
    setExpandManageparticipants((prevExpandProject) => !prevExpandProject);
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
  const handleStudentSearch = (event) => {
    //event.persist();
    const query = event.target.value;
    const newquery = query.replace(/ /g,'');
    const results = participants.filter(participant => {
      return Object.keys(participant).some(key =>
        participant[key].toString().toLowerCase().includes(newquery)
      );
    });
      /////////////////////Pagination ////////////////
      setPageCount(Math.ceil(results.length / pageMaxCount));
      const slice = results.slice(offset, offset + pageMaxCount);
      setStudents(slice);
      //setParticipants(results);
      /////////////////////Pagination ////////////////
  };

  useEffect(() => {
    let mounted = true;
    const fetchRoomParticipants = () => {
      API.getRoomParticipant(roomId, token)
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

            let participantsCount = participants.length;
            if (participantsCount !== 0) {
              participantsCount -= 1;
            }
            studentCountCb(participantsCount);

            /////////////////////Pagination ////////////////
            setPageCount(Math.ceil(participants.length / pageMaxCount));
            const slice = participants.slice(offset, offset + pageMaxCount);
            setStudents(slice);
            setParticipants(participants);
            /////////////////////Pagination ////////////////

           // setParticipants(results);
            setIsLoading(false);
          }
        })
        .catch((error) => { console.log(error); });
    };

    fetchRoomParticipants();

    return () => {
      mounted = false;
    };
  }, []);

  if (!open) {
    return null;
  }

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
              onClick={handleToggleManageparticipants}
            >
              <Typography variant="h5">{t('Manage Participants')}</Typography>
              {expandManageparticipants ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
         <Collapse in={expandManageparticipants}>
          <div className={classes.contentSectionContent}>
            <Divider/>
              <CardContent className="p-3">
                <PerfectScrollbar>
                <Grid container  justify="flex-start" alignItems="center">
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
                        style={{fontStyle:'italic',}}
                      />    
                    </Paper>
                    </div>
                 </Grid>
                  </Grid>
                  <div className={classes.inner}>   
                    <div className="table-responsive">
                      <table className="text-nowrap mb-0 table table-borderless table-hover">
                        <tbody>
                          <tr>
                          <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                          <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Avatar   className={classes.avatar} />
                            <div>
                              <Typography variant="h4">
                              Hamza Ayub
                              </Typography>
                              <Typography varient="body2" style={{ color:'grey' }}>
                                hamxa6630@gmail.com
                            </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                        <Button
                            className={classes.removeButton}
                            size="small"
                            variant="contained"
                          //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>

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
    <Divider style={{marginBottom:"20px"}}/>

        {/* Submit Button */}
        <div className={classes.actions}>
          <Button
            style={{backgroundColor : disableSubmit ? '#9b9ea1' : '#f7b731 '}}
            className={classes.confirmbutton}
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
        </div>
      </form>
    </Drawer>
  
  );
}

ManageParticipantsModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

ManageParticipantsModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default ManageParticipantsModal;

