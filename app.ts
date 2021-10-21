import { Application } from "pixi.js";
import { Ball } from "./Ball";

const stageWidth = 550;
const stageHeight = 400;

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  backgroundColor: 0x0,
  width: stageWidth,
  height: stageHeight,
});

const ball = new Ball();
ball.y = stageHeight * 0.5
ball.x = stageWidth * 0.5

app.stage.addChild(ball);

const ballSpeed = 5;
const halfBallWidth = ball.width * 0.5;
let xVelocity = ballSpeed;
let yVelocity = ballSpeed;

app.ticker.add((delta) => {
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
