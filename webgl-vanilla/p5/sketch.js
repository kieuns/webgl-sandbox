// https://youtu.be/3mfvZ-mdtZQ?si=mCS5Pvdw7POszbli&t=940
// https://www.youtube.com/watch?v=3mfvZ-mdtZQ
// vector swizzling

function preload()
{
  exampleShader = loadShader('example.vert', 'example.frag')
}

function setup() {
  createCanvas(400, 400, WEBGL);
  shader(exampleShader); // 쓸 셰이더 지정
  noStroke(); // shape 윤곽선 제거
}

function draw() {
  clear();
  rect(0,0,width, height);
  //ellipse(0,0,width,height, 150); // try-1
}