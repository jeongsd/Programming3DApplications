import 'babel-polyfill';
import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import Stats from 'stats.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import Path from 'UI/Path';


import './App.css';
class App extends Component {

  componentDidMount() {
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';
    ReactDOM.findDOMNode(this.refs.app).appendChild( stats.domElement );
  }

  render() {
    return (
      <div ref="app" className="App">
        <h1>Programming 3D Applications</h1>
        <p>for self Study</p>

        <Path>
          <a href="https://github.com/jeongsd/Programming3DApplications">
            www/github/jeongsd/Programming3DApplications
          </a>
        </Path>

        <Link to="/chapter4">
          <p>Chapter4</p>
        </Link>
        { this.props.children }
      </div>
    );
  }

}

export default App;
