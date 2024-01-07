import { SCALE_MODES, Texture, TilingSprite } from "pixi.js";

import { textures } from "../../configs/loader";
import Point from "../../configs/Point";

import GameEvents from "../../constants/GameEvents";

import GameObject from "../../managers/gameObjectsManager/GameObject";
import RenderGameTypes from "../../managers/renderManager/constants/RenderGameTypes";

import { IROContextCfg } from "../../types";

export default class Bg extends GameObject {
  private layers: TilingSprite[];
  private counter: number;

  private readonly speed: number;
  private readonly deltaParalaxSpeed: number;
  private readonly direction: number;

  private isMove: boolean;

  constructor(context: IROContextCfg) {
    super(context);

    this.layers = [];
    this.counter = 0;

    this.speed = context.jsons.game.speed;
    this.deltaParalaxSpeed = context.jsons.game.bg.deltaParalaxSpeed;
    this.direction = context.jsons.game.bg.direction;

    this.isMove = true;

    this.renderLayer = RenderGameTypes.Bg;
  }

  private createLayer(texture: Texture, width: number, height: number) {
    const layer = this.addChild(new TilingSprite(texture, width, height));

    layer.anchor = new Point(0.5, 0.5);
    layer.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    this.layers.push(layer);

    return layer;
  }

  override onCreate() {
    this.context.jsons.game.bg.layers?.forEach((layer) => {
      this.createLayer(textures[layer], 500, 288);
    });

    this.scale = new Point(6, 6);
    this.position = new Point(0, 200);

    this.layers.reverse();

    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.on(GameEvents.DEATH, this.onDeath, this);
  }

  private onDeath() {
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
  }

  private onTicker(dt: number) {
    if (!this.isMove) {
      return;
    }
    this.counter -= this.speed * dt;

    this.layers.forEach((layer, index) => {
      layer.tilePosition = new Point(
        this.counter * this.direction * (index * this.deltaParalaxSpeed || 1),
        0
      );
    });
  }

  override onRemove() {
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.off(GameEvents.DEATH, this.onDeath, this);
  }
}
