import React, { Fragment, useState, useEffect } from 'react';

import { Box, Popover, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import AdjustIcon from '@material-ui/icons/Adjust';
import {
  ListItemIcon,
  ListItemText,

  MenuItem
} from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ManageParticipantPublicModal from '../Explore/PublicCourses/ManageParticipantPublicModal';
import { useTranslation } from 'react-i18next';
import ShareIcon from '@material-ui/icons/Share';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CoursDeleteConfirmationModal from './CoursDeleteConfirmationModal';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditCoursModal from '../newModal/EditCoursModal';
import ShareCourse from '../newModal/ShareCourse';
import AddCalendar from '../newModal/AddCalendar';
import CancelParticipation from '../Cours/CancelParticipation';
import Pophover2 from '../Login/ShareInput/Pophover2';
import * as API from '../../services2';
const useStyles = makeStyles((theme) => ({
  root: {},
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  paginate: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  search: {
    flexGrow: 1,
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center'
  },
  rootSearch: {
    display: 'flex',
    alignItems: 'center'
  },
  toggleButton: {
    position: 'relative',
    color: 'grey',
    '& + &:before': {
      color: 'red',
    },
  },

}));

export default function Pophover(props) {
  const { roomId,creator,theClasse } = props

  //console.log("hhh"+props.theCours)
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const user = useSelector((state) => state.user.userData);
  const token = useSelector((state) => state.user.token);
  const [openCreateClasse, setOpenCreateClasse] = useState(false);
  const [openShareCourse, setOpenShareCourse] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openCoursDeleteModal, setOpenCoursDeleteModal] = useState(false);
  const [openCancelParticipation, setOpenCancelParticipation] = useState(false);
  const [manageStudents, setManageStudents] = useState(false);
  const [theCours, setTheCours] = useState([])

  //actions states
  const [isEdited, setIsEdited] = useState(false);




  const handleCreateClasseClose = () => {
    setOpenCreateClasse(false);
  };

  const handleCreateClasseOpen = () => {
    setIsEdited(true)
    setOpenCreateClasse(true);
  };



  // const handleMenuOpen = () => {
  //   setOpenMenu(true);
  // };

  useEffect(() => {
    let mounted = true;
      const fetchRoom = () => {
        API.getRoomsByID(roomId, token)
          .then((cours) => {
            if (mounted) {
              setTheCours(cours.data)
            }
          })
        
      }
      fetchRoom()
      return () => {
        mounted = false;
      };
  }, [])


  const handleShareCourseOpen = () => {
    setOpenShareCourse(true);
  };
  const handleShareCourseClose = () => {
    setOpenShareCourse(false);
  };
  const handleCalendarOpen = () => {
    setOpenCalendar(true);
  };
  const handleCalendarClose = () => {
    setOpenCalendar(false);
  };
  const handleClickPopover4 = event => {
    setAnchorEl4(event.currentTarget);
  };
  const handleClosePopover4 = () => {
    setAnchorEl4(null);
  };
  const open4 = Boolean(anchorEl4);
  console.log("Yes the student is:::::", user)
  return (
    <Fragment>
      <div className="text-right">
        <MoreVertIcon
          onClick={handleClickPopover4}>
        </MoreVertIcon>
        <Popover
          open={open4}
          anchorEl={anchorEl4}
          onClose={handleClosePopover4}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}>
          <Box className="p-4">
            {console.log('user', user)}
            <div className={classes.actions}>
              {user.id === creator.id ?
                <MenuItem onClick={handleCreateClasseOpen} style={{width:'100%'}}>
                  <ListItemIcon>
                    <EditIcon theCours={theCours} />
                  </ListItemIcon>
                  <ListItemText primary={t('edit')} />
                </MenuItem>
                : null
              }
            </div>
            {
              user.isModerator && theCours.category ?
                <MenuItem onClick={() => { setManageStudents(true); setOpenMenu(false) }}>
                  <ListItemIcon>
                    <GroupIcon />
                    {/* <img src="./images/icons/participants.png" style={{height:'20px', width:'20px'}}></img> */}
                  </ListItemIcon>
                  <ListItemText primary='Manage Participants' />
                </MenuItem> :
                theCours.category ?
                  <MenuItem onClick={() => { setManageStudents(true); setOpenMenu(false) }}>
                    <ListItemIcon>
                      <GroupIcon />
                      {/* <img src="./images/icons/participants.png" style={{height:'20px', width:'20px'}}></img> */}
                    </ListItemIcon>
                    <ListItemText primary='Manage Participants' />
                  </MenuItem> : null
            }
            {user.id === creator.id ?
              <MenuItem onClick={() => { setOpenCoursDeleteModal(true); setOpenMenu(false) }}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary='Delete' />
              </MenuItem> : null
            }

            <div className={classes.actions}>
              {user.isModerator ?
                <MenuItem onClick={handleShareCourseOpen} style={{width:'100%'}}>
                  <ListItemIcon>
                    <ShareIcon />
                  </ListItemIcon>
                  <ListItemText primary='Share Course' />
                </MenuItem>
                : <MenuItem onClick={handleShareCourseOpen}>
                  <ListItemIcon>
                    <ShareIcon />
                  </ListItemIcon>
                  <ListItemText primary='Share Course' />
                </MenuItem>
              }
            </div>
            <div className={classes.actions}>
              {
                // theCours.category  ?
                <MenuItem onClick={handleCalendarOpen} style={{width:'100%'}}>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText primary='Add to calendar' />
                </MenuItem>
                // : null
              }
            </div>
            {
              user.isModerator && theCours.category ?

                <MenuItem onClick={() => { setOpenCancelParticipation(true); setOpenMenu(false) }}>
                  <ListItemIcon>
                    <CancelIcon />
                  </ListItemIcon>
                  <ListItemText primary='Cancel participation' />
                </MenuItem> :
                theCours.category ?
                  <MenuItem onClick={() => { setOpenCancelParticipation(true); setOpenMenu(false) }}>
                    <ListItemIcon>
                      <CancelIcon />
                    </ListItemIcon>
                    <ListItemText primary='Cancel participation' />
                  </MenuItem> : null
            }
          </Box>
        </Popover>
      </div>
      
      {
        user.isModerator && theCours.classRooms?
          <EditCoursModal
            onClose={handleCreateClasseClose}
            open={openCreateClasse}
            theCours={theCours}
            isEdited={isEdited}
          />
          : null
      }

      {
        user.isModerator?
          <AddCalendar
            onClose={handleCalendarClose}
            open={openCalendar}
          />
          : <AddCalendar
            onClose={handleCalendarClose}
            open={openCalendar}
          />
      }
      {
        theCours.urlCode ?
          <ShareCourse
            onClose={handleShareCourseClose}
            open={openShareCourse}
            theCours={theCours}
          />
          : null
      }

      <CoursDeleteConfirmationModal
        onClose={() => setOpenCoursDeleteModal(false)}
        open={openCoursDeleteModal}
        thecours={theCours}
        theClasse={theClasse}
      />

      <ManageParticipantPublicModal
        roomId={theCours?.id}
        theCour={theCours}
        onClose={() => { setManageStudents(false); setOpenMenu(false) }}
        open={manageStudents}
        userCreater={creator.id}
        userEmail={user.id}
      // (theCour?.creator?.email === user.email)
      />

      <CancelParticipation
        onClose={() => setOpenCancelParticipation(false)}
        open={openCancelParticipation}
        thecours={theCours}
      />
    </Fragment>



  );
}
Pophover2.propTypes = {
  className: PropTypes.string
};