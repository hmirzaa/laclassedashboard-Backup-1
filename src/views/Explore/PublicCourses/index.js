import React, { Fragment, useState, useEffect } from "react";
import "./styles.css";
import Pophover from "./Pophover";
import Pophover2 from "./Pophover2";
import EmptyElements from "../../Empty/EmptyElements";
import { useTranslation } from "react-i18next";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import CircularProgress from "@material-ui/core/CircularProgress";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import VideocamIcon from '@material-ui/icons/Videocam';
import SearchIcon from "@material-ui/icons/Search";
import Paginate from "src/components/Paginate";
import clsx from "clsx";
import { SuccessSnackbar } from "../../Snackbars";
import { makeStyles } from "@material-ui/styles";
import * as API from "../../../services2";
import getInitials from "../../../utils/getInitials";
import { LocalStorage } from '../../../services/localstorage.service';
import {
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Typography,
  colors,
  Avatar,
  IconButton,
  Paper,
  Input,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import moment from "moment";
import { PersonAdd } from "@material-ui/icons";
import LoginModal from './LoginModal';

const useStyles = makeStyles((theme) => ({
  root: {},

  header: {
    paddingBottom: 2,
  },
  content: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  paginate: {
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
  },
  description: {
    padding: theme.spacing(2, 3, 1, 3),
  },
  tags: {
    padding: theme.spacing(0, 3, 2, 3),
    "& > * + *": {
      marginLeft: theme.spacing(1),
    },
  },
  learnMoreButtonwatch: {
    fontWeight: 'bold',
    width: '100%',
    color: 'black',
    justifyContent: 'revert',
    borderRadius: '10rem',
    backgroundColor: '#babcbe',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  learnMoreButton: {
    fontWeight: "bold",
    width: "100%",
    color: "white",
    borderRadius: "10rem",
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: "black",
    },
  },
  startButton: {
    fontWeight: "bold",
    width: "100%",
    color: "black",
    borderRadius: "10rem",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },

 
  likedButton: {
    color: colors.yellow[600],
  },
  shareButton: {
    marginLeft: theme.spacing(1),
  },
  details: {
    padding: theme.spacing(2, 3),
  },

  PlayCircleFilled: {
    marignRight: theme.spacing(3),
    color: "white",
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    backgroundColor: theme.palette.secondary.main,
  },
  avatarHover: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 55,
    width: 55,
    backgroundColor: theme.palette.secondary.main,
  },
  shareIcons: {
    padding: theme.spacing(2, 3, 1, 3),
  },
  icons: {
    //marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  calendarIcon: {
    color: "black",
    backgroundColor: "grey",
    marginRight: theme.spacing(1),
  },
  shareCalendarIcon: {
    //marginLeft: theme.spacing(1),
  },
  coursTitle: {
    color: theme.palette.coursTitle,
    "text-decoration": "underline",
  },
  searchIcon: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.icon,
  },
  search: {
    flexGrow: 1,
    height: 42,
    display: "flex",
    alignItems: "center",
    minWidth:'230px'
  },
  searchInput: {
    flexGrow: 1,
    placeholder: "#afaaaa",
    marginLeft: theme.spacing(3),
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2),
  },
}));

export default function ExplorePubliccorsView({
  className,
  getAllPublicRooms,
  publicRooms,
  ...rest
}) {
  // console.log("ayub"+thecours)
  const { t } = useTranslation();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [successMessage, setSuccessMessage] = useState("");
  let [page, setPage] = useState(1);
  let [filteredCourses, setCourses] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [currentRoomId, setCurrentRoomId] = useState('');
  const [IsAuth, setIsAuth] = useState(false);
  const [openModal, setOpenModal] = useState(false)

  const participateInRoomByStudent = (id) => {
    API.participateInRoomByStudent(id, token)
      .then((res) => {
        if (res.message) setSuccessMessage(res.message);
      })
      .then(() => {
        setIsLoading(false);
        getAllPublicRooms();
        setTimeout(() => {
          setSuccessMessage("");
        }, 1500);
      });
  };


  useEffect(() => {
    console.log('token', token)
    setIsLoading(true);

    const userToken = LocalStorage.getItem('userToken');

    if (!userToken || userToken === '') {
      setIsAuth(false)
      setIsLoading(false);
    } else {
      setIsAuth(true)
      setIsLoading(false);
    }
  })



  const paginationHandler = (e) => {
    setPage(++e.selected);
  };

  const searchHandler = (e) => {
    let inputText = e.target.value.toLowerCase();
    if (inputText.length) {
      let filteredArray = publicRooms.filter(
        (val) =>
          val.roomName.toLowerCase().indexOf(inputText) != -1 ||
          val.category.name.toLowerCase().indexOf(inputText) != -1 ||
          val.creator.fullName.toLowerCase().indexOf(inputText) != -1
      );

      setCourses([...filteredArray]);
    } else {
      setCourses(false);
    }
  };

  const coursesPerPage = 9;
  let roomsToRender = filteredCourses ? filteredCourses : publicRooms;

  const classes = useStyles();
  console.log("roomsToRender roomsToRender roomsToRender", roomsToRender)
  return (
    <Fragment>
      <Grid
        container
        spacing={5}
        direction="row"
        justify="center"
        alignItems="center"
        style={{ marginBlockEnd: "20px" }}
      >
        <Grid item xs={6}>
          <div {...rest} className={clsx(classes.root, className)}>
            <Paper className={classes.search} elevation={1}>
              <Input
                className={classes.searchInput}
                disableUnderline
                placeholder="Search by title, teacher, name, category"
                style={{ fontStyle: "italic" }}
                onChange={searchHandler}
              />
              <button type="submit" class="searchButton">
                <SearchIcon className={classes.searchIcon} />
              </button>
            </Paper>
            {roomsToRender.length == 0 ? (
              <EmptyElements title={t("no courses")} />
            ) : null}
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {roomsToRender
          .slice(page * coursesPerPage - coursesPerPage, page * coursesPerPage)
          .map((publicRoom, index) => {
            let dateTime = moment.utc(publicRoom.startDateTime).format('YYYY-MM-DD HH:mm').split(" ");
            return (
              <Grid item md={4} sm={6} xs={12}>
                <Card {...rest} className={clsx(classes.root, className)}>
                  <Grid container style={{ textAlign: "left" }}>
                    <Grid item xs={12}>
                      <div className="card-badges">
                        <span
                          className="shadow-none badge badge-danger badge-pill"
                          style={{ backgroundColor: "#f7b731", color: "black" }}
                        >
                          {publicRoom.urlCode}
                        </span>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container style={{ flexWrap: 'nowrap' }}>
                    <Grid item style={{ marginInlineStart: "15px" }}>
                      <Avatar
                        alt="cours"
                        className={classes.avatar}
                        src={
                          publicRoom.creator && publicRoom.creator.profileImage
                        }
                      >
                        {getInitials(publicRoom.creator.fullName)}
                      </Avatar>
                    </Grid>
                    <Grid item xs={8} style={{ marginInlineStart: "15px" }}>
                      <Grid container spacing={3}>
                        <Grid item xs>
                          <Grid
                            container
                            direction="row"
                            style={{ lineHeight: "1.0" }}
                          >

                            <Grid item >
                              <Typography variant="h4">
                                {publicRoom.roomName}
                              </Typography>
                            </Grid>
                            <Grid item >
                              <Pophover description={publicRoom.description} />
                            </Grid>

                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs>
                          <Typography
                            varient="body2"
                            style={{ marginTop: "-10px", color: "grey" }}
                          >
                            By:{" "}
                            {publicRoom.creator && publicRoom.creator.fullName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={1} style={{ textAlign: "right" }}>
                      <IconButton size="small">
                        {IsAuth ? (<Pophover2 theCour={publicRoom}
                          participateCheck={publicRoom.checkParticipation}
                        />) : ""}
                      </IconButton>
                    </Grid>
                  </Grid>

                  <CardContent className="p-3">
                    <Divider />
                    <div style={{ marginTop: "20px" }}>
                      <Grid
                        alignItems="center"
                        container
                        justify="space-between"
                        spacing={1}
                      //  style={{ flexWrap: 'nowrap' }}
                      >
                        <Grid item>
                          <Typography variant="h5">Start Date</Typography>
                          <center>
                            <Typography variant="body2">
                            {dateTime[0]}<br></br>{dateTime[1]}
                            </Typography>
                          </center>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="h5"
                            style={{ textAlign: "center" }}
                          >
                            Category
                          </Typography>
                          <center>
                            <Typography variant="body2">
                              <br></br>
                              {publicRoom?.category?.name}
                            </Typography>
                          </center>
                        </Grid>
                        <Grid item>
                          <Typography variant="h5">Participants</Typography>
                          <center>
                            <Typography variant="body2">
                              <br></br>
                              {publicRoom.participantsCount}
                            </Typography>
                          </center>
                        </Grid>
                      </Grid>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <Grid
                        alignItems="center"
                        container
                        justify="center"
                        spacing={3}
                      >

                        {/* <div style={{ display: publicRoom.checkParticipation && 'flex' }}> */}
                        <Grid item style={{ width: publicRoom.checkParticipation ? '70%' : "70%" }}>
                          {IsAuth ? (
                            <Button
                              title="Start"
                              className={
                                publicRoom?.creator?.id == user?.id ?
                                  classes.startButton
                                  :
                                  publicRoom.checkParticipation
                                    ? classes.startButton
                                    : classes.learnMoreButton
                              }
                              endIcon={
                                publicRoom?.creator?.id == user?.id ?
                                  <PlayCircleOutlineIcon
                                    style={{ fontSize: "27px" }}
                                  ></PlayCircleOutlineIcon>
                                  :
                                  publicRoom.checkParticipation ? (
                                    <PlayCircleOutlineIcon
                                      style={{ fontSize: "27px" }}
                                    ></PlayCircleOutlineIcon>
                                  ) : (
                                      publicRoom.id === currentRoomId ? <CircularProgress color="secondary" size={16} />
                                        :
                                        <PersonAddIcon
                                          style={{ fontSize: "27px" }}
                                        ></PersonAddIcon>

                                    )
                                // <img src="./images/icons/addParticipant.png" style={{height:'15px',width:'3px'}}></img>
                              }
                              onClick={
                                !publicRoom.checkParticipation
                                  ? () => {
                                    setIsLoading(true);
                                    setCurrentRoomId(publicRoom.id)
                                    participateInRoomByStudent(publicRoom.id);
                                  }
                                  : () => {
                                    window.location.href = publicRoom.url;
                                  }
                              }
                            >

                              {publicRoom?.creator?.id == user?.id ?
                                "START"
                                :
                                publicRoom.checkParticipation
                                  ? "START"
                                  : "PARTICIPATE"
                              }
                            </Button>
                          ) : (
                              <Button
                                title="Start"
                                className={
                                  publicRoom?.creator?.id == user?.id ?
                                    classes.startButton
                                    :
                                    publicRoom.checkParticipation
                                      ? classes.startButton
                                      : classes.learnMoreButton
                                }
                                endIcon={
                                  publicRoom?.creator?.id == user?.id ?
                                    <PlayCircleOutlineIcon
                                      style={{ fontSize: "27px" }}
                                    ></PlayCircleOutlineIcon>
                                    :
                                    publicRoom.checkParticipation ? (
                                      <PlayCircleOutlineIcon
                                        style={{ fontSize: "27px" }}
                                      ></PlayCircleOutlineIcon>
                                    ) : (
                                        publicRoom.id === currentRoomId ? <CircularProgress color="secondary" size={16} />
                                          :
                                          <PersonAddIcon
                                            style={{ fontSize: "27px" }}
                                          ></PersonAddIcon>

                                      )
                                  // <img src="./images/icons/addParticipant.png" style={{height:'15px',width:'3px'}}></img>
                                }
                                onClick={() => setOpenModal(true)}
                              >
                                {
                                  publicRoom?.creator?.id == user?.id ?
                                    "START"
                                    :
                                    publicRoom.checkParticipation
                                      ? "START"
                                      : "PARTICIPATE"}
                              </Button>
                            )}


                        </Grid>
                        {/* {publicRoom.checkParticipation &&
                          <Grid item style={{ width: '50%' }}>
                            <Button
                              className={classes.learnMoreButtonwatch}
                              title="Start"
                              endIcon={<VideocamIcon style={{ fontSize: '27px' }}></VideocamIcon>}
                            >
                              <span style={{ flexGrow: "1" }}>
                                Watch
                        </span>

                            </Button>
                          </Grid>
                        } */}
                        {/* </div> */}
                      </Grid>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      <Grid item xs={12}>
        <div {...rest} className={clsx(classes.root, className)}>
          <div className={classes.paginate}>
            <Paginate
              onPageChange={paginationHandler}
              pageCount={roomsToRender.length / coursesPerPage}
            />
          </div>
        </div>
      </Grid>
      <SuccessSnackbar open={successMessage} message={successMessage} />
      <LoginModal open={openModal} onClose={() => setOpenModal(false)} />
    </Fragment >
  );
}
