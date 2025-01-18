const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 680;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;

const jumpSound = document.getElementById("jumpSound");
const startSound = document.getElementById("startSound");
const restartSound = document.getElementById("restartSound");
const gameOverSound = document.getElementById("gameOverSound");

const backgroundImage = new Image();
backgroundImage.src = "sky/1.png";

const clouds = [];
const cloudPaths = [
  "clouds/1.png",
  "clouds/2.png",
  "clouds/3.png",
  "clouds/4.png",
  "clouds/5.png",
  "clouds/6.png",
  "clouds/7.png",
  "clouds/8.png",
];

cloudPaths.forEach((path, index) => {
  clouds[index] = new Image();
  clouds[index].src = path;
});

const froggyJump = new Image();
froggyJump.src = "frog/jump.png";

const froggyFall = new Image();
froggyFall.src = "frog/fall.png";

const PLATFORM_WIDTH = 140;
const PLATFORM_HEIGHT = 76;
const PLATFORM_GAP = 195;
const PLATFORM_COUNT = 12;
const GRAVITY = 0.5; // Made constant since it shouldn't change
const INITIAL_JUMP_FORCE = -15; // Reduced jump force
const MOVEMENT_SPEED = 8; // Reduced horizontal speed

let score = 0;

let platforms = [];

const keys = {
  left: false,
  right: false,
};

class Froggy {
  constructor() {
    this.width = 70;
    this.height = 70;
    this.x = canvas.width / 2 - this.width / 2; // Center properly
    this.y = canvas.height / 2;
    this.velocity = 0;
    this.jumpForce = INITIAL_JUMP_FORCE;
    this.speed = MOVEMENT_SPEED;
    this.isJumping = false; // Add jump state
  }

  jump() {
    if (!this.isJumping) {
      jumpSound.volume = 0.5;
      jumpSound.pause();
      jumpSound.currentTime = 0;
      jumpSound.play();
      this.velocity = this.jumpForce;
      this.isJumping = true;
    }
  }

  draw() {
    ctx.save();

    let imageToDraw;
    if (this.isJumping) {
      imageToDraw = froggyJump;
    } else {
      imageToDraw = froggyFall;
    }

    if (this.facingLeft) {
      // Flip horizontally
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
      ctx.drawImage(imageToDraw, 0, 0, this.width, this.height);
    } else {
      ctx.drawImage(imageToDraw, this.x, this.y, this.width, this.height);
    }

    ctx.restore();
  }

  checkPlatformCollision() {
    if (this.velocity > 0) {
      this.isJumping = false;
      // Only check when falling
      for (const platform of platforms) {
        const isColliding =
          this.y + this.height >= platform.y &&
          this.y + this.height <= platform.y + platform.height &&
          this.x + this.width > platform.x &&
          this.x < platform.x + platform.width;

        if (isColliding) {
          this.y = platform.y - this.height; // Set exact position
          this.isJumping = false;
          this.jump();
          return; // Exit after first collision
        }
      }
    }
  }

  update() {
    // Handle horizontal movement
    if (keys.left) {
      this.facingLeft = true;
      this.x -= this.speed;
    }
    if (keys.right) {
      this.facingLeft = false;
      this.x += this.speed;
    }

    // Apply gravity
    this.velocity += GRAVITY;
    this.y += this.velocity;

    // Screen wrapping
    if (this.x + this.width < 0) {
      this.x = canvas.width;
    }
    if (this.x > canvas.width) {
      this.x = -this.width;
    }

    // Camera scrolling when player goes above middle
    const screenMiddle = canvas.height / 2;
    if (this.y < screenMiddle) {
      const diff = screenMiddle - this.y;
      this.y = screenMiddle;

      // Move platforms down
      platforms.forEach((platform) => {
        platform.y += diff;
      });
      score += 3;
    }

    this.checkPlatformCollision();

    if (this.velocity > -2) {
      checkLosingCondition();
    }
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PLATFORM_WIDTH;
    this.height = PLATFORM_HEIGHT;

    this.cloudIndex = Math.floor(Math.random() * clouds.length);
  }

  draw() {
    ctx.drawImage(
      clouds[this.cloudIndex],
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

function generatePlatforms() {
  platforms = [];

  // first platform is under the player
  platforms.push(
    new Platform(canvas.width / 2 - PLATFORM_WIDTH / 2, canvas.height / 2 + 100)
  );

  for (let i = 1; i < PLATFORM_COUNT; i++) {
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

const froggy = new Froggy();

// Event listeners
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
    case " ":
      if (isGameOver) {
        restartSound.play();
        isGameOver = false;
        resetGame();
      }
      break;
    case "Enter":
      if (onMainMenu) {
        startSound.pause();
        startSound.currentTime = 0;
        startSound.play();
        onMainMenu = false;
        gameLoop();
      }
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

let animationFrameId;
let isGameOver = false;

function checkLosingCondition() {
  if (froggy.y > canvas.height - 69) {
    gameOverSound.play();
    isGameOver = true;
    cancelAnimationFrame(animationFrameId);
    console.log("Player Lost");

    ctx.fillStyle = "rgba(0, 0, 0, 0.69)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText(
      "Press SPACE to restart",
      canvas.width / 2,
      canvas.height / 2 + 80
    );
    score = 0;
  }
}

function resetGame() {
  froggy.x = canvas.width / 2 - froggy.width / 2;
  froggy.y = canvas.height / 2;
  froggy.velocity = 0;
  froggy.jumpForce = INITIAL_JUMP_FORCE;

  generatePlatforms();
  gameLoop();
}

function updateScore() {
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, canvas.width / 2, 69);
}

const FPS = 75;
const FRAME_INTERVAL = 1000 / FPS;
let lastFrameTime = 0;

function gameLoop(timestamp) {
  if (!isGameOver && !onMainMenu) {
    const deltaTime = timestamp - lastFrameTime;

    if (deltaTime >= FRAME_INTERVAL) {
      lastFrameTime = timestamp - (deltaTime % FRAME_INTERVAL);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      updatePlatforms();
      platforms.forEach((platform) => platform.draw());

      froggy.update();
      froggy.draw();
    }
    updateScore();
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

let onMainMenu;

function mainMenu() {
  onMainMenu = true;

  ctx.fillStyle = "rgb(0, 85, 255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Puffy Pixels", canvas.width / 2, canvas.height / 2);
  ctx.fillText(
    "Press ENTER to Start",
    canvas.width / 2,
    canvas.height / 2 + 60
  );
}

const music = document.getElementById("music");
music.volume = 0.09;
music.loop = true;
music.play();

mainMenu();

console.log("hi");
