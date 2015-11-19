attribute vec3 vertexPos;
attribute vec4 vertexColor;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec4 vColor;
void main(void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
  vColor = vertexColor;
}
