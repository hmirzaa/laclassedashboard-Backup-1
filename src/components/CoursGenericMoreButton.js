import React, {
  useRef,
  useState,
  useEffect,
  memo
} from 'react';
import PropTypes from 'prop-types';
import {
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';

import DeleteIcon from '@material-ui/icons/Delete';

import ManageStudentsModal from '../views/Classe/ManageStudentsModal';
import EditCoursModal from '../views/Classe/EditCoursModal';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/Share';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CancelIcon from '@material-ui/icons/Cancel';
import CoursDeleteConfirmationModal from '../views/Cours/CoursDeleteConfirmationModal';
import CoursRecordingsModal from '../views/Cours/CoursRecordingsModal';
import CoursArchiveConfirmationModal from '../views/Cours/CoursArchiveConfirmationModal';
import CoursDeleteForStudentModal from '../views/Cours/CoursDeleteForStudentModal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ErrorSnackbar, InfoSnackbar } from '../views/Snackbars';

function CoursGenericMoreButton(props) {
  const moreRef = useRef(null);
  const { t } = useTranslation(); //{t('calendar')}

  const user = useSelector(state => state.user.userData);
 

  const [openMenu, setOpenMenu] = useState(false);
  const [manageStudents, setManageStudents] = useState(false);
  const [openCoursDeleteModal, setOpenCoursDeleteModal] = useState(false);
  const [openGetRoomRecordingsModal, setOpenGetRoomRecordingsModal] = useState(false);
  const [openEditCoursModal, setOpenEditCoursModal] = useState(false);
  const [openArchiveCoursModal, setOpenArchiveCoursModal] = useState(false);
  const [openCoursDeleteForStudentModal, setOpenCoursDeleteForStudentModal] = useState(false);

  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);


  const [openInfoSnackbar, setOpenInfoSnackbar] = useState(false);


  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleErrorSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };

  const handleInfoSnackbarClose = () => {
    setOpenInfoSnackbar(false);
  };

  useEffect(() => {
  console.log("Hamza AYub"+props.thecours)
  })

  // const exportStudents = () => {

  //   API.exportRoomStudents(props.thecours._id, token)
  //     .then((response) => {

  //       if (response && response.Students && response.Students.length > 0) {
  //         const options = {
  //           fieldSeparator: ';',
  //           showLabels: true,
  //           useTextFile: false,
  //           useBom: true,
  //           headers: ['Nom Complet', 'Adresse électronique']
  //         };

  //         const csvExporter = new ExportToCsv(options);
  //         csvExporter.generateCsv(response.Students);
  //       } else {
  //         setInfoSnackbarMessage(t('Students list is empty!'));
  //         setOpenInfoSnackbar(true);
  //       }

  //     }).catch((error) => {
  //       setErrorSnackbarMessage(t('Error while downloading the file!'));
  //       setOpenErrorSnackbar(true);
  //     }
  //   );
  // };
 

  return (
    <>
     
      <Tooltip title={t('more options')}>
        <IconButton
          {...props}
          onClick={handleMenuOpen}
          ref={moreRef}
          size="small"
        >
          <MoreIcon />
        </IconButton>
      </Tooltip>


      {
        user._id === props.thecours.creator._id ?
          <Menu
          anchorEl={moreRef.current}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            elevation={1}
            onClose={handleMenuClose}
            open={openMenu}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            {
              props.thecours && props.thecours.isActive ?
                <MenuItem onClick={ () =>  { setManageStudents(true)  ; setOpenMenu(false) }}>
                  <ListItemIcon>
                    <SendIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('invite students')} />
                </MenuItem>
                : null
            }

            {/* {
              props.thecours && props.thecours.isActive ?
                <MenuItem onClick={ () =>  { exportStudents()  ; setOpenMenu(false) }}>
                  <ListItemIcon>
                    <CloudDownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('export students')} />
                </MenuItem>
                : null
            } */}

            {/* {
              props.thecours && props.thecours.isActive ?
                <MenuItem onClick={ () =>  {setOpenGetRoomRecordingsModal(true); setOpenMenu(false)}}>
                  <ListItemIcon>
                    <PlayCircleFilledIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('Course recording')} />
                </MenuItem>
                : null
            } */}

            {
              props.thecours && props.thecours.isActive ?
                <MenuItem onClick={ () =>  {setOpenEditCoursModal(true); setOpenMenu(false)}}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('edit')} />
                </MenuItem>
                : null
            }

            {/* {
              props.thecours && props.thecours.isActive ?
                <MenuItem onClick={ () =>  {setOpenArchiveCoursModal(true); setOpenMenu(false)}}>
                  <ListItemIcon>
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('archive')} />
                </MenuItem>
                : null
            } */}

            <MenuItem onClick={ () =>  {setOpenCoursDeleteModal(true); setOpenMenu(false)}}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary={t('delete')} />
            </MenuItem>
          
            <MenuItem>
                <ListItemIcon>
                    <FileCopyIcon/>
                </ListItemIcon>
                <ListItemText primary='Copy Link' />
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <ShareIcon/>
                </ListItemIcon>
                <ListItemText primary='Share Course' />
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <CalendarTodayIcon/>
                </ListItemIcon>
                <ListItemText primary='Add to calendar' />
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <CancelIcon/>
                </ListItemIcon>
                <ListItemText primary='Cancel participation' />
            </MenuItem>
          
          
          
          </Menu>

          : null
      }

      {
        user._id !== props.thecours.creator._id ?
          <Menu
            anchorEl={moreRef.current}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            elevation={1}
            onClose={handleMenuClose}
            open={openMenu}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            {/* <MenuItem onClick={ () =>  {setOpenGetRoomRecordingsModal(true); setOpenMenu(false)}}>
              <ListItemIcon>
                <PlayCircleFilledIcon />
              </ListItemIcon>
              <ListItemText primary={t('Course recording')} />
            </MenuItem> */}

            <MenuItem onClick={ () =>  {setOpenCoursDeleteForStudentModal(true); setOpenMenu(false)}}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary={t('delete')} />
            </MenuItem>
          </Menu>

          : null
      }

      {
        user._id === props.thecours.creator._id ?
          <>
            <ManageStudentsModal
              onClose={() =>  { setManageStudents(false) ; setOpenMenu(false) }}
              open={manageStudents}
              isClasse={false}
              thisthingid={props.thecours._id}
            />

            <EditCoursModal
              onClose={() => setOpenEditCoursModal(false)}
              open={openEditCoursModal}
              thecours={props.thecours}
            />
           

            <CoursDeleteConfirmationModal
              onClose={() => setOpenCoursDeleteModal(false)}
              open={openCoursDeleteModal}
              thecours={props.thecours}
            />

            <CoursArchiveConfirmationModal
              onClose={() => setOpenArchiveCoursModal(false)}
              open={openArchiveCoursModal}
              thecours={props.thecours}
            />
          </>
          : null
      }
      
      {
        user._id !== props.thecours.creator._id ?
          <CoursDeleteForStudentModal
            onClose={() => setOpenCoursDeleteForStudentModal(false)}
            open={openCoursDeleteForStudentModal}
            thecours={props.thecours}
          />
          : null
      }

      <CoursRecordingsModal
        onClose={() => setOpenGetRoomRecordingsModal(false)}
        open={openGetRoomRecordingsModal}
        thecours={props.thecours}
      />

      <ErrorSnackbar
        onClose={handleErrorSnackbarClose}
        open={openErrorSnackbar}
        errorMessage={t('something went wrong')}
      />

      <InfoSnackbar
        onClose={handleInfoSnackbarClose}
        open={openInfoSnackbar}
        errorMessage={t('Students list is empty!')}
      />
    </>
  );
}

CoursGenericMoreButton.propTypes = {
  className: PropTypes.string
};

export default memo(CoursGenericMoreButton);
