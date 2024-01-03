import { IROContext, IVev2 } from "../../../types";
import { Container, Sprite } from "pixi.js";

export interface IROOrientationCfg {
  readonly anchor: IVev2;
  readonly relativePosition: IVev2;
  readonly absolutePosition: IVev2;
  readonly scale: IVev2;
  readonly angle: number;
}

export interface IROResizeCfg {
  readonly context: IROContext;
  readonly parent: Container | Sprite;
  readonly landscape: IROOrientationCfg;
  readonly portrait: IROOrientationCfg;
}
