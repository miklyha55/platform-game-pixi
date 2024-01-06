import GameEvents from "../../../constants/GameEvents";

import GameObjectManager from "../../gameObjectsManager/GameObjectManager";

import PlaceObject from "./PlaceObject";
import Block from "../Block";
import Coin from "../Coin";

import { IROContextCfg } from "../../../types";

export default class PlaceManager {
  private placeObjects: PlaceObject[];
  private readonly spawnDistance: number;
  private readonly spawnPositionsY: number[];
  private readonly context: IROContextCfg;
  private readonly gameObjectManager: GameObjectManager;

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
    this.context.app.stage.on(GameEvents.DEATH, this.onDeath, this);

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
  }

  onSpawnPlaceObject() {
    const randPositionY: number = Math.round(
      Math.random() * (this.spawnPositionsY.length - 1)
    );

    const randPlaceObjectType: number = Math.round(Math.random() * 10);
    let placeObject: PlaceObject = null;

    if (randPlaceObjectType > 2) {
      placeObject = this.gameObjectManager.create(
        new Block(this.context)
      ) as Block;
    } else {
      placeObject = this.gameObjectManager.create(
        new Coin(this.context)
      ) as Coin;
    }

    placeObject.y = this.spawnPositionsY[randPositionY];
    placeObject.x = this.spawnDistance / 2;

    this.placeObjects.push(placeObject);

    placeObject.removePlaceObject = () => {
      this.placeObjects.shift();
      placeObject.remove();
    };
  }

  private onDeath() {
    this.context.app.stage.off(GameEvents.DEATH, this.onDeath, this);
    this.context.app.stage.off(
      GameEvents.SPAWN_PLACE_OBJECT,
      this.onSpawnPlaceObject
    );
  }
}
