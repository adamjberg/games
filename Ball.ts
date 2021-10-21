import { Container, Graphics } from "pixi.js";

export class Ball extends Container {
  constructor() {
    super();

    const graphics = new Graphics();
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(-10, -10, 20, 20);
    graphics.endFill();
    
    this.addChild(graphics);
  }
}