import { Application, Sprite } from "pixi.js";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";

enum GameState {
  NEW_GAME,
  PAUSED,
  PLAYING,
  GAME_OVER,
}

let gameState: GameState = GameState.PAUSED;

const stageWidth = 550;
const stageHeight = 400;

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  backgroundColor: 0x0,
  width: stageWidth,
  height: stageHeight,
});

let playerOneScore = 0;
let playerTwoScore = 0;

const playerSpeed = 6;

const playerOne = new Paddle();
playerOne.x = 5;
playerOne.y = stageHeight * 0.5 - playerOne.height * 0.5;
app.stage.addChild(playerOne);

const playerTwo = new Paddle();
playerTwo.x = stageWidth - 5 - playerTwo.width;
playerTwo.y = stageHeight * 0.5 - playerTwo.height * 0.5;
app.stage.addChild(playerTwo);

const keysPressed = {};
document.addEventListener("keydown", handleKeyDown);
function handleKeyDown(e: KeyboardEvent) {
  keysPressed[e.code] = true;

  if (e.key === "p") {
    if (gameState === GameState.PAUSED) {
      gameState = GameState.PLAYING;
    } else if (gameState === GameState.PLAYING) {
      gameState = GameState.PAUSED;
    }
  }
}

document.addEventListener("keyup", handleKeyUp);
function handleKeyUp(e: KeyboardEvent) {
  keysPressed[e.code] = false;
}

function isKeyDown(code: string) {
  return keysPressed[code];
}

const ball = new Ball();
app.stage.addChild(ball);

resetGame();

const ballSpeed = 5;
const halfBallWidth = ball.width * 0.5;
let ballXVelocity = ballSpeed;
let ballYVelocity = ballSpeed;

let playerTwoYVelocity = 0;
let lastCPUStrategyUpdate = new Date().getTime();

app.ticker.add((delta) => {
  if (gameState === GameState.PAUSED) {
    return;
  }

  if (isKeyDown("ArrowDown")) {
    playerOne.y += playerSpeed * delta;
  }
  if (isKeyDown("ArrowUp")) {
    playerOne.y -= playerSpeed * delta;
  }

  if (ballXVelocity > 0) {
    const currentTime = new Date().getTime();
    const reactionTime = (Math.random() * 200) + 100
    const nextStrategyUpdate = lastCPUStrategyUpdate + reactionTime;
    if (currentTime >= nextStrategyUpdate) {
      const playerTwoMidY = playerTwo.y + playerTwo.height * 0.5;
      if (playerTwoMidY < ball.y) {
        playerTwoYVelocity = playerSpeed;
      } else if (playerTwoMidY > ball.y) {
        playerTwoYVelocity = -playerSpeed;
      } else {
        playerTwoYVelocity = 0;
      }

      lastCPUStrategyUpdate = currentTime;
    }

    playerTwo.y += playerTwoYVelocity * delta;
  }

  if (ballXVelocity < 0) {
    if (
      ball.x <= playerOne.x + playerOne.width &&
      ball.y >= playerOne.y &&
      ball.y <= playerOne.y + playerOne.height
    ) {
      ballXVelocity *= -1;
    }
  } else {
    if (
      ball.x + halfBallWidth >= playerTwo.x &&
      ball.y >= playerTwo.y &&
      ball.y <= playerTwo.y + playerTwo.height
    ) {
      ballXVelocity *= -1;
    }
  }

  ball.x += ballXVelocity * delta;
  ball.y += ballYVelocity * delta;

  if (ball.y + halfBallWidth >= stageHeight) {
    ballYVelocity = -ballSpeed;
  }
  if (ball.y - halfBallWidth <= 0) {
    ballYVelocity = ballSpeed;
  }
  if (ball.x + halfBallWidth >= stageWidth) {
    handlePlayerOneScored();
  }
  if (ball.x - halfBallWidth <= 0) {
    handlePlayerTwoScored();
  }
});

function handlePlayerOneScored() {
  playerOneScore += 1;
  resetGame();
}

function handlePlayerTwoScored() {
  playerTwoScore += 1;
  resetGame();
}

function resetGame() {
  ball.y = stageHeight * 0.5;
  ball.x = stageWidth * 0.5;
}
