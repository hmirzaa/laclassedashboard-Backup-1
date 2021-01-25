import React, { Fragment, useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import RequestForm from "./RequestForm";
import AlarmIcon from "@material-ui/icons/Alarm";
import { Grid, Card, Button, Typography, makeStyles } from "@material-ui/core";
import { db } from "../../config";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: "1",
  },
  learnMoreButton: {
    width: "100%",
    color: "white",
    fontSize: "12px",
    justifyContent: "revert",
    backgroundColor: "#c30d0d",
    "&:hover": {
      backgroundColor: "#c30d0d",
    },
  },
  paper: {
    padding: "10px",
    textAlign: "center",
    color: "white",
    whiteSpace: "nowrap",
    marginBottom: "10px",
  },
  ArrowButton: {
    flexGrow: 1,
    fontSize: "20px",
    textAlign: "left",
  },
}));

function LaclasseForm({ className, ...rest }) {
  const user = useSelector((state) => state.user.userData);
  const classes = useStyles();
  const [openRequest, setOpenRequest] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    db.collection("notifications")
      .doc(user?.deviceId)
      .collection("myNotification")
      .where("timestamp", ">", Date.now() - 1800000)
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        let msgs = [];
        snap.forEach((val) => {
          msgs.push({ ...val.data(), _id: val.id });
        });
        setNotifications(msgs);
      });
  }, []);

  return (
    <Fragment>
      <Grid container direction="row" spacing={3}>
        {notifications.map((notification, index) => {
          return (
            <Grid item xs={3} key={index}>
              <Card {...rest} className={clsx(classes.root, className)}>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  spacing={3}
                >
                  <Grid item xs>
                    <Typography variant="h4">
                      {notification.fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h4">
                      {notification.classname}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item style={{ width: "100%" }}>
                  <Button
                    className={classes.learnMoreButton}
                    size="large"
                    color="primary"
                    fullWidth
                    startIcon={
                      <AlarmIcon style={{ fontSize: "14px" }}></AlarmIcon>
                    }
                    onClick={() => setOpenRequest(notification)}
                  >
                    <span className={classes.ArrowButton}>
                      {notification.createdAt}
                    </span>
                  </Button>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {!!notifications.length && (
        <RequestForm
          notification={notifications}
          user={user}
          onClose={() => setOpenRequest(false)}
          open={openRequest}
        />
      )}
    </Fragment>
  );
}

export default memo(LaclasseForm);
