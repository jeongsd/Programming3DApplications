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
import dat from 'dat.gui/build/dat.gui.js';

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

    this.folder = {};

    this.state = {
      currentGeometry: 'BoxGeometry',
    };

    this.onGeometryChange = this.onGeometryChange.bind(this);
    this.renderBoxGeometry = this.renderBoxGeometry.bind(this);
    this.renderCircleGeometry = this.renderCircleGeometry.bind(this);
  }

  componentDidMount() {
    this.initGUI();
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

  initGUI() {
    this.gui = new dat.GUI();
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

    let material = await this.getMaterial();
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

    let folder = this.folder;
    folder = this.gui.addFolder('THREE.BoxGeometry');
    folder.add(data, 'width', 100, 300).onChange(redrew.bind(this));
    folder.add(data, 'height', 100, 300).onChange(redrew.bind(this));
    folder.add(data, 'depth', 100, 300).onChange(redrew.bind(this));
    folder.add(data, 'widthSegments', 1, 10).step(1).onChange(redrew.bind(this));
    folder.add(data, 'heightSegments', 1, 10).step(1).onChange(redrew.bind(this));
    folder.add(data, 'depthSegments', 1, 10).step(1).onChange(redrew.bind(this));
    folder.remove();
  }

  async renderCircleGeometry() {
    let data = {
      radius: 200,
      segments: 32,
      thetaStart: 0,
      thetaLength: Math.PI * 2,
    }

    let geometry = new THREE.CircleGeometry(
      data.radius, data.segments,
      data.thetaStart, data.thetaLength
    );

    let material = await this.getMaterial();
    let circle = new THREE.Mesh(geometry, material);
    this.scene.add(circle);

    function redrew() {
      this.scene.remove(circle);

      let geometry = new THREE.CircleGeometry(
        data.radius, data.segments,
        data.thetaStart, data.thetaLength
      );

      circle = new THREE.Mesh(geometry, material);

      this.scene.add(circle);
    }

    let folder = this.folder;

    folder = this.gui.addFolder('THREE.CircleGeometry');
    folder.add(data, 'radius', 100, 300).onChange(redrew.bind(this));
    folder.add(data, 'segments', 0, 128).onChange(redrew.bind(this));
    folder.add(data, 'thetaStart', 0, Math.PI * 2).onChange(redrew.bind(this));
    folder.add(data, 'thetaLength', 0, Math.PI * 2).onChange(redrew.bind(this));
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
        </DropdownButton>
        <canvas ref="canvas" />
      </div>
    );
  }

}

export default WebglGeometries;
