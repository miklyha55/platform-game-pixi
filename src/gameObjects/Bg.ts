import { SCALE_MODES, Texture, TilingSprite } from "pixi.js";
import GameObject from "../managers/gameObjectsManager/GameObject";
import { IROContext } from "../types";
import { textures } from "../configs/loader";
import RenderGameTypes from "../constants/events/RenderGameTypes";
import Point from "../configs/Point";
import GameEvents from "../constants/events/GameEvents";

export default class Bg extends GameObject {
  layers: TilingSprite[];

  counter: number;
  speed: number;
  deltaSpeed: number;
  direction: number;

  isMove: boolean;

  constructor(context: IROContext) {
    super(context);

    this.layers = [];

    this.counter = 0;
    this.speed = 0.5;
    this.deltaSpeed = 0.3;
    this.direction = -1;

    this.isMove = false;

    this.renderLayer = RenderGameTypes.Game;
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

    this.createLayer(textures.bg1, width, height);
    this.createLayer(textures.bg2, width, height);

    this.scale = new Point(6, 6);
    this.position = new Point(0, 200);

    this.layers.reverse();
    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
  }

  onTicker() {
    if (!this.isMove) {
      return;
    }
    this.counter += this.speed;

    this.layers.forEach((layer, index) => {
      layer.tilePosition = new Point(
        this.counter * this.direction * (index * this.deltaSpeed || 1),
        0
      );
    });
  }

  onRemove() {
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
  }
}
