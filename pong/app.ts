import { Application, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { sound } from "@pixi/sound";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";

enum GameState {
  NEW_GAME,
  PAUSED,
  PLAYING,
  GAME_OVER,
}

let gameState: GameState = GameState.PLAYING;

const stageWidth = 1000;
const stageHeight = 600;

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  backgroundColor: 0x0,
  width: stageWidth,
  height: stageHeight,
});

let pointScoredSoundIndex = 0;
const pointScoredSounds = [
  "cackle3",
  "deeplaugh",
  "hag_idle",
  "wickedlaugh1",
  "lach01",
  "wickedlaugh1",
  "wickedwitchlaugh",
  "witch",
];

for (const pointScoredSound of pointScoredSounds) {
  sound.add(pointScoredSound, `/assets/pong/${pointScoredSound}.mp3`);
}

sound.add("bg-loop", `/assets/pong/2019-06-18_-_Creepy_Vibes_-_David_Fesliyan.mp3`);

var backgroundTexture = Texture.from("/assets/pong/halloween-bg.jpeg");

var background = new Sprite(backgroundTexture);
app.stage.addChild(background);

let playerOneScore = 0;
let playerTwoScore = 0;

const textStyle = new TextStyle({
  stroke: "white",
  fill: "white",
  fontWeight: "bold",
  align: "center",
});

const txtScore = new Text("0:0", textStyle);
txtScore.x = stageWidth * 0.5 - txtScore.width * 0.5;
app.stage.addChild(txtScore);

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
      sound.resumeAll();
      gameState = GameState.PLAYING;
    } else if (gameState === GameState.PLAYING) {
      sound.pauseAll();
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

const ballXAcceleration = 1.1;

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
    const reactionTime = 0;
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

  let paddleCollisionDetected = false;
  if (ballXVelocity < 0) {
    if (
      ball.x <= playerOne.x + playerOne.width &&
      ball.y + halfBallWidth >= playerOne.y &&
      ball.y - halfBallWidth <= playerOne.y + playerOne.height
    ) {
      paddleCollisionDetected = true;
      ballXVelocity *= -1;
      ballXVelocity *= ballXAcceleration;
    }
  } else {
    if (
      ball.x + halfBallWidth >= playerTwo.x &&
      ball.y + halfBallWidth >= playerTwo.y &&
      ball.y - halfBallWidth <= playerTwo.y + playerTwo.height
    ) {
      paddleCollisionDetected = true;
      ballXVelocity *= -1;
      ballXVelocity *= ballXAcceleration;
    }
  }

  if (!paddleCollisionDetected) {
    if (ball.x + halfBallWidth >= stageWidth) {
      handlePlayerOneScored();
    }
    if (ball.x - halfBallWidth <= 0) {
      handlePlayerTwoScored();
    }
  }

  if (ball.y + halfBallWidth >= stageHeight) {
    ballYVelocity = -ballSpeed;
  }
  if (ball.y - halfBallWidth <= 0) {
    ballYVelocity = ballSpeed;
  }
  

  ball.x += ballXVelocity * delta;
  ball.y += ballYVelocity * delta;
});

function handlePlayerOneScored() {
  playerOneScore += 1;
  playScoreSound();
  updateScoreText();
  resetBall();
}

function handlePlayerTwoScored() {
  playerTwoScore += 1;
  playScoreSound();
  updateScoreText();
  resetBall();
}

function playScoreSound() {
  sound.play(pointScoredSounds[pointScoredSoundIndex]);

  pointScoredSoundIndex += 1;
  if (pointScoredSoundIndex >= pointScoredSounds.length) {
    pointScoredSoundIndex = 0;
  }
}

function updateScoreText() {
  txtScore.text = `${playerOneScore}:${playerTwoScore}`;
}

function resetGame() {
  playerOneScore = 0;
  playerTwoScore = 0;
  resetBall();
  updateScoreText();
}

function resetBall() {
  sound.stop("bg-loop");

  setTimeout(() => {
    sound.play("bg-loop");
  }, 1000);

  ballXVelocity = ballSpeed;
  ballYVelocity = ballSpeed;

  ball.y = stageHeight * 0.5;
  ball.x = stageWidth * 0.5;
}
