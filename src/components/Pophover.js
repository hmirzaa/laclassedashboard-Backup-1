import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import { Box, Popover, Button, Tooltip, IconButton } from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';
const useStyles = makeStyles(theme => ({
  root: {
    lineHeight: 1.34
  },

  header: {
    paddingBottom: 2
  },
  tooltip: {
    '&:hover': {
      fontSize: "40px",
      backgroundColor: 'gray',
      Height: "20px"
    }
  },

  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  }
}));

export default function Pophover({ className, theCours, ...rest }) {
  const classes = useStyles();
  return (
    <Fragment>
      <div {...rest}
        className={clsx(classes.root, className)}
      >
        <Tooltip title={theCours.description} className={classes.tooltip}>
          <InfoIcon
            style={{ fontSize: "revert", backgroundColor: "white" }}>
          </InfoIcon>
        </Tooltip>
      </div>
    </Fragment>
  );
}
