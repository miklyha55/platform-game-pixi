import GameEvents from "../constants/events/GameEvents";
import PlaceManager from "../managers/placeManager/PlaceManager";
import GameObjectManager from "../managers/gameObjectsManager/GameObjectManager";
import Bg from "./Bg";
import Character from "./character/Character";
import Ai from "./character/Ai";
import { IROContextCfg } from "../types";

export default class Level {
  bg: Bg;
  character: Character;
  ai: Ai;
  placeManager: PlaceManager;
  context: IROContextCfg;
  gameObjectManager: GameObjectManager;

  constructor(context: IROContextCfg, gameObjectManager: GameObjectManager) {
    this.context = context;
    this.gameObjectManager = gameObjectManager;
  }

  create() {
    this.bg = this.gameObjectManager.create(new Bg(this.context)) as Bg;
    this.character = this.gameObjectManager.create(
      new Character(this.context)
    ) as Character;
    this.ai = this.gameObjectManager.create(new Ai(this.context, this.character)) as Ai;
    this.placeManager = new PlaceManager(this.context, this.gameObjectManager);
    this.context.app.stage.on(GameEvents.START_GAME, this.onStartGame, this);
  }

  remove() {
    this.context.app.stage.off(GameEvents.START_GAME, this.onStartGame, this);
    this.context.app.stage.emit(GameEvents.CLEAR_GAME_OBJECT, [
      this.bg,
      this.character,
      this.ai,
    ]);
    this.placeManager.remove();
  }

  onStartGame() {
    this.placeManager.onSpawnPlaceObject();
  }
}
