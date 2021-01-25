import React, { Fragment, useState } from 'react';
import { Box, Popover, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AdjustIcon from '@material-ui/icons/Adjust';
import {
  ListItemIcon,
  ListItemText,
  MenuItem
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/Share';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditCoursModal from '../../../views/newModal/EditCoursModal';
import ManageParticipantPublicModal from './ManageParticipantPublicModal';
import ShareCourse from '../../../views/newModal/ShareCourse';
import AddCalendar from '../../../views/newModal/AddCalendar';
import InviteStudentPublic from './InviteStudentPublic';
import CancelParticipationPublic from './CancelParticipationPublic';
import CoursPublicDeleteConfirmation from './CoursPublicDeleteConfirmation';
import Pophover2 from 'src/views/Login/ShareInput/Pophover2';
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

  const { theCour } = props
  const { participateCheck } = props
  const classes = useStyles();
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState(false);
  const user = useSelector((state) => state.user.userData);
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const [openCreateClasse, setOpenCreateClasse] = useState(false);
  const [openShareCourse, setOpenShareCourse] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openInviteStudent, setOpenInviteStudent] = useState(false);
  const [manageStudents, setManageStudents] = useState(false);
  const [openCoursDeleteModal, setOpenCoursDeleteModal] = useState(false);
  const [openCancelParticipation, setOpenCancelParticipation] = useState(false);
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

  const handleInviteStudentOpen = () => {
    setOpenInviteStudent(true);
  };
  const handleInviteStudentClose = () => {
    setOpenInviteStudent(false);
  };

  const handleClickPopover4 = event => {
    setAnchorEl4(event.currentTarget);
  };
  const handleClosePopover4 = () => {
    setAnchorEl4(null);
  };
  const open4 = Boolean(anchorEl4);

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
            {/* <div className={classes.actions}>
              {user.isModerator && theCour?.creator?.id === user.id ?
                <MenuItem onClick={handleInviteStudentOpen}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary='Invite students' />
                </MenuItem>
                : null
              }
            </div> */}
            { 
            //user.id == theCour.creator.id ?
              // (theCour?.creator?.email === user.email) &&
              // (participateCheck || theCour?.creator?.email === user.email) &&
              <MenuItem onClick={() => { setManageStudents(true); setOpenMenu(false) }}>
                <ListItemIcon>
                  <GroupIcon />
                  {/* <img src="./images/icons/participants.png" style={{height:'20px', width:'20px'}}></img> */}
                </ListItemIcon>
               { user.id == theCour.creator.id ?
                <ListItemText primary='Manage Participants' />
                :
                <ListItemText primary='Participants' />
               }
              </MenuItem>
           //   : null
            }

            <div className={classes.actions}>
              {theCour?.creator?.id === user.id ?
                <MenuItem onClick={handleCreateClasseOpen} style={{ width: '100%' }}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('edit')} />
                </MenuItem>
                : null
              }
            </div>

            {theCour?.creator?.id === user.id ?
              <MenuItem onClick={() => { setOpenCoursDeleteModal(true); setOpenMenu(false) }}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary='Delete' />
              </MenuItem> : null
            }

            <div className={classes.actions}>
              <MenuItem onClick={handleShareCourseOpen} style={{ width: '100%' }}>
                <ListItemIcon>
                  <ShareIcon />
                </ListItemIcon>
                <ListItemText primary='Share Course' />
              </MenuItem>
            </div>
            { participateCheck ?
            <div className={classes.actions}>
              <MenuItem onClick={handleCalendarOpen} style={{ width: '100%' }}>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary='Add to calendar' />
              </MenuItem>
            </div>
            : theCour?.creator?.id === user.id &&
            <MenuItem onClick={handleCalendarOpen} style={{ width: '100%' }}>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText primary='Add to calendar' />
          </MenuItem>
            }
            {
              theCour?.creator?.id === user.id ?
                null :
                participateCheck &&
                <MenuItem onClick={() => { setOpenCancelParticipation(true); setOpenMenu(false) }}>
                  <ListItemIcon>
                    <CancelIcon />
                  </ListItemIcon>
                  <ListItemText primary='Cancel participation' />
                </MenuItem>
            }
          </Box>
        </Popover>

      </div>

      {
        user.isModerator ?
          <InviteStudentPublic
            onClose={handleInviteStudentClose}
            open={openInviteStudent}
            thecour={theCour}

          // isEdited={isEdited}
          />
          : null
      }

      {
        user.isModerator ?
          <EditCoursModal
            onClose={handleCreateClasseClose}
            open={openCreateClasse}
            theCours={theCour}
            isEdited={isEdited}
          />
          : null
      }

      {
        user.isModerator ?
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
        user.isModerator ?
          <ShareCourse
            onClose={handleShareCourseClose}
            open={openShareCourse}
            theCours={theCour}
          />
          : <ShareCourse
            onClose={handleShareCourseClose}
            open={openShareCourse}
            theCours={theCour}
          />
      }

      <CoursPublicDeleteConfirmation
        onClose={() => setOpenCoursDeleteModal(false)}
        open={openCoursDeleteModal}
        thecours={theCour}
      />

      <CancelParticipationPublic
        onClose={() => setOpenCancelParticipation(false)}
        open={openCancelParticipation}
        thecours={theCour}
      />
      
      <ManageParticipantPublicModal
        roomId={theCour?.id}
        theCour={theCour}
        onClose={() => { setManageStudents(false); setOpenMenu(false) }}
        open={manageStudents}
        userCreater={theCour?.creator?.email}
        userEmail={user.email}
      // (theCour?.creator?.email === user.email)
      />



    </Fragment>
  );
}
Pophover2.propTypes = {
  className: PropTypes.string
};
