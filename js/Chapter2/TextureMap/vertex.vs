attribute vec3 vertexPos;
attribute vec2 texCoord;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec4 vColor;
varying vec2 vTexCoord;
void main(void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
  vTexCoord = texCoord;
}
