import { SCALE_MODES, Sprite } from "pixi.js";
import RenderGameTypes from "../../constants/events/RenderGameTypes";
import GameEvents from "../../constants/events/GameEvents";
import { textures } from "../../configs/loader";
import Point from "../../configs/Point";
import GameObject from "../gameObjectsManager/GameObject";
import { IROContextCfg } from "../../types";

export default class PlaceObject extends GameObject {
  context: IROContextCfg;
  sprite: Sprite;

  speed: number;
  spawnDistance: number;

  isSpawn: boolean;
  isRemove: boolean;

  constructor(context: IROContextCfg) {
    super(context);

    this.speed = this.context.jsons.game.config.speed;
    this.spawnDistance = this.context.jsons.game.blocks.spawnDistance;

    this.isSpawn = false;
    this.isRemove = false;

    this.renderLayer = RenderGameTypes.Blocks;

    this.sprite = this.addChild(new Sprite(textures.block.block1));
    this.sprite.anchor = new Point(0.5, 0.5);
    this.sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    this.scale = new Point(4, 4);
  }

  onCreate() {
    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
  }

  onTicker(dt: number) {
    if (this.isRemove) {
      return;
    }
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

  onRemove() {
    this.isRemove = true;

    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
  }

  removePlaceObject() {}
}
