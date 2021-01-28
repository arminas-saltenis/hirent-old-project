import React, {Component} from 'react';

import { GET, MODIFY } from './../../services/api-service';

export default class PayPage extends Component {
  constructor(props) {
    super(props);

    this.propertyId = props.match.params.propertyId;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadTaxes = this.loadTaxes.bind(this);
  }

  componentDidMount() {
    this.loadTaxes();
  }

  loadTaxes() {
    GET(`payments/payment/${this.propertyId}`)
      .then(payment => this.setState({ payment }));
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY(`payments/payment/${this.propertyId}/pay`, 'PUT')
      .then(paid => this.loadTaxes());
  }

  render() {
    return (
      <div>
        {
          this.state && 
          this.state.payment && 
          this.state.payment.payment &&
          <form layout='column' layout-align='center center' flex='100' 
                onSubmit={this.handleSubmit}>
          <div className='common-card-container'
              layout='column'
              flex='50'
              m-flex='80'
              t-flex='65'
              layout-align='center center'>
            <div flex='30' m-flex='80' t-flex='50' layout='column' layout-align='center center'>
              <span className='common-card-header'>Sąskaita</span>
              <div className='common-card-content' 
                   layout='column'
                   flex='100'
                   layout-align='center center'>
                <details flex='100' layout-align='center center'>
                  <summary layout='row' layout-align='space-between center'>
                    <span>Iš viso mokėti: </span>
                    <span>{Math.round((this.state.payment.payment.total + 0.00001) * 100) / 100}</span>
                  </summary>
                  <br />
                  <div layout='row' layout-align='space-between center'>
                    <span>Elektra: </span>
                    <span>{Math.round((this.state.payment.payment.electricity + 0.00001) * 100) / 100}</span>
                  </div>
                  <div layout='row' layout-align='space-between center'>
                    <span>Šildymas: </span>
                    <span>{Math.round((this.state.payment.payment.heating + 0.00001) * 100) / 100}</span>
                  </div>
                  <div layout='row' layout-align='space-between center'>
                    <span>Šaltas vanduo: </span>
                    <span>{Math.round((this.state.payment.payment.coldWater + 0.00001) * 100) / 100}</span>
                  </div>
                  <div layout='row' layout-align='space-between center'>
                    <span>Karštas vanduo: </span>
                    <span>{Math.round((this.state.payment.payment.hotWater + 0.00001) * 100) / 100}</span>
                  </div>
                  <div layout='row' layout-align='space-between center'>
                    <span>Dujos: </span>
                    <span>{Math.round((this.state.payment.payment.gas + 0.00001) * 100) / 100}</span>
                  </div>
                  <div layout='row' layout-align='space-between center'>
                    <span>Komunaliniai mokesčiai</span>
                    <span>{Math.round((this.state.payment.payment.municipal + 0.00001) * 100) / 100}</span>
                  </div>
                  <div layout='row' layout-align='space-between center'>
                    <span>Nuoma: </span>
                    <span>{Math.round((this.state.payment.payment.rent + 0.00001) * 100) / 100}</span>
                  </div>
                </details>
              </div>
            </div>
            {
              !this.state.payment.payment.paid &&
              <button className='primary' type='submit'>Apmokėti</button>
            }
            {
              this.state.payment.payment.paid && 
              <div>Ši sąskaita jau apmokėta!</div>
            }
            </div>
          </form>
        }
      </div>
    )
  }
}