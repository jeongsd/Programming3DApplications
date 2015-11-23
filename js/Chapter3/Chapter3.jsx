import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import ThreeJS from './ThreeJS';

import './Chapter3.css';

class Chapter3 extends Component {

  render() {
    return (
      <div className="Chapter3">
        <h2>Using three js</h2>
        <ThreeJS />
      </div>
    );
  }

}

export default Chapter3;
