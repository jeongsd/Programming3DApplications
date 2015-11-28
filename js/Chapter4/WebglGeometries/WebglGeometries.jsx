import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {
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
import Lazy from 'lazy.js';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Stats from 'stats.js';

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

  async componentDidMount() {
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

    this.webglStateRender();

    this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    this.camera.position.y = 400;

    this.scene = new Scene();

    let light;
    let object;

    this.scene.add( new AmbientLight( 0x404040 ) );

    light = new DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    this.scene.add( light );

    let map = await loadTexture(require('./UV_Grid_Sm.jpg'));9
    map.wrapS = map.wrapT = RepeatWrapping;
    map.anisotropy = 16;

    let material = new MeshLambertMaterial({
      map: map,
      side: DoubleSide
    });

    object = new Mesh( new SphereGeometry( 75, 20, 10 ), material );
    object.position.set( -400, 0, 200 );
    this.scene.add( object );

    object = new Mesh( new IcosahedronGeometry( 75, 1 ), material );
    object.position.set( -200, 0, 200 );
    this.scene.add( object );

    object = new Mesh( new OctahedronGeometry( 75, 2 ), material );
    object.position.set( 0, 0, 200 );
    this.scene.add( object );

    object = new Mesh( new TetrahedronGeometry( 75, 0 ), material );
    object.position.set( 200, 0, 200 );
    this.scene.add( object );

    object = new Mesh( new PlaneGeometry( 100, 100, 4, 4 ), material );
    object.position.set( -400, 0, 0 );
    this.scene.add( object );

    object = new Mesh( new BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
    object.position.set( -200, 0, 0 );
    this.scene.add( object );

    object = new Mesh( new CircleGeometry( 50, 20, 0, Math.PI * 2 ), material );
    object.position.set( 0, 0, 0 );
    this.scene.add( object );

    object = new Mesh( new RingGeometry( 10, 50, 20, 5, 0, Math.PI * 2 ), material );
    object.position.set( 200, 0, 0 );
    this.scene.add( object );

    object = new Mesh( new CylinderGeometry( 25, 75, 100, 40, 5 ), material );
    object.position.set( 400, 0, 0 );
    this.scene.add( object );


    let points = [];

    for ( let i = 0; i < 50; i ++ ) {
      points.push( new Vector3( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, 0, ( i - 5 ) * 2 ) );
    }

    object = new Mesh( new LatheGeometry( points, 20 ), material );
    object.position.set( -400, 0, -200 );
    this.scene.add( object );

    object = new Mesh( new TorusGeometry( 50, 20, 20, 20 ), material );
    object.position.set( -200, 0, -200 );
    this.scene.add( object );

    object = new Mesh( new TorusKnotGeometry( 50, 10, 50, 20 ), material );
    object.position.set( 0, 0, -200 );
    this.scene.add( object );

    object = new AxisHelper( 50 );
    object.position.set( 200, 0, -200 );
    this.scene.add( object );

    object = new ArrowHelper( new Vector3( 0, 1, 0 ), new Vector3( 0, 0, 0 ), 50 );
    object.position.set( 400, 0, -200 );
    this.scene.add( object );

    this.animate();
  }

  webglRender() {
    let timer = Date.now() * 0.0001;

    this.camera.position.x = Math.cos( timer ) * 800;
    this.camera.position.z = Math.sin( timer ) * 800;

    this.camera.lookAt( this.scene.position );

    for ( let i = 0, l = this.scene.children.length; i < l; i ++ ) {

      let object = this.scene.children[ i ];

      object.rotation.x = timer * 5;
      object.rotation.y = timer * 2.5;

    }
    this.renderer.render( this.scene, this.camera );
  }

  webglStateRender() {
    this.webglStats = new Stats();
    this.webglStats.domElement.style.position = 'absolute';

    const container = ReactDOM.findDOMNode(this.refs.WebglGeometries);
    container.insertBefore( this.webglStats.domElement, ReactDOM.findDOMNode(this.refs.canvas) );
  }

  animate() {
    requestAnimationFrame( () => this.animate() );

    this.webglRender();
    this.webglStats.update();
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
