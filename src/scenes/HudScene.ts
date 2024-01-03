import BaseScene from "./core/BaseScene";
import { IROContext } from "../types";
import RenderManager from "../managers/renderManager/RenderManager";
import RenderHudTypes from "../constants/events/RenderHudTypes";

export default class HudScene extends BaseScene {
  constructor(context: IROContext) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderHudTypes);
  }

  onCreate() {}
}
