import React, { Component } from 'react';
import Card from './../Card/Card';
import { GET } from './../../services/api-service';
import cookies from '../../services/cookies';
import { NavLink } from "react-router-dom";

import './MainPage.css';
import './../../styles/inputs.css';
import './../../styles/flex.css';
import './../../styles/card.css';
import { checkConnection } from '../../services/connection';

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    this.assignedProperty = sessionStorage.getItem('assignedProperty') ||
      cookies.getCookie('assignedProperty');

    this.userId = sessionStorage.getItem('userId') ||
      cookies.getCookie('userId');

    this.state = {
      properties: []
    }
    this.getProperties = this.getProperties.bind(this);
  }

  componentDidMount() {
    checkConnection();
    this.getProperties();
  }

  addPropertiesToIndexedDB(db, properties, type) {
    const transaction = db.transaction('user-properties', 'readwrite');
    const userProperties = transaction.objectStore('user-properties');
    if (properties.length > 1) {
      properties.forEach(async property => {
        await userProperties.add(property);
      });
      return;
    }
    if (properties.property !== null && type === 'tenant') {
      userProperties.add(properties.property);
    }
    if (properties.length && type === 'landlord') {
      userProperties.add(properties[0]);
    }
  }

  retrieveFromIndexedDB() {
    let offlineData = [];
    const request = indexedDB.open('properties');
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('user-properties', 'readonly');
      const userProperties = transaction.objectStore('user-properties');
      const request = userProperties.openCursor();
      request.onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          offlineData.push(cursor.value);
          cursor.continue();
        } else {
          this.setState({ properties: offlineData });
        }
      }
    }
  }

  addToIndexedDB(properties, type) {
    const request = indexedDB.open('properties', '3');
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (db.objectStoreNames[0] !== 'user-properties') {
        db.createObjectStore('user-properties', { keyPath: 'propertyId' });
      }
    }

    request.onsuccess = event => {
      this.addPropertiesToIndexedDB(event.target.result, properties, type);
    }
  }

  getProperties() {
    if (this.assignedProperty) {
      GET(`properties/property/${this.assignedProperty}`)
        .then(properties => {
          this.addToIndexedDB(properties, 'tenant');
          if (navigator.onLine) {
            this.setState({properties: [properties.property]})
            console.log(this.state);
          } else {
            this.retrieveFromIndexedDB();
          }
        });
      return;
    }

    GET(`properties/${this.userId}/all`)
      .then(properties => {
        this.addToIndexedDB(properties, 'landlord');
        if (navigator.onLine) {
          this.setState({ properties })
          console.log(this.state);
        } else {
          this.retrieveFromIndexedDB();
        }
      }).catch(err => console.log(err));
  }

  render() {
    return (
      <div layout='row' wrap='wrap' layout-align='center center'>
        {this.state && this.state.properties && !!(this.state.properties.length > 1) &&
          this.state.properties.map(property => {
            return <Card key={property.propertyId}
              propertyId={property.propertyId}
              title={property.title}
              address1={property.address1}
              address2={property.address2}
              description={property.description}
              tenant={property.tenant}
              paid={property.paid}
              type={property.propertyType}
              afterDeleteCallback={this.getProperties} />
          })
        }
        {this.state && this.state.properties && !!(this.state.properties.length === 1) &&
          <Card key={this.state.properties.propertyId || this.state.properties[0].propertyId}
                propertyId={this.state.properties.propertyId || this.state.properties[0].propertyId}
                title={this.state.properties.title || this.state.properties[0].title}
                address1={this.state.properties.address1 || this.state.properties[0].address1}
                address2={this.state.properties.address2 || this.state.properties[0].address2}
                description={this.state.properties.description || this.state.properties[0].description}
                tenant={this.state.properties.tenant || this.state.properties[0].tenant}
                paid={this.state.properties.paid || this.state.properties[0].paid}
                type={this.state.properties.propertyType || this.state.properties[0].propertyType}
                afterDeleteCallback={this.getProperties} />
        }
        {
          (!this.state || !this.state.properties || (!this.state.properties.length || this.state.properties[0] === null)) &&
          <div layout='column'
            className='common-card-container'
            layout-align='center center'
            flex='30'
            t-flex='50'
            m-flex='80'>
            <span className='common-card-header'>Nėra pridėta patalpų!</span>
            <NavLink to='/prideti'>
              <button className='primary'>
                Pridėti patalptą
                  </button>
            </NavLink>
          </div>
        }
      </div>
    )
  }
}