import React, { Component } from 'react';
import { GET, MODIFY } from './../../services/api-service';

import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/card.css';

export default class PaymentPage extends Component {
  constructor(props) {
    super(props);

    this.propertyId = props.match.params.id;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);

    this.state = {
      payment: {
        hotWater: 0,
        coldWater: 0,
        heating: 0,
        gas: 0,
        electricity: 0,
        municipal: 0,
      }
    }
  }

  componentDidMount() {
    GET(`taxes/tax/property/${this.propertyId}`)
      .then(taxes => this.setState({ taxes }));
  }

  handleDetailsChange(event) {
    this.setState(
      {
        payment:
          { ...this.state.payment, [event.target.name]: event.target.value }
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const payment = {
      electricity: this.state.taxes.property.electricity * this.state.payment.electricity,
      gas: this.state.taxes.property.gas * this.state.payment.gas,
      hotWater: this.state.taxes.property.hotWater *  this.state.payment.hotWater,
      coldWater: this.state.taxes.property.coldWater * this.state.payment.coldWater,
      heating: this.state.taxes.property.heating * this.state.payment.heating,
      municipal: this.state.taxes.property.municipal,
      rent: this.state.taxes.property.rent
    }
    MODIFY(`payments/payment/${this.propertyId}/send`, 'POST', payment)
      .then(response => {
        if (Notification.permission === 'granted') {
          MODIFY('notifications/send-notification', 'POST', { propertyId: this.propertyId});
        }
        this.props.history.push('/pagrindinis');
      });
  }

  render() {
    return (
      <form layout='column' layout-align='center center' flex='100'
            onSubmit={this.handleSubmit}>
        <div className='common-card-container'
              layout='column'
              flex='50'
              m-flex='80'
              t-flex='65'
              layout-align='center center'>
        {this.state && this.state.taxes && this.state.taxes.property &&
          <div layout='column' layout-align='center center' flex='100'>
            <span className='common-card-header'>Siųsti mokėjimo pranešimą</span>
            <div className='common-card-content' 
               layout='column'
               flex='100'
               layout-align='center center'>
            <div layout='row' flex='40' m-flex='80' t-flex='50' layout-align='space-between center'>
              <input flex='80' m-flex='80' t-flex='80' type='text'
                placeholder='Karštas vanduo *'
                onChange={this.handleDetailsChange}
                name='hotWater'></input>
              <span flex='20' m-flex='20' t-flex='20'>x {`${this.state.taxes.property.hotWater}`}</span>
            </div>
            <div layout='row' flex='40' m-flex='80' t-flex='50' layout-align='space-between center'>
              <input flex='80' m-flex='80' t-flex='80' type='text'
                placeholder='Šildymas *'
                onChange={this.handleDetailsChange}
                name='heating'></input>
              <span flex='20' m-flex='20' t-flex='20'>x {`${this.state.taxes.property.heating}`}</span>
            </div>
            <div layout='row' flex='40' m-flex='80' t-flex='50' layout-align='space-between center'>
              <input flex='80' m-flex='80' t-flex='80' type='text'
                placeholder='Šaltas vanduo *'
                onChange={this.handleDetailsChange}
                name='coldWater'></input>
              <span flex='20' m-flex='20' t-flex='20'>x {`${this.state.taxes.property.coldWater}`}</span>
            </div>
            <div layout='row' flex='40' m-flex='80' t-flex='50' layout-align='space-between center'>
              <input flex='80' m-flex='80' t-flex='80' type='text'
                placeholder='Dujos *'
                onChange={this.handleDetailsChange}
                name='gas'></input>
              <span flex='20' m-flex='20' t-flex='20'>x {`${this.state.taxes.property.gas}`}</span>
            </div>
            <div layout='row' flex='40' m-flex='80' t-flex='50' layout-align='space-between center'>
              <input flex='80' m-flex='80' t-flex='80' type='text'
                placeholder='Elektra *'
                onChange={this.handleDetailsChange}
                name='electricity'></input>
              <span flex='20' m-flex='20' t-flex='20'>x {`${this.state.taxes.property.electricity}`}</span>
            </div>
            <div layout='row'>
              <span>Komunaliniai mokesčiai:</span>
              <span>{`${this.state.taxes.property.municipal}`}</span>
            </div>
            <div layout='row'>
              <span>Nuoma:</span>
              <span>{`${this.state.taxes.property.rent}`}</span>
            </div>
          </div>
            <button className='primary' type='submit'>Siųsti</button>
            <span>* įveskite sunaudotą kiekį</span>
          </div>
        }
        </div>
      </form>
    )
  }
}