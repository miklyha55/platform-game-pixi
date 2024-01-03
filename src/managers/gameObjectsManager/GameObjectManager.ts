import { Container } from "pixi.js";
import GameEvents from "../../constants/events/GameEvents";
import GameObject from "./GameObject";
import { IROContext } from "../../types";

export default class GameObjectManager {
  gameObjects: GameObject[];
  context: IROContext;

  constructor(context: IROContext) {
    this.gameObjects = [];
    this.context = context;
  }

  create(gameObject: GameObject) {
    this.gameObjects.push(gameObject);

    this.context.app.stage.emit(GameEvents.SET_GAME_OBJECT, gameObject);
    this.context.app.stage.emit(
      GameEvents.GET_RENDER_LAYER,
      gameObject.renderLayer,
      (renderLayer: Container) => {
        if (!renderLayer) return;

        renderLayer.addChild(gameObject);
      }
    );

    gameObject.name = gameObject.constructor.name;
    gameObject.gameObjectManager = this;
    gameObject.onCreate();

    return gameObject;
  }

  removeAll() {
    this.gameObjects.forEach((gameObject) => {
      gameObject.remove();
    });

    this.context.app.stage.emit(GameEvents.CLEAR_GAME_OBJECT, [
      ...this.gameObjects,
    ]);

    this.gameObjects = [];
  }

  getGameObjectByName(name: string) {
    this.context.app.stage.emit(
      GameEvents.GET_GAME_OBJECT,
      name,
      (gameObject: GameObject) => {
        return gameObject;
      }
    );
  }
}
