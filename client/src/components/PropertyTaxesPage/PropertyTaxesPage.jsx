import React, {Component} from 'react';
import { GET, MODIFY } from './../../services/api-service';

import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/card.css';

export default class PropertyTaxesPage extends Component {
  constructor(props) {
    super(props);

    this.propertyId = props.match.params.id;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {};
  }

  componentDidMount() {
    GET(`taxes/tax/property/${this.propertyId}`)
      .then(data => {
        this.setState({
          electricity: data.property.electricity,
          gas: data.property.gas,
          municipal: data.property.municipal,
          hotWater: data.property.hotWater,
          coldWater: data.property.coldWater,
          heating: data.property.heating,
          rent: data.property.rent
        });
      })
      .catch(error => console.log(error));
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY(`taxes/tax/property/${this.propertyId}/update`, 'PUT', this.state)
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
          <span className='common-card-header'>Redaguoti patalpos mokesčių tarifus</span>
          <div className='common-card-content' 
               layout='column'
               flex='100'
               layout-align='center center'>
            <input flex='40' m-flex='80' t-flex='50' type='number' placeholder='Nuoma'
                  value={this.state.rent || ''}
                  onChange={event => this.setState({ rent: Number(event.target.value) })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='number' placeholder='Komunaliniai mokesčiai'
                  value={this.state.municipal || ''}
                  onChange={event => this.setState({ municipal: Number(event.target.value) })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='number' placeholder='Šildymas'
                  value={this.state.heating || ''}
                  onChange={event => this.setState({ heating: Number(event.target.value) })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='number' placeholder='Karštas vanduo'
                  value={this.state.hotWater || ''}
                  onChange={event => this.setState({ hotWater: Number(event.target.value) })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='number' placeholder='Šaltas vanduo'
                  value={this.state.coldWater || ''}
                  onChange={event => this.setState({ coldWater: Number(event.target.value) })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='number' placeholder='Dujos'
                  value={this.state.gas || ''}
                  onChange={event => this.setState({ gas: Number(event.target.value) })}>
            </input>
            <input flex='40' m-flex='80' t-flex='50' type='number' placeholder='Elektra'
                  value={this.state.electricity || ''}
                  onChange={event => this.setState({ electricity: Number(event.target.value) })}>
            </input>
          </div>
          <button className='primary'>Išsaugoti</button>
        </div>
      </form>
    )
  }
}