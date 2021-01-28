import React, { Component } from 'react';
import { Link } from "react-router-dom";
import cookie from './../../services/cookies';
import { MODIFY } from './../../services/api-service';
import auth from './../../services/auth';
import pushNotification from './../../services/pushNotification';

import notif from './../../services/notificationUtil';
import ReactNotifications from 'react-notifications-component';

import './LoginPage.css';
import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/global.css';

export default class LoginPage extends Component {
  constructor(props) {
    super(props) ;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.handleRememberPassword = this.handleRememberPassword.bind(this);
    
    this.notificationDOMRef = React.createRef();

    this.state = {
      email: '',
      password: ''
    }

    this.publicVapidKey = 'BPLqO7feCBth7aqW8C6UpHbDcLuCBdmlOa4Truqa13mUDIAD3Qm6Q5XcCcO7o1QTTqYVqGyq73VwRYh1W8AVWOs';
  }

  handleDetailsChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleRememberPassword() {
    this.rememberPassword = document.querySelector('.remember-checkbox').checked;
  }

  saveUserInfoToSession(user) {
    let sessionUserId = sessionStorage.getItem('userId');
    if (sessionUserId !== user.userId) {
      sessionStorage.setItem('userId', user.userId);
    }

    if (user.tenantInfo) {
      let sessionIsLandlord = sessionStorage.getItem('isLandlord');
      if (sessionIsLandlord !== user) {
        sessionStorage.setItem('assignedProperty', user.tenantInfo.assignedProperty);
      }
    }
  }

  saveUserInfoToCookies(user) {
    cookie.setCookie('userId', user.userId, 30);

    if (user.tenantInfo) {
      cookie.setCookie('assignedProperty', user.tenantInfo.assignedProperty, 30);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY('users/login', 'POST', this.state)
      .then(data => {
        if (data && data.error) {
          notif.pushNotification(this.notificationDOMRef, data.error, 'danger');
          return
        }

        const user = data.userData;

        if (user) {
          if (this.rememberPassword) {
            this.saveUserInfoToCookies(user);
          } else {
            this.saveUserInfoToSession(user);
          }
        }

        if (user) {
          notif.pushNotification(this.notificationDOMRef, `${user.firstname}, sėkmigai prisijungėte!`, 'success');
          if (Notification.permission === 'granted') {
            pushNotification.registerPushNotification(user.userId);
          }
        }
        
        auth.login(() => {
          this.props.history.push('/pagrindinis');
        })
      });
  }

  render() {
    return (
      <div layout='row' flex='100' wrap='wrap'>
        <div flex='50' m-flex='100' t-flex='100' layout='column'>
          <form onSubmit={this.handleSubmit} layout='column' flex='100'
                layout-align='center center' className='credentials-wrapper'>
            <div className='common-card-container'
                 layout='column'
                 flex='70'
                 layout-align='center center'>
              <span className='credentials-title'>Prisijungti</span>
              <input flex='60' m-flex='80' t-flex='50' type='email' 
                    placeholder='Elektroninis paštas'
                    onChange={this.handleDetailsChange} name='email'></input>
              <input flex='60' m-flex='80' t-flex='50' type='password' placeholder='Slaptažodis'
                    onChange={this.handleDetailsChange} name='password'></input>
              <div flex='60' m-flex='80' t-flex='50' layout='row' layout-align='space-between center'
                  className='credentials-actions'>
                <Link to='/registracija' className='credentials-link'>Registruotis</Link>
                <button className='primary' type='submit'>Prisijungti</button>
              </div>
              <div className='remember-checkbox-wrapper' flex='100' m-flex='80' t-flex='50' layout='row' 
                  layout-align='center center'>
                <input type='checkbox' className='remember-checkbox' id='remember' 
                      onChange={this.handleRememberPassword}></input>
                <label htmlFor='remember'>Prisiminti slaptažodį</label>
              </div>
            </div>
          </form>
        </div>
        <div flex='50' m-flex='0' t-flex='0' layout='column' 
             className='auth-half-screen'>
          <img className='logo-image' src='/images/icons/icon-384x384.png' alt='logo'></img>
        </div>
        <ReactNotifications ref={this.notificationDOMRef} />
      </div>
    )
  }
}