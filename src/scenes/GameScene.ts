import { Camera } from "../camera/Camera";
import BaseScene from "./core/BaseScene";
import RenderGameTypes from "../constants/RenderGameTypes";
import GameEvents from "../constants/GameEvents";
import RenderManager from "../managers/renderManager/RenderManager";
import Level from "../gameObjects/Level";
import { IROContextCfg } from "../types";

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
