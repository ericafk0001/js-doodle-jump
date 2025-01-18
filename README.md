# Puffy Pixels

Puffy Pixels is a Doodle Jump-inspired platformer game featuring a jumping frog, parallax backgrounds, dynamic platforms, and whimsical bird animations. The game challenges players to achieve high scores by jumping from platform to platform while navigating obstacles and enjoying vibrant visuals.

## Features

- **Parallax Background**: Multi-layered scrolling background for depth and immersion.
- **Dynamic Gameplay**: Procedurally generated platforms with varying gaps.
- **Character Mechanics**: Gravity, smooth jumping, and horizontal screen wrapping.
- **Enemies**: Birds that fly across the screen at higher scores.
- **Audio Effects**: Jump sounds, background music, and game-over sound effects.

## How to Play

1. **Start the Game**: Press `Enter` on the main menu.
2. **Controls**:
   - `Arrow Left` / `A`: Move left.
   - `Arrow Right` / `D`: Move right.
   - `Space`: Restart after game over.
3. Jump on platforms to climb higher and score points. Avoid falling below the screen.

## Screenshot

![a ingame screenshot](https://cloud-9u4xmj5cr-hack-club-bot.vercel.app/0image.png)

## Setup and Installation

1. Clone or download the repository.
2. Ensure the following files and folders are in the correct structure:
   ```
   /sky
     1.png
     2.png
   /clouds
     1.png
     2.png
     3.png
     4.png
     5.png
   /frog
     jump.png
     fall.png
   bird.png
   background.png
   index.html
   script.js
   style.css
   ```
3. Open `index.html` in a browser to play.

## Dependencies

- No external libraries required. The game runs on vanilla JavaScript, HTML5, and Canvas.

## Game Logic Overview

- **Frog Physics**:
  - Gravity applies continuously, pulling the frog downward.
  - Jumping is triggered when landing on platforms or at the start.
- **Platform Management**:
  - Platforms are dynamically added and removed as the frog ascends.
  - Randomized positions ensure replayability.
- **Scoring**:
  - Score increases as the frog moves upward.
- **Birds**:
  - Appear after a certain score threshold and move horizontally across the screen.

## Known Issues

- Rarely, platforms may overlap when the player jumps rapidly.

## Future Enhancements

- Add more enemy types and obstacles.
- Introduce power-ups, such as high jumps or shields.
- Implement mobile-friendly controls.

## Credits

- **Art Assets**: Free Sky Backgrounds by CraftPix, Ninja Frog from Pixel Adventure by Pixel frog, Garden Birds by Pop Shop Packs.
- **SFX**: Universal UI/Menu Soundpack by Cyrex Studios [View](https://cyrex-studios.itch.io/universal-ui-soundpack)

## License

This project is licensed under the MIT License. See `LICENSE` for details.
