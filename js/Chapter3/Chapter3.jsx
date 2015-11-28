import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import ThreeJS from './ThreeJS';
import AddLight from './AddLight';

import './Chapter3.css';

class Chapter3 extends Component {

  render() {
    return (
      <div className="Chapter3">
        <Grid>
          <Row>
            <Col md={6}>
              <h2>using three js</h2>
              <ThreeJS />
            </Col>

            <Col md={6}>
              <h3>Add light</h3>
              <AddLight />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

export default Chapter3;
