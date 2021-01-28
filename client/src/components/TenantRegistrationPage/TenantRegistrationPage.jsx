import React, { Component } from 'react';
import { GET, MODIFY } from './../../services/api-service';

export default class TenantRegistrationPage extends Component {
  constructor(props) {
    super(props);

    this.userId = props.match.params.userId;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {};
  }

  componentDidMount() {
    GET(`users/profile/${this.userId}`)
      .then(data => {
        if (data.user.active) {
          this.props.history.push('/');
        }
        this.setState(
          {
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            email: data.user.email,
            active: true,
            password: ''
          }
        )
      })
      .catch(error => console.log(error));
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY(`users/profile/${this.userId}/edit`, 'PUT', this.state)
      .then(() => this.props.history.push('/pagrindinis'));
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
              <span className='credentials-title'>Registracija</span>
              <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Vardas'
                    value={this.state.firstname || ''}
                    onChange={event => this.setState({ firstname: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Pavardė'
                    value={this.state.lastname || ''} 
                    onChange={event => this.setState({ lastname: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='email' placeholder='El. paštas'
                    value={this.state.email || ''} 
                    onChange={event => this.setState({ email: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='tel' placeholder='Tel. numeris'
                    value={this.state.phone || ''} 
                    onChange={event => this.setState({ phone: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='password' placeholder='Slaptažodis'
                    value={this.state.password || ''} 
                    onChange={event => this.setState({ password: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='password' placeholder='Slaptažodis'>
              </input>
              <button className='primary'>Registruotis</button>
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