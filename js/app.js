import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Stats from 'stats.js';
import Chapter2 from 'Chapter2';
import Chapter3 from 'Chapter3';
import Chapter4 from 'Chapter4';
import 'bootstrap/dist/css/bootstrap.min.css';

import './app.css';
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
        <h1>Chapter2</h1>

        <h1>Chapter3</h1>
        <Chapter3 />

        <h1>Chapter4</h1>
        <Chapter4 />
      </div>
    );
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('learn-webgl')
);
