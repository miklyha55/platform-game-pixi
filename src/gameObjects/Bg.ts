import { SCALE_MODES, Texture, TilingSprite } from "pixi.js";
import GameObject from "../managers/gameObjectsManager/GameObject";
import { IROContextCfg } from "../types";
import { textures } from "../configs/loader";
import Point from "../configs/Point";
import GameEvents from "../constants/GameEvents";
import RenderGameTypes from "../constants/RenderGameTypes";

export default class Bg extends GameObject {
  layers: TilingSprite[];

  counter: number;
  speed: number;
  deltaParalaxSpeed: number;
  direction: number;

  isMove: boolean;

  constructor(context: IROContextCfg) {
    super(context);

    this.layers = [];

    this.counter = 0;
    this.speed = context.jsons.game.speed;
    this.deltaParalaxSpeed = context.jsons.game.bg.deltaParalaxSpeed;
    this.direction = context.jsons.game.bg.direction;

    this.renderLayer = RenderGameTypes.Bg;

    this.isMove = true;
  }

  createLayer(texture: Texture, width: number, height: number) {
    const layer = this.addChild(new TilingSprite(texture, width, height));

    layer.anchor = new Point(0.5, 0.5);
    layer.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    this.layers.push(layer);

    return layer;
  }

  onCreate() {
    const width = 500;
    const height = 288;

    this.context.jsons.game.bg.layers?.forEach((layer) => {
      this.createLayer(textures[layer], width, height);
    });

    this.scale = new Point(6, 6);
    this.position = new Point(0, 200);

    this.layers.reverse();

    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.on(GameEvents.DEATH, this.onDeath, this);
  }

  onDeath() {
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
  }

  onTicker(dt: number) {
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

  onRemove() {
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.off(GameEvents.DEATH, this.onDeath, this);
  }
}
