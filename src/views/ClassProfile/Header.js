import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import SearchIcon from "@material-ui/icons/Search";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { makeStyles } from "@material-ui/styles";
import InviteClass from '../newModal/InviteClass';
import { ErrorSnackbar , SuccessSnackbar } from '../Snackbars';
import {
  Container,
  Avatar,
  Grid,
  Link,
  Typography,
  Paper,
  Input,
  Button,
  colors,
} from "@material-ui/core";
import PeopleOutlined from "@material-ui/icons/PeopleOutlined";
import AddIcon from "@material-ui/icons/Add";
import CreateCoursModal from "../Classe/CreateCoursModal";
import { useSelector } from "react-redux";
import ManageStudentsModal from "../Classe/ManageStudentsModal";
import { useTranslation } from "react-i18next";


const useStyles = makeStyles((theme) => ({
  root: {},
  cover: {
    position: "relative",
    height: 80,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    "&:before": {
      position: "absolute",
      content: '" "',
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      backgroundColor: theme.palette.secondary.dark,
      //  backgroundImage: 'linear-gradient(90deg, rgba(247,183,49,1) 0%, rgba(247,193,49,1) 30%, rgba(247,193,49,1) 74%)'
    },
    "&:hover": {
      "& $changeButton": {
        visibility: "visible",
      },
    },
  },
  changeButton: {
    visibility: "hidden",
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: colors.blueGrey[900],
    color: theme.palette.common.white,
    [theme.breakpoints.down("md")]: {
      top: theme.spacing(3),
      bottom: "auto",
    },
    "&:hover": {
      backgroundColor: colors.blueGrey[900],
    },
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    backgroundColor: theme.palette.secondary.main,
  },
  search: {
    flexGrow: 1,
    height: "100%",
    width: 280,
    display: "flex",
    alignItems: "center",
    boxShadow: "0 0 10px  rgb(216 211 211 / 60%)",
  },
  searchIcon: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.icon,
  },
  searchInput: {
    flexGrow: 1,
    placeholder: "#afaaaa",
    marginLeft: theme.spacing(3),
  },
  addPhotoIcon: {
    marginRight: theme.spacing(1),
  },
  container: {
    padding: theme.spacing(2, 3),
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 120,
    width: 120,
    top: -60,
    left: theme.spacing(3),
    position: "absolute",
    backgroundColor: theme.palette.secondary.dark,
  },
  details: {
    marginLeft: 136,
  },
  actions: {
    marginLeft: "auto",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1),
    },
    "& > * + *": {
      marginLeft: theme.spacing(1),
    },
  },
  pendingButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.red[600],
    "&:hover": {
      backgroundColor: colors.red[900],
    },
  },
  personAddIcon: {
    marginRight: theme.spacing(1),
  },
  button: {
    borderRadius: "20px",
    //backgroundColor:'#f7b62a'
  },
  mailIcon: {
    marginLeft: theme.spacing(2),
  },
  AddTeacherStudent: {
    color: '#393939',
  },
}));

function Header({
  className,
  classeId,
  thisclasse,
  searchHandler,
  placeholderOfSearch,
  currentTab,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}


  const user = useSelector((state) => state.user.userData);

  const [openCreateCoursModal, setOpenCreateCoursModal] = useState(false);
  const [manageStudents, setManageStudents] = useState(false);
  const [openInviteClasse, setOpenInviteClasse] = useState(false);
  const [inviteStudents, setInviteStudents] = useState(false);
  const [inviteTeacher, setInviteTeacher] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState(t('something went wrong'));

  const handleInviteClasseClose = () => {
    setOpenInviteClasse(false);
    setInviteStudents(false);
    setInviteTeacher(false);
    
  };

  const handleInviteStudentOpen= () => {
    setOpenInviteClasse(true);
    setInviteStudents(true);
  };
  
  const handleInviteTeacherOpen= () => {
    setOpenInviteClasse(true);
    setInviteTeacher(true);
  };

  const handleSuccessSnackbarClose = () => {
    setOpenSuccessSnackbar(false);
  };

  const handleErrorSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {/* <div className={classes.cover}></div> */}
      <Container maxWidth="lg" className={classes.container}>
        {/* <Avatar
          alt="classe"
          className={classes.avatar}
          src={'/images/icons/classe-home 2.png'}
        /> */}
        {/* <div className={classes.details}>
          <Typography component="h1" variant="h4">
            {thisclasse.classeName}
          </Typography>
          <Typography component="h2" gutterBottom variant="overline">
            {thisclasse.schoolName + ', ' + thisclasse.city}
          </Typography>
        </div> */}
        <Grid
          item
          xs={12}
          style={{ marginInlineStart: "15px", marginBottom: "17px" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Grid container style={{ lineHeight: "1.0" }}>
                <Grid item>
                  <Link
                    className={classes.logo}
                    color="primary"
                    component={RouterLink}
                    to="/classes"
                    underline="hover"
                  >
                    <Typography varient="body2">
                      <ArrowBackIosIcon
                        style={{ fontSize: "10px" }}
                      ></ArrowBackIosIcon>
                      Go back
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ marginInlineStart: "15px" }}>
          <Grid container direction="row" spacing={3}>
            <Grid item>
              <Grid container>
                <Grid item>
                  <Avatar
                    alt="cours"
                      // className={classes.avatar}
                    src={
                      thisclasse.data && thisclasse.data.creator.profileImage
                    }
                  >
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h2">
                    {thisclasse.data && thisclasse.data.classeName}
                  </Typography>
                </Grid>
                <Grid item>
                {thisclasse.data &&
                  <Typography variant="body2">By: {thisclasse.data.creator.fullName}</Typography>}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={3}
                justify="flex-end"
                style={{ textAlign: "right",width: 'auto', position: 'absolute', right: 25 }}
              >
                {
                  user.isModerator ?
                  currentTab == 'teachers' || currentTab == 'studentsList' ?
                  <Grid item>
                 
                      <Button
                        className={classes.AddTeacherStudent}
                        color="secondary"
                        variant="contained"
                        onClick={ currentTab == 'teachers'? handleInviteTeacherOpen :handleInviteStudentOpen}
                      >
                        {
                        currentTab == 'teachers' ? 
                          t('Add Teacher') :
                          t('Add Student')
                        }
                      </Button>
                      
              
                  
                  </Grid>
                  :null:null
                  }
                <Grid item>
                    <Paper className={classes.search} elevation={1}>
                      <Input
                        className={classes.searchInput}
                        disableUnderline
                        onChange={searchHandler}
                        placeholder={placeholderOfSearch}
                      />
                      <button type="submit" class="searchButton">
                        <SearchIcon className={classes.searchIcon} />
                      </button>
                    </Paper>
                </Grid>
                {/* <Grid item>
                  {user.isModerator && thisclasse.creator === user._id ? (
                    <div className={classes.actions}>
                  
                    </div>
                  ) : null}
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <CreateCoursModal
          onClose={() => setOpenCreateCoursModal(false)}
          open={openCreateCoursModal}
          currentClasseId={classeId}
        />
      </Container>

      <ManageStudentsModal
        onClose={() => {
          setManageStudents(false);
        }}
        open={manageStudents}
        isClasse={true}
        thisthingid={classeId}
      />

        <InviteClass
          isErrorSnackbar={setOpenErrorSnackbar}
          errorMessage={setErrorSnackbarMessage}
          onClose={handleInviteClasseClose}
          onSuccess={setOpenSuccessSnackbar}
          open={openInviteClasse}
          inviteStudents={inviteStudents}
          inviteTeacher={inviteTeacher}
          classID={classeId}
        />

        <ErrorSnackbar
          onClose={handleErrorSnackbarClose}
          open={openErrorSnackbar}
          errorMessage={errorSnackbarMessage}
        />

        <SuccessSnackbar
          onClose={handleSuccessSnackbarClose}
          open={openSuccessSnackbar}
          message={'Invited Successfully'}
        />
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
