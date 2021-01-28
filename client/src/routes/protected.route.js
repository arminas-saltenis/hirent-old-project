import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './../services/auth';

import Header from './../components/Header/Header';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
      <Route {...rest} render={
        (props) => {
          if (auth.isAuthenticated()) {
            return (
              <div>
                <Header />
                <Component {...props} />
              </div>
            )
          } else {
            return <Redirect to={
              {
                pathname: '/',
                state: {
                  from: props.location
                }
              }
            } />
          }
        }
      } />
  )
}