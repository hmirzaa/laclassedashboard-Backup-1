import React, {useState} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import { makeStyles } from "@material-ui/styles";
import {  colors , Typography , Avatar , Button , Divider , CardContent} from "@material-ui/core";

import EmptyElements from "../Empty/EmptyElements";
import getInitials from "../../utils/getInitials";
import { ErrorSnackbar , SuccessSnackbar } from "../Snackbars";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as API from "../../services2";



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

function StudentsList({ className,classeId, studentList, ...rest }) {

  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}
  const token = useSelector((state) => state.user.token);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const user = useSelector((state) => state.user.userData);

  
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

    API.CancelParticipationFromClass(classeId, data, token)
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
      >
            <Divider/>
              <CardContent className="p-3">
                <PerfectScrollbar>
                  <div className={classes.inner}>
                    <div className="table-responsive">
                      <table className="text-nowrap mb-0 table table-borderless table-hover">
                        <tbody>
                        { studentList.length > 0 && studentList.map((student) => {
                         
                          return (
                        <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <Avatar
                                className={classes.avatar} 
                                src={student?.profileImage}
                                >
                                { getInitials(student?.fullName) }
                                </Avatar>
                                <div>
                                  <Typography variant="h4">
                                  {student?.fullName}
                                  </Typography>
                                  <Typography varient="body2" style={{ color:'grey' }}>
                                  {student?.email}
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
                                {t(`${student?.status}`)}
                              </Button>
                               
                            <Button
                                className={classes.removeButton}
                                size="small"
                                variant="contained"
                                value={student?.email}
                                onClick={() => handleRemoveUser(student?.email)}
                            
                              >
                                <DeleteOutlineOutlinedIcon />
                              </Button> 
                               
                              
                             
                            </td>
                            : null }
                          </tr>
                          )}) 
                          }
                           { studentList.length === 0 ?
                          <EmptyElements title={t('No Students')} description={t('Invite students to join your class')}/>
                          : null 
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </PerfectScrollbar>

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
              {/*                 
                <Grid item xs={12}>
                  <div {...rest} className={clsx(classes.root, className)}>
                    <div className={classes.paginate}>
                      <Paginate />
                    </div>
                  </div>
                </Grid> */}
              </CardContent>
      </form>
  );
}

StudentsList.propTypes = {
  className: PropTypes.string
};

export default StudentsList;
