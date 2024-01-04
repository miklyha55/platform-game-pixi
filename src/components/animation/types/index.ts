import { Container, Texture } from "pixi.js";

export interface IROAnimationCfg {
  readonly parent: Container;
  readonly animations: Texture[][];
  readonly currentAnimationName: number;
}
