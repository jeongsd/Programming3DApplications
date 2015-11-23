import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Chapter2 from 'Chapter2';
import Chapter3 from 'Chapter3';

// <Chapter2 />
ReactDOM.render(
  <div>
    <h1>Chapter2</h1>

    <h1>Chapter3</h1>
    <Chapter3 />
  </div>,
  document.getElementById('app')
);
