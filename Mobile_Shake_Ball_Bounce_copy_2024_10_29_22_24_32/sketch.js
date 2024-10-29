let balls = [];
let miniBalls = []; 
let threshold = 30;
let accChangeX = 0;
let accChangeY = 0;
let accChangeT = 0;

function setup() {
  createCanvas(displayWidth, displayHeight);

  for (let i = 0; i < 50; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(0);

  // Display and move main balls
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].display();
  }

  // Display and update mini balls
  for (let i = miniBalls.length - 1; i >= 0; i--) {
    miniBalls[i].move();
    miniBalls[i].display();
    if (miniBalls[i].alpha <= 0) {
      miniBalls.splice(i, 1); // Remove faded-out mini balls
    }
  }

  checkForShake();
}

function checkForShake() {
  accChangeX = abs(accelerationX - pAccelerationX);
  accChangeY = abs(accelerationY - pAccelerationY);
  accChangeT = accChangeX + accChangeY;

  if (accChangeT >= threshold) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].shake();
      balls[i].turn();
    }
  } else {
    for (let i = 0; i < balls.length; i++) {
      balls[i].stopShake();
      balls[i].turn();
      balls[i].move();
    }
  }
}

// Ball class
class Ball {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(20, 50);
    this.xspeed = random(-2, 2);
    this.yspeed = random(-2, 2);
    this.oxspeed = this.xspeed;
    this.oyspeed = this.yspeed;
    this.direction = 0.7;
    this.color = color(random(255), random(255), random(255));
    this.isBox = false; // Track shape
  }

  move() {
    this.x += this.xspeed * this.direction;
    this.y += this.yspeed * this.direction;
  }

  turn() {
    if (this.x < 0 || this.x > width - 20 || this.y < 0 || this.y > height - 20) {
      this.color = color(random(255), random(255), random(255)); // Change color
      this.isBox = !this.isBox; // Toggle between box and ball
      this.createMiniBalls(); // Generate smaller balls on bounce

      if (this.x < 0) this.x = 0;
      if (this.y < 0) this.y = 0;
      if (this.x > width - 20) this.x = width - 20;
      if (this.y > height - 20) this.y = height - 20;

      this.direction = -this.direction;
    }
  }

  shake() {
    this.xspeed += random(5, accChangeX / 3);
    this.yspeed += random(5, accChangeX / 3);
  }

  stopShake() {
    if (this.xspeed > this.oxspeed) {
      this.xspeed -= 0.6;
    } else {
      this.xspeed = this.oxspeed;
    }
    if (this.yspeed > this.oyspeed) {
      this.yspeed -= 0.6;
    } else {
      this.yspeed = this.oyspeed;
    }
  }

  // Generate smaller balls on bounce
  createMiniBalls() {
    for (let i = 0; i < 20; i++) {
      miniBalls.push(new MiniBall(this.x, this.y));
    }
  }

  display() {
    fill(this.color);
    if (this.isBox) {
      rect(this.x, this.y, this.diameter, this.diameter); // Display as box on bounce
    } else {
      ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }
}

// MiniBall class for smaller balls
class MiniBall {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.diameter = random(5, 20);
    this.xspeed = random(-5, 5);
    this.yspeed = random(-5, 5);
    this.color = color(random(255), random(255), random(255));
    this.alpha = 255; // Start fully opaque
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.alpha -= 3; // Gradually fade out
  }

  display() {
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
