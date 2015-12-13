import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

const propTypes = {
};

const defaultProps = {
};


class PointerLockRequester extends Component {

  componentDidMount() {
    let element = ReactDOM.findDOMNode(this.refs.PointerLockRequester);

    var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
  }

  render() {
    return (
      <div ref="PointerLockRequester" className="PointerLockRequester">
        { this.props.children }
      </div>
    );
  }

}

PointerLockRequester.propTypes = propTypes;
PointerLockRequester.defaultProps = defaultProps;


export default PointerLockRequester;
