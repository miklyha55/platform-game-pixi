import { SCALE_MODES, Sprite, Texture } from "pixi.js";

import Point from "../../../configs/Point";

import GameEvents from "../../../constants/GameEvents";

import RenderGameTypes from "../../renderManager/constants/RenderGameTypes";
import GameObject from "../../gameObjectsManager/GameObject";

import { IROContextCfg } from "../../../types";

export default class PlaceObject extends GameObject {
  sprite: Sprite;
  type: number;
  texture: Texture;

  private readonly speed: number;
  private readonly spawnDistance: number;

  private isSpawn: boolean;

  constructor(context: IROContextCfg) {
    super(context);

    this.speed = this.context.jsons.game.speed;
    this.spawnDistance = this.context.jsons.game.blocks.spawnDistance;

    this.isSpawn = false;

    this.renderLayer = RenderGameTypes.Blocks;
  }

  createSprite() {
    this.sprite = this.addChild(new Sprite(this.texture));
    this.sprite.anchor = new Point(0.5, 0.5);
    this.sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  }

  removePlaceObject() {}

  override onCreate() {
    this.context.app.stage.on(GameEvents.DEATH, this.onDeath, this);
    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
  }

  protected onDeath() {
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
  }

  protected onTicker(dt: number) {
    const scaleBg: number = 6;

    this.position.x -= this.speed * scaleBg * dt;
    const spawnPositionX: number = -(
      this.spawnDistance / this.context.jsons.game.blocks.countBlocksOnScreen -
      this.spawnDistance / 2
    );

    if (this.position.x < spawnPositionX && !this.isSpawn) {
      this.isSpawn = true;

      this.context.app.stage.emit(GameEvents.SPAWN_PLACE_OBJECT);
    }

    if (this.position.x < -this.spawnDistance / 2) {
      this.removePlaceObject();
    }
  }

  override onRemove() {
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.off(GameEvents.DEATH, this.onDeath, this);
  }
}
