import React, { Fragment, useState } from 'react';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import { Grid, Card, Button, colors } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {},
  header: {
    paddingBottom: 2
  },
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  ArrowButton: {
    flexGrow: 1,
    textAlign: 'left'
  },
  description: {
    padding: theme.spacing(2, 3, 1, 3)
  },
  tags: {
    padding: theme.spacing(0, 3, 2, 3),
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  },

  learnMoreButton: {
    width: '100%',
    color: 'white',
    fontSize: "12px",
    justifyContent: 'revert',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },

  learnMoreButtonUnsubscribe: {
    width: '100%',
    color: 'white',
    backgroundColor: theme.palette.secondary.unsubscribeButton,
    '&:hover': {
      backgroundColor: theme.palette.secondary.unsubscribeButton
    }
  },

  learnMoreButtonTextDisabled: {
    width: '100%',
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: '#9b9ea1',
    '&:hover': {
      backgroundColor: '#9b9ea1'
    }
  },
  learnMoreButtonDisable: {
    width: '100%',
    color: 'white',
    backgroundColor: '#A9A9A9',
    '&:hover': {
      backgroundColor: '#A9A9A9'
    },
    '&:disabled': {
      color: 'white'
    }
  },
  likedButton: {
    color: colors.yellow[600]
  },
  shareButton: {
    marginLeft: theme.spacing(1)
  },
  details: {
    padding: theme.spacing(2, 3)
  },

  PlayCircleFilled: {
    marignRight: theme.spacing(3),
    color: 'white'
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 50,
    width: 50,
    backgroundColor: theme.palette.secondary.main
  },
  avatarHover: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 55,
    width: 55,
    backgroundColor: theme.palette.secondary.main
  },
  shareIcons: {
    padding: theme.spacing(2, 3, 1, 3),
  },
  icons: {
    //marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  calendarIcon: {
    color: 'black',
    backgroundColor: 'grey',
    marginRight: theme.spacing(1),
  },
  shareCalendarIcon: {
    //marginLeft: theme.spacing(1),
  },
  coursTitle: {
    color: theme.palette.coursTitle,
    'text-decoration': 'underline'
  }
}));

export default function ExploreCategoriesView({ className, getCategoryIdFun,theCategory, ...rest }) {
  const classes = useStyles();

  const [categoryName, setCategoryName] = useState('');


  const iconComponents = [
    <img src="./images/icons/elementary.png" style={{ marginBlockStart: "30px", marginBlockEnd: "30px", height:'20%' , width:'20%' }}/>,
    <img src="./images/icons/university.png" style={{ marginBlockStart: "30px", marginBlockEnd: "30px",  height:'20%' , width:'20%' }}/>,
    <img src="./images/icons/webinar.png" style={{ marginBlockStart: "30px", marginBlockEnd: "30px", height:'20%' , width:'20%' }}/>,
    <img src="./images/icons/others.png" style={{ marginBlockStart: "30px", marginBlockEnd: "30px",  height:'20%' , width:'20%' }}/>
  ]

  return (
    <Fragment>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h4 className="heading-4 mt-4 mb-3=== font-weight-bold" style={{ marginTop: "30px" }}>
            Categories
          </h4>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {theCategory.map((category, index) => {
          return (
            <Grid item xs={6} sm={6} lg={3} key={category.id} >
              <Card {...rest} className={clsx(classes.root, className)}>
                <div style={{ textAlign: 'center' }}>
                  {iconComponents[index]}
                </div>
                <Grid item style={{ width: '100%' }}>
                  <Button
                    className={classes.learnMoreButton}
                    size="large"
                    color="primary"
                    textAlign="left"
                    fullWidth
                    style={{ backgroundColor: '#f7b62a', color: 'black' }}
                    endIcon={<DoubleArrowIcon></DoubleArrowIcon>}
                    // onClick={onClickButton1}
                    onClick={() => {
                      getCategoryIdFun(category.id)
                      setCategoryName(category.name) 
                    }}
                  >
                    <span className={classes.ArrowButton}>
                      {category.name}
                    </span>
                  </Button>
                </Grid>
              </Card>
            </Grid>
          )
        })}

      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h4 className="heading-4 mb-3 font-weight-bold" style={{ marginTop: "20px" }}>
            <a href="/explore" style={{ color: 'black' }}>All Public Courses </a>
            <DoubleArrowIcon />{categoryName}
          </h4>
        </Grid>
      </Grid>
    </Fragment>

  );

}
