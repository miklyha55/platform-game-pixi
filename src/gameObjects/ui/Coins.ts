import { SCALE_MODES, Sprite, Text } from "pixi.js";

import Point from "../../configs/Point";
import { textures } from "../../configs/loader";

import GameEvents from "../../constants/GameEvents";

import GameObject from "../../managers/gameObjectsManager/GameObject";
import RenderHudTypes from "../../managers/renderManager/constants/RenderHudTypes";

import { Resize } from "../../components/resize/Resize";

import { IROContextCfg } from "../../types";

export default class Coins extends GameObject {
  private readonly sprite: Sprite;
  private readonly text: Text;
  private coins: number;

  constructor(context: IROContextCfg) {
    super(context);

    this.coins = 0;

    this.sprite = this.addChild(new Sprite(textures.coin));
    this.sprite.anchor = new Point(-1, -0.5);
    this.sprite.scale = new Point(6, 6);
    this.sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    this.text = this.addChild(
      new Text(String(this.coins), {
        fontFamily: "Arial Black",
        fill: 0x2a2e30,
      })
    );
    this.text.anchor = new Point(0, 0.5);
    this.text.position = new Point(70, 35);

    this.renderLayer = RenderHudTypes.Ui;

    this.components = [
      new Resize({
        context: context,
        parent: this,
        landscape: {
          relativePosition: new Point(0, 0),
        },
        portrait: {
          relativePosition: new Point(0, 0),
        },
      }),
    ];

    context.app.stage.on(GameEvents.RESET_LEVEL, this.onResetLevel, this);
  }

  private onResetLevel() {
    this.coins = 0;
    this.text.text = String(this.coins);
  }

  override onCreate() {
    this.context.app.stage.on(GameEvents.SET_COINS, this.onSetCoins, this);
  }

  private onSetCoins() {
    this.coins++;
    this.text.text = String(this.coins);
  }

  override onRemove() {
    this.context.app.stage.off(GameEvents.SET_COINS, this.onSetCoins, this);
  }
}
