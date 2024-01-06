import { Container } from "pixi.js";
import { Component } from "../core/Component";

export class InputCatcher extends Component {
  constructor(parent: Container) {
    super(parent);
  }

  onCreate() {
    this.parent.interactive = true;

    this.parent.on("pointerdown", this.onPointerDown, this);
    this.parent.on("pointerup", this.onPointerUp, this);
    this.parent.on("pointermove", this.onPointerMove, this);
    this.parent.on("pointermove", this.onPointerMove, this);
  }

  onRemove() {
    this.parent.off("pointerdown", this.onPointerDown, this);
    this.parent.off("pointerup", this.onPointerUp, this);
    this.parent.off("pointermove", this.onPointerMove, this);
  }

  onPointerDown(event: Event) {}
  onPointerUp(event: Event) {}
  onPointerMove(event: Event) {}
}
