import { SCALE_MODES, Sprite, Text } from "pixi.js";

import Point from "../../configs/Point";
import { fonts, textures } from "../../configs/loader";

import GameEvents from "../../constants/GameEvents";

import GameObject from "../../managers/gameObjectsManager/GameObject";
import RenderHudTypes from "../../managers/renderManager/constants/RenderHudTypes";

import { Resize } from "../../components/resize/Resize";

import { IROContextCfg } from "../../types";

export default class Lives extends GameObject {
  private readonly sprite: Sprite;
  private readonly text: Text;
  private lives: number;

  constructor(context: IROContextCfg) {
    super(context);

    this.lives = this.context.jsons.game.character.livesCounter;

    this.sprite = this.addChild(new Sprite(textures.live));
    this.sprite.anchor = new Point(2, -0.2);
    this.sprite.scale = new Point(5, 5);
    this.sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    this.text = this.addChild(
      new Text(String(this.lives), {
        fontFamily: fonts.montserratBold.family,
        fill: 0x2a2e30,
      })
    );
    this.text.anchor = new Point(1, 0.5);
    this.text.position = new Point(-25, 35);

    this.renderLayer = RenderHudTypes.Ui;

    this.components = [
      new Resize({
        context: context,
        parent: this,
        landscape: {
          relativePosition: new Point(1, 0),
        },
        portrait: {
          relativePosition: new Point(1, 0),
        },
      }),
    ];

    context.app.stage.on(GameEvents.RESET_LEVEL, this.onResetLevel, this);
  }

  private onResetLevel() {
    this.lives = this.context.jsons.game.character.livesCounter;
    this.text.text = String(this.lives);
  }

  override onCreate() {
    this.context.app.stage.on(GameEvents.SET_LIVES, this.onSetLives, this);
  }

  private onSetLives() {
    this.lives--;
    this.text.text = String(this.lives);
  }

  override onRemove() {
    this.context.app.stage.off(GameEvents.SET_LIVES, this.onSetLives, this);
  }
}
