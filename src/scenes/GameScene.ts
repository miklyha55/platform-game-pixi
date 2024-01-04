import { Camera } from "../camera/Camera";
import BaseScene from "./core/BaseScene";
import { IROContextCfg } from "../types";
import RenderManager from "../managers/renderManager/RenderManager";
import RenderGameTypes from "../constants/events/RenderGameTypes";
import Level from "../gameObjects/Level";
import GameEvents from "../constants/events/GameEvents";

export default class GameScene extends BaseScene {
  camera: Camera;
  level: Level;

  constructor(context: IROContextCfg) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderGameTypes);
    context.app.stage.on(GameEvents.RESET_LEVEL, this.onResetLevel, this);
  }

  create() {
    this.level = new Level(this.context, this.gameObjectManager);
    this.level.create();
  }

  onCreate() {
    this.create();
  }

  onResetLevel() {
    this.level.remove();
    this.create();
  }
}
