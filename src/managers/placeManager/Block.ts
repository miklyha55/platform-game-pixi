import PlaceObject from "./core/PlaceObject";

import { textures } from "../../configs/loader";
import Point from "../../configs/Point";

import PlaceObjectType from "./constants";

import { IROContextCfg } from "../../types";

export default class Block extends PlaceObject {
  constructor(context: IROContextCfg) {
    super(context);

    this.type = PlaceObjectType.Block;
    this.texture = textures.block;

    this.scale = new Point(4, 4);

    this.createSprite();
  }
}
