import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import THREE, {
  WebGLRenderer,
  TextureLoader, RepeatWrapping,
  PerspectiveCamera,
  DoubleSide,
  Scene, Mesh, Vector3,
  MeshLambertMaterial,
  AmbientLight, DirectionalLight,
  SphereGeometry, IcosahedronGeometry, OctahedronGeometry,
  TetrahedronGeometry, PlaneGeometry, BoxGeometry,
  CircleGeometry, RingGeometry, CylinderGeometry,
  LatheGeometry, TorusGeometry, TorusKnotGeometry,
  AxisHelper, ArrowHelper } from 'three.js';
import lazy from 'lazy.js';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Stats from 'stats.js';
import { GUI } from 'dat.gui/build/dat.gui.js';

import './WebglGeometries.css';

function loadTexture(url, onProgress ) {
  return new Promise((resolve, reject) => {
    let loader = new TextureLoader();

    loader.load(
      url,
      texture => resolve(texture),
      (xhr) => onProgress ? onProgress(xhr) : null,
      (xhr) => reject(xhr)
    );
  });
}

class WebglGeometries extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(
      canvas.offsetWidth,
      canvas.offsetHeight
    );
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.scene = new Scene();

    this.camera = new PerspectiveCamera( 45, canvas.offsetWidth / canvas.offsetHeight, 1, 2000 );
    this.camera.position.y = 400;
    this.camera.position.z = 200;
    this.camera.lookAt( this.scene.position );

    this.scene.add( new AmbientLight( 0x404040 ) );

    let light = new DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    this.scene.add( light );

    this.boxgeometryRender();

    this.initGUI();
    this.initStateMonitor();
    this.animate();
  }

  async boxgeometryRender() {
    let map = await loadTexture(require('./UV_Grid_Sm.jpg'));
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    let material = new MeshLambertMaterial({
      map: map,
      side: THREE.DoubleSide
    });

    let data = {
      width: 200,
      height: 200,
      depth: 200,
      widthSegments: 1,
      heightSegments: 1,
      depthSegments: 1,
    }

    let geometry = new THREE.BoxGeometry(
      data.width, data.height, data.depth,
      data.widthSegments, data.heightSegments,
      data.depthSegments
    );

    let cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    function redrew() {
      this.scene.remove(cube);

      let geometry = new THREE.BoxGeometry(
        data.width, data.height, data.depth,
        data.widthSegments, data.heightSegments,
        data.depthSegments
      );

      cube = new THREE.Mesh(geometry, material);

      this.scene.add(cube);
    }

    let folder = this.gui.addFolder('THREE.BoxGeometry');
    folder.add(data, 'width').onChange(redrew.bind(this));
    folder.add(data, 'height').onChange(redrew.bind(this));
    folder.add(data, 'depth').onChange(redrew.bind(this));
    folder.add(data, 'widthSegments').step(1).onChange(redrew.bind(this));
    folder.add(data, 'heightSegments').step(1).onChange(redrew.bind(this));
    folder.add(data, 'depthSegments').step(1).onChange(redrew.bind(this));
  }

  initGUI() {
    this.gui = new GUI();
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.right = '0px';

    const container = ReactDOM.findDOMNode(this.refs.WebglGeometries);
    container.insertBefore( this.gui.domElement, ReactDOM.findDOMNode(this.refs.canvas) );
  }

  initStateMonitor() {
    this.webglStats = new Stats();
    this.webglStats.domElement.style.position = 'absolute';

    const container = ReactDOM.findDOMNode(this.refs.WebglGeometries);
    container.insertBefore( this.webglStats.domElement, ReactDOM.findDOMNode(this.refs.canvas) );
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.webglRender();
    this.webglStats.update();
  }

  webglRender() {
    let timer = Date.now() * 0.0001;

    lazy(this.scene.children).each((children) => {
      children.rotation.x = timer * 5;
      children.rotation.y = timer * 2.5;
    })

    this.renderer.render( this.scene, this.camera );
  }

  render() {
    return (
      <div
        ref="WebglGeometries"
        className="WebglGeometries">
        <h2>WebglGeometries</h2>
        <DropdownButton title="Dropdown" id="select-geometry">
          <MenuItem eventKey="1">Dropdown link</MenuItem>
          <MenuItem eventKey="2">Dropdown link</MenuItem>
        </DropdownButton>
        <canvas ref="canvas" />
      </div>
    );
  }

}

export default WebglGeometries;
