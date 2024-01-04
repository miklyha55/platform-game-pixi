import GameObject from "../managers/gameObjectsManager/GameObject";
import { IROContextCfg } from "../types";
import RenderGameTypes from "../constants/events/RenderGameTypes";
import Bg from "./Bg";
import Character from "./character/Character";

export default class Level extends GameObject {
  bg: Bg;
  character: Character;
  
  constructor(context: IROContextCfg) {
    super(context);

    this.renderLayer = RenderGameTypes.Game;
  }

  onCreate() {
    this.bg = this.gameObjectManager.create(new Bg(this.context), this) as Bg;
    this.character = this.gameObjectManager.create(new Character(this.context), this) as Character;
  }

  onRemove() {
    this.bg.remove();
  }
}
