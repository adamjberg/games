import { Container, Graphics } from "pixi.js";

export class Paddle extends Container {
  constructor() {
    super();

    const graphics = new Graphics();
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(0, 0, 20, 100);
    graphics.endFill();
    this.addChild(graphics)
  }
}