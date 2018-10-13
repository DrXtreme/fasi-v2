import React from 'react';
import { Alert } from 'react-bootstrap';

export function done() {
    return(
      <Alert bsStyle="success"><h4>Huge Success</h4><br/>Done !</Alert>
    );
  }