import { Container, Sprite } from "pixi.js";
import { Component } from "../core/Component";
import GameEvents from "../../constants/events/GameEvents";
import { IROOrientationCfg, IROResizeCfg } from "./types";
import { IROContextCfg } from "../../types";
import Point from "../../configs/Point";

export class Resize extends Component {
  parent: Container;
  landscape: IROOrientationCfg;
  portrait: IROOrientationCfg;
  context: IROContextCfg;

  constructor({ parent, landscape, portrait, context }: IROResizeCfg) {
    super(parent);

    this.parent = parent;
    this.portrait = portrait;
    this.landscape = landscape;
    this.context = context;

    context.app.stage.on(GameEvents.RESIZE, this.onResize, this);
    this.onResize();
  }

  onRemove() {
    this.context.app.stage.off(GameEvents.RESIZE, this.onResize, this);
  }

  onResize() {
    if (!this.landscape || !this.portrait) {
      console.warn("Please set Resize props to " + this.parent.name);
      return;
    }

    const { innerWidth, innerHeight } = window;
    const isLandscape = innerWidth / innerHeight > 1;
    const orientation: IROOrientationCfg = isLandscape
      ? this.landscape
      : this.portrait;

    if (orientation.absolutePosition) {
      this.parent.x = orientation.absolutePosition.x;
      this.parent.y = orientation.absolutePosition.y;
    }

    if (orientation.anchor && this.parent instanceof Sprite) {
      this.parent.anchor.x = orientation.anchor.x;
      this.parent.anchor.y = orientation.anchor.y;
    }

    if (orientation.relativePosition) {
      const deltaScale: number = Math.max(
        innerWidth / this.context.app.width,
        innerHeight / this.context.app.height
      );

      this.parent.x =
        (innerWidth * orientation.relativePosition.x) / deltaScale;
      this.parent.y =
        (innerHeight * orientation.relativePosition.y) / deltaScale;
    }

    if (orientation.angle !== undefined) {
      this.parent.angle = orientation.angle;
    }

    if (orientation.scale) {
      this.parent.scale = new Point(orientation.scale.x, orientation.scale.y);
    }
  }
}
