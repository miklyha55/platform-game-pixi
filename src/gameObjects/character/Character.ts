import { AnimatedSprite, SCALE_MODES, Texture } from "pixi.js";
import { Tween } from "tweedle.js";
import { textures } from "../../configs/loader";
import Point from "../../configs/Point";
import { Utils } from "../../configs/utils";
import CharacterAnimationType from "./constants";
import GameEvents from "../../constants/events/GameEvents";
import RenderGameTypes from "../../constants/events/RenderGameTypes";
import GameObject from "../../managers/gameObjectsManager/GameObject";
import PlaceObject from "../../managers/placeManager/PlaceObject";
import { Animation } from "../../components/animation/Animation";
import { IROContextCfg, IVev2 } from "../../types";

export default class Character extends GameObject {
  sprite: AnimatedSprite;
  animations: Texture[][];
  placeObjects: PlaceObject[];
  animationComponent: Animation;

  levelCounter: number;

  terminalVelocity: IVev2;
  jumpVelocity: IVev2;
  speed: IVev2;
  velocity: IVev2;
  gravity: IVev2;

  isInvulnerability: boolean;
  isFirstTap: boolean;
  isJump: boolean;
  isRemove: boolean;

  constructor(context: IROContextCfg) {
    super(context);

    this.terminalVelocity = { x: 0, y: 50 };

    this.jumpVelocity = this.context.jsons.game.character.jumpVelocity;
    this.speed = this.context.jsons.game.character.speed;

    this.velocity = { x: 0, y: 0 };
    this.gravity = { x: 0, y: 9.5 };

    this.levelCounter = 3;

    this.isInvulnerability = false;
    this.isFirstTap = false;
    this.isJump = true;
    this.isRemove = false;

    this.placeObjects = [];
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

    this.renderLayer = RenderGameTypes.Character;

    this.scale = new Point(6, 6);
    this.position = new Point(0, -50);
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

  setInvulnerability() {
    this.isInvulnerability = true;

    new Tween(this)
      .to({ alpha: 0 }, 50)
      .onComplete(() => {
        this.isInvulnerability = false;
        this.alpha = 1;
      })
      .repeat(15)
      .yoyo()
      .start();
  }

  checkCollision() {
    const radius: number = 70;

    this.placeObjects.forEach((placeObject) => {
      if (this.isRemove) {
        return;
      }

      const vec1: IVev2 = new Point(this.position.x, this.position.y);
      const vec2: IVev2 = new Point(
        placeObject.position.x,
        placeObject.position.y
      );

      if (Utils.mag(Utils.sub(vec1, vec2)) < radius) {
        if (this.isInvulnerability) {
          return;
        }

        if (this.levelCounter === 0) {
          this.context.app.stage.emit(GameEvents.RESET_LEVEL);
          return;
        }

        this.setInvulnerability();
        this.levelCounter--;
      }
    });
  }

  onCreate() {
    this.animationComponent
      .switchAnimation(CharacterAnimationType.Jump)
      .play(false, 0.1);

    this.context.app.stage.on(GameEvents.JUMP, this.onJump, this);
    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.on(
      GameEvents.SET_PLACE_OBJECTS,
      this.onSetPlaceObjects,
      this
    );
  }

  onSetPlaceObjects(placeObjects: PlaceObject[]) {
    this.placeObjects = placeObjects;
  }

  onTicker(dt: number) {
    this.checkCollision();

    if (this.isRemove) {
      return;
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
        .play(true, 0.1);
    }
  }

  onJump() {
    if (!this.isFirstTap) {
      this.isFirstTap = true;
      this.context.app.stage.emit(GameEvents.START_GAME);
      return;
    }

    if (this.isJump) {
      return;
    }

    this.isJump = true;

    this.animationComponent
      .switchAnimation(CharacterAnimationType.Jump)
      .play(false, 0.1);

    this.velocity.y = this.jumpVelocity.y;
  }

  onRemove() {
    this.isRemove = true;

    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.off(GameEvents.JUMP, this.onJump, this);
    this.context.app.stage.off(
      GameEvents.SET_PLACE_OBJECTS,
      this.onSetPlaceObjects,
      this
    );
  }
}
