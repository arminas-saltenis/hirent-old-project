import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { MODIFY } from './../../services/api-service';
import cookie from './../../services/cookies';

import './../../styles/flex.css';
import './../../styles/card.css';

export default class Card extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.assignedProperty = sessionStorage.getItem('assignedProperty') ||
                            cookie.getCookie('assignedProperty');
  }

  getLinkToInfo() {
    return `/patalpa/${this.props.propertyId}/informacija`;
  }

  getLinkToTaxes() {
    return `/patalpa/${this.props.propertyId}/mokesciai`;
  }

  getLinkToSendPayment() {
    return `/patalpa/${this.props.propertyId}/siusti`;
  }

  getLinkAddTenantPayment() {
    return `/gyventojas/${this.props.propertyId}`;
  }

  getLinkToPay() {
    return `/sumoketi/${this.props.propertyId}`;
  }

  deleteFromIndexedDB() {
    const request = indexedDB.open('properties');
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('user-properties', 'readwrite');
      const userProperties = transaction.objectStore('user-properties');
      const request = userProperties.openCursor();
      request.onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.key === this.props.propertyId) {
            cursor.delete();
          }
          cursor.continue();
        }
        
      }
    }
  }

  handleDelete() {
    MODIFY(`properties/property/${this.props.propertyId}/delete`, 'DELETE')
      .then(() => {
        this.props.afterDeleteCallback();
        this.deleteFromIndexedDB();
      });
  }

  render() {
    return (
      <div className='card-wrapper'
           layout='column'
           layout-align='center center'>
        <div className='card-header' layout-align='center center' layout='column'>
          {this.props.title}
          <span className={`card-paid-badge-${this.props.paid}`}>{this.props.paid ? 'Apmokėta' : 'Neapmokėta'}</span>
        </div>
        <div className='card-img-container'>
          <img className='card-img'
              alt={`Property of ${this.props.type} type`}
              src={`/images/${this.props.type}.svg`}></img>
        </div>
        <div>
          <div className='card-info'>
            <span>Adresas: {this.props.address1} {this.props.address2 ? '- ' + this.props.address2 : ''}</span>
          </div>
        </div>
        <div className='card-divider'></div>
        <div className='card-subinfo' layout='column' layout-align='center center'>
            <span className='card-subinfo-title'>Aprašymas: </span>
            {this.props.description}
          </div>
        <div className='card-divider'></div>
        { this.assignedProperty && 
          <div className='card-actions' layout='column' flex='75'>
              <Link to={this.getLinkToPay()} layout='column' className='card-button'>
                <button className='primary'>Sumokėti mokesčius</button>
              </Link>
          </div>
        }
        { !this.assignedProperty &&
          <div className='card-actions' layout='column' flex='75'>
              <Link to={this.getLinkToInfo()} layout='column' className='card-button'>
                <button>Redaguoti informaciją</button>
              </Link>
              <Link to={this.getLinkToTaxes()} layout='column' className='card-button'>
                <button>Redaguoti mokesčių tarifus</button>
              </Link>
              <Link to={this.getLinkToSendPayment()} layout='column' className='card-button'>
                <button>Siųsti apmokėjimo pranešimą</button>
              </Link>
              <Link to={this.getLinkAddTenantPayment()} layout='column' className='card-button'>
                <button>Pridėti nuomininką</button>
              </Link>
            <button className='danger card-button' onClick={this.handleDelete}>Ištrinti</button>
          </div>
        }
      </div>
    )
  }
}