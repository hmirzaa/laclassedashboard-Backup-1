/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import HomeView from './views/Home';
import ClassesView from './views/ClassesList';
import SettingsView from './views/Settings';
import LoginView from "./views/Login";
import MainLayout from './layouts/MainLayout';
import CoursView from './views/Cours';
import ExploreView from './views/Explore';
import Receiver from './views/Receiver';
import LaclassePro from './views/LaclassePro';


import PublicCoursView from './views/PublicCours';
import RegisterView from './views/Register'
import WithAuth from './WithAuth';
import IsAuth from './IsAuth';
import CalendarView from './views/Calendar';
import ForgetPasswordView from './views/Login/ForgetPassword';
import CoursHistoryView from './views/Cours/History';
import ExplorePubliccorsView from './views/Explore/PublicCourses';
import ExploreCategoriesView from './views/Explore/Categories';
import ClassView from './views/ClassProfile';
import CoursDetailsView from './views/CoursDetails';
import FormForgetPassword from './views/Login/FormForgetPassword';

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/home" />
  },

  {
    path: '/live',
    component: AuthLayout,
    routes: [
      {
        path: '/live/:id',
        exact: true,
        component: lazy(() => import('src/views/Login/ShareInput'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/exploreview',
    component: DashboardLayout,
    routes: [
      {
        path: '/exploreview',
        exact: true,
        component: ExploreView
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  

  {
    path: '/auth',
    component: IsAuth(AuthLayout),
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: LoginView
      },
      {
        path: '/auth/register',
        exact: true,
        component: RegisterView
      },
      {
        path: '/auth/forgetPassword',
        exact: true,
        component: ForgetPasswordView
      },
      {
        path: '/auth/forgetFormPassword',
        exact: true,
        component: FormForgetPassword
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  { 
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('src/views/Errors/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('src/views/Errors/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('src/views/Errors/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/laclassepro',
    component: AuthLayout,
    routes: [
      {
          path: '/laclassepro',
          exact: true,
          component: LaclassePro
      },
    ]
  },
  {
    path: '/receiver',
    component: MainLayout,
    routes: [
      {
          path: '/receiver',
          exact: true,
          component: Receiver
      },
      // {
      //   exact: true,
      //   path: '/receiver/empty',
      //   component: lazy(() => import('src/views/Reciever/Empty'))
      // },
    ]
  },
  {
    route: '*',
    component: WithAuth(DashboardLayout),
    routes: [
      {
        path: '/home',
        exact: true,
        component: WithAuth(HomeView)
      },
      {
        path: '/calendar',
        exact: true,
        component: CalendarView
      },
      // {
      //   path: '/receiver',
      //   exact: true,
      //   component: Reciever
      // },
      // {
      //   path: '/receiver/empty',
      //   exact: true,
      //   component: Reciever/Empty
      // },
      {
        path: '/Explore/PublicCourses',
        exact: true,
        component: CoursHistoryView
      },
      {
        path: '/Explore/Categories',
        exact: true,
        component: ExploreCategoriesView
      },
      {
        path: '/Cours/History',
        exact: true,
        component: ExplorePubliccorsView
      },
      {
        path: '/classes',
        exact: true,
        component: WithAuth(ClassesView)
      },
      {
        path: '/cours',
        exact: true,
        component: WithAuth(CoursView)
      },
      {
        path: '/explore',
        exact: true,
        component: WithAuth(ExploreView)
      },
      {
        path: '/cours/public',
        exact: true,
        component: PublicCoursView
      },
      {
        path: '/cours/details/:id',
        exact: true,
        component: WithAuth(CoursDetailsView)
      },
      {
        path: '/cours/details/:id/:tab',
        exact: true,
        component: WithAuth(CoursDetailsView)
      },

      {
        path: '/classe/:id',
        exact: true,
        component: WithAuth(ClassView)
      },
      {
        path: '/classe/:id/:tab',
        exact: true,
        component: WithAuth(ClassView)
      },
      {
        path: '/settings/:tab',
        exact: true,
        component: WithAuth(SettingsView)
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
];
