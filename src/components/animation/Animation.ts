import { AnimatedSprite, Texture } from "pixi.js";
import { Component } from "../core/Component";
import { IROAnimationCfg } from "./types";

export class Animation extends Component {
  readonly sprite: AnimatedSprite;
  private readonly animations: Texture[][];

  constructor({ parent, animations, currentAnimationName }: IROAnimationCfg) {
    super(parent);

    this.animations = animations;

    this.sprite = new AnimatedSprite(this.animations[currentAnimationName]);
    this.parent.addChild(this.sprite);
  }

  switchAnimation(index: number) {
    this.sprite.textures = this.animations[index];

    return this;
  }

  play(isLoop: boolean, animationSpeed: number = 1) {
    this.sprite.animationSpeed = animationSpeed;
    this.sprite.loop = isLoop;

    this.sprite.play();
    return this;
  }

  stop() {
    this.sprite.stop();
    return this;
  }

  override onRemove() {
    this.sprite.stop();
    this.sprite.destroy();
  }
}
