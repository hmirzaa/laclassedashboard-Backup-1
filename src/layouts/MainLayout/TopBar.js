import React from "react";

import clsx from "clsx";
import PropTypes from "prop-types";
import RefreshIcon from "@material-ui/icons/Refresh";
import Account from "./Account";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { db } from "../../config";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Hidden,
  makeStyles,
} from "@material-ui/core";
import { THEMES } from "src/constants";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...(theme.name === THEMES.LIGHT
      ? {
          boxShadow: "none",
          backgroundColor: "#c30d0d",
        }
      : {}),
    ...(theme.name === THEMES.ONE_DARK
      ? {
          backgroundColor: "#c30d0d",
        }
      : {}),
  },
  toolbar: {
    height: 64,
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    "& + &": {
      marginLeft: theme.spacing(2),
    },
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  refreshbutton: {
    width: "auto",
    height: 3,
  },
}));

function TopBar({ className, ...rest }) {
  const classes = useStyles();
  const user = useSelector((state) => state.user.userData);

  const handleRefresh = () => {
    window.location.reload();
  };

  const removeNotifications = () => {
    db.collection("notifications")
      .doc(user?.deviceId)
      .collection("myNotification")
      .get()
      .then((data) => {
        data.forEach((val) => {
          db.collection("notifications")
            .doc(user?.deviceId)
            .collection("myNotification")
            .doc(val.id)
            .delete()
            .then(() => {})
            .catch((error) => {});
        });
      });
  };

  return (
    <AppBar
      className={clsx(classes.root, className)}
      style={{ color: "white" }}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        {/* <Hidden lgUp>
          <IconButton
          className={classes.menuButton}
          color="inherit"
          onClick={onMobileNavOpen}
          >
          <SvgIcon fontSize="small">
          <MenuIcon />
          </SvgIcon>
          </IconButton>
        </Hidden> */}

        <Hidden mdDown>
          <Button
            style={{ height: "20px", width: "20px" }}
            onClick={handleRefresh}
          >
            <RefreshIcon
              style={{ height: "100%", width: "100%", color: "white" }}
            ></RefreshIcon>
          </Button>
        </Hidden>
        <Button onClick={removeNotifications}>
          <DeleteForeverIcon
            style={{ height: "30px", width: "30px", color: "white" }}
          ></DeleteForeverIcon>
        </Button>
        <Box ml={2} flexGrow={1} />
        {/* <Search />
        <Contacts />
        <Notifications />
        <Settings /> */}
        <Box ml={2}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
