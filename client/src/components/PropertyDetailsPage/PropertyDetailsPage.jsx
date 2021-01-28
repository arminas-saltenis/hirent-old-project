import React, {Component} from 'react';
import { GET, MODIFY } from './../../services/api-service';

import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/card.css';

export default class PropertyDetailsPage extends Component {
  constructor(props) {
    super(props);

    this.propertyId = props.match.params.id;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {};
  }

  componentDidMount() {
    GET(`properties/property/${this.propertyId}`)
      .then(data => this.setState(
        {
          title: data.property.title,
          address1: data.property.address1,
          address2: data.property.address2,
          description: data.property.description
        }
      ))
      .catch(error => console.log(error));
  }

  handleSubmit(event) {
    event.preventDefault();
    MODIFY(`properties/property/${this.propertyId}/update`, 'PUT', this.state)
      .then(() => this.props.history.push('/pagrindinis'));
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div layout='column' layout-align='center center'>
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
              <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Patalpos pavadinimas'
                    value={this.state.title || ''}
                    onChange={event => this.setState({ title: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Adresas 1'
                    value={this.state.address1 || ''}
                    onChange={event => this.setState({ address1: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Adresas 2'
                    value={this.state.address2 || ''}
                    onChange={event => this.setState({ address2: event.target.value })}>
              </input>
              <input flex='40' m-flex='80' t-flex='50' type='text' placeholder='Aprašymas'
                    value={this.state.description || ''}
                    onChange={event => this.setState({ description: event.target.value })}>
              </input>
            </div>
            <button className='primary' type='submit'>Išsaugoti</button>
          </div>
        </div>
      </form>
    )
  }
}