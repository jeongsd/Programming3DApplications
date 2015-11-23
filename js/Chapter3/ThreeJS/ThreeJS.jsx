import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three.js';

import './ThreeJS.css';

function loadTexture(url, onProgress ) {
  return new Promise((resolve, reject) => {
    let loader = new THREE.TextureLoader();

    loader.load(
      url,
      texture => resolve(texture),
      (xhr) => onProgress ? onProgress(xhr) : null,
      (xhr) => reject(xhr),
    );
  });
}

class ThreeJS extends Component {

  async componentDidMount() {
    let renderer = null;
    let scene = null;
    let camera = null;
    let cube = null;

    let duration = 5000;
    let currentTime = Date.now();

    function webglRender() {
      requestAnimationFrame(() => webglRender());
      renderer.render( scene, camera );

      let now = Date.now();
      let deltat = now - currentTime;
      currentTime = now;
      let fract = deltat / duration;
      let angle = Math.PI * 2 * fract;
      cube.rotation.y += angle;
    }

    let canvas = ReactDOM.findDOMNode(this.refs.canvas);

    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setSize(
      this.refs.canvas.offsetWidth,
      this.refs.canvas.offsetHeight
    );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45,
      this.refs.canvas.offsetWidth / this.refs.canvas.offsetHeight,
      1, 4000);
    scene.add(camera);

    let map = await loadTexture(require('./webgl-logo-256.jpg'));
    let material = new THREE.MeshBasicMaterial({ map: map });

    let geometry = new THREE.CubeGeometry(2, 2, 2);

    cube = new THREE.Mesh(geometry, material);
    cube.position.z = -8;
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    scene.add( cube );

    webglRender();
  }

  render() {
    return (
      <div className="ThreeJS">
        <canvas ref="canvas" style={{ width: 500, height: 500 }} />
      </div>
    );
  }

}

export default ThreeJS;
