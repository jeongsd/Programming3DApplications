import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { mat4 } from 'gl-matrix';
import THREE from 'three.js';

import Basic from './Basic';
import AddGeometry from './AddGeometry';

import './Chapter2.css';

class Chapter2 extends Component {

  render() {
    return (
      <div className="Chapter2">
        <h2>Basic</h2>
        <Basic />
        <h2>AddGeometry</h2>
        <AddGeometry />
      </div>
    );
  }

}

export default Chapter2;
