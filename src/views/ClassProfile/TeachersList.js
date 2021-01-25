import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Grid , colors , Typography , Avatar , Button , Divider , CardContent} from '@material-ui/core';
import CoursCard from 'src/components/CoursCard';
import * as API from '../../services';
import Alert from 'src/components/Alert';
import EmptyElements from '../Empty/EmptyElements';
import getInitials from '../../utils/getInitials';
import Paginate from 'src/components/Paginate';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { ErrorSnackbar, SuccessSnackbar } from '../Snackbars';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoadingElement from '../Loading/LoadingElement';
import * as API2 from '../../services2';

const useStyles = makeStyles((theme) => ({
  root: {},
    alert: {
      marginTop: theme.spacing(3) ,
      marginBottom: theme.spacing(3) ,
      backgroundColor: colors.blue[700]
  },
  paginate: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  connectedButton: {
    marginLeft: 'auto',
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  pendingButton: {
    marginLeft: 'auto',
    color: theme.palette.common.white,
    backgroundColor: 'gray',
    '&:hover': {
      backgroundColor: 'gray'
    }
  },
  divider: {
    backgroundColor: colors.grey[300]
  } ,
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
  removeButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: 'gray',
    '&:hover': {
      backgroundColor: 'gray'
    }
  },
  contentSection: {
    padding: theme.spacing(2, 0)
  },

}));

function TeachersList({ className, classeId, teachersList, archivedCoursCountCb, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const [openAlert, setOpenAlert] = useState(false);
 
  const [classe, setClasse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const user = useSelector((state) => state.user.userData);

  const handleAlertClose = () => {
    setOpenAlert(false);
  };
  useEffect(() => {
    let mounted = true;

    const fetchClasse = () => {
      API.getArchivedClasse(classeId, token)
        .then((classe) => {
          if (mounted) {
            setClasse(classe);
            setIsLoading(false);

            archivedCoursCountCb(classe.rooms.length);
            // show alert that elements will be in history automaticaly if rooms more than 1
            if(classe.rooms.length > 0 ) setOpenAlert(true);
          }
        })
        .catch((error) => { console.log(error); });
    };

    fetchClasse();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSuccessSnackbarClose = () => {
    setOpenSuccessSnackbar(false);
  };

  const handleErrorSnackbarClose = () => {
    setErrorSnackbar(false);
  };

  const handleRemoveUser = (email) => {


    let data = {
      email: email
    };

    API2.CancelParticipationFromClass(classeId, data, token)
      .then(response => {
        if(response.status==1)
        {
          setOpenSuccessSnackbar(true);
          window.location.reload()

        }else{
          setErrorMessage(response.message)
          setErrorSnackbar(true)
        }


      })
      .catch((error) => {  });
  };
  

  return (
    <form
        {...rest}
        className={clsx(classes.root, className)}
     //   id='ListStudentsForm'
    //    onSubmit={handleSubmit}
      >
    {/* {
      isLoading ? <LoadingElement /> :
        (classe.rooms && classe.rooms.length > 0 ) ? */}
        {/* <Grid
          container
          spacing={3}
        > */}
           {/* <div className={classes.contentSectionContent}> */}
            <Divider/>
              <CardContent className="p-3">
                <PerfectScrollbar>
                  <div className={classes.inner}>
                    <div className="table-responsive">
                      <table className="text-nowrap mb-0 table table-borderless table-hover">
                        <tbody>
                        {teachersList.length > 0 && teachersList.map((teacher) => {
                          return (
                        <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <Avatar className={classes.avatar} >
                                { getInitials(teacher.fullName) }
                                </Avatar>
                                <div>
                                  <Typography variant="h4">
                                    {teacher.fullName}
                                  </Typography>
                                  <Typography varient="body2" style={{ color:'grey' }}>
                                    {teacher.email}
                                </Typography>
                                </div>
                              </div>
                            </td>
                            {user.isModerator ?
                            <td className="text-center">
                             
                            <Button 
                                className={classes.connectedButton}
                                size="small"
                                variant="contained"
                              //  onClick={() => {setCurrentUser(connection) ; handleModalRemoveStudent() ;}}
                              >
                                {t(`${teacher?.status}`)}
                              </Button>
                              <Button
                                className={classes.removeButton}
                                size="small"
                                variant="contained"
                                value={teacher?.email}
                                onClick={() => handleRemoveUser(teacher?.email)}
                            
                              >
                                <DeleteOutlineOutlinedIcon />
                              </Button>
                            

                            </td>
                            : null }
                          </tr>
                         )})}
                        { teachersList.length == 0 ?
                          <EmptyElements title={t('No Teachers')} description={t('Invite teachers to join your class')}/>
                          : null 
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </PerfectScrollbar>
                {/* <Grid item xs={12}>
                  <div {...rest} className={clsx(classes.root, className)}>
                    <div className={classes.paginate}>
                      <Paginate />
                    </div>
                  </div>
                </Grid> */}
              </CardContent>
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
     
          {/* </div> */}
        
        {/* </Grid> */}
        {/* : <EmptyElements title={t('no archived course')} description={''} />
    } */}
    </form>
  );
}

TeachersList.propTypes = {
  className: PropTypes.string
};

export default TeachersList;
