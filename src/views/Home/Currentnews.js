import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import 'react-alice-carousel/lib/alice-carousel.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';


import {
  Card,
  Grid,
  Avatar,
  Button,
  Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
//borderRadius:"15px",
    paddingBottom:"32px",
    marginLeft: '-47px',
    marginTop: '5px',
    width: '95%',
    height:"220px"

  },

  sliderimg:{
    width: 100,
    height: 500
  },
  titletypography:{
    maxHeight: "50px",
    //  width:'50%',
      overflow: 'hidden'
  },
  typography:{
   lineHeight: "18px",
    maxHeight: "64px",
  //  width:'70%',
    overflow: 'hidden'
  },
  reactslick:{
    '& slick-prev::before': {
     color:'#353535'
    }
  },
  learnMoreButton: {
    width: '100%',
    color: 'white',
    fontSize: "12px",
    justifyContent:'center',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 400
  },
  actions: {
    justifyContent: 'flex-end'
  },
  arrowForwardIcon: {
    marginLeft: theme.spacing(1)
  }
}));



// const responsive = {
//   0: { items: 1 },
//   568: { items: 2 },
//   1024: { items: 3 },
// };

function Currentnews ({ propsEvents, className, ...rest}) {

  const history = useHistory();




  const events = propsEvents
  var settings = {
      dots: false,
      infinite: true,
      focusOnSelect: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      initialSlide: 0,

    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          initialSlide: 2,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        }
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 0,
          slidesToScroll: 1,
        }
      }
    ]
  };



  useEffect(() => {


    // events.map((event) => {

    //   if(event.urlType=="course")
    //   {

    //     API.getRoomById(event.room, token)
    //     .then((data) => {

    //       let creator = data.data.creator

    //       if(creator == null)
    //       {

    //         API.getRoomById(event.room, token)
    //         .then((data) => {

    //           let creator = data.data.creator

    //           if(creator == null)
    //           {

    //           }

    //         })
    //         .catch((error) => {
    //           console.log(error);
    //         });
    //       }


    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    //   }
    // })


  });

  const classes = useStyles();

  const courseRedirect = (type, id, redirectUrl) => {
    if (type === "url") window.location.href = redirectUrl
    if (type === "course") history.push(`/live/${id}`)
  }

  return (
    <div >
      <Slider {...settings} className={classes.reactslick}>

      {events.map((event) => {

        return(
      <div key={event.image}>
        <Card {...rest} className={clsx(classes.root, className)} style={{marginRight : '15px'}}>
          <Grid item  xs={12} style={{marginTop:"15px",marginInlineStart:"15px", height:'62px'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" className={classes.titletypography}>
                 {event.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{margin:"15px" , height:'70px'}}>
            <Grid container
              justify="space-around"
              alignItems="center"
              style={{flexWrap:'nowrap'}}
            >
              <Grid item xs={12} sm={9} >
                <Typography varient="body2" style={{fontSize: 15}} className={classes.typography}>
                  {event.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Avatar
                  src={event.image}
                  alt="No Image Found" 
                  style={{ width:"80px",height: "80px"}}
                >
                </Avatar>
                
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{margin:'15px' , height:'62px'}}>
            <Grid container container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  spacing={2}>
              <Grid item xs={12}  style={{ width: '100%' }}>
                <Button
                    className={classes.learnMoreButton}
                    variant="text"
                    size="large"
                    style={{borderRadius:"15px"}}
                    onClick={() => courseRedirect(event.urlType, event?.room?.urlCode, event.redirectUrl)}
                >
                  {event.textBtn}
                </Button>
              </Grid>
            </Grid>
          </Grid>

        </Card>

      </div>
  )
})}
      </Slider>
    </div>

  );
}
export default Currentnews;



  {/* <AliceCarousel

        mouseTracking
        items={items}
        paddingLeft={50}
        responsive={responsive}

    /> */}
