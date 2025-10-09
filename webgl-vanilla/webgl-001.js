// webglUtils는 전역 변수로 사용 가능합니다.

const vertex_shader_2d_001 = `
// 속성은 버퍼에서 데이터를 받는다
attribute vec4 a_position;
// 모든 셰이더는 main 함수를 가집니다.
void main() {
    // gl_Position 정점 셰이더가 설정을 담당하는 특수 변수
    gl_Position = a_position;
}
`;

const fragment_shader_2d_001 = `
// 프래그먼트 셰이더는 기본 정밀도를 가지고 있지 않으므로 하나를 선택해야 합니다.
// mediump 는 좋은 기본값으로 "중간 정밀도"를 의미합니다.
precision mediump float;

void main() {
    // gl_FragColor는 프래그먼트 셰이더가 설정을 담당하는 특수 변수
    gl_FragColor = vec4(1, 0, 0.5, 1); // 자주색 반환
}
`;

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
 * vertex셰이더, fragment셰이더를 연결한다. 왜 program인가?
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
  gl.deleteProgram(program);
}

function main() {
  // WebGL context 얻기
  const canvas = document.createElement('canvas');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  canvas.width = 400;
  canvas.height = 300;
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('no gl object');
    return;
  }

  //
  // Init
  //

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_2d_001);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_2d_001);

  const program = createProgram(gl, vertexShader, fragmentShader);

  // 버텍스 데이터를 사용할 속성 찾기
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  // 속성은 버퍼에서 데이터를 가져오기 때문에 버퍼를 만들어야한다.
  const positionBuffer = gl.createBuffer();
  //  (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 바인드 포인트를 통해 버퍼를 참조해서 데이터를 넣을 수 있다
  const positions = [
    0,
    0,
    0,
    0.5,
    0.7,
    0
  ];
  // Float32Array 타입명시된 버퍼
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //
  // render
  //

  // 캔버스 크기 조정
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // 캔바스 지우기
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 실행할 셰이더 프로그램을 WebGL에 알려준다
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  // 위치버퍼할당
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // positionBuffer(ARRAY_BUFFER)의 데이터를 꺼내오는 방법을 속성에 지시
  const size = 2; // 반복마다 2개의 컴포넌트
  const type = gl.FLOAT; // 데이터는 32비트 부동 소수점
  const normalize = false; // 데이터 정규화 안함
  const stride = 0; // 0 = 다음 위치를 가져오기 위한 반복마다 (size * sizeof(type))만큼 앞으로 이동
  const offset = 0; // 버퍼의 처음부터 시작
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // draw
  const primitiveType = gl.TRIANGLES;
  const offset2 = 0;
  const count = 3;
  gl.drawArrays(primitiveType, offset2, count);
}

main();
