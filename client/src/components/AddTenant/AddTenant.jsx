import React, { Component } from 'react';
import cookie from './../../services/cookies'
import notif from './../../services/notificationUtil';
import ReactNotifications from 'react-notifications-component';

import { MODIFY, GET } from './../../services/api-service';

export default class AddTenant extends Component {
  constructor(props) {
    super(props);

    this.landlordId = sessionStorage.getItem('userId') || cookie.getCookie('userId');
    this.propertyId = props.match.params.id;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  componentDidMount() {
    this.getPropertyInfo();
  }

  getPropertyInfo() {
    this.setState({tenant: null});
    GET(`properties/property/${this.propertyId}`)
      .then(property => this.getTenantInfo(property))
  }

  getTenantInfo(property) {
    if (property.property.tenantId) {
      GET(`users/profile/${property.property.tenantId}`)
        .then(tenant => {
          console.log(tenant, property);
          this.setState({ tenant: tenant })
        });
    }
  }

  handleDetailsChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY(`users/send-invite/${this.landlordId}/${this.propertyId}`, 'POST', this.state)
      .then((response) => {
        if (response && response.error) {
          notif.pushNotification(this.notificationDOMRef, response.error, 'danger');
        }
        if (response && response.success) {
          notif.pushNotification(this.notificationDOMRef, response.success, 'success');
        }
        this.getPropertyInfo();
      });
  }

  handleDelete() {
    MODIFY(`users/delete/${this.propertyId}/${this.state.tenant.user.userId}`, 'DELETE')
      .then((response) => {
        if (response) {
          notif.pushNotification(this.notificationDOMRef, response, 'success');
        }
        this.getPropertyInfo();
      });
  }

  render() {
    return (
      <div layout='column' flex='100'
        layout-align='center center'>
        {this.state && this.state.tenant && this.state.tenant.user &&
          <div className='common-card-container'
               layout='column'
               flex='40'
               layout-align='center center'>
            <div className='common-card-header'>
              {`${this.state.tenant.user.firstname} ${this.state.tenant.user.lastname}`}
            </div>
            <div className='common-card-content' 
                 layout='column'
                 flex='100'
                 layout-align='center center'>
              <div className='card-info'>
                <span>Elektroninis paštas: </span>
                {this.state.tenant.user.email}
              </div>
              <div className='card-subinfo' layout='column'>
                <span className='card-subinfo-title'>
                  Aktyvus: {this.state.tenant.user.active ? 'Taip' : 'Ne'}
                </span>
              </div>
            </div>
            <div className='card-actions' layout='column' flex='75'>
              <button className='danger' onClick={this.handleDelete}>
                Ištrinti gyventoją
              </button>
            </div>
          </div>
        }
        {
          (!this.state || !this.state.tenant || !this.state.tenant.user) &&
          <form onSubmit={this.handleSubmit} layout='column' flex='100'
            layout-align='center center'>
            <div className='common-card-container'
              layout='column'
              flex='50'
              m-flex='80'
              t-flex='65'
              layout-align='center center'>
              <span className='common-card-header'>Pakviesti nuomininką</span>
              <div className='common-card-content' 
               layout='column'
               flex='100'
               layout-align='center center'>
                <input flex='50' m-flex='80' t-flex='50' type='text' placeholder='Vardas'
                  onChange={this.handleDetailsChange} name='firstname'></input>
                <input flex='50' m-flex='80' t-flex='50' type='text' placeholder='Pavardė'
                  onChange={this.handleDetailsChange} name='lastname'></input>
                <input flex='50' m-flex='80' t-flex='50' type='email' placeholder='El. paštas'
                  onChange={this.handleDetailsChange} name='email'></input>
              </div>
              <div flex='50' m-flex='80' t-flex='50' layout='row' layout-align='center'>
                <button className='primary' type='submit'>Išsiųsti kvietimą</button>
              </div>
            </div>
          </form>
        }
        <ReactNotifications ref={this.notificationDOMRef} />
      </div>
    )
  }
}
