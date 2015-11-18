import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { mat4 } from 'gl-matrix';
import THREE from 'three.js';

import vertexSource from './vertex.vs';
import fragmentSource from './fragment.fs';
import './Chapter2.css';

function initWebGL(canvas) {
  let gl = null;
  let msg = "Your browser does not support WebGL, " +
    "or it is not enabled by default.";
  try {
    gl = canvas.getContext("webgl");
  } catch (e) {
    msg = "Error creating WebGL Context!: " + e.toString();
  }

  if (!gl)
  {
    console.error(msg);
    throw new Error(msg);
  }

    return gl;
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

let projectionMatrix, modelViewMatrix;

function initMatrices(canvas)
{
    // Create a model view matrix with object at 0, 0, -3.333
    modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3.333]);

    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
}

// Create the vertex data for a square to be drawn
function createSquare(gl) {
    let vertexBuffer;
  vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let verts = [
         .5,  .5,  0.0,
        -.5,  .5,  0.0,
         .5, -.5,  0.0,
        -.5, -.5,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    let square = {buffer:vertexBuffer, vertSize:3, nVerts:4, primtype:gl.TRIANGLE_STRIP};
    return square;
}

function createShader(gl, str, type) {
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
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


let shaderProgram, shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

function initShader(gl) {

  // load and compile the fragment and vertex shader
    //let fragmentShader = getShader(gl, "fragmentShader");
    //let vertexShader = getShader(gl, "vertexShader");
    let fragmentShader = createShader(gl, fragmentSource, "fragment");
    let vertexShader = createShader(gl, vertexSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");


    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, obj) {

   // clear the background (with black)
   gl.clearColor(0.0, 0.0, 0.0, 1.0);
   gl.clear(gl.COLOR_BUFFER_BIT);

   // set the shader to use
   gl.useProgram(shaderProgram);

 // connect up the shader parameters: vertex position and projection/model matrices
   // set the vertex buffer to be drawn
   gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
   gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
   gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
   gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

   // draw the object
   gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

class Chapter2 extends Component {

  componentDidMount() {
    let canvas = ReactDOM.findDOMNode(this.refs.canvas);
    let gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initMatrices(canvas);
    let square = createSquare(gl);
    initShader(gl);
    draw(gl, square);
  }

  render() {
    return (
      <div className="Chapter2">
        <canvas ref="canvas"/>
      </div>
    );
  }

}

export default Chapter2;
