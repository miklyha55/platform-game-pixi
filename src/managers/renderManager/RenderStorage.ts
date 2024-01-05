import { Container } from "pixi.js";
import GameEvents from "../../constants/GameEvents";
import { RenderGameTypesCfg } from "../../constants/RenderGameTypes";
import { RenderHudTypesCfg } from "../../constants/RenderHudTypes";
import { IROContextCfg } from "../../types";

export default class RenderStorage {
  renderLayers: Container[];

  constructor(context: IROContextCfg) {
    this.renderLayers = [];

    context.app.stage.on(
      GameEvents.GET_RENDER_LAYER,
      this.onGetRenderLayer,
      this
    );
    context.app.stage.on(
      GameEvents.SET_RENDER_LAYER,
      this.onSetRenderLayer,
      this
    );
    context.app.stage.on(
      GameEvents.CLEAR_RENDER_LAYER,
      this.onClearRenderLayer,
      this
    );
  }

  onSetRenderLayer(layer: Container) {
    this.renderLayers.push(layer);
  }

  onGetRenderLayer(name: string, callback: (layer: Container) => void) {
    callback instanceof Function &&
      callback(this.renderLayers.find((layer) => layer.name === name));
  }

  onClearRenderLayer(layers: RenderGameTypesCfg | RenderHudTypesCfg) {
    for (const key in layers) {
      if (Object.hasOwnProperty.call(layers, key)) {
        const layer: string = layers[key];

        this.renderLayers.forEach((renderLayer, index) => {
          if (renderLayer.name === layer) {
            renderLayer.destroy();
            this.renderLayers.splice(index, 1);
          }
        });
      }
    }
  }
}
