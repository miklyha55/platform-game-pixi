import { Container } from "pixi.js";
import { InputCatcher } from "../InputCatcher";

export class InputAreaCommand extends InputCatcher {
  constructor(parent: Container) {
    super(parent);
  }

  onPointerDown() {}
  onPointerUp() {}
  onPointerMove() {}
}
