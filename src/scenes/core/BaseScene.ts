import { Container, Point } from "pixi.js";
import { IROContext } from "../../types";
import GameEvents from "../../constants/events/GameEvents";
import GameObjectManager from "../../managers/gameObjectsManager/GameObjectManager";
import RenderManager from "../../managers/renderManager/RenderManager";

export default class BaseScene extends Container {
  context: IROContext;
  gameObjectManager: GameObjectManager;
  renderManager: RenderManager;

  constructor(context: IROContext) {
    super();

    this.context = context;

    context.app.stage.on(GameEvents.RESIZE, this.onResize, this);
    this.onResize();
  }

  onResize() {
    this.context.app.deltaScale = Math.max(
      innerWidth / this.context.app.width,
      innerHeight / this.context.app.height
    );
    this.scale = new Point(
      this.context.app.deltaScale,
      this.context.app.deltaScale
    );
  }

  create() {
    this.onCreate();
  }

  onCreate() {}
}
