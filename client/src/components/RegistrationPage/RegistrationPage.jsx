import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { MODIFY } from './../../services/api-service';

import './RegistrationPage.css';
import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/global.css';

export default class RegistrationPage extends Component {
  constructor(props) {
    super(props) ;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);

    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: ''
    }
  }

  handleDetailsChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY('users/register', 'POST', this.state)
      .then(data => {
        console.log(data);
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <div layout='row' flex='100' wrap='wrap'>
        <div flex='50' m-flex='100' t-flex='100' layout='column'>
          <form onSubmit={this.handleSubmit} layout='column' 
                layout-align='center center' className='credentials-wrapper'>
              <div className='common-card-container'
                  layout='column'
                  flex='70'
                  layout-align='center center'>
              <span className='credentials-title'>Registruotis</span>
              <input flex='60' m-flex='80' t-flex='50' type='text' placeholder='Vardas'
                    onChange={this.handleDetailsChange} name='firstname'></input>
              <input flex='60' m-flex='80' t-flex='50' type='text' placeholder='Pavardė'
                    onChange={this.handleDetailsChange} name='lastname'></input>
              <input flex='60' m-flex='80' t-flex='50' type='email' placeholder='El. paštas'
                    onChange={this.handleDetailsChange} name='email'></input>
              <input flex='60' m-flex='80' t-flex='50' type='tel' placeholder='Tel. numeris'
                    onChange={this.handleDetailsChange} name='phone'></input>
              <input flex='60' m-flex='80' t-flex='50' type='password' placeholder='Slaptažodis'
                    onChange={this.handleDetailsChange} name='password'></input>
              <input flex='60' m-flex='80' t-flex='50' type='password' placeholder='Slaptažodis'></input>
              <div flex='60' m-flex='80' t-flex='50' layout='row' layout-align='space-between' 
                  className='credentials-actions'>
                <Link to='/' className='credentials-link'>Prisijungti</Link>
                <button className='primary' type='submit'>Registruotis</button>
              </div>
            </div>
          </form>
        </div>
        <div flex='50' m-flex='0' t-flex='0' layout='column' 
             className='auth-half-screen'>
          <img className='logo-image' src='/images/icons/icon-384x384.png' alt='logo'></img>
        </div>
      </div>
    )
  }
}