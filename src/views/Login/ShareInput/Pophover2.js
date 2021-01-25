import React, { Fragment,useState,memo} from 'react';

import { Box, Popover, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {useSelector } from 'react-redux';


import {
    ListItemIcon,
    ListItemText,
    
    MenuItem
  } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ShareCourse from './ShareCourse';
import AddCalendar from '../../../views/newModal/AddCalendar';
import EditIcon from '@material-ui/icons/Edit';
import CONFIG from '../../../config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GroupIcon from '@material-ui/icons/Group';
import ShareIcon from '@material-ui/icons/Share';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CancelIcon from '@material-ui/icons/Cancel';
import ManageParticipantsModal from './manageParticipantsModal';
import DeleteIcon from '@material-ui/icons/Delete';

function Pophover2({theCours}) {

  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const [openShareCourse, setOpenShareCourse] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
 
  const [manageStudents, setManageStudents] = useState(false);

  const token = useSelector(state => state.user.token);
  const user = useSelector((state) => state.user.userData);
  
  const handleClickPopover4 = event => {
    setAnchorEl4(event.currentTarget);
  };
  const handleClosePopover4 = () => {
    setAnchorEl4(null);
  };
  const open4 = Boolean(anchorEl4);
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
  let urlcode =theCours?.data.urlCode
  console.log("hamza" + urlcode)
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
          {token && theCours.data.creator.id == user.id?
          <>
{/*             
            <MenuItem onClick={ () =>  { setManageStudents(true)  ; }}>
                <ListItemIcon>
                  <GroupIcon/>
                  <img src="./images/icons/participants.png" style={{height:'20px', width:'20px'}}></img>
                </ListItemIcon>
                <ListItemText primary='Manage Participants' />
            </MenuItem> */}
            
            <MenuItem >
                <ListItemIcon>
                    <EditIcon/>
                </ListItemIcon>
                <ListItemText primary='Edit' />
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                <ListItemText primary='Delete' />
            </MenuItem>
            {/* <MenuItem>
                <ListItemIcon>
                    <CancelIcon/>
                </ListItemIcon>
                <ListItemText primary='Cancel participation' />
            </MenuItem> */}
            </>
            : null}
            <MenuItem >
                <ListItemIcon>
                    <FileCopyIcon/>
                </ListItemIcon>
                <CopyToClipboard text={CONFIG.SITEURL + `/live/${urlcode}`}> 
                  <ListItemText primary='Copy Link' />
                </CopyToClipboard>
            </MenuItem>
            <MenuItem 
            onClick={handleShareCourseOpen} 
            style={{ width: '100%' }}>
                <ListItemIcon> 
                    <ShareIcon/>
                </ListItemIcon>
                <ListItemText primary='Share Course' />
            </MenuItem>
            <MenuItem 
            onClick={handleCalendarOpen} 
            style={{ width: '100%' }}>
                <ListItemIcon>
                    <CalendarTodayIcon/>
                </ListItemIcon>
                <ListItemText primary='Add to calendar' />
            </MenuItem>
            
          </Box>
        </Popover>
        {token && theCours.data.creator.id == user.id?
        <ManageParticipantsModal
        onClose={() =>  { setManageStudents(false) }}
        open={manageStudents}
        // isClasse={true}
        // thisthingid={props.theclasse._id}
      />
        :null}

      </div>
      
       <AddCalendar
        onClose={handleCalendarClose}
        open={openCalendar}
        theCourse={theCours}
      /> 


      <ShareCourse
        onClose={handleShareCourseClose}
        open={openShareCourse}
        theCours={theCours}
      />
    </Fragment>
  );
}
Pophover2.propTypes = {
  className: PropTypes.string
};
export default memo(Pophover2);
