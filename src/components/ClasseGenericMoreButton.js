import React, {
  useRef,
  useState,
  memo
} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";
import SendIcon from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import NewCreateClasseModal from "../views/newModal/NewCreateClasseModal";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ManageStudentsModal from "../views/Classe/ManageStudentsModal";
import EditClassModal from "../views/newModal/EditClassModal";
import InviteClass from "../views/newModal/InviteClass";
import ClasseDeleteConfirmationModal from "../views/Classe/ClasseDeleteConfirmationModal";
import { useTranslation } from "react-i18next";
import { ExportToCsv } from "export-to-csv";
import * as API from "../services";
import { useSelector } from "react-redux";
import { ErrorSnackbar, InfoSnackbar, SuccessSnackbar } from "../views/Snackbars";
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
  moreoption: {
    '&  .MuiIconButton-sizeSmall': {
      padding: 'revert !important'
    },
    outline: 'none'
  }

}));

function ClasseGenericMoreButton(props) {
  const classes = useStyles();
  const moreRef = useRef(null);
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);


  const [inviteStudents, setInviteStudents] = useState(false);
  const [inviteTeacher, setInviteTeacher] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const user = useSelector((state) => state.user.userData);
  const [manageStudents, setManageStudents] = useState(false);
  const [manageTeachers, setManageTeachers] = useState(false);
  const [openClasseDeleteModal, setOpenClasseDeleteModal] = useState(false);
  const [openEditClassModal, setOpenEditClassModal] = useState(false);

  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState(t('something went wrong'));

  const [openInfoSnackbar, setOpenInfoSnackbar] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState(t('Students list is empty!'));
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openCreateClasse, setOpenCreateClasse] = useState(false);
  const [openEditClasse, setOpenEditClasse] = useState(false);
  const [openInviteClasse, setOpenInviteClasse] = useState(false);

  const handleCreateClasseClose = () => {
    setOpenCreateClasse(false);
  };

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleCreateClasseOpen = () => {
    setOpenCreateClasse(true);
  };

  const handleInviteStudentOpen = () => {
    setOpenMenu(false);
    setOpenInviteClasse(true);
    setInviteStudents(true);
  };

  const handleInviteTeacherOpen = () => {
    setOpenMenu(false);
    setOpenInviteClasse(true);
    setInviteTeacher(true);
    setOpenSuccessSnackbar(false)
  };

  const handleSuccessSnackbarClose = () => {
    setOpenSuccessSnackbar(false);
  };

  const handleInviteClasseClose = () => {
    setOpenInviteClasse(false);
    setInviteStudents(false);
    setInviteTeacher(false);
    setOpenSuccessSnackbar(false)
  };
  const handleEditClasseOpen = () => {
    setOpenMenu(false);
    setOpenEditClasse(true);
  };

  const handleEditClasseClose = () => {
    setOpenEditClasse(false);
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

  const exportStudents = () => {
    API.exportClassStudents(props.theclasse._id, token)
      .then((response) => {
        if (response && response.Students && response.Students.length > 0) {
          const options = {
            fieldSeparator: ';',
            showLabels: true,
            useTextFile: false,
            useBom: true,
            headers: ['Nom Complet', 'Adresse électronique']
          };

          const csvExporter = new ExportToCsv(options);
          csvExporter.generateCsv(response.Students);
        } else {
          setInfoSnackbarMessage(t('Students list is empty!'));
          setOpenInfoSnackbar(true);
        }

      }).catch((error) => {
        setErrorSnackbarMessage(t('Error while downloading the file!'));
        setOpenErrorSnackbar(true);
      }
      );
  };

  return (
    <>
      <Tooltip title={t('more options')}>
        <IconButton
          {...props}
          onClick={handleMenuOpen}
          ref={moreRef}
          // size="small"
          className={classes.moreoption}
        >
          <MoreIcon />
        </IconButton>
      </Tooltip>
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
        {props.isCreator?
        <>
        <div className={classes.actions}>
              <MenuItem onClick={handleInviteStudentOpen} >
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText primary={t('invite students')} />
              </MenuItem>
        </div>
        <div className={classes.actions}>
            <MenuItem onClick={handleInviteTeacherOpen} style={{ width: '100%' }}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary={t('invite Teachers')} />
            </MenuItem>
        </div>

        {/* <MenuItem onClick={ () =>  { exportStudents()  ; setOpenMenu(false) }}>
          <ListItemIcon>
            <CloudDownloadIcon />
          </ListItemIcon>
          <ListItemText primary={t('export students')} />
        </MenuItem> */}
        <div className={classes.actions}>
            <MenuItem onClick={handleEditClasseOpen} style={{ width: '100%' }}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary={t('edit')} />
            </MenuItem>
        </div>
        </>
        : null}

        <MenuItem onClick={() => { setOpenClasseDeleteModal(true); setOpenMenu(false) }}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={t('delete')} />
        </MenuItem>

      </Menu>

      <ManageStudentsModal
        onClose={() => { setManageStudents(false); setOpenMenu(false) }}
        open={manageStudents}
        isClasse={true}
        thisthingid={props.theclasse._id}
      />
      {/* you have to import Manage ManageTeachersModal */}

      {/* <ManageTeachersModal
        onClose={() =>  { setManageTeachers(false) ; setOpenMenu(false) }}
        open={manageTeachers}
        isClasse={true}
        thisthingid={props.theclasse._id}
      /> */}

      <EditClassModal
        onClose={() => setOpenEditClassModal(false)}
        open={openEditClassModal}
        theclasse={props.theclasse}
      />

      {
        user.isModerator ?
          <NewCreateClasseModal
            onClose={handleCreateClasseClose}
            open={openCreateClasse}
          />
          : null
      }


      {
        user.isModerator ?
          <InviteClass
            isErrorSnackbar={setOpenErrorSnackbar}
            errorMessage={setErrorSnackbarMessage}
            onClose={handleInviteClasseClose}
            onSuccess={setOpenSuccessSnackbar}
            open={openInviteClasse}
            inviteStudents={inviteStudents}
            inviteTeacher={inviteTeacher}
            classID={props.classID}
          />
          : null
      }



      {
        user.isModerator ?
          <EditClassModal
            onClose={handleEditClasseClose}
            open={openEditClasse}
          />
          : null
      }
          <ClasseDeleteConfirmationModal
            onClose={() => setOpenClasseDeleteModal(false)}
            open={openClasseDeleteModal}
            theclasse={props.theclasse}
            deleteThisClass={props.isCreator}
          />
          

      <ErrorSnackbar
        onClose={handleErrorSnackbarClose}
        open={openErrorSnackbar}
        errorMessage={errorSnackbarMessage}
      />

      <InfoSnackbar
        onClose={handleInfoSnackbarClose}
        open={openInfoSnackbar}
        errorMessage={infoSnackbarMessage}
      />

      <SuccessSnackbar
        onClose={handleSuccessSnackbarClose}
        open={openSuccessSnackbar}
        message={'Invited Successfully'}
      />
    </>
  );
}

ClasseGenericMoreButton.propTypes = {
  className: PropTypes.string,
  classID: PropTypes.string
};

export default memo(ClasseGenericMoreButton);
