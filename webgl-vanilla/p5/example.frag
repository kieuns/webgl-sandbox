precision mediump float;

varying vec2 pos; // from vert

//time
//uniform float millis; // 'exampleShader'.setUniform('이름', 함수); 이름부분에 써 넣는다
//uniform sampler2D background;

void main() {
  //gl_FragColor = vec4(pos.x, 0., 1., 1.); // gradient-1
  gl_FragColor = vec4(pos, 1.,1.); // gradient-2
}

//
// Vectors: vec2, vec3, vec4
//
// vec4 v = vec4(0.1, 0.2, 0.3, 0.4);
// > result: [0.1, 0.2, 0.3, 0.4]
//
// vec4 v = vec4(0.1);
// > result: [0.1, 0.1, 0.1, 0.1]
//
// vec4 v = vec4(0.1, 0.2, 0.3, 0.4);
// 0.1  0.2  0.3  0.4
// x    y    z    w
// r    g    b    a
// s    t    p    q
//
// v.x = v.r = v.s // exchange ok
// v.y = v.g = v.t
// v.w = v.b = v.p
// v.z = v.a = v.q
//
// vec2 pos = v.xy; // multiple reference enable > swizzling
// pos = v.xx;
//

// ref: <https://github.com/processing/p5.js/blob/main/contributor_docs/webgl_mode_architecture.md>
//          |  Attribute  | Uniform   | varying (vert->frag 전달시 사용)
// vert     | read only   | read only | read/write
// frag     | N.A         | read only | read only
// set-from | CPU         | CPU       | Vertex
// changes  | Per Vertex  | Constant  | Per Fragment
//

//
// Texture Coord             | gl_FragCoord
// Range: 0-1                | Range: 0-width/height
// Bounds: inside verticies  | Bounds: Entire scree
//

// fract(x) : 정수제거