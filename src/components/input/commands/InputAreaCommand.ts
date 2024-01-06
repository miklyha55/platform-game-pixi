import { Container } from "pixi.js";
import { InputCatcher } from "../InputCatcher";
import GameEvents from "../../../constants/GameEvents";

export class InputAreaCommand extends InputCatcher {
  constructor(parent: Container) {
    super(parent);
  }

  override onPointerDown() {
    this.context.app.stage.emit(GameEvents.JUMP);
  }
}
