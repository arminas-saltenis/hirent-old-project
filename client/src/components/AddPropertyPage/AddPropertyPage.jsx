import React, { Component } from 'react';
import { MODIFY } from './../../services/api-service';
import notif from './../../services/notificationUtil';
import ReactNotifications from 'react-notifications-component';

import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/card.css';
import { checkConnection } from '../../services/connection';

export default class AddPropertyPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.handleTaxesChange = this.handleTaxesChange.bind(this);
    this.notificationDOMRef = React.createRef();


    this.state = {
      landlordId: sessionStorage.getItem('userId'),
      title: '',
      address1: '',
      address2: '',
      description: '',
      paid: false,
      taxes: {
        rent: '',
        electricity: '',
        gas: '',
        municipal: '',
        hotWater: '',
        coldWater: '',
        heating: ''
      }
    };
  }

  componentDidMount() {
    checkConnection();
  }

  handleDetailsChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleTaxesChange(event) {
    this.setState({ taxes: { ...this.state.taxes, [event.target.name]: event.target.value } });
  }

  addPropertyToIndexedDB(property) {
    const request = indexedDB.open('properties');
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('user-properties', 'readwrite');
      const userProperties = transaction.objectStore('user-properties');
      userProperties.add(property);
    }
  }

    handleSubmit(event) {
      event.preventDefault();
      MODIFY('properties/property/add', 'POST', this.state)
        .then((response) => {
          if (response && response.success) {
            notif.pushNotification(this.notificationDOMRef, response.success, 'success');
            this.addPropertyToIndexedDB({...this.state, propertyId: response.propertyId});
          }
          this.props.history.push('/pagrindinis')
        });
    }

    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit} layout='column'
            layout-align='center center'>
            <div className='common-card-container'
              layout='column'
              flex='50'
              m-flex='80'
              t-flex='65'
              layout-align='center center'>
              <span className='common-card-header'>Redaguoti patalpos informacija</span>
              <div className='common-card-content'
                layout='column'
                flex='100'
                layout-align='center center'>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Patalpos pavadinimas'
                  onChange={this.handleDetailsChange} name='title'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Adresas 1'
                  onChange={this.handleDetailsChange} name='address1'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Adresas 2'
                  onChange={this.handleDetailsChange} name='address2'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Aprašymas'
                  onChange={this.handleDetailsChange} name='description'></input>
                <select name='propertyType' onChange={this.handleDetailsChange}
                  flex='40' m-flex='70' t-flex='50'>
                  <option value='' defaultValue>Pasirinkite patalpos tipą</option>
                  <option value='apartment'>Butas</option>
                  <option value='house'>Namas</option>
                  <option value='office'>Ofisas</option>
                </select>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Nuoma'
                  onChange={this.handleTaxesChange} name='rent'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Komunaliniai mokesčiai'
                  onChange={this.handleTaxesChange} name='municipal'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Šildymas'
                  onChange={this.handleTaxesChange} name='heating'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Karštas vanduo'
                  onChange={this.handleTaxesChange} name='hotWater'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Šaltas vanduo'
                  onChange={this.handleTaxesChange} name='coldWater'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Dujos'
                  onChange={this.handleTaxesChange} name='gas'></input>
                <input flex='40' m-flex='70' t-flex='50' type='text' placeholder='Elektra'
                  onChange={this.handleTaxesChange} name='electricity'></input>
              </div>
              <button className='primary' type='submit'>Išsaugoti</button>
            </div>
          </form>
          <ReactNotifications ref={this.notificationDOMRef} />
        </div>
      )
    }
  }