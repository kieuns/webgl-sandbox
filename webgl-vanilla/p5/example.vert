// https://github.com/processing/p5.js/blob/main/contributor_docs/webgl_mode_architecture.md#shader-implementation

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 pos; // pass to frag

void main() {
  pos = aTexCoord;

  vec4 position = vec4(aPosition, 1.0);

  // (0,1) -> (-1,1)
  // position.xy = position.xy * 2. - 1.;

  gl_Position = position;
}

