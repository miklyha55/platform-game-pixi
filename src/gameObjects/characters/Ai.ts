import { SCALE_MODES } from "pixi.js";
import { Tween } from "tweedle.js";
import { textures } from "../../configs/loader";
import Point from "../../configs/Point";
import { Utils } from "../../configs/utils";
import CharacterAnimationType from "./constants";
import GameEvents from "../../constants/GameEvents";
import PlaceObjectType from "../../managers/placeManager/constants";
import Character from "./Character";
import { IROContextCfg, IVev2 } from "../../types";

export default class Ai extends Character {
  character: Character;
  direction: number;
  deltaCloser: number;

  constructor(context: IROContextCfg, character: Character) {
    super(context);

    this.character = character;

    this.direction = 1;
    this.deltaCloser = 0.2;

    this.position = new Point(-700, -150);

    new Tween(this).to({ x: -200 }, 300).start();
  }

  fillAnimations() {
    if (!this.context.jsons.game.ai.animations) {
      return;
    }

    this.context.jsons.game.ai.animations.forEach((frames) => {
      this.animations.push(
        frames.map((frame) => {
          return textures.characters[frame];
        })
      );
    });

    this.animations.forEach((animation) => {
      animation.forEach((texture) => {
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
      });
    });
  }

  checkCollision() {
    const radius: number = 100;
    const radiusCharacter: number = 70;

    this.placeObjects.forEach((placeObject) => {
      const vec1: IVev2 = new Point(this.position.x, this.position.y);
      const vec2: IVev2 = new Point(
        placeObject.position.x,
        placeObject.position.y
      );
      const vec3: IVev2 = new Point(
        this.character.position.x,
        this.character.position.y
      );

      if (Utils.mag(Utils.sub(vec1, vec3)) < radiusCharacter) {
        this.context.app.stage.emit(GameEvents.DEATH);
        return;
      }

      if (
        Utils.mag(Utils.sub(vec1, vec2)) < radius &&
        !this.isJump &&
        placeObject.type !== PlaceObjectType.Collectable
      ) {
        this.isJump = true;

        this.animationComponent
          .switchAnimation(CharacterAnimationType.Jump)
          .play(false, 0.15);

        this.velocity.y = this.jumpVelocity.y;
      }
    });
  }

  onJump() {
    if (!this.isFirstTap) {
      this.isFirstTap = true;
      return;
    }

    this.direction = -1;
    this.deltaCloser = 0.45;

    new Tween(null)
      .to({}, 600)
      .onComplete(() => {
        this.direction = 1;
        this.deltaCloser = 0.2;
      })
      .start();
  }

  async onTicker(dt: number) {
    this.checkCollision();

    if (this.isFirstTap) {
      this.position.x += this.deltaCloser * this.direction;
    }

    if (!this.isJump) {
      return;
    }

    this.velocity.y += this.gravity.y;
    this.position.y += this.velocity.y * dt * this.speed.y;

    if (this.position.y > this.terminalVelocity.y) {
      this.isJump = false;
      this.position.y = this.terminalVelocity.y;

      this.animationComponent
        .switchAnimation(CharacterAnimationType.Run)
        .play(true, 0.15);
    }
  }

  onDeath() {
    this.isDeath = true;

    this.sprite.scale.x = -1;
    new Tween(this)
      .to({ x: -700, y: 50 }, 300)
      .onComplete(() => {})
      .start();

    this.context.app.stage.off(GameEvents.DEATH, this.onDeath, this);
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);

    if (!this.isJump) {
      this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
    }
  }
}
