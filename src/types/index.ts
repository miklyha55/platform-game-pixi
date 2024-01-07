import { Application } from "pixi.js";

export interface ICustomApplicationCfg extends Application {
  width?: number;
  height?: number;
  deltaScale?: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IVev2 {
  x: number;
  y: number;
}

export interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IROContextCfg {
  readonly app: ICustomApplicationCfg;
  readonly jsons: IROJsonCfg;
}

export interface IROJsonCfg {
  readonly game: {
    readonly speed: number;
    readonly bg: {
      readonly deltaParalaxSpeed: number;
      readonly direction: number;
      readonly layers: string[];
    };
    readonly blocks: {
      readonly spawnDistance: number;
      readonly countBlocksOnScreen: number;
      readonly spawnPositionsY: number[];
    };
    readonly character: {
      readonly livesCounter: number;
      readonly speed: IVev2;
      readonly terminalVelocity: IVev2;
      readonly jumpVelocity: IVev2;
      readonly jumpVelocityDeath: IVev2;
      readonly animations: string[][];
    };
    readonly ai: {
      readonly deltaCloser: number;
      readonly deltaCloserBack: number;
      readonly terminalVelocity: IVev2;
      readonly animations: string[][];
    };
  };
}
