import { Container } from "pixi.js";
import GameEvents from "../../constants/GameEvents";
import GameObject from "./GameObject";
import { IROContextCfg } from "../../types";

export default class GameObjectManager {
  private gameObjects: GameObject[];
  private readonly context: IROContextCfg;

  constructor(context: IROContextCfg) {
    this.gameObjects = [];
    this.context = context;
  }

  create(gameObject: GameObject, renderLayer: Container = null) {
    this.gameObjects.push(gameObject);

    this.context.app.stage.emit(GameEvents.SET_GAME_OBJECT, gameObject);
    !renderLayer
      ? this.context.app.stage.emit(
          GameEvents.GET_RENDER_LAYER,
          gameObject.renderLayer,
          (renderLayer: Container) => {
            if (!renderLayer) return;

            renderLayer.addChild(gameObject);
          }
        )
      : renderLayer.addChild(gameObject);

    gameObject.name = gameObject.constructor.name;
    gameObject.gameObjectManager = this;
    gameObject.onCreate();

    gameObject.components.forEach((component, index) => {
      component.context = this.context;
      component.onCreate();

      component.remove = () => {
        component.onRemove();
        gameObject.components.splice(index, 1);
      };
    });

    return gameObject;
  }

  removeAll() {
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
