import { sound } from "@pixi/sound";

import { Camera } from "../camera/Camera";

import BaseScene from "./core/BaseScene";

import GameEvents from "../constants/GameEvents";

import RenderGameTypes from "../managers/renderManager/constants/RenderGameTypes";
import RenderManager from "../managers/renderManager/RenderManager";

import Level1 from "../gameObjects/levels/Level1";

import { IROContextCfg } from "../types";

export default class GameScene extends BaseScene {
  camera: Camera;
  private level: Level1;

  constructor(context: IROContextCfg) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderGameTypes);
    context.app.stage.on(GameEvents.RESET_LEVEL, this.onResetLevel, this);
    context.app.stage.on(GameEvents.DEATH, this.onDeath, this);
  }

  init() {
    this.level = new Level1(this.context, this.gameObjectManager);
    this.level.create();
    sound.play("music", { loop: true, volume: 0.5 });

    sound.play("may");
  }

  onCreate() {
    this.init();
  }

  onResetLevel() {
    this.level.remove();
    this.init();
  }

  onDeath() {
    sound.stop("music");
  }
}
