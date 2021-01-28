import React, {Component} from 'react';
import { GET, MODIFY } from './../../services/api-service';
import cookies from './../../services/cookies';

import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/card.css';

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.userId = sessionStorage.getItem('userId') || 
                  cookies.getCookie('userId');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {};
  }

  componentDidMount() {
    GET(`users/profile/${this.userId}`)
      .then(data => this.setState(
        {
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          email: data.user.email,
          phone: data.user.phone
        }
      ))
      .catch(error => console.log(error));
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY(`users/profile/${this.userId}/edit`, 'PUT', this.state)
      .then(() => this.props.history.push('/pagrindinis'));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} layout='column' 
            layout-align='center center'>
        <div className='common-card-container'
              layout='column'
              flex='50'
              m-flex='80'
              t-flex='65'
              layout-align='center center'>
          <span className='common-card-header'>Redaguoti profilį</span>
          <div className='common-card-content' 
               layout='column'
               flex='100'
               layout-align='center center'>
            <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Vardas'
                  value={this.state.firstname || ''}
                  onChange={event => this.setState({ firstname: event.target.value })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Pavardė'
                  value={this.state.lastname || ''} 
                  onChange={event => this.setState({ lastname: event.target.value })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='El. paštas'
                  value={this.state.email || ''} 
                  onChange={event => this.setState({ email: event.target.value })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Tel. numeris'
                  value={this.state.phone || ''} 
                  onChange={event => this.setState({ phone: event.target.value })}>
            </input>
          </div>
          <button className='primary'>Išsaugoti</button>
        </div>
      </form>
    )
  }
}