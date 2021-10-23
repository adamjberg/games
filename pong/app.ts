import { Application } from "pixi.js";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";

enum GameState {
  NEW_GAME,
  PAUSED,
  PLAYING,
  GAME_OVER
};

let gameState: GameState = GameState.PLAYING;

const stageWidth = 550;
const stageHeight = 400;

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  backgroundColor: 0x0,
  width: stageWidth,
  height: stageHeight,
});

const playerOne = new Paddle();
const playerSpeed = 8;
app.stage.addChild(playerOne);

const keysPressed = {};
document.addEventListener('keydown', handleKeyDown);
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

document.addEventListener('keyup', handleKeyUp);
function handleKeyUp(e: KeyboardEvent) {
  keysPressed[e.code] = false;
}

function isKeyDown(code: string) {
  return keysPressed[code];
}

const ball = new Ball();
ball.y = stageHeight * 0.5
ball.x = stageWidth * 0.5

app.stage.addChild(ball);

const ballSpeed = 5;
const halfBallWidth = ball.width * 0.5;
let xVelocity = ballSpeed;
let yVelocity = ballSpeed;

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

  ball.x += xVelocity * delta;
  ball.y += yVelocity * delta;

  if (ball.y + halfBallWidth >= stageHeight) {
    yVelocity = -ballSpeed;
  }
  if (ball.y - halfBallWidth <= 0) {
    yVelocity = ballSpeed;
  }
  if (ball.x + halfBallWidth >= stageWidth) {
    xVelocity = -ballSpeed;
  }
  if (ball.x - halfBallWidth <= 0) {
    xVelocity = ballSpeed;
  }
})
