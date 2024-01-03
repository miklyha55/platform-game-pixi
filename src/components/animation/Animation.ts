import { AnimatedSprite, Texture } from "pixi.js";
import { Component } from "../core/Component";
import { IROAnimationCfg } from "./types";

export class Animation extends Component {
  sprite: AnimatedSprite;
  animations: Texture[][];

  constructor({ parent, animations, currentAnimationName }: IROAnimationCfg) {
    super(parent);

    this.animations = animations;

    this.sprite = new AnimatedSprite(this.animations[currentAnimationName]);
    this.parent.addChild(this.sprite);
  }

  switchAnimation(name: string) {
    this.sprite.textures = this.animations[name];
  }

  play(isLoop: boolean, animationSpeed: number = 1) {
    this.sprite.animationSpeed = animationSpeed;
    this.sprite.loop = isLoop;

    this.sprite.play();
  }

  stop() {
    this.sprite.stop();
  }

  onRemove() {
    this.sprite.stop();
    this.sprite.destroy();
  }
}
