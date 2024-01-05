import { Container } from "pixi.js";
import { Tween } from "tweedle.js";
import GameEvents from "../constants/GameEvents";
import { IROContextCfg } from "../types";

export class Camera {
  container: Container;
  target: Container;
  context: IROContextCfg;

  isUpdateOnlyResize: boolean;

  constructor(context: IROContextCfg, container: Container) {
    this.context = context;
    this.container = container;
    this.isUpdateOnlyResize = true;

    context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
    context.app.stage.on(GameEvents.RESIZE, this.onResize, this);

    context.app.stage.on(GameEvents.FOLLOW_CAMERA, this.onFollowCamera, this);
    context.app.stage.on(GameEvents.ZOOM_CAMERA, this.onZoomCamera, this);
  }

  updateTransform() {
    if (this.target) {
      const { innerWidth, innerHeight } = window;

      this.container.x =
        innerWidth / 2 -
        this.target.x * this.container.scale.x * this.context.app.deltaScale;

      this.container.y =
        innerHeight / 2 -
        this.target.y * this.container.scale.x * this.context.app.deltaScale;
    }
  }

  onTicker() {
    !this.isUpdateOnlyResize && this.updateTransform();
  }

  onResize() {
    this.isUpdateOnlyResize && this.updateTransform();
  }

  onFollowCamera({ target, time = 0, isUpdateOnlyResize = false, callback }) {
    const x =
      innerWidth / 2 -
      target.x * this.container.scale.x * this.context.app.deltaScale;
    const y =
      innerHeight / 2 -
      target.y * this.container.scale.y * this.context.app.deltaScale;

    new Tween(this.container)
      .to({ x, y }, time)
      .onComplete(() => {
        this.target = target;
        this.isUpdateOnlyResize = isUpdateOnlyResize;

        this.updateTransform();

        callback instanceof Function && callback();
      })
      .start();
  }

  onZoomCamera({ zoom, time = 300, callback }) {
    new Tween(this.container.scale)
      .to(
        {
          x: zoom * this.context.app.deltaScale,
          y: zoom * this.context.app.deltaScale,
        },
        time
      )
      .onComplete(() => {
        callback instanceof Function && callback();
      })
      .onUpdate(this.updateTransform)
      .start();
  }
}
