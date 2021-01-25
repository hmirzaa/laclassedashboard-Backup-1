import React, { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { createBrowserHistory } from 'history';
import MomentUtils from '@date-io/moment';
import { Provider as StoreProvider, useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { theme, themeWithRtl } from './theme';
import { configureStore } from './store';
import routes from './routes';
import GoogleAnalytics from './components/GoogleAnalytics';
import ScrollReset from './components/ScrollReset';
import StylesProvider from './components/StylesProvider';
import './mixins/chartjs';
import './mixins/moment';
import './mixins/validate';
import './mixins/prismjs';
import './mock';
import './assets/scss/main.scss';
import { PersistGate } from 'redux-persist/integration/react'
import i18n from "./i18n";
import { I18nextProvider, useTranslation } from 'react-i18next';
import './../node_modules/react-modal-video/scss/modal-video.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from 'react-ga';
import { LocalStorage } from './services/localstorage.service';
import './../node_modules/react-widgets/lib/scss/react-widgets.scss';
import { NotificationSnackbar } from './views/Snackbars';

const history = createBrowserHistory();
const { store, persistor } = configureStore();

function initializeReactGA() {
  ReactGA.initialize('UA-163895259-1');
  ReactGA.pageview('/dashboard');
}

function App() {
  const [direction, setDirection] = useState('ltr');
  const { t } = useTranslation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  initializeReactGA();

  useEffect(() => {

   

    if ( !(LocalStorage.getItem('language') === undefined) ||
      !LocalStorage.getItem('language').isEmpty
      || !LocalStorage.getItem('language').equals('') ) {
      i18n.changeLanguage(LocalStorage.getItem('language'))
    } else {
      i18n.changeLanguage('fr')
      LocalStorage.setItem('language','fr')
    }
    if (LocalStorage.getItem('language') === 'ar') {
      setDirection('rtl');
     // i18n.changeLanguage('ar');
    } else {
      setDirection('ltr');
     // i18n.changeLanguage('fr');
    }
  }, []);
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
      <I18nextProvider i18n={i18n}>
        <StoreProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={direction === 'rtl' ? themeWithRtl : theme}>
              <StylesProvider direction={direction}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Router history={history}>
                    <ScrollReset />
                    <GoogleAnalytics />
                    <NotificationSnackbar
                      onClose={handleSnackbarClose}
                      open={openSnackbar}
                      message={notificationMessage}
                    />
                    {/* <CookiesNotification />
                  <DirectionToggle
                    direction={direction}
                    onToggle={handleDirectionToggle}
                  />
                  */}
                    {renderRoutes(routes)}
                  </Router>
                </MuiPickersUtilsProvider>
              </StylesProvider>
            </ThemeProvider>
          </PersistGate>
        </StoreProvider>
      </I18nextProvider>
  );
}

export default App;
