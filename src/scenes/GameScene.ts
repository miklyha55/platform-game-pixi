import { Camera } from "../camera/Camera";
import BaseScene from "./core/BaseScene";
import { IROContext } from "../types";
import RenderManager from "../managers/renderManager/RenderManager";
import RenderGameTypes from "../constants/events/RenderGameTypes";
import Bg from "../gameObjects/Bg";

export default class GameScene extends BaseScene {
  camera: Camera;
  bg: Bg;
  
  constructor(context: IROContext) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderGameTypes);
  }

  onCreate() {
    this.bg = this.gameObjectManager.create(new Bg(this.context)) as Bg;
  }
}
