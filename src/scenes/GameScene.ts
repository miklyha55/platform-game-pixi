import { Camera } from "../camera/Camera";
import BaseScene from "./core/BaseScene";
import { IROContext } from "../types";
import RenderManager from "../managers/renderManager/RenderManager";
import RenderGameTypes from "../constants/events/RenderGameTypes";

export default class GameScene extends BaseScene {
  camera: Camera;
  
  constructor(context: IROContext) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderGameTypes);
  }

  onCreate() {}
}
