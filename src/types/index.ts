import { Application } from "pixi.js";

export interface ICustomApplication extends Application {
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

export interface IROContext {
  readonly app: ICustomApplication;
}
