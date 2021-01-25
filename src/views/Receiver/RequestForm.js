import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Modal, Card, Typography, Grid } from "@material-ui/core";
import ReactAudioPlayer from "react-audio-player";
import { db } from "../../config";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    boxShadow: theme.shadows[20],
    width: 850,
    height: 350,
    maxHeight: "100%",
    overflowY: "auto",
    maxWidth: "100%",
  },
  container: {
    marginTop: theme.spacing(3),
    height: 200,
  },
  actions: {
    justifyContent: "flex-end",
  },
  image: {
    height: "300px",
    width: "auto",
  },
}));

function RequestForm({
  onFinish,
  notification,
  isShow,
  open,
  onClose,
  user,
  ...rest
}) {
  const classes = useStyles();
  let [cindex] = useState(0);
  let [isModal, setModal] = useState(true);

  let NotificationsToDisplay = open
    ? [open]
    : notification.filter((val) => !val.isPlay);

  const nextNotificationHandler = () => {
    if (open) {
      return onClose();
    }
    setModal(false);
    db.collection("notifications")
      .doc(user?.deviceId)
      .collection("myNotification")
      .doc(`${NotificationsToDisplay[cindex]._id}`)
      .update({
        isPlay: true,
      });

    if (NotificationsToDisplay.length - 1 > cindex) {
      setTimeout(() => {
        setModal(true);
      }, 3000);
      return;
    }
    setModal(true);
    return;
  };

  return (
    <Modal onClose={onClose} open={!!NotificationsToDisplay.length && isModal}>
      <Card {...rest} className={clsx(classes.root)}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <div>
              <img
                alt="Presentation"
                src="./images/icons/ClipartClass.png"
                className={classes.image}
              ></img>
            </div>
          </Grid>
          <Grid item>
            <Grid direction="column">
              <Grid item>
                <Typography variant="h3">
                  {NotificationsToDisplay[cindex]?.fullName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h3" style={{ color: "#c30d0d" }}>
                  IT'S TIME TO GO HOME !
                </Typography>
              </Grid>

              <ReactAudioPlayer
                src={
                  NotificationsToDisplay[cindex]?.voice
                    ? NotificationsToDisplay[cindex]?.voice
                    : process.env?.REACT_APP_DUMMY_AUDIO
                }
                autoPlay
                controls
                onEnded={nextNotificationHandler}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  );
}

RequestForm.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

RequestForm.defaultProps = {
  open: false,
  onClose: () => {},
};

export default memo(RequestForm);
