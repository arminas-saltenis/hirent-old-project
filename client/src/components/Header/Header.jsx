import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import auth from './../../services/auth';
import cookie from './../../services/cookies';

import './Header.css';

export default class Header extends Component {
  constructor(props) {
    super(props);

    
    this.userId = sessionStorage.getItem('userId') ||
                  cookie.getCookie('userId');
    this.assignedProperty = sessionStorage.getItem('assignedProperty') ||
                  cookie.getCookie('assignedProperty');
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.state = {
      expandMobileNavigation: false
    }
  }

  handleLogOut() {
    auth.logout(() => {
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('assignedProperty');
      cookie.removeCookie('userId');
      cookie.removeCookie('assignedProperty');
    });
  }

  toggleMobileMenu() {
    this.setState({expandMobileNavigation: !this.state.expandMobileNavigation})
  }

  render() {
    return (
      <div flex='100' layout='column'>
        <header flex='100' layout='row' layout-align='space-between center'>
          <NavLink to='/pagrindinis'><img src='/images/icons/icon-72x72.png' className='header-logo' alt='logo'></img></NavLink>
          <nav>
            <div layout='column' className='desktop-navigation'>
              <ul layout='row'>
                <li><NavLink to='/pagrindinis'>Pagrindinis</NavLink></li>
                {!this.assignedProperty &&
                  <li><NavLink to='/prideti'>Pridėti patalptą</NavLink></li>
                }
                <li><NavLink to={`/profilis/${this.userId}`}>Profilis</NavLink></li>
                <li onClick={this.handleLogOut}><NavLink to='/'>Atsijungti</NavLink></li>
              </ul>
            </div>
            <button className='navigation-toggle' onClick={this.toggleMobileMenu}>
                <div className='burger-menu-item'></div>
                <div className='burger-menu-item'></div>
                <div className='burger-menu-item'></div>
            </button>
          </nav>
        </header>
        {this.state.expandMobileNavigation && 
        <div  flex='100' className='mobile-navigation' layout-align='center center'>
          <div layout='column' layout-align='center center' flex='100'>
            <div className='mobile-navigation-container' layout-align='center center' flex='100'>
              <ul layout='column' flex='80'>
              <NavLink to='/pagrindinis'><li className='mob-nav-link'>Pagrindinis</li></NavLink>
                {!this.assignedProperty &&
                  <NavLink to='/prideti'><li className='mob-nav-link'>Pridėti patalptą</li></NavLink>
                }
                <NavLink to={`/profilis/${this.userId}`}><li className='mob-nav-link'>Profilis</li></NavLink>
                <NavLink to='/' onClick={this.handleLogOut}><li className='mob-nav-link'>Atsijungti</li></NavLink>
              </ul>
            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}