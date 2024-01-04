import { AnimatedSprite, SCALE_MODES, Texture } from "pixi.js";
import { textures } from "../../configs/loader";
import Point from "../../configs/Point";
import CharacterAnimationType from "./constants";
import GameEvents from "../../constants/events/GameEvents";
import GameObject from "../../managers/gameObjectsManager/GameObject";
import { Animation } from "../../components/animation/Animation";
import { IROContextCfg, IVev2 } from "../../types";

export default class Character extends GameObject {
  sprite: AnimatedSprite;
  animations: Texture[][];
  animationComponent: Animation;

  terminalVelocity: IVev2;
  jumpVelocity: IVev2;
  speed: IVev2;
  velocity: IVev2;
  gravity: IVev2;

  isJump: boolean;

  constructor(context: IROContextCfg) {
    super(context);

    this.terminalVelocity = { x: 0, y: 50 };

    this.jumpVelocity = this.context.jsons.game.character.jumpVelocity;
    this.speed = this.context.jsons.game.character.speed;

    this.velocity = { x: 0, y: 0 };
    this.gravity = { x: 0, y: 9.5 };

    this.isJump = true;

    this.animations = [];
    this.fillAnimations();

    this.animationComponent = new Animation({
      parent: this,
      animations: this.animations,
      currentAnimationName: 0,
    });

    this.sprite = this.addChild(this.animationComponent.sprite);
    this.sprite.anchor = new Point(0.5, 0.5);
    this.components = [this.animationComponent];

    this.scale = new Point(6, 6);
    this.position = new Point(0, -350);
  }

  fillAnimations() {
    if (!this.context.jsons.game.character.animations) {
      return;
    }

    this.context.jsons.game.character.animations.forEach((frames) => {
      this.animations.push(
        frames.map((frame) => {
          return textures.cat[frame];
        })
      );
    });

    this.animations.forEach((animation) => {
      animation.forEach((texture) => {
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
      });
    });
  }

  onCreate() {
    this.animationComponent
      .switchAnimation(CharacterAnimationType.Jump)
      .play(false, 0.1);

    this.context.app.stage.on(GameEvents.JUMP, this.onJump, this);
    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
  }

  onTicker(dt: number) {
    if(!this.isJump) {
       return;
    }

    this.velocity.y += this.gravity.y;
    this.position.y += this.velocity.y * dt * this.speed.y;

    if (this.position.y > this.terminalVelocity.y) {
      this.position.y = this.terminalVelocity.y;
      this.animationComponent
      .switchAnimation(CharacterAnimationType.Run)
      .play(true, 0.1);
      this.isJump = false;
    }
  }

  onJump() {
    if(this.isJump) {
      return;
    }

    this.isJump = true;

    this.animationComponent
    .switchAnimation(CharacterAnimationType.Jump)
    .play(false, 0.1);

    this.velocity.y = this.jumpVelocity.y;
  }

  onRemove() {
    this.context.app.stage.off(GameEvents.JUMP, this.onJump, this);
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
  }
}
