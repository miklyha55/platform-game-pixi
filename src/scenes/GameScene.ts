import { Camera } from "../camera/Camera";
import BaseScene from "./core/BaseScene";
import { IROContextCfg } from "../types";
import RenderManager from "../managers/renderManager/RenderManager";
import RenderGameTypes from "../constants/events/RenderGameTypes";
import Level from "../gameObjects/Level";

export default class GameScene extends BaseScene {
  camera: Camera;
  level: Level;
  
  constructor(context: IROContextCfg) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderGameTypes);
  }

  onCreate() {
    this.level = this.gameObjectManager.create(new Level(this.context)) as Level;
    console.log(this)
  }
}
