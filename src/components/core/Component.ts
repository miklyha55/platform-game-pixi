import { Container } from "pixi.js";

export class Component {
  name: string;
  parent: Container;

  constructor(parent: Container) {
    this.parent = parent;
    this.name = this.constructor.name;
  }

  remove() {
    this.onRemove();
  }

  onRemove() {}
}
