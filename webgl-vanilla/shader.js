// 1) https://webglfundamentals.org/webgl/lessons/ko/webgl-fundamentals.html
// 2) https://webglfundamentals.org/webgl/lessons/ko/webgl-shaders-and-glsl.html
//
// uniform (global variables)
// attribute (attribute and buffer)
// varying (variable)
// * parameter qualifier : in,out,inout
// * precision qualifier
//   * highp   : shaping -2^16~2^16. floating point -2^62 ~ 2^62
//   * mediump : shaping -2^10~2^10. floating point -2^14 ~ 2^14
//   * lowp    : shaping -2^8~2^8. floating point -2 ~ 2
//   ex) precision highp float;

// 예전 스터디 자료. webgl-0xxx.js 파일이 최근 것.

/**
 * @param {WebGLRenderingContext} gl
 * @param {GLenum} type
 * @param {string} source
 * @returns {WebGLShader}
 */
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  // gl.deleteShader(shader);
}

function main() {
  const canvas = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  canvas.width = 400;
  canvas.height = 300;

  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('no webgl object');
    return;
  }

  const vertexSource = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
    `;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);

  const position = [
    0,
    0,
    0,
    0.5,
    0.7,
    0
  ];

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

  // gl.STATIC_DRAW  : data will most likely never change
  // gl.DYNAMIC_DRAW : data changes all the time
  // gl.STREAM_DRAW  : data changes with every draw

  const fragmentSource = `
precision mediump float;
void main() {
  gl_FragColor = vec4(1, 0, 0.5, 1.0);
}
`;

  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
