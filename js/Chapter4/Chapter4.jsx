import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import WebglGeometries from './WebglGeometries';

import './Chapter4.css';

class Chapter4 extends Component {

  render() {
    return (
      <div className="Chapter4">
        <Grid>
          <WebglGeometries />
        </Grid>
      </div>
    );
  }

}

export default Chapter4;
