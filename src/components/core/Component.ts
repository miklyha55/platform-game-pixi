import { Container } from "pixi.js";
import { IROContextCfg } from "../../types";

export class Component {
  name: string;
  parent: Container;
  context: IROContextCfg;

  constructor(parent: Container) {
    this.parent = parent;
    this.name = this.constructor.name;
  }

  remove() {}
  onCreate() {}
  onRemove() {}
}
