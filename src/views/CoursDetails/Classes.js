import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid , colors} from '@material-ui/core';
import CoursCard from 'src/components/CoursCard';
import * as API from '../../services2';
import Alert from 'src/components/Alert';
import EmptyElements from '../Empty/EmptyElements';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoadingElement from '../Loading/LoadingElement';
import ProjectCard from '../../components/ProjectCard';

const useStyles = makeStyles((theme) => ({
  root: {},
  alert: {
    marginTop: theme.spacing(3) ,
    marginBottom: theme.spacing(3) ,
    backgroundColor: colors.blue[700]
  },
  divider: {
    backgroundColor: colors.grey[300]
  } ,

}));

function Classes({ className, room, ...rest }) {
  const classes = useStyles();
  const { t } = useTranslation(); //{t('calendar')}

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userData);

  const [openAlert, setOpenAlert] = useState(false);

  const [roomClasses, setRoomClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setRoomClasses(room.classes);
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [room]);

  if (room.creator !== user._id) {
    return null;
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      {
        isLoading ? <LoadingElement /> :
          ( roomClasses && roomClasses.length > 0 ) ?

            <Grid
              container
              spacing={3}
            >
              {roomClasses ? roomClasses.map((classe) => (
                <Grid
                  item
                  key={classe._id}
                  lg={4}
                  lx={4}
                  md={6}
                  xs={12}
                >
                  <ProjectCard theClasse={classe}  />
                </Grid>
              )) : null}
            </Grid>

            : <EmptyElements
              title={t('no class')}
              description={t('this course belong to no class')}
            />
      }
    </div>
  );
}

Classes.propTypes = {
  className: PropTypes.string
};

export default Classes;
