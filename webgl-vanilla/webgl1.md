
from: https://webglfundamentals.org/webgl/lessons/ko/
* https://webglfundamentals.org/webgl/lessons/ko/webgl-fundamentals.html
* https://github.com/gfxfundamentals/webgl-fundamentals/tree/master

버퍼: 2진데이터. 위치,법선,텍스쳐좌표 원하는 걸 자유롭게.

속성: 버퍼에서 데이터를 가져오고, 정점 셰이더에 제공하는 방법을 지정. 버퍼의 데이터 형식을 지정.
* 버퍼는 랜덤 접근 X. 정점셰이더가 정한 횟수만큼 실행. 실행될때마다 지정된 버퍼에서 다음 값을 가져와서 **속성에 할당**
* (정점셰이더가 정한 횟수)만큼 (반복)해서 (속성이 정의한 데이터 형식에 맞게 값을 속성에 복사)

유니폼: 전역변수

텍스쳐: 이미지 데이터

varying: 정점셰이더가 프래그먼트 셰이던에 데이터를 전달하는 방법.

WebGL 클립공간 좌표는,
* x: -1 ~ 1 / y: -1 ~ 1


렌더링
* CSS로 캔바스 크기 설정해야 한다.

WebGLProgram
* <https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram>

box만 그리기 위한 초기화&렌더 과정 정리
* WebGL 얻기
  * html에 canvas 엘리먼트를 만들거나 얻기
  * canvas에서 'webgl' (WebGL) 컨텍스트 얻기
* init
  * vertexShader, fragmentShader 만들기
  * (WebGLProgram) program 만들기 > 위의 셰이더를 program에 붙여서 연결하기
  * 셰이더에서 사용할 속성을 얻기
  * 속성에 값을 제공할 버퍼만들고(gl.createBuffer) 버퍼를 바인딩해두기 (gl.bindBuffer)
* render setting
  * 뷰포트설정 (gl.viewport) / 화면지우기 (gl.clearColor, gl.clear)
  * 셰이더 활성화 (gl.useProgram)
  * 버텍스속성 활성화하고 (gl.enableVertexAttribArray)
  * 버퍼에서 버텍스 속성으로 넘겨줄 데이터 형식 설정 (gl.vertexAttribPointer)
  * 속성값 설정하기 (gl.uniform2f 또는 형제 함수)
* render
  * 버퍼에 버텍스 데이터 설정 (gl.bufferData)
  * 여기에 사용되는 속성값 변경(또는 설정)
  * 그리기 (gl.drawArrays)