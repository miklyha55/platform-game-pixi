import { Graphics } from "pixi.js";

import Point from "../../configs/Point";

import GameEvents from "../../constants/GameEvents";

import RenderHudTypes from "../../managers/renderManager/constants/RenderHudTypes";
import GameObject from "../../managers/gameObjectsManager/GameObject";

import { Resize } from "../../components/resize/Resize";
import { InputAreaCommand } from "../../components/input/commands/InputAreaCommand";

import { IROContextCfg } from "../../types";

export default class InputArea extends GameObject {
  private readonly graphics: Graphics;
  private readonly keyDownHandler: (events: KeyboardEvent) => void;

  constructor(context: IROContextCfg) {
    super(context);

    this.components = [
      new InputAreaCommand(this),
      new Resize({
        context: context,
        parent: this,
        landscape: {
          relativePosition: new Point(0.5, 0.5),
        },
        portrait: {
          relativePosition: new Point(0.5, 0.5),
        },
      }),
    ];

    const graphics: Graphics = new Graphics();

    graphics.beginFill(0xf);
    graphics.drawRect(-2500, -2500, 5000, 5000);
    graphics.alpha = 0;

    this.addChild(graphics);

    context.app.stage.on(
      GameEvents.TOGGLE_INPUT_AREA,
      this.onToggleInputArea,
      this
    );

    this.renderLayer = RenderHudTypes.Ui;
    this.keyDownHandler = this.onKeyDown.bind(this);

    window.addEventListener('keydown', this.keyDownHandler);
  }

  private onToggleInputArea(active: boolean) {
    this.interactive = active;

    if(active) {
      window.addEventListener('keydown', this.keyDownHandler);
    } else {
      window.removeEventListener('keydown', this.keyDownHandler);
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if(event.code === "Space") {
      this.context.app.stage.emit(GameEvents.JUMP);
    }
  }

  override onRemove() {
    this.context.app.stage.off(
      GameEvents.TOGGLE_INPUT_AREA,
      this.onToggleInputArea,
      this
    );
  }
}
