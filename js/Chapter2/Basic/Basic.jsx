import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { mat4 } from 'gl-matrix';
import THREE from 'three.js';

import './Basic.css';

let projectionMatrix;
let modelViewMatrix;

// Create the vertex data for a square to be drawn
function createShader(gl, str, type) {
  let shader;
  if (type === 'fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (type === 'vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

let shaderProgram;
let shaderVertexPositionAttribute;
let shaderProjectionMatrixUniform;
let shaderModelViewMatrixUniform;

class Basic extends Component {

  componentDidMount() {
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.gl = this.canvas.getContext('webgl');
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.initMatrices();
    this.initShader();
    this.draw();
  }

  initMatrices() {
    modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3.333]);

    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4,
      this.canvas.width / this.canvas.height, 1, 10000);
  }

  createSquare() {
    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    const boxVerts = new Float32Array([
      0.5, 0.5, 0.0,
      -0.5, 0.5, 0.0,
      0.5, -0.5, 0.0,
      -0.5, -0.5, 0.0,
    ]);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, boxVerts, this.gl.STATIC_DRAW);

    const square = {
      buffer: vertexBuffer,
      vertSize: 3,
      numberOfVerts: 4,
      primtype: this.gl.TRIANGLE_STRIP,
    };

    return square;
  }

  initShader() {
    let fragmentShader = createShader(this.gl, require('./fragment.fs'), 'fragment');
    let vertexShader = createShader(this.gl, require('./vertex.vs'), 'vertex');

    // link them together into a new program
    shaderProgram = this.gl.createProgram();

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, 'vertexPos');
    this.gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderProjectionMatrixUniform = this.gl.getUniformLocation(shaderProgram, 'projectionMatrix');
    shaderModelViewMatrixUniform = this.gl.getUniformLocation(shaderProgram, 'modelViewMatrix');


    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error('Could not initialise shaders');
    }
  }

  draw() {
    let square = this.createSquare();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.useProgram(shaderProgram);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, square.buffer);
    this.gl.vertexAttribPointer(shaderVertexPositionAttribute, square.vertSize, this.gl.FLOAT, false, 0, 0);
    this.gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    this.gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    this.gl.drawArrays(square.primtype, 0, square.numberOfVerts);
  }

  render() {
    return (
      <div className="Basic">
        <canvas ref="canvas"/>
      </div>
    );
  }

}

export default Basic;
