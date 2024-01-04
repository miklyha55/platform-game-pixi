import { Container, Point } from "pixi.js";
import { IROContextCfg } from "../../types";
import GameObjectManager from "../gameObjectsManager/GameObjectManager";
import PlaceObject from "./PlaceObject";
import GameEvents from "../../constants/events/GameEvents";

export default class PlaceManager {
  placeObjects: PlaceObject[];
  spawnDistance: number;
  spawnPositionsY: number[];
  context: IROContextCfg;
  gameObjectManager: GameObjectManager;

  constructor(context: IROContextCfg, gameObjectManager: GameObjectManager) {
    this.placeObjects = [];
    this.spawnDistance = context.jsons.game.blocks.spawnDistance;
    this.spawnPositionsY = context.jsons.game.blocks.spawnPositionsY;

    this.context = context;
    this.gameObjectManager = gameObjectManager;

    this.context.app.stage.on(
      GameEvents.SPAWN_PLACE_OBJECT,
      this.onSpawnPlaceObject,
      this
    );

    this.context.app.stage.emit(
      GameEvents.SET_PLACE_OBJECTS,
      this.placeObjects
    );
  }

  remove() {
    this.placeObjects.forEach((placeObject) => {
      placeObject.remove();
    });
    this.placeObjects = [];

    this.context.app.stage.off(
      GameEvents.SPAWN_PLACE_OBJECT,
      this.onSpawnPlaceObject
    );
  }

  onSpawnPlaceObject() {
    const rand: number = Math.round(
      Math.random() * (this.spawnPositionsY.length - 1)
    );

    const placeObject: PlaceObject = this.gameObjectManager.create(
      new PlaceObject(this.context)
    ) as PlaceObject;

    placeObject.y = this.spawnPositionsY[rand];
    placeObject.x = this.spawnDistance / 2;

    this.placeObjects.push(placeObject);

    placeObject.removePlaceObject = () => {
      this.placeObjects.shift();
      placeObject.remove();
    };
  }
}
