import React, { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import uuid from "uuid/v1";
import { useDropzone } from "react-dropzone";
import PerfectScrollbar from "react-perfect-scrollbar";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  colors
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import bytesToSize from "src/utils/bytesToSize";
import { useTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";
import * as API from "../services2";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import * as CSV from "csv-string";

const useStyles = makeStyles((theme) => ({
  root: {},
  dropZone: {
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(6),
    outline: 'none',
    display: 'flex',
    paddingLeft:15,
    //justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: colors.grey[50],
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: colors.grey[50],
    opacity: 0.5,
    padding: 35
  },
  image: {
    width: 55
  },
  info: {
    marginTop: theme.spacing(1)
  },
  list: {
    maxHeight: 320
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}));



const FilesDropzoneManageStudents = forwardRef((props, ref) => {

  const {
    className, 
    classID, 
    isClasse, 
    setIsConfirmClicked,
    onClose, 
    onSuccess, 
    errorMessage, 
    isErrorSnackbar,
    inviteTeacher,
    setInvitedStudents,
    invitedStudents,
    newClass,
    ...rest
  } = props;

  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const [files, setFiles] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState()

  const token = useSelector((state) => state.user.token);

  let emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



  const handleDrop = useCallback((acceptedFiles) => {

    
    setError('');
    if (acceptedFiles.length === 1) {
      setIsFileUploaded(true);
    }

    if (acceptedFiles.length > 1) {
      setFiles([]);
      return false;
    }

    setFiles((prevFiles) => [...prevFiles].concat(acceptedFiles));

    // Handle CSV file
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => {
        console.log('file reading was aborted');
        setError('file reading was aborted');
      };

      reader.onerror = () => {
        console.log('file reading has failed');
        setError('file reading has failed');
      };

      reader.onload = () => {
        const textStr = reader.result;
        
        const csvArr = CSV.parse(textStr);
        setCount(--csvArr.length)
        if (csvArr && csvArr.length > 0) {
          for (let [i, csvData] of csvArr.slice(1).entries()) {
            if (!csvData.includes("")) {

              if (!emailValidation.test(csvData[1])) {
                setError(t('invalid email address') + ' (' + t('line') + (i + 2) + ')');
                setFiles([]);
                setIsFileUploaded(false);
                setInvitedStudents([]);
                break;

              } else {
                csvData[2]=inviteTeacher;
                invitedStudents.push(csvData.join());
              }
            }
          }
        }
      };

      reader.readAsText(file);
    });
  }, []);

if(!newClass)
{
  useImperativeHandle(ref, () => ({

    handleUploadFile() {
      let inviteUsersData = {
        invitedUsers: invitedStudents,
        isModerator: inviteTeacher ? true : false
      };
    

      API.sendInvitestoClass(classID, inviteUsersData, token)
      

        .then((res) => {
          const { status } = res
          if (status === 1) {
            onSuccess(true)
            setTimeout(() => {
              onClose()
              window.location.reload()
            }, 1500);
          }
          if( status == 0)
          {
            errorMessage(t(res.message));
            isErrorSnackbar(true);
            setTimeout(() => {
              isErrorSnackbar(false);
              setIsConfirmClicked(false)
            }, 1500);
          }
        }).catch((error) => {
        console.log(error);
        onClose();
      });
    }

  }));

}

  const handleRemoveAll = () => {
    setFiles([]);
    setIsFileUploaded(false);
    setInvitedStudents([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: '.csv'
  });

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      {
        isFileUploaded ? null :
          <div
            className={clsx({
              [classes.dropZone]: true,
              [classes.dragActive]: isDragActive
            })}
            {...getRootProps()}
          >
            <input {...getInputProps()} accept="text/csv" multiple={false}/>
            <div>
              <img
                alt="Select file"
                className={classes.image}
                src="/images/undraw_add_file2_gvbb.svg"
              />
            </div>
            <div>
              <Typography
                gutterBottom
                variant="h3"
              >
                {t('Select CSV file')}
              </Typography>
              <Typography
                className={classes.info}
                color="textSecondary"
                variant="body1"
              >
                {t('Drop CSV file here or click to browse in your computer.')}
              </Typography>
            </div>
          </div>
      }

      {files.length > 0 && (
        <>
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <List className={classes.list}>
              {files.map((file, i) => (
                <ListItem
                  divider={i < files.length - 1}
                  key={uuid()}
                >
                  <ListItemIcon>
                    <FileCopyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ variant: 'h5' }}
                    secondary={t('students') + ' (' + count + ')'}
                  />
                  <Tooltip title="More options">
                    <IconButton
                      edge="end"
                      onClick={handleRemoveAll}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                </ListItem>
              ))}
            </List>
          </PerfectScrollbar>
        </>
      )}

      {
        error !== '' ?
          <Typography
            className={classes.info}
            color="error"
            variant="body1"
          >
            {error}
          </Typography>
          : null
      }
    </div>
  );
});

FilesDropzoneManageStudents.propTypes = {
  className: PropTypes.string
};

export default FilesDropzoneManageStudents;
