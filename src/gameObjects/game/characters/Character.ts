import { AnimatedSprite, SCALE_MODES, Texture } from "pixi.js";
import { sound } from "@pixi/sound";
import { Tween } from "tweedle.js";

import { textures } from "../../../configs/loader";
import Point from "../../../configs/Point";
import { Utils } from "../../../configs/utils";

import CharacterAnimationType from "./constants";
import GameEvents from "../../../constants/GameEvents";

import RenderGameTypes from "../../../managers/renderManager/constants/RenderGameTypes";
import GameObject from "../../../managers/gameObjectsManager/GameObject";
import PlaceObject from "../../../managers/placeManager/core/PlaceObject";
import PlaceObjectType from "../../../managers/placeManager/constants";

import { Animation } from "../../../components/animation/Animation";

import { IROContextCfg, IVev2 } from "../../../types";

export default class Character extends GameObject {
  protected sprite: AnimatedSprite;
  protected animations: Texture[][];
  protected placeObjects: PlaceObject[];
  protected animationComponent: Animation;

  private livesCounter: number;

  protected terminalVelocity: IVev2;
  protected jumpVelocity: IVev2;
  protected speed: IVev2;
  protected velocity: IVev2;
  protected gravity: IVev2;

  private isInvulnerability: boolean;
  protected isFirstTap: boolean;
  protected isJump: boolean;
  protected isDeath: boolean;

  constructor(context: IROContextCfg) {
    super(context);

    this.terminalVelocity = { x: 0, y: 50 };

    this.jumpVelocity = this.context.jsons.game.character.jumpVelocity;
    this.speed = this.context.jsons.game.character.speed;

    this.velocity = { x: 0, y: 0 };
    this.gravity = { x: 0, y: 9.5 };

    this.livesCounter = this.context.jsons.game.character.livesCounter;

    this.isInvulnerability = false;
    this.isFirstTap = false;
    this.isJump = true;
    this.isDeath = false;

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

  protected fillAnimations() {
    if (!this.context.jsons.game.character.animations) {
      return;
    }

    this.context.jsons.game.character.animations.forEach((frames) => {
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

  protected setInvulnerability() {
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

  protected checkCollision() {
    this.placeObjects.forEach((placeObject) => {
      const vec1: IVev2 = new Point(this.position.x, this.position.y);
      const vec2: IVev2 = new Point(
        placeObject.position.x,
        placeObject.position.y
      );

      if (Utils.mag(Utils.sub(vec1, vec2)) < 70) {
        if (!placeObject.alpha || this.isDeath) {
          return;
        }

        if (placeObject.type === PlaceObjectType.Collectable) {
          this.context.app.stage.emit(GameEvents.SET_COINS);
          placeObject.alpha = 0;
          sound.play("dzin");
        } else {
          if (this.isInvulnerability) {
            return;
          }
          sound.play("hit");
          this.livesCounter--;
          this.context.app.stage.emit(GameEvents.SET_LIVES);

          if (this.livesCounter === 0) {
            sound.play("fail");
            this.context.app.stage.emit(GameEvents.DEATH);
            return;
          }

          this.setInvulnerability();
        }
      }
    });
  }

  override onCreate() {
    this.animationComponent
      .switchAnimation(CharacterAnimationType.Jump)
      .play(false, 0.1);

    this.context.app.stage.on(GameEvents.DEATH, this.onDeath, this);
    this.context.app.stage.on(GameEvents.JUMP, this.onJump, this);
    this.context.app.stage.on(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.on(
      GameEvents.SET_PLACE_OBJECTS,
      this.onSetPlaceObjects,
      this
    );
  }

  protected onDeath() {
    this.isDeath = true;

    this.context.app.stage.emit(GameEvents.TOGGLE_INPUT_AREA, false);
    this.jumpVelocity = this.context.jsons.game.character.jumpVelocityDeath;
    this.isJump = false;

    this.onJump();

    this.context.app.stage.off(GameEvents.DEATH, this.onDeath, this);
    this.context.app.stage.emit(GameEvents.ZOOM_CAMERA, { zoom: 0.8 });
  }

  protected onSetPlaceObjects(placeObjects: PlaceObject[]) {
    this.placeObjects = placeObjects;
  }

  protected async onTicker(dt: number) {
    this.checkCollision();

    if (!this.isJump) {
      return;
    }
    
    this.velocity.y += this.gravity.y * dt;
    this.position.y += this.velocity.y * this.speed.y;

    if (this.position.y > this.terminalVelocity.y) {
      this.isJump = false;
      this.position.y = this.terminalVelocity.y;

      if (this.isDeath) {
        this.animationComponent
          .switchAnimation(CharacterAnimationType.Jump)
          .play(false, 0.15);
        this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);

        await Utils.delay(1000);
        this.context.app.stage.emit(GameEvents.RESET_LEVEL);
        return;
      }

      this.animationComponent
        .switchAnimation(CharacterAnimationType.Run)
        .play(true, 0.15);
    }
  }

  protected onJump() {
    if (!this.isFirstTap) {
      this.isFirstTap = true;
      
      this.context.app.stage.emit(GameEvents.TOGGLE_PRESS_START, false);
      this.context.app.stage.emit(GameEvents.START_GAME);
    }

    if (this.isDeath) {
      this.sprite.scale.y = -1;
    }

    if (this.isJump) {
      return;
    }
    sound.play("jump");

    this.isJump = true;

    this.animationComponent
      .switchAnimation(CharacterAnimationType.Jump)
      .play(false, 0.15);

    this.velocity.y = this.jumpVelocity.y;
  }

  override onRemove() {
    this.context.app.stage.off(GameEvents.JUMP, this.onJump, this);
    this.context.app.stage.off(
      GameEvents.SET_PLACE_OBJECTS,
      this.onSetPlaceObjects,
      this
    );
  }
}
