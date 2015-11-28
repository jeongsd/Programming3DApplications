precision mediump float;
varying vec2 vTexCoord;
varying vec4 vColor;
uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
}
