import { Text } from "pixi.js";
import { Tween } from "tweedle.js";

import Point from "../../configs/Point";

import GameEvents from "../../constants/GameEvents";

import GameObject from "../../managers/gameObjectsManager/GameObject";
import RenderHudTypes from "../../managers/renderManager/constants/RenderHudTypes";

import { Toggle } from "../../components/toggle/Toggle";
import { Resize } from "../../components/resize/Resize";

import { IROContextCfg } from "../../types";
import { fonts } from "../../configs/loader";

export default class PressStart extends GameObject {
  private readonly text: Text;

  constructor(context: IROContextCfg) {
    super(context);

    this.text = this.addChild(
      new Text("PRESS CLICK \n OR SPACE KEY", {
        fontFamily: fonts.montserratBold.family,
        fill: 0x2a2e30,
        align: "right",
      })
    );
    this.text.anchor = new Point(0.5, 0.5);
    
    this.renderLayer = RenderHudTypes.Ui;
    this.components = [
      new Toggle(this),
      new Resize({
        context: context,
        parent: this,
        landscape: {
          relativePosition: new Point(0.5, 0.3),
        },
        portrait: {
          relativePosition: new Point(0.5, 0.3),
        },
      }),
    ];

    this.context.app.stage.on(
      GameEvents.TOGGLE_PRESS_START,
      this.onTogglePressStart,
      this
    );

    this.loopAnimation();
  }

  private loopAnimation() {
    new Tween(this.scale).to({ x: 1.3, y: 1.3 }, 500).repeat().yoyo().start();
  }

  private onTogglePressStart(active: boolean) {
    this.emit(GameEvents.TOGGLE_ACTIVE, { active, time: 200 });
  }

  override onRemove() {
    this.context.app.stage.off(
      GameEvents.TOGGLE_PRESS_START,
      this.onTogglePressStart,
      this
    );
  }
}
