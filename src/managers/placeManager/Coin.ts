import PlaceObject from "./core/PlaceObject";

import { textures } from "../../configs/loader";
import Point from "../../configs/Point";

import PlaceObjectType from "./constants";

import { IROContextCfg } from "../../types";

export default class Coin extends PlaceObject {
  constructor(context: IROContextCfg) {
    super(context);

    this.type = PlaceObjectType.Collectable;
    this.texture = textures.coin;

    this.scale = new Point(6, 6);

    this.createSprite();
  }
}
