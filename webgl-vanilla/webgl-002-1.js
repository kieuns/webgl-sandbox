// 서버로 띄우는 경우 import 되는지 확인해보기
//const webglUtils = import('./webgl-util/webgl-utils.js');

//
// 픽셀좌표 기준으로 임의의 사각형 그리기
//

// 2d 픽셀좌표값을 webgl클립공간(-1~1)값으로 변경
let vertex_shader_2d = `
// (x,y)만 사용하기 때문에 vec2사용
attribute vec2 a_position; // 픽셀좌표입력받을곳
uniform vec2 u_resolution; // 화면픽셀크기
// 모든 셰이더는 main 함수를 가집니다.
void main() {
    // 위치를 픽셀에서 0.0~1.0 사이로 변경
    vec2 zeroToOne = a_position / u_resolution;

    // 0->1에서 0->2로 변환
    vec2 zeroToTwo = zeroToOne * 2.0;

    // 0->2에서 (-1~1)로 변환 (클립공간)
    vec2 clipspace = zeroToTwo - 1.0;

    gl_Position = vec4(clipspace, 0, 1);
}
`;

let fragment_shader_2d = `
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
function createShader(gl, type, source)
{
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
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
function createProgram(gl, vertexShader, fragmentShader)
{
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function main()
{
    // WebGL context 얻기
    const canvas = document.createElement('canvas');
    document.getElementsByTagName('body')[0].appendChild(canvas);
    canvas.width = 400;
    canvas.height = 300;
    const gl = canvas.getContext('webgl');
    if(!gl) {
        console.log('no gl object');
        return;
    }

    //
    // Init
    //

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_2d);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_2d);

    let program = createProgram(gl, vertexShader, fragmentShader);

    // 버텍스 데이터를 사용할 속성 찾기
    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    // 속성은 버퍼에서 데이터를 가져오기 때문에 버퍼를 만들어야한다.
    let positionBuffer = gl.createBuffer();
    //  (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 바인드 포인트를 통해 버퍼를 참조해서 데이터를 넣을 수 있다
    const positions = [
        10, 20,  80, 20,
        10, 30,
        10, 30,  80, 20,
        80, 30
    ];
    // Float32Array 타입명시된 버퍼
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    //
    // render
    //

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height);

    // 캔바스 지우기
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 실행할 셰이더 프로그램을 WebGL에 알려준다
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // 위치버퍼할당
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // positionBuffer(ARRAY_BUFFER)의 데이터를 꺼내오는 방법을 속성에 지시
    let size = 2;           // 반복마다 2개의 컴포넌트
    let type = gl.FLOAT;    // 데이터는 32비트 부동 소수점
    let normalize = false;  // 데이터 정규화 안함
    let stride = 0;         // 0 = 다음 위치를 가져오기 위한 반복마다 (size * sizeof(type))만큼 앞으로 이동
    let offset = 0;         // 버퍼의 처음부터 시작
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // draw
    let primitiveType = gl.TRIANGLES;
    let offset2 = 0;
    let count = 6;
    gl.drawArrays(primitiveType, offset2, count);
}

main();