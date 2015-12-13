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
import PointerLock from 'react-pointerlock';
import './PointerLockControls.js';
import lazy from 'lazy.js';
import { Nav, NavItem, Well, Col } from 'react-bootstrap';
import Stats from 'stats.js';
import { ClipLoader } from 'halogen';
import koreaGeomety from './koreaGeometry.js';

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

const clock = new THREE.Clock();

class WebglGeometries extends Component {

  constructor() {
    super();

    this.state = {
      currentGeometry: 'BoxGeometry',
      isPointLock: false,
    };

    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    this.onGeometryChange = this.onGeometryChange.bind(this);
    this.renderBoxGeometry = this.renderBoxGeometry.bind(this);
    this.renderCircleGeometry = this.renderCircleGeometry.bind(this);
    this.renderCylinderGeometry = this.renderCylinderGeometry.bind(this);
    this.renderDodecahedronGeometry = this.renderDodecahedronGeometry.bind(this);
    this.renderExtrudeGeometry = this.renderExtrudeGeometry.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onPointLock = this.onPointLock.bind(this);
    this.onExitPointLock = this.onExitPointLock.bind(this);
  }

  componentDidMount() {
    this.initStateMonitor();

    this.init();
    this.initLight();
    this.geometryRender(this.state.currentGeometry);

    this.animate();
  }

  onPointLock() {
    this.setState({ isPointLock: true });
    this.controls.enabled = true;
  }

  onExitPointLock() {
    this.setState({ isPointLock: false });
    this.controls.enabled = false;
  }

  onKeyDown(event) {
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;
      case 32: // space
        this.moveUp = true;
        break;
      case 88: // x
        this.moveDown = true;
        break;
    }
  }

  onKeyUp(event) {
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;
      case 32: // space
        this.moveUp = false;
        break;
      case 88: // x
        this.moveDown = false;
        break;
    }
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

    this.controls = new THREE.PointerLockControls( this.camera );
    this.scene.add( this.controls.getObject() );
    this.velocity = new THREE.Vector3();

    document.addEventListener( 'keydown', this.onKeyDown, false );
    document.addEventListener( 'keyup', this.onKeyUp, false );
  }

  initLight() {
    this.scene.add( new AmbientLight( 0x404040 ) );

    let light = new DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    this.scene.add( light );
  }

  initControl() {
    this.controls = new THREE.PointerLockControls( this.camera );
    this.scene.add( this.controls.getObject() );
    this.controls.getObject().translateX( 0 );
    this.controls.getObject().translateZ( 0 );
  }

  initStateMonitor() {
    this.webglStats = new Stats();
    this.webglStats.domElement.style.position = 'absolute';

    const container = ReactDOM.findDOMNode(this.refs.canvasWrapper);
    container.insertBefore(this.webglStats.domElement,
      ReactDOM.findDOMNode(this.refs.canvas));
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    let delta = clock.getDelta();
    let timer = Date.now() * 0.0001;

    if (this.state.isPointLock) {
      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;
      this.velocity.y -= this.velocity.y * 10.0 * delta;

      if ( this.moveForward ) this.velocity.z -= 400.0 * delta;
      if ( this.moveBackward ) this.velocity.z += 400.0 * delta;

      if ( this.moveLeft ) this.velocity.x -= 400.0 * delta;
      if ( this.moveRight ) this.velocity.x += 400.0 * delta;

      if (this.moveUp) this.velocity.y += 400 * delta;
      if (this.moveDown) this.velocity.y -= 400 * delta;


      this.controls.getObject().translateX( this.velocity.x * delta );
      this.controls.getObject().translateY( this.velocity.y * delta );
      this.controls.getObject().translateZ( this.velocity.z * delta );
    }

    this.renderer.render(this.scene, this.camera);
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
    let map = await loadTexture(require('./static/UV_Grid_Sm.jpg'));
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
    let geometry = new THREE.CylinderGeometry( 200, 100, 100, 32 );

    let material = await this.getMaterial();
    let circle = new THREE.Mesh(geometry, material);
    this.scene.add(circle);
  }

  async renderDodecahedronGeometry() {
    let geometry = new THREE.DodecahedronGeometry(100, 0 );

    let material = await this.getMaterial();
    let circle = new THREE.Mesh(geometry, material);
    this.scene.add(circle);
  }

  renderExtrudeGeometry() {
    const meshs = koreaGeomety();
    // this.camera.position.y = 10;
    // this.camera.position.z = 10;
    // this.camera.lookAt( new THREE.Vector3( 776, 290, 0 ) );

    meshs.rotation.x = -0.5;
    // x: 776
    // y: 290
    this.scene.add(meshs);
  }

  onGeometryChange(eventKey) {
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
        <Col md={3}>
          <Nav
            bsStyle="pills"
            activeKey={this.state.currentGeometry}
            onSelect={ this.onGeometryChange }
            stacked >
            <NavItem eventKey="BoxGeometry">
              BoxGeometry
            </NavItem>
            <NavItem eventKey="CircleGeometry">
              CircleGeometry
            </NavItem>
            <NavItem eventKey="CylinderGeometry">
              CylinderGeometry
            </NavItem>
            <NavItem eventKey="DodecahedronGeometry">
              DodecahedronGeometry
            </NavItem>
            <NavItem eventKey="ExtrudeGeometry">
              ExtrudeGeometry
            </NavItem>
          </Nav>
        </Col>
        <Col md={9}>
          <PointerLock
            ref="canvasWrapper"
            onPointLock={ this.onPointLock }
            onExitPointLock={ this.onExitPointLock } >
            <canvas
              ref="canvas" />
          </PointerLock>
        </Col>
      </div>
    );
  }

}

export default WebglGeometries;
