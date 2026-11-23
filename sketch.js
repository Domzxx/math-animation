// NEON WAVE — IT3 Math-Based Animation
// Mathematics: y = centerY + amplitude * sin(frequency*x - speed*time + phase)

// Animation settings (the arrow keys change speed and amplitude).
let animationSpeed = 1.0;
let waveAmplitude = 85;
let isPaused = false;
let elapsedTime = 0;
let lastFrameTime = 0;

// The palette changes whenever the user clicks the canvas.
const palettes = [
  { main: [55, 225, 255], second: [153, 91, 255], third: [54, 125, 255] },
  { main: [255, 80, 190], second: [112, 105, 255], third: [255, 155, 220] },
  { main: [80, 255, 190], second: [62, 175, 255], third: [160, 255, 220] }
];
let paletteIndex = 0;

const waveSettings = [
  { amplitudeScale: 1.00, frequency: 0.012, speedScale: 1.00, phase: 0.0, color: "main", weight: 2.5 },
  { amplitudeScale: 0.68, frequency: 0.009, speedScale: 0.78, phase: 1.7, color: "second", weight: 2.0 },
  { amplitudeScale: 0.43, frequency: 0.016, speedScale: 1.22, phase: 3.1, color: "third", weight: 1.7 }
];

function setup() {
  // Create the animation canvas inside the webpage's visualizer panel.
  const canvas = createCanvas(1000, 560);
  canvas.parent("canvas-container");
  pixelDensity(1);
  textFont("Inter");
  lastFrameTime = millis();
}

function draw() {
  const currentTime = millis();
  const deltaSeconds = min((currentTime - lastFrameTime) / 1000, 0.05);
  lastFrameTime = currentTime;

  if (!isPaused) {
    elapsedTime += deltaSeconds * animationSpeed;
  }

  drawBackground();
  drawHeader();
  drawWaveLayers();
  drawParticles();
  drawCenterPulse();
  drawStatus();
}

function drawBackground() {
  background(5, 7, 20);

  // Subtle grid gives the canvas a futuristic instrument-panel look.
  stroke(38, 48, 87, 75);
  strokeWeight(1);
  for (let x = 0; x <= width; x += 50) line(x, 0, x, height);
  for (let y = 0; y <= height; y += 50) line(0, y, width, y);

  // Soft horizontal center guide.
  stroke(75, 95, 150, 45);
  line(35, height / 2, width - 35, height / 2);
}

function drawHeader() {
  noStroke();
  fill(190, 205, 245, 180);
  textSize(12);
  textStyle(BOLD);
  text("SIGNAL / 01", 34, 38);
  textStyle(NORMAL);
  fill(115, 130, 175, 170);
  text("SINE WAVE FIELD", 34, 57);
}

function drawWaveLayers() {
  const centerY = height / 2;

  // Draw three waves. Each wave has a different frequency, phase and speed.
  for (const settings of waveSettings) {
    const colorValues = palettes[paletteIndex][settings.color];
    const currentAmplitude = waveAmplitude * settings.amplitudeScale;

    // First pass: a wide transparent stroke creates the neon glow.
    noFill();
    stroke(colorValues[0], colorValues[1], colorValues[2], 28);
    strokeWeight(settings.weight * 8);
    drawSingleWave(centerY, currentAmplitude, settings, colorValues);

    // Second pass: a sharper line sits on top of the glow.
    stroke(colorValues[0], colorValues[1], colorValues[2], 220);
    strokeWeight(settings.weight);
    drawSingleWave(centerY, currentAmplitude, settings, colorValues);
  }
}

function drawSingleWave(centerY, amplitude, settings, colorValues) {
  noFill();
  beginShape();

  // x is sampled across the canvas. The sine calculation determines every y.
  for (let x = 0; x <= width; x += 4) {
    const angle = settings.frequency * x
                - settings.speedScale * elapsedTime * 2.2
                + settings.phase;

    // Main mathematical relationship: sine controls vertical position.
    const y = centerY + amplitude * sin(angle);
    vertex(x, y);
  }
  endShape();
}

function drawParticles() {
  const centerY = height / 2;
  const colorValues = palettes[paletteIndex].main;

  // Small glowing markers travel along the main wave.
  for (let i = 0; i < 9; i++) {
    const x = (i * 125 + elapsedTime * 85) % width;
    const angle = 0.012 * x - elapsedTime * 2.2;
    const y = centerY + waveAmplitude * sin(angle);

    noStroke();
    fill(colorValues[0], colorValues[1], colorValues[2], 35);
    circle(x, y, 24);
    fill(colorValues[0], colorValues[1], colorValues[2], 230);
    circle(x, y, 5);
  }
}

function drawCenterPulse() {
  const pulse = 1 + 0.13 * sin(elapsedTime * 3);
  const diameter = 13 * pulse;
  const colorValues = palettes[paletteIndex].second;

  noStroke();
  fill(colorValues[0], colorValues[1], colorValues[2], 25);
  circle(width / 2, height / 2, diameter * 5);
  fill(colorValues[0], colorValues[1], colorValues[2], 90);
  circle(width / 2, height / 2, diameter * 2.2);
  fill(235, 240, 255);
  circle(width / 2, height / 2, diameter * 0.65);
}

function drawStatus() {
  const colorValues = palettes[paletteIndex].main;
  noStroke();
  fill(colorValues[0], colorValues[1], colorValues[2], 220);
  textSize(11);
  text("AMPLITUDE  " + nf(waveAmplitude, 1, 0), 34, height - 66);
  text("SPEED  " + nf(animationSpeed, 1, 1) + "x", 34, height - 47);

  fill(160, 174, 210, 190);
  textSize(10);
  text("SPACE: PAUSE   ↑↓: SPEED   ←→: AMPLITUDE   CLICK: COLOR", 34, height - 22);

  if (isPaused) {
    textAlign(CENTER, CENTER);
    fill(245, 245, 255);
    textSize(19);
    text("PAUSED", width / 2, 82);
    textAlign(LEFT, BASELINE);
  }
}

function keyPressed() {
  if (key === " ") {
    isPaused = !isPaused;
    return false; // Prevent the browser from scrolling when SPACE is pressed.
  }

  if (keyCode === UP_ARROW) animationSpeed = min(animationSpeed + 0.2, 3.0);
  if (keyCode === DOWN_ARROW) animationSpeed = max(animationSpeed - 0.2, 0.2);
  if (keyCode === RIGHT_ARROW) waveAmplitude = min(waveAmplitude + 10, 150);
  if (keyCode === LEFT_ARROW) waveAmplitude = max(waveAmplitude - 10, 20);
}

function mousePressed() {
  // Only change the palette when the click is inside the animation canvas.
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    paletteIndex = (paletteIndex + 1) % palettes.length;
  }
}

function windowResized() {
  // Keep the canvas responsive while preserving its 1000:560 proportions.
  const containerWidth = document.getElementById("canvas-container").clientWidth;
  const newWidth = min(1000, containerWidth);
  const newHeight = newWidth * 0.56;
  resizeCanvas(1000, 560);
}
