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
import Character from "./Character";
import { IROContextCfg, IVev2 } from "../../types";

export default class Ai extends GameObject {
  sprite: AnimatedSprite;
  animations: Texture[][];
  placeObjects: PlaceObject[];
  character: Character;
  animationComponent: Animation;

  terminalVelocity: IVev2;
  jumpVelocity: IVev2;
  speed: IVev2;
  velocity: IVev2;
  gravity: IVev2;

  direction: number;
  deltaCloser: number;

  isInvulnerability: boolean;
  isFirstTap: boolean;
  isJump: boolean;
  isRemove: boolean;

  constructor(context: IROContextCfg, character: Character) {
    super(context);

    this.character = character;

    this.jumpVelocity = this.context.jsons.game.ai.jumpVelocity;
    this.speed = this.context.jsons.game.ai.speed;

    this.terminalVelocity = { x: 0, y: 50 };
    this.velocity = { x: 0, y: 0 };
    this.gravity = { x: 0, y: 9.5 };

    this.direction = 1;
    this.deltaCloser = 0.2;

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
    this.position = new Point(-500, -150);

    new Tween(this).to({ x: -200 }, 300).start();
  }

  fillAnimations() {
    if (!this.context.jsons.game.character.animations) {
      return;
    }

    this.context.jsons.game.ai.animations.forEach((frames) => {
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

  checkCollision() {
    const radius: number = 100;
    const radiusCharacter: number = 70;

    this.placeObjects.forEach((placeObject) => {
      if (this.isRemove) {
        return;
      }

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
        this.context.app.stage.emit(GameEvents.RESET_LEVEL);
        return;
      }

      if (Utils.mag(Utils.sub(vec1, vec2)) < radius && !this.isJump) {
        this.isJump = true;

        this.animationComponent
          .switchAnimation(CharacterAnimationType.Jump)
          .play(false, 0.1);

        this.velocity.y = this.jumpVelocity.y;
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

  onJump() {
    if (!this.isFirstTap) {
      this.isFirstTap = true;
      return;
    }

    this.direction = -1;
    this.deltaCloser = 0.4;

    new Tween(null)
      .to({}, 600)
      .onComplete(() => {
        this.direction = 1;
        this.deltaCloser = 0.2;
      })
      .start();
  }

  onTicker(dt: number) {
    this.checkCollision();

    if (this.isRemove) {
      return;
    }

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
        .play(true, 0.1);
    }
  }

  onRemove() {
    this.isRemove = true;

    this.context.app.stage.off(GameEvents.JUMP, this.onJump, this);
    this.context.app.stage.off(GameEvents.TICKER, this.onTicker, this);
    this.context.app.stage.off(
      GameEvents.SET_PLACE_OBJECTS,
      this.onSetPlaceObjects,
      this
    );
  }
}
