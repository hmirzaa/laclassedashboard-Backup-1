import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Container, Tabs, Card, Tab, Divider, colors, Button } from "@material-ui/core";
import Page from "src/components/Page";
import Header from "./Header";
import StudentsList from "./Connections";
import TeachersList from "./TeachersList";
import Projects from "./Projects";
import HistoryCours from "./../Cours/HistoryCours";
import { useSelector } from "react-redux";
import * as API from "../../services2";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    marginTop: theme.spacing(3),
  },
  tabslash: {
    "&:MuiTabs-scroller": {
      position: "revert",
    },
    backgroundColor: "white",
  },
  tabbutton: {
    "&:MuiTabs-scroller": {
      position: "revert",
    },
    "&:focus": {
      outline: 'none'
    },
    backgroundColor: "#f7b62a",
    margin: "25px",
    borderRadius: "35px",
  },
  divider: {
    backgroundColor: colors.grey[300],
  },
  content: {
    marginTop: theme.spacing(3),
  },

}));

function Profile({ match, history }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const user = useSelector((state) => state.user.userData);
  const token = useSelector((state) => state.user.token);

  const [classe, setClasse] = useState([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [coursCount, setCoursCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [roomsList, setRoomsList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const { id, tab: currentTab } = match.params;

  const tabs = [
    { value: "studentsList", label: t("students list") },
    { value: "teachers", label: t("teachers list") },
    { value: "cours", label: t("courses") },
  ];

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const handleStudentsCount = (count) => {
    setStudentsCount(count);
  };

  const handleTeachersCount = (count) => {
    setTeachersCount(count);
  };

  useEffect(() => {
    if (!id) return;
    fetchClasse();
    fetchClasseParticipantsById()
  }, []);

  const fetchClasse = () => {
    // if (classe.status === 1) return;
    API.getClasse(id, token)
      .then((classe) => {
        const {
          rooms,
          roomsList,
        } = classe.data;
        const newRoomList = roomsList.filter(data => data?.room?.isActive == true)
        setClasse(classe);
        setCoursCount(rooms);
        setRoomsList(newRoomList);

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchClasseParticipantsById = () => {
    API.getClasseParticipants(id, token).then((participantsData) => {
      const { data: { participants } } = participantsData
      console.log('participantsData', participantsData)
      participants.map((user) => {
        console.log('user--', user)
        if (user.isModerator) {
          setTeachersList((value) => [...value, user]);
          // teachersList.push(user)
        }
        else {
          setStudentList((value) => [...value, user]);
        }
      })
      console.log('participant--->', teachersList)
    })
  }

  if (!currentTab) {
    return <Redirect to={`/classe/${id}/studentsList`} />;
  }

  if (!tabs.find((tab) => tab.value === currentTab)) {
    return <Redirect to="/errors/error-404" />;
  }

  const renderTabs = (value, label) => {
    switch (value) {
      case "studentsList":
        return label + ` (${studentList.length || 0})`;
      case "cours":
        return label + ` (${roomsList.length || 0})`;
      case "teachers":
        return label + ` (${teachersList.length || 0})`;
    }
  };
  console.log("Hamza Ayub---->" + roomsList)

  let searchHandler = (e) => {
    let searchText = e?.target?.value;
    if (searchText?.length) {
      setIsSearch(true);
      if (currentTab === "studentsList") {
        let filteredArray = studentList.filter((v) => {
          console.log('v', v)
          console.log('searchText', searchText)

          return (
            v?.fullName?.includes(searchText?.toLowerCase()) ||
            v?.email?.includes(searchText?.toLowerCase()));
        });
        console.log('filteredArray', filteredArray)

        setFilteredStudents(filteredArray);
      } else if (currentTab === "teachers") {
        let filteredArray = teachersList.filter((v) => {
          return (
            v?.fullName
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) !== -1 ||
            v?.email
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) !== -1
          );
        });
        console.log("FILTEREDARRAY" + filteredArray)
        setFilteredTeachers(filteredArray);
      } else if (currentTab === "cours") {

        let filteredArray = roomsList.filter((v) => {
          return (
            v?.room?.roomName
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) !== -1 
          );
        });
        console.log("FILTEREDARRAY32", roomsList, filteredArray)
        setFilteredCourses(filteredArray);
      }
    } else {
      setIsSearch(false);
    }
  };

  let placeholderOfSearch =
    currentTab === "studentsList"
      ? "Search Students Here.."
      : currentTab === "cours"
        ? "Search Courses Here.."
        : "Search Teachers Here..";
  return (
    <Page className={classes.root} title="Classe">
      <Header
        classeId={id}
        thisclasse={classe}
        searchHandler={searchHandler}
        placeholderOfSearch={placeholderOfSearch}
        currentTab={currentTab}
      />

      <Container maxWidth="lg" style={{ paddingBottom: "30px" }}>
        <Card>
          <Container maxWidth="lg">
            <Tabs
              //  indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              value={currentTab}
              variant="scrollable"
              disableFocusRipple={true}
              disableRipple={true}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  className={classes.tabbutton}
                  style={{ position: "revert" }}
                  label={renderTabs(tab.value, tab.label)}
                  value={tab.value}
                  disableFocusRipple={true}
                  disableRipple={true}
                />
              ))}
            </Tabs>

            <div className={classes.content}>
              {currentTab === "studentsList" && (
                <StudentsList
                  studentList={isSearch ? filteredStudents : studentList}
                  studentCountCb={handleStudentsCount}
                  classeId={id}

                />
              )}

              {currentTab === "cours" && (
                <Projects
                  theCours={isSearch ? filteredCourses : roomsList}
                  roomID={id}
                  theClasse={classe}
                  fetchClasse={fetchClasse}
                />
              )}
              {currentTab === "teachers" && (
                <TeachersList
                  teachersList={isSearch ? filteredTeachers : teachersList}
                  archivedCoursCountCb={handleTeachersCount}
                  classeId={id}
                />
              )}
            </div>
          </Container>
        </Card>
      </Container>
    </Page>
  );
}

Profile.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Profile;
