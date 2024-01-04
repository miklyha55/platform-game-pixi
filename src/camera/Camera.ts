import { Container, Rectangle } from "pixi.js";
import { Tween } from "tweedle.js";
import { Utils } from "../configs/utils";
import GameEvents from "../constants/events/GameEvents";
import { IROContextCfg, IRectangle } from "../types";

export class Camera {
  container: Container;
  target: Container;
  borderBox: Container;
  context: IROContextCfg;

  isUpdateOnlyResize: boolean;

  constructor(context: IROContextCfg, container: Container) {
    this.context = context;
    this.container = container;
    this.isUpdateOnlyResize = true;

    this.borderBox = null;

    context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
    context.app.stage.on(GameEvents.RESIZE, this.onResize, this);

    context.app.stage.on(GameEvents.FOLLOW_CAMERA, this.onFollowCamera, this);
    context.app.stage.on(GameEvents.ZOOM_CAMERA, this.onZoomCamera, this);
  }

  updateTransform() {
    if (this.target) {
      let isHorizontalBorder: boolean = false;
      let isVerticalBorder: boolean = false;

      let offsetBorderX: number = 0;
      let offsetBorderY: number = 0;

      const { innerWidth, innerHeight } = window;

      if (this.borderBox) {
        isHorizontalBorder = this.getBorderBoxProps().isHorizontal;
        isVerticalBorder = this.getBorderBoxProps().isVertical;
        offsetBorderX = this.getBorderBoxProps().offsetX;
        offsetBorderY = this.getBorderBoxProps().offsetY;
      }

      if (!isHorizontalBorder) {
        this.container.x =
          innerWidth / 2 -
          this.target.x * this.container.scale.x * this.context.app.deltaScale;
      } else {
        this.container.x =
          innerWidth / 2 -
          this.target.x * this.container.scale.x * this.context.app.deltaScale -
          offsetBorderX;
      }

      if (!isVerticalBorder) {
        this.container.y =
          innerHeight / 2 -
          this.target.y * this.container.scale.x * this.context.app.deltaScale;
      } else {
        this.container.y =
          innerHeight / 2 -
          this.target.y * this.container.scale.x * this.context.app.deltaScale -
          offsetBorderY;
      }
    }
  }

  onTicker() {
    !this.isUpdateOnlyResize && this.updateTransform();
  }

  onResize() {
    this.isUpdateOnlyResize && this.updateTransform();
  }

  getBorderBoxProps() {
    const rect1: IRectangle = new Rectangle(
      this.borderBox.getGlobalPosition().x - this.container.x,
      this.borderBox.getGlobalPosition().y - this.container.y,
      this.borderBox.getBounds().width,
      this.borderBox.getBounds().height
    );

    const rect2: IRectangle = new Rectangle(
      this.target.x * this.context.app.deltaScale,
      this.target.y * this.context.app.deltaScale,

      this.context.app.renderer.screen.width,
      this.context.app.renderer.screen.height
    );

    return Utils.containsRect(rect1, rect2);
  }

  onFollowCamera({
    target,
    time = 0,
    isUpdateOnlyResize = false,
    borderBox = null,
    callback,
  }) {
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

        if (borderBox) {
          this.borderBox = borderBox;
        }

        this.updateTransform();

        callback instanceof Function && callback();
      })
      .start();
  }

  onZoomCamera({ zoom, time = 300, callback }) {
    new Tween(this.container.scale)
      .to(
        {
          x: zoom,
          y: zoom,
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
