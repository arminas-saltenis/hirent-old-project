import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './../services/auth';

export const AuthenticatedRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={
      (props) => {
        if (auth.isAuthenticated()) {
          return <Redirect to={
            {
              pathname: '/pagrindinis',
              state: {
                from: props.location
              }
            }
          } />
        } else {
          return <Component {...props} />
        }
      }
    } />
  )
}