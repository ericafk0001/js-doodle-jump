const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let GRAVITY = 0.5;
const keys = {
  left: false,
  right: false,
};

class Doodler {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.height = 60;
    this.width = 60;
    this.velocity = 0;
    this.jumpForce = -15;
    this.speed = 5;
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  draw() {
    ctx.fillStyle = "orange";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (keys.left) {
      this.x -= this.speed;
    }
    if (keys.right) {
      this.x += this.speed;
    }

    this.velocity += GRAVITY;
    this.y += this.velocity;

    // screen wrapping
    if (this.x + this.width < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = -this.width;
  }
}

const doodler = new Doodler();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
    case "A":
    case "ArrowLeft":
      keys.left = true;
      break;
    case "d":
    case "D":
    case "ArrowRight":
      keys.right = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
    case "A":
    case "ArrowLeft":
      keys.left = false;
      break;
    case "d":
    case "D":
    case "ArrowRight":
      keys.right = false;
      break;
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  doodler.update();
  doodler.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
