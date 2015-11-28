import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { mat4, vec3 } from 'gl-matrix';
import THREE from 'three.js';

import './TextureMap.css';

var okToRun = false;

let webGLTexture;
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

class TextureMap extends Component {

  componentDidMount() {
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.gl = this.canvas.getContext('webgl');
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.initMatrices();
    this.initShader();
    this.animate();
  }

  handleTextureLoaded(texture) {
    let gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
    texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
    okToRun = true;
  }

  initTexture() {
    let gl = this.gl;
    webGLTexture = gl.createTexture();
    webGLTexture.image = new Image();
    webGLTexture.image.onload = function() {
      this.handleTextureLoaded(webGLTexture)
    };

    webGLTexture.image.src = "./webgl-logo-256.jpg";
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
    let gl = this.gl;
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      var verts = [
         // Front face
         -1.0, -1.0,  1.0,
          1.0, -1.0,  1.0,
          1.0,  1.0,  1.0,
         -1.0,  1.0,  1.0,

         // Back face
         -1.0, -1.0, -1.0,
         -1.0,  1.0, -1.0,
          1.0,  1.0, -1.0,
          1.0, -1.0, -1.0,

         // Top face
         -1.0,  1.0, -1.0,
         -1.0,  1.0,  1.0,
          1.0,  1.0,  1.0,
          1.0,  1.0, -1.0,

         // Bottom face
         -1.0, -1.0, -1.0,
          1.0, -1.0, -1.0,
          1.0, -1.0,  1.0,
         -1.0, -1.0,  1.0,

         // Right face
          1.0, -1.0, -1.0,
          1.0,  1.0, -1.0,
          1.0,  1.0,  1.0,
          1.0, -1.0,  1.0,

         // Left face
         -1.0, -1.0, -1.0,
         -1.0, -1.0,  1.0,
         -1.0,  1.0,  1.0,
         -1.0,  1.0, -1.0
         ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

      var texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      var textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

      // Index data (defines the triangles to be drawn)
      var cubeIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
      var cubeIndices = [
          0, 1, 2,      0, 2, 3,    // Front face
          4, 5, 6,      4, 6, 7,    // Back face
          8, 9, 10,     8, 10, 11,  // Top face
          12, 13, 14,   12, 14, 15, // Bottom face
          16, 17, 18,   16, 18, 19, // Right face
          20, 21, 22,   20, 22, 23  // Left face
      ];
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

      var cube = {buffer:vertexBuffer, texCoordBuffer:texCoordBuffer, indices:cubeIndexBuffer,
              vertSize:3, nVerts:24, texCoordSize:2, nTexCoords: 24, nIndices:36,
              primtype:gl.TRIANGLES};

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
    let gl = this.gl;
    let cube = this.createCube();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.buffer);
    gl.vertexAttribPointer(shaderVertexPositionAttribute, cube.vertSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.texCoordBuffer);
    gl.vertexAttribPointer(shaderTexCoordAttribute, cube.texCoordSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indices);

    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
    gl.uniform1i(shaderSamplerUniform, 0);

    // draw the cubeect
    gl.drawElements(cube.primtype, cube.nIndices, gl.UNSIGNED_SHORT, 0);
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
      <div className="TextureMap">
        <canvas ref="canvas"/>
      </div>
    );
  }

}

export default TextureMap;
