let k;

function setup() {
  createCanvas(710, 400);
  frameRate(15); // Slows down the animation for a smoother effect
  k = new KochFractal();
}

function draw() {
  background(0);

  // Update start and end positions to move around
  k.start.x = width / 2 - 200 + sin(frameCount * 0.01) * 100;
  k.start.y = height / 2 + cos(frameCount * 0.01) * 100;
  k.end.x = width / 2 + 200 + cos(frameCount * 0.01) * 100;
  k.end.y = height / 2 + sin(frameCount * 0.01) * 100;

  // Draw and animate the Koch snowflake
  k.render();
  k.smoothTransition();
  if (k.getCount() > 5) {
    k.restart();
  }
}

class KochLine {
  constructor(a, b, opacity = 0) {
    this.start = a.copy();
    this.end = b.copy();
    this.opacity = opacity; // Initial opacity
  }

  display() {
    stroke(255, this.opacity); // Use opacity for smooth transitions
    line(this.start.x, this.start.y, this.end.x, this.end.y);
    if (this.opacity < 255) this.opacity += 15; // Gradually increase opacity
  }

  kochA() { return this.start.copy(); }
  kochB() { let v = p5.Vector.sub(this.end, this.start); v.div(3); v.add(this.start); return v; }
  kochC() { let a = this.start.copy(); let v = p5.Vector.sub(this.end, this.start); v.div(3); a.add(v); v.rotate(-PI / 3); a.add(v); return a; }
  kochD() { let v = p5.Vector.sub(this.end, this.start); v.mult(2 / 3.0); v.add(this.start); return v; }
  kochE() { return this.end.copy(); }
}

class KochFractal {
  constructor() {
    this.start = createVector(0, height - 20);
    this.end = createVector(width, height - 20);
    this.lines = [];
    this.count = 0;
    this.restart();
  }

  nextLevel() {
    this.lines = this.iterate(this.lines);
    this.count++;
  }

  restart() {
    this.count = 0;
    this.lines = [];
    this.lines.push(new KochLine(this.start, this.end, 0));
  }

  getCount() {
    return this.count;
  }

  render() {
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].display();
    }
  }

  smoothTransition() {
    if (frameCount % 30 === 0) {
      this.nextLevel();
    }
  }

  iterate(before) {
    let now = [];
    for (let i = 0; i < this.lines.length; i++) {
      let l = this.lines[i];
      let a = l.kochA();
      let b = l.kochB();
      let c = l.kochC();
      let d = l.kochD();
      let e = l.kochE();
      // Generate new lines with initial opacity for smooth fade-in
      now.push(new KochLine(a, b, 0));
      now.push(new KochLine(b, c, 0));
      now.push(new KochLine(c, d, 0));
      now.push(new KochLine(d, e, 0));
    }
    return now;
  }
}
