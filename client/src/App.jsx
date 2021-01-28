import React, { Component } from 'react';
import { BrowserRouter as Switch, Route } from "react-router-dom";
import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import MainPage from './components/MainPage/MainPage';
import PropertyDetailsPage from './components/PropertyDetailsPage/PropertyDetailsPage';
import PropertyTaxesPage from './components/PropertyTaxesPage/PropertyTaxesPage';
import PaymentPage from './components/PaymentPage/PaymentPage';
import AddPropertyPage from './components/AddPropertyPage/AddPropertyPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import TenantRegistrationPage from './components/TenantRegistrationPage/TenantRegistrationPage';
import AddTenant from './components/AddTenant/AddTenant';
import PayPage from './components/PaymentPage/PayPage';
import { ProtectedRoute } from './routes/protected.route';
import { AuthenticatedRoute } from './routes/authenticated.route';
import { checkConnection } from './services/connection';
import ReactNotifications from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.notificationDOMRef = React.createRef();
  }

  isLoggedIn() {
    return sessionStorage.getItem('userId');
  }

  componentWillMount() {
    checkConnection();
  }

  componentDidUpdate() {
    checkConnection();
  }

  componentDidMount() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  render() {
    return (
      <Switch>
        <div>
          <main>
            <Route exact 
                   path="/invitation/:userId"
                   component={TenantRegistrationPage} />
            <AuthenticatedRoute exact 
                                path="/" 
                                component={LoginPage} />
            <AuthenticatedRoute exact 
                                path="/registracija" 
                                component={RegistrationPage} />
            <ProtectedRoute exact 
                            path="/pagrindinis" 
                            component={MainPage}/>
            <ProtectedRoute exact 
                            path="/gyventojas/:id" 
                            component={AddTenant}/>
            <ProtectedRoute exact 
                            path="/patalpa/:id/informacija"
                            component={PropertyDetailsPage} />
            <ProtectedRoute exact 
                            path="/patalpa/:id/mokesciai" 
                            component={PropertyTaxesPage} />
            <ProtectedRoute exact 
                            path="/patalpa/:id/siusti"
                            component={PaymentPage} />
            <ProtectedRoute exact 
                            path="/prideti" 
                            component={AddPropertyPage} />
            <ProtectedRoute exact 
                            path="/sumoketi/:propertyId" 
                            component={PayPage} />
            <ProtectedRoute exact 
                            path="/profilis/:id" 
                            component={ProfilePage} />
          </main>
          <ReactNotifications ref={this.notificationDOMRef} />
          <div flex='100' layout='column' className='no-internet'>
            <div>
              Nėra interneto ryšio! 
            </div>
          </div>
        </div>
      </Switch>
    );
  }
}
