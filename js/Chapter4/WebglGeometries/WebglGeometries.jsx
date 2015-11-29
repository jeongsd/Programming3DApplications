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
// import dat from 'dat.gui/build/dat.gui.js';

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

    this.state = {
      currentGeometry: 'BoxGeometry',
    };

    this.onGeometryChange = this.onGeometryChange.bind(this);
    this.renderBoxGeometry = this.renderBoxGeometry.bind(this);
    this.renderCircleGeometry = this.renderCircleGeometry.bind(this);
    this.renderCylinderGeometry = this.renderCylinderGeometry.bind(this);
  }

  componentDidMount() {
    this.initStateMonitor();

    this.init();
    this.initLight();
    this.geometryRender(this.state.currentGeometry);

    this.animate();
  }

  init() {
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
  }

  initLight() {
    this.scene.add( new AmbientLight( 0x404040 ) );

    let light = new DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    this.scene.add( light );
  }

  initStateMonitor() {
    this.webglStats = new Stats();
    this.webglStats.domElement.style.position = 'absolute';

    const container = ReactDOM.findDOMNode(this.refs.WebglGeometries);
    container.insertBefore( this.webglStats.domElement, ReactDOM.findDOMNode(this.refs.canvas) );
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    let timer = Date.now() * 0.0001;

    lazy(this.scene.children).each((children) => {
      children.rotation.x = timer * 5;
      children.rotation.y = timer * 2.5;
    })

    this.renderer.render(this.scene, this.camera );

    this.webglStats.update();
  }

  clearScene() {
    lazy(this.scene.children)
      .each((children) => {
        if(children.type === 'Mesh') {
          this.scene.remove(children);
        }
      });
  }

  async getMaterial() {
    let map = await loadTexture(require('./UV_Grid_Sm.jpg'));
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    return new MeshLambertMaterial({
      map: map,
      side: THREE.DoubleSide
    });
  }

  geometryRender(type) {
    const renderFunction = this[`render${type}`];

    if(renderFunction) {
      renderFunction();
    }
  }

  async renderBoxGeometry() {
    let geometry = new THREE.BoxGeometry(
      200, 200, 200,
      1, 1, 1
    );

    let material = await this.getMaterial();
    let cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  async renderCircleGeometry() {
    let geometry = new THREE.CircleGeometry(
      200, 32,
      0, Math.PI * 2
    );

    let material = await this.getMaterial();
    let circle = new THREE.Mesh(geometry, material);
    this.scene.add(circle);
  }

  async renderCylinderGeometry() {
    let geometry = new THREE.CylinderGeometry( 200, 100, 100, 32 )

    let material = await this.getMaterial();
    let circle = new THREE.Mesh(geometry, material);
    this.scene.add(circle);
  }

  onGeometryChange(event, eventKey) {
    this.setState({
      currentGeometry: eventKey,
    });

    this.clearScene();
    this.geometryRender(eventKey);
  }

  render() {
    return (
      <div
        ref="WebglGeometries"
        className="WebglGeometries">
        <h2>WebglGeometries</h2>
        <DropdownButton
          onSelect={ this.onGeometryChange }
          title={ this.state.currentGeometry }
          id="select-geometry">
          <MenuItem eventKey="BoxGeometry">BoxGeometry</MenuItem>
          <MenuItem eventKey="CircleGeometry">CircleGeometry</MenuItem>
          <MenuItem eventKey="CylinderGeometry">CylinderGeometry</MenuItem>
        </DropdownButton>
        <canvas ref="canvas" />
      </div>
    );
  }

}

export default WebglGeometries;
