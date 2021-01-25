import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button, Divider,
  Drawer,
  Typography,
  Grid,
  Collapse
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CONFIG from '../../config';
import ReactGA from 'react-ga';
import * as API from '../../services2';
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  FacebookMessengerShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton
} from "react-share";
import { FacebookButton, } from "react-social";
// import array from json

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    width: 420,
    maxWidth: '100%'
  },
  switchPublicCourse: {
    marginTop: theme.spacing(2)
  },
  header: {
    padding: theme.spacing(2, 1),
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(0, 3),
    flexGrow: 1
  },
  contentSection: {
    padding: theme.spacing(2, 0)
  },
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  contentSectionContent: {},
  formGroup: {
    padding: theme.spacing(2, 0)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  field: {
    marginTop: 0,
    marginBottom: 0
  },
  flexGrow: {
    flexGrow: 1
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  tags: {
    marginTop: theme.spacing(1)
  },
  minAmount: {
    marginRight: theme.spacing(3)
  },
  maxAmount: {
    marginLeft: theme.spacing(3)
  },
  radioGroup: {},
  actions: {
    padding: theme.spacing(3),
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  fieldHint: {
    margin: theme.spacing(1, 0)
  },
  students: {
    marginTop: 20
  },
  inviteAddButton: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    margin: theme.spacing(1, 0)
  },
}));


function ShareCourse({
  open,
  theCours,
  onClose,
  className,
  currentClasseId,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [expandShareCourse, setExpandShareCourse] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);


  const initialValues = {
    classeName: '',
    etablissement: user.etablissement,
    ville: user.cityName,
    email: '',
    fullName: '',
    tags: []
  };

  const [values, setValues] = useState({ ...initialValues });
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });



  const resetFormsOnClose = () => {
    setValues({ ...initialValues });
  };

  const handleToggleShareCourse = () => {
    setExpandShareCourse((prevExpandProject) => !prevExpandProject);
  };


  console.log("The Share Course is::", theCours)
  return (

    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={() => { onClose(); resetFormsOnClose(); }}
      open={open}
      variant="temporary"
    >
      <form
        {...rest}
        className={clsx(classes.root, className)}
        id='createClassForm'
      // onSubmit={handleSubmit}
      >

        <div className={classes.header}>
          <Button
            onClick={onClose}
            size="small"
          >
            <CloseIcon className={classes.buttonIcon} />
            {t('Close')}
          </Button>
        </div>

        <div className={classes.content}>

          {/* Section Create Class */}
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleShareCourse}
            >
              <Typography variant="h5">{t('share course in')}</Typography>
              {expandShareCourse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandShareCourse}>
              <div className={classes.contentSectionContent}>
                <Grid item xs={12} style={{ padding: '13px' }}>
                  <Grid container justify="space-around">
                    <Grid item xs={9}>
                      <Typography
                        className={classes.fieldHint}
                        variant="body2"
                        ref={textAreaRef}
                      >
                        {CONFIG.SITEURL + `/live/${theCours?.urlCode}`}
                      </Typography>

                    </Grid>
                    <Grid item xs={3}>

                      {
                        document.queryCommandSupported('copy') &&
                        <div>
                          <CopyToClipboard text={CONFIG.SITEURL + `/live/${theCours?.urlCode}`}
                          >
                            <Button
                              style={{ fontSize: "10px", border: '1px solid' }}
                              // onClick={() => navigator.clipboard.writeText(CONFIG.SITEURL + `/live/${theCours?.urlCode}`)}
                            >
                              Copy link
                            </Button>
                          </CopyToClipboard>
                        </div>
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
                <Grid xs={12} style={{ padding: '15px' }}>
                  <Grid container spacing={3} justify="space-around" alignItems="center">
                    <Grid item xs={3} style={{ textAlign: 'center' }}>
                      <WhatsappShareButton url={CONFIG.SITEURL + `/live/${theCours?.urlCode}`}>
                        <img src={window.location.origin + "/images/icons/whatsapp.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography >
                          Whatsapp
                      </Typography>
                      </WhatsappShareButton>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: 'center' }}>
                      <FacebookShareButton style={{ borderWidth: '0px', backgroundColor: 'white' }}
                        url={CONFIG.SITEURL + `/live/${theCours?.urlCode}`}
                      //appId={'244049677035541'}
                      >
                        {/* <FacebookCount url={`https://compte.laclasse.ma/live/${theCours.urlCode}`} /> */}
                        <img src={window.location.origin + "/images/icons/facebook.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography>
                          Facebook
                        </Typography>
                      </FacebookShareButton>
                    </Grid>
                    {/* <Grid item xs={3} style={{ textAlign: 'center' }}>
                      <FacebookMessengerShareButton
                        url={CONFIG.SITEURL + `/live/${theCours?.urlCode}`} appId={'244049677035541'}>
                        <img src={window.location.origin + "/images/icons/messenger.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography>
                          Messenger
                       </Typography>
                      </FacebookMessengerShareButton>
                    </Grid> */}
                    <Grid item xs={3} style={{ textAlign: 'center' }}
                    >
                      <LinkedinShareButton url={CONFIG.SITEURL+`/live/${theCours?.urlCode}`}>
                        <img src={window.location.origin +"/images/icons/linkedin.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography >
                          Linkedin
                        </Typography>
                      </LinkedinShareButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={12} style={{ padding: '15px' }}>
                  <Grid container spacing={3} justify="space-around" alignItems="center">
                    <Grid item xs={3} style={{ textAlign: 'center' }}>
                      <TwitterShareButton url={CONFIG.SITEURL + `/live/${theCours?.urlCode}`}>
                        <img src={window.location.origin + "/images/icons/twitter.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography style={{ textAlign: 'center' }}>
                          Twitter
                      </Typography>
                      </TwitterShareButton>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: 'center' }}>
                      <TelegramShareButton url={CONFIG.SITEURL + `/live/${theCours?.urlCode}`}>
                        <img src={window.location.origin + "/images/icons/telegram.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography>
                          Telegram
                      </Typography>
                      </TelegramShareButton>
                    </Grid>
                    {/* <Grid item xs={3} style={{ textAlign: 'center' }}
                      onClick={() => window.open("https://hangouts.google.com/")}
                    >
                      <img src={window.location.origin +"/images/icons/hangout.png"} style={{ width: '60px', height: '60px' }}></img>
                      <Typography>
                        Hangout
                      </Typography>
                    </Grid> */}
                    <Grid item xs={3} style={{ textAlign: 'center' }}>
                      <EmailShareButton url={CONFIG.SITEURL + `/live/${theCours?.urlCode}`}>
                        <img src={window.location.origin + "/images/icons/email.png"} style={{ width: '60px', height: '60px' }}></img>
                        <Typography style={{ textAlign: 'center' }}>
                          Email
                      </Typography>
                      </EmailShareButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={12} style={{ padding: '15px' }}>
                  <Grid container spacing={3} justify="space-around" alignItems="center">
                    {/* <Grid item xs={3} style={{ textAlign: 'center' }}
                    >
                      <img src={window.location.origin +"/images/icons/instagram.png"} style={{ width: '60px', height: '60px' }}></img>
                      <Typography>
                        Instagram
                      </Typography>
                    </Grid> */}
                  </Grid>
                </Grid>
              </div>
            </Collapse>
          </div>


        </div>
        <Divider />

      </form >
    </Drawer >
  );
}

ShareCourse.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default ShareCourse;
