import { Point } from "pixi.js";
import { IVev2, IRectangle } from "../types";

export const Utils = {
  add: (vec1: IVev2, vec2: IVev2) => {
    return {
      x: vec1.x + vec2.x,
      y: vec1.y + vec2.y,
    };
  },

  sub: (vec1: IVev2, vec2: IVev2) => {
    return {
      x: vec1.x - vec2.x,
      y: vec1.y - vec2.y,
    };
  },

  mul: (vec: IVev2, number: number) => {
    return {
      x: vec.x * number,
      y: vec.y * number,
    };
  },

  mag: (vec: IVev2) => {
    return Math.abs(Math.sqrt(vec.x * vec.x + vec.y * vec.y));
  },

  normalize: (vec: IVev2) => {
    return {
      x: vec.x / Math.abs(Math.sqrt(vec.x * vec.x + vec.y * vec.y)),
      y: vec.y / Math.abs(Math.sqrt(vec.x * vec.x + vec.y * vec.y)),
    };
  },

  delay: (ms: number = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  getTwoPointsAngle(vec1: IVev2, vec2: IVev2) {
    const vec: IVev2 = {
      x: vec1.x - vec2.x,
      y: vec1.y - vec2.y,
    };

    let theta: number = Math.atan2(vec.y, vec.x);
    theta *= 180 / Math.PI;

    return theta;
  },

  containsRect(rect1: IRectangle, rect2: IRectangle) {
    const a1: IVev2 = new Point(
      rect1.x - rect1.width / 2,
      rect1.y - rect1.height / 2
    );
    const b1: IVev2 = new Point(
      rect1.x - rect1.width / 2,
      rect1.y + rect1.height / 2
    );
    const c1: IVev2 = new Point(
      rect1.x + rect1.width / 2,
      rect1.y + rect1.height / 2
    );
    const d1: IVev2 = new Point(
      rect1.x + rect1.width / 2,
      rect1.y - rect1.height / 2
    );

    const a2: IVev2 = new Point(
      rect2.x - rect2.width / 2,
      rect2.y - rect2.height / 2
    );
    const b2: IVev2 = new Point(
      rect2.x - rect2.width / 2,
      rect2.y + rect2.height / 2
    );
    const c2: IVev2 = new Point(
      rect2.x + rect2.width / 2,
      rect2.y + rect2.height / 2
    );
    const d2: IVev2 = new Point(
      rect2.x + rect2.width / 2,
      rect2.y - rect2.height / 2
    );

    return {
      isHorizontal: a1.x > a2.x || c1.x < c2.x,
      isVertical: d1.y > d2.y || b1.y < b2.y,

      offsetX:
        (a1.x > a2.x ? a1.x - a2.x : 0) || (c1.x < c2.x ? c1.x - c2.x : 0),
      offsetY:
        (d1.y > d2.y ? d1.y - d2.y : 0) || (b1.y < b2.y ? b1.y - b2.y : 0),
    };
  },
};
