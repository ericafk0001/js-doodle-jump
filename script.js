const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 680;
canvas.height = window.innerHeight;

const PLATFORM_WIDTH = 125;
const PLATFORM_HEIGHT = 30;
const PLATFORM_GAP = 100;
const PLATFORM_COUNT = 12;
let platforms = [];

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
    this.speed = 10;

    this.startY = canvas.height / 2;
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  draw() {
    ctx.fillStyle = "orange";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkPlatformCollision() {
    if (this.velocity > 0) {
      // Only check when falling
      platforms.forEach((platform) => {
        if (
          this.y + this.height >= platform.y &&
          this.y + this.height <= platform.y + platform.height &&
          this.x + this.width >= platform.x &&
          this.x <= platform.x + platform.width
        ) {
          this.jump();
        }
      });
    }
  }

  update() {
    if (keys.left) {
      this.x -= this.speed;
    }
    if (keys.right) {
      this.x += this.speed;
    }

    this.velocity += GRAVITY;

    if (this.y < this.startY) {
      const diff = this.startY - this.y;
      this.y = this.startY;
      platforms.forEach((platform) => {
        platform.y += diff;
      });
    } else {
      this.y += this.velocity;
    }

    this.checkPlatformCollision();

    // screen wrapping
    if (this.x + this.width < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = -this.width;
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PLATFORM_WIDTH;
    this.height = PLATFORM_HEIGHT;
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function generatePlatforms() {
  platforms = []; // Clear existing platforms
  for (let i = 0; i < PLATFORM_COUNT; i++) {
    const x = Math.random() * (canvas.width - PLATFORM_WIDTH);
    const y = canvas.height - i * PLATFORM_GAP;
    platforms.push(new Platform(x, y));
  }
}

function updatePlatforms() {
  // Remove platforms that are below screen
  platforms = platforms.filter((platform) => platform.y < canvas.height + 100);

  // Generate new platforms at top
  while (platforms.length < PLATFORM_COUNT) {
    const x = Math.random() * (canvas.width - PLATFORM_WIDTH);
    const y = platforms[platforms.length - 1].y - PLATFORM_GAP;
    platforms.push(new Platform(x, y));
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

generatePlatforms();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlatforms();
  platforms.forEach((platform) => platform.draw());
  doodler.update();
  doodler.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
