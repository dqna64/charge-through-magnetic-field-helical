const DIS_HEIGHT = 720;
const DIS_WIDTH = 1280;

// Charge particle attributes
let pos;
let vel;
let acc;
let q = 1.602 * Math.pow(10, -19);
let b = 0.0000000008; // 0.0000000001
let b_dir;
let m = 1.673 * Math.pow(10, -27);
let trail;

// 3D engine
let rotY;
let axisLen;
let xOff;
let yOff;
let zOff;
let r;
let detailX;
let detailY;

// Misc
let step;
let centriVel;
let helicalRadius;

function setup() {
  createCanvas(DIS_WIDTH, DIS_HEIGHT, WEBGL);
  initPos = createVector(280, -140, 0);
  pos = initPos.copy();
  vel = createVector(0, -0.8, -0.2);
  acc = createVector(0, 0, 0);
  b_dir = createVector(0, 0, 1);
  trail = [];
  rotY = -0.4; // 2.2
  axisLen = 400;
  xOff = -axisLen / 2;
  yOff = 200;
  zOff = axisLen / 2;
  detailX = 32;
  detailY = 32;
  r = 2;
  step = 0;
  centriVel = 0;
  helicalRadius = 0;
}

function draw() {
  background(98, 170, 222);
  ambientLight(130);
  pointLight(210, 210, 210, 100, 100, 400);
  push();
  translate(0, yOff, 0);
  rotateY(rotY);
  translate(xOff, 0, zOff);
  /// Axes
  ambientMaterial(250);
  fill(90);

  push();
  rotateZ(PI / 2);
  translate(0, -axisLen / 2);
  cylinder(r, axisLen, 32, 32); // x-axis
  pop();

  push();
  translate(0, -axisLen / 2);
  cylinder(r, axisLen, 32, 32); // y-axis
  pop();

  push();
  rotateX(PI / 2);
  translate(0, -axisLen / 2);
  cylinder(r, axisLen, 32, 32); // z-axis
  pop();

  // Charged particle
  push();
  translate(pos.x, pos.y, pos.z);
  ambientMaterial(250);
  fill(235, 94, 94);
  sphere(10, detailX, detailY);
  // push(); // Magnetic field
  // rotateX(PI/2);
  // translate(0, -20, 0);
  // fill(20, 110, 227);
  // cylinder(2, 40, 32, 32);
  // translate(0, 20, 0);
  // rotateX(PI);
  // translate(0, 40, 0);
  // cone(4, 10, 32, 32);
  // pop();
  // push(); // Velocity
  // rotateX(acos(vel.x/vel.mag()));
  // rotateY(-acos(vel.y/vel.mag()));
  // rotateZ(-acos(vel.z/vel.mag()));
  // fill(90);
  // cylinder(2, 40, 32, 32);
  // pop();

  pop();

  ambientMaterial(250);
  for (let point of trail) {
    push();
    translate(point.x, point.y, point.z);
    sphere(1.5, 64, 64);
    pop();
  }

  // Magnetic field
  push();
  rotateX(PI / 2);
  translate(initPos.x - helicalRadius, -axisLen / 2, -initPos.y);
  ambientMaterial(250);
  fill(20, 110, 227);
  cylinder(3, axisLen, 32, 32); // magnetic field direction
  rotateX(PI);
  translate(0, axisLen / 2, 0);
  cone(11, 50, 32, 32);
  pop();
  pop();

  // Charges particle
  accMag = q * vel.mag() * b * sin(abs(vel.angleBetween(b_dir))) / m
  acc = p5.Vector.cross(vel, b_dir).setMag(accMag); // Cross product is non-commutative
  vel.add(acc);
  pos.add(vel);
  trail.push(pos.copy());
  centriVel = createVector(vel.x, vel.y, 0).mag();
  helicalRadius = pow(centriVel, 2) / accMag;
  acc = createVector(0, 0, 0);

  // 3D engine
  rotY += 0.005;
  step += 0.01;
}

let looper = 0;

function keyPressed() {
  if (key == " ") {
    looper += 1;
    if (looper % 2 == 0) {
      loop();
    } else {
      noLoop();
    }
  } else if (key == 'd') {
    debug = !debug;
  }
}