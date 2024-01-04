import { Container } from "pixi.js";
import { InputCatcher } from "../InputCatcher";
import GameEvents from "../../../constants/events/GameEvents";

export class InputAreaCommand extends InputCatcher {
  constructor(parent: Container) {
    super(parent);
  }

  onPointerDown() {
    this.context.app.stage.emit(GameEvents.JUMP);
  }
  onPointerUp() {}
  onPointerMove() {}
}
