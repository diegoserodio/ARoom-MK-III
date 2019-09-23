class Clock {
  constructor() {
    this.cx;
    this.cy;
    this.radius = min(width, height) / 5;
    this.secondsRadius = this.radius * 0.71;;
    this.minutesRadius = this.radius * 0.6;;
    this.hoursRadius = this.radius * 0.5;;
    this.clockDiameter = this.radius * 1.7;;

    this.cx = width*3.5/4;
    this.cy = height / 4;
    stroke(255);
  }

  draw(){
    // Draw the clock background
    noStroke();
    // fill(244, 122, 158);
    fill(100);
    ellipse(this.cx, this.cy, this.clockDiameter + 25, this.clockDiameter + 25);
    fill(50);
    ellipse(this.cx, this.cy, this.clockDiameter, this.clockDiameter);

    // Angles for sin() and cos() start at 3 o'clock;
    // subtract HALF_PI to make them start at the top
    let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
    let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
    let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

    // Draw the hands of the clock
    stroke(255);
    strokeWeight(1);
    line(this.cx, this.cy, this.cx + cos(s) * this.secondsRadius, this.cy + sin(s) * this.secondsRadius);
    strokeWeight(2);
    line(this.cx, this.cy, this.cx + cos(m) * this.minutesRadius, this.cy + sin(m) * this.minutesRadius);
    strokeWeight(4);
    line(this.cx, this.cy, this.cx + cos(h) * this.hoursRadius, this.cy + sin(h) * this.hoursRadius);

    // Draw the minute ticks
    strokeWeight(2);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 6) {
      let angle = radians(a);
      let x = this.cx + cos(angle) * this.secondsRadius;
      let y = this.cy + sin(angle) * this.secondsRadius;
      vertex(x, y);
    }
    endShape();
    }
}
