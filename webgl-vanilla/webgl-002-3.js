// 서버로 띄우는 경우 import 되는지 확인해보기
// const webglUtils = import('./webgl-util/webgl-utils.js');

//
// 픽셀좌표 기준으로 임의의 사각형 그리기
// 모니터처럼 좌상단을 (0,0)으로 설정하기
// 임의의 색상으로 50개의 사각형 그리기
//

// 2d 픽셀좌표값을 webgl클립공간(-1~1)값으로 변경
const vertex_shader_2d = `
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

    // 좌상단이 (0,0)이 되도록 수정. (클립공간에서 좌하단이 (-1, -1), 이걸 y축 반전시켜서 좌상단 기준이 되도록 변경)
    gl_Position = vec4(clipspace * vec2(1, -1), 0, 1);
}
`

const fragment_shader_2d = `
// 프래그먼트 셰이더는 기본 정밀도를 가지고 있지 않으므로 하나를 선택해야 합니다.
// mediump 는 좋은 기본값으로 "중간 정밀도"를 의미합니다.
precision mediump float;

// 색상유니폼을 입력을 가져올 수 있게 추가한다.
uniform vec4 u_color;

void main() {
    // gl_FragColor는 프래그먼트 셰이더가 설정을 담당하는 특수 변수
    gl_FragColor = u_color;
}
`

/**
 * @param {WebGLRenderingContext} gl
 * @param {GLenum} type
 * @param {string} source
 * @returns {WebGLShader}
 */
function createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    }
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

/**
 * vertex셰이더, fragment셰이더를 연결한다. 왜 program인가?
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

function main() {
    //
    // WebGL context 얻기
    //

    const canvas = document.createElement('canvas')
    document.getElementsByTagName('body')[0].appendChild(canvas)
    canvas.width = 400
    canvas.height = 300
    const gl = canvas.getContext('webgl')
    if (!gl) {
        console.log('no gl object')
        return
    }

    //
    // init
    //

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_2d)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_2d)

    const program = createProgram(gl, vertexShader, fragmentShader)

    // 버텍스 데이터를 사용할 속성 찾기
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

    // 속성은 버퍼에서 데이터를 가져오기 때문에 버퍼를 만들어야한다.
    const positionBuffer = gl.createBuffer()
    //  (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    //
    // render setting
    //

    webglUtils.resizeCanvasToDisplaySize(gl.canvas)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // 캔바스 지우기
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 실행할 셰이더 프로그램을 WebGL에 알려준다
    gl.useProgram(program)

    gl.enableVertexAttribArray(positionAttributeLocation)

    // positionBuffer(ARRAY_BUFFER)의 데이터를 꺼내오는 방법을 속성에 지시
    const size = 2 // 반복마다 2개의 컴포넌트
    const type = gl.FLOAT // 데이터는 32비트 부동 소수점
    const normalize = false // 데이터 정규화 안함
    const stride = 0 // 0 = 다음 위치를 가져오기 위한 반복마다 (size * sizeof(type))만큼 앞으로 이동
    const offset = 0 // 버퍼의 처음부터 시작
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

    //
    // render
    //

    render(gl, program)
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 */
function render(gl, program) {
    // 버텍스 데이터를 사용할 속성 찾기
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

    // 임의의 색상으로 임의의 사각형 50개 그리기
    for (let ii = 0; ii < 3; ++ii) {
        // 임의 사각형 설정
        // ARRAY_BUFFER 바인드 포인트에 마지막으로 바인딩한 것이므로 positionBuffer에 작성됩니다.
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300))
        // 임의 색상 설정
        gl.uniform4f(
            colorUniformLocation,
            Math.random(), Math.random(), Math.random(), 1
        )
        // 사각형 그리기
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
}

/**
 * 0 ~ -1 사이의 임의 정수 반환용으로 쓸 함수
 * @param {number} range
 */
function randomInt(range) {
    return Math.floor(Math.random() * range)
}

/**
 * 사각형을 정의한 값드로 버퍼 채우기
 * @param {WebGLRenderingContext} gl
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
function setRectangle(gl, x, y, width, height) {
    const x1 = x
    const x2 = x + width
    const y1 = y
    const y2 = y + height
    // gl.bufferData(gl.ARRAY_BUFFER, ...)는 ARRAY_BUFFER 바인드 포인트에 바인딩된 버퍼에 영향을 주지만 지금까지는 하나의 버퍼만 있었다.
    // 두 개 이상이라면 원하는 버퍼를 ARRAY_BUFFER에 먼저 바인딩해야 한다.
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            x1, y1, x2, y1, x1, y2,
            x1, y2, x2, y1, x2, y2
        ]),
        gl.STATIC_DRAW
    )
}

main()
