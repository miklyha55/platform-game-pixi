import { Graphics } from "pixi.js";
import Point from "../configs/Point";
import GameEvents from "../constants/events/GameEvents";
import GameObject from "../managers/gameObjectsManager/GameObject";
import { Resize } from "../components/resize/Resize";
import { InputAreaCommand } from "../components/input/commands/InputAreaCommand";
import { IROContextCfg } from "../types";
import RenderHudTypes from "../constants/events/RenderHudTypes";

export default class InputArea extends GameObject {
  graphics: Graphics;

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
  }

  onToggleInputArea(active: boolean) {
    this.interactive = active;
  }

  onRemove() {
    this.context.app.stage.off(
      GameEvents.TOGGLE_INPUT_AREA,
      this.onToggleInputArea,
      this
    );
  }
}
