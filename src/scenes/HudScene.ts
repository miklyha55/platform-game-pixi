import { Container } from "pixi.js";

import BaseScene from "./core/BaseScene";

import RenderHudTypes from "../managers/renderManager/constants/RenderHudTypes";
import RenderManager from "../managers/renderManager/RenderManager";

import InputArea from "../gameObjects/ui/InputArea";
import PressStart from "../gameObjects/ui/PressStart";
import Coins from "../gameObjects/ui/Coins";
import Lives from "../gameObjects/ui/Lives";

import { IROContextCfg } from "../types";

export default class HudScene extends BaseScene {
  private inputArea: Container;
  private pressStart: PressStart;
  private coins: Coins;
  private lives: Lives;

  constructor(context: IROContextCfg) {
    super(context);

    this.renderManager = new RenderManager(this.context, this, RenderHudTypes);
  }

  onCreate() {
    this.inputArea = this.gameObjectManager.create(
      new InputArea(this.context)
    ) as InputArea;
    this.pressStart = this.gameObjectManager.create(
      new PressStart(this.context)
    ) as PressStart;
    this.coins = this.gameObjectManager.create(
      new Coins(this.context)
    ) as Coins;
    this.lives = this.gameObjectManager.create(
      new Lives(this.context)
    ) as Lives;
  }
}
