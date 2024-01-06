import { Container } from "pixi.js";

import Point from "../../configs/Point";

import GameEvents from "../../constants/GameEvents";

import GameObjectManager from "../../managers/gameObjectsManager/GameObjectManager";
import RenderManager from "../../managers/renderManager/RenderManager";

import { IROContextCfg } from "../../types";

export default class BaseScene extends Container {
  gameObjectManager: GameObjectManager;
  renderManager: RenderManager;

  protected readonly context: IROContextCfg;

  constructor(context: IROContextCfg) {
    super();

    this.context = context;

    context.app.stage.on(GameEvents.RESIZE, this.onResize, this);
    this.onResize();
  }

  create() {
    this.onCreate();
  }

  onCreate() {}

  private onResize() {
    this.context.app.deltaScale = Math.max(
      innerWidth / this.context.app.width,
      innerHeight / this.context.app.height
    );
    this.scale = new Point(
      this.context.app.deltaScale,
      this.context.app.deltaScale
    );
  }
}
