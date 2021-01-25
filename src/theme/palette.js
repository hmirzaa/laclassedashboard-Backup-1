import { colors } from '@material-ui/core';

const Colors = {
  PRIMARY: '#393939',
  SECONDARY: '#f7b731',
  SECONDARY_DARK: '#f7b131',
  DEFAULT: '#FFFFFF',
  PEARL_RIVER: '#F4F6F8',
  RED: colors.red[900],
  IMPERIAL: colors.red[600],
  PERSIAN: colors.red[400],
  CHARCOAL: colors.blueGrey[900],
  IRON: colors.blueGrey[800],
  ANCHOR: colors.blueGrey[600],
  STEEL: colors.blueGrey[200],
  INDIGO: colors.indigo[900],
};

export default {
  primary: {
    contrastText: Colors.DEFAULT,
    dark: Colors.PRIMARY,
    main: Colors.PRIMARY,
    light: Colors.PRIMARY
  },
  secondary: {
    contrastText: Colors.DEFAULT,
    dark: Colors.SECONDARY_DARK,
    main: Colors.SECONDARY,
    light: Colors.SECONDARY,
    unsubscribeButton: '#f78205'
  },
  error: {
    contrastText: Colors.DEFAULT,
    dark: Colors.RED,
    main: Colors.IMPERIAL,
    light: Colors.PERSIAN
  },
  text: {
    primary: Colors.CHARCOAL,
    secondary: Colors.ANCHOR,
    link: Colors.ANCHOR
  },
  background: {
    default: Colors.PEARL_RIVER,
    paper: Colors.DEFAULT
  },
  link: Colors.IRON,
  icon: Colors.ANCHOR,
  divider: Colors.STEEL,
  coursTags: {
    backgroundIsPublic: colors.green[500],
    backgroundIsPrivate: colors.grey[800],
    waiting: colors.grey[700]
  },
  coursTitle: Colors.INDIGO
};
