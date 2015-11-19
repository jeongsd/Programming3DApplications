import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { mat4, vec3 } from 'gl-matrix';
import THREE from 'three.js';

import './AddGeometry.css';

let projectionMatrix;
let modelViewMatrix;
let rotationAxis;
let shaderVertexColorAttribute;

const duration = 5000;
let currentTime = Date.now();

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

class AddGeometry extends Component {

  componentDidMount() {
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.gl = this.canvas.getContext('webgl');
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.initMatrices();
    this.initShader();
    this.animate();
  }

  initMatrices() {
    modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3.333]);

    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4,
      this.canvas.width / this.canvas.height, 1, 10000);
    rotationAxis = vec3.create();
    vec3.normalize(rotationAxis, [1, 1, 1]);
  }

  createCube() {
    let vertexBuffer;
    vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

       // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

       // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

       // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

       // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0,
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

    // Color data
    let colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
      [1.0, 0.0, 0.0, 1.0], // Front face
      [0.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 0.0, 1.0, 1.0], // Top face
      [1.0, 1.0, 0.0, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 1.0, 1.0, 1.0]  // Left face
    ];

    let vertexColors = [];
    for (let i in faceColors) {
      const color = faceColors[i];
      for (let j=0; j < 4; j++) {
        vertexColors = vertexColors.concat(color);
      }
    }
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexColors), this.gl.STATIC_DRAW);

    let cubeIndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    let cubeIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), this.gl.STATIC_DRAW);

    const cube = {
      buffer: vertexBuffer,
      colorBuffer: colorBuffer,
      indices: cubeIndexBuffer,
      vertSize: 3,
      nVerts: 24,
      colorSize: 4,
      nColors: 24,
      nIndices: 36,
      primtype: this.gl.TRIANGLES
    };

    return cube;
  }


  initShader() {
    let gl = this.gl;
    let fragmentShader = createShader(gl, require('./fragment.fs'), 'fragment');
    let vertexShader = createShader(gl, require('./vertex.vs'), 'vertex');

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Could not initialise shaders');
    }
  }

  draw() {
    let cube = this.createCube();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT || this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(shaderProgram);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube.buffer);
    this.gl.vertexAttribPointer(shaderVertexPositionAttribute, cube.vertSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube.colorBuffer);
    this.gl.vertexAttribPointer(shaderVertexColorAttribute, cube.colorSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cube.indices);
    this.gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    this.gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    this.gl.drawElements(cube.primtype, cube.nIndices, this.gl.UNSIGNED_SHORT, 0);
  }

  animate() {
    requestAnimationFrame(() => { this.animate(); });
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;
    mat4.rotate(modelViewMatrix, modelViewMatrix, angle, rotationAxis);
    this.draw();
  }

  render() {
    return (
      <div className="AddGeometry">
        <canvas ref="canvas"/>
      </div>
    );
  }

}

export default AddGeometry;
