import { Container } from "pixi.js";
import BaseScene from "./core/BaseScene";
import RenderHudTypes from "../constants/RenderHudTypes";
import RenderManager from "../managers/renderManager/RenderManager";
import InputArea from "../gameObjects/InputArea";
import { IROContextCfg } from "../types";

export default class HudScene extends BaseScene {
  inputArea: Container;

  constructor(context: IROContextCfg) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderHudTypes);
  }

  onCreate() {
    this.inputArea = this.gameObjectManager.create(new InputArea(this.context)) as InputArea;
  }
}
