import { ObservablePoint } from "pixi.js";

export default class Point extends ObservablePoint {
  constructor(x: number, y: number) {
    super(null, null, x, y);
  }
}
