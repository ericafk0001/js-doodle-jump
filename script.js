const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let GRAVITY = 0.5;

class Doodler {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.height = 60;
    this.width = 60;
    this.velocity = 0;
    this.jumpForce = -15;
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  draw() {
    ctx.fillStyle = "orange";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.velocity += GRAVITY;
    this.y += this.velocity;
  }
}

const doodler = new Doodler();

window.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "W" || e.key === " ") {
    doodler.jump();
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  doodler.update();
  doodler.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
