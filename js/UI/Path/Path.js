import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import './Path.css';

const propTypes = {
  rootPath: PropTypes.string,
};

const defaultProps = {
  rootPath: '/',
};


class Path extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <ol className="Path">
        { this.props.children }
      </ol>
    );
  }

}

Path.propTypes = propTypes;
Path.defaultProps = defaultProps;


export default Path;
