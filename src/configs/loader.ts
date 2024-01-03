import { Assets } from "pixi.js";
import { sound } from "@pixi/sound";

import { fontAssets, soundAssets, textureAssets, jsonsAssets } from "./index";

export const fonts = {};
export const textures = {};
export const jsons = {};

export function load() {
  return new Promise<void>(async (resolve) => {
    for (const key in fontAssets) {
      if (Object.hasOwnProperty.call(fontAssets, key)) {
        fonts[key] = await Assets.load(fontAssets[key]);
      }
    }

    for (const key in soundAssets) {
      if (Object.hasOwnProperty.call(soundAssets, key)) {
        sound.add(key, soundAssets[key]);
      }
    }

    for (const key in textureAssets) {
      if (Object.hasOwnProperty.call(textureAssets, key)) {
        if (textureAssets[key] instanceof Object) {
          await loadTree(textures, textureAssets, key);
        } else {
          textures[key] = await Assets.load(textureAssets[key]);
        }
      }
    }

    for (const key in jsonsAssets) {
      if (Object.hasOwnProperty.call(jsonsAssets, key)) {
        jsons[key] = jsonsAssets[key];
      }
    }

    return resolve();
  });

  async function loadTree(writenObject, readenObject, key) {
    writenObject[key] = {};

    for (const key2 in readenObject[key]) {
      if (readenObject[key][key2] instanceof Object) {
        await loadTree(writenObject[key], readenObject[key], key2);
      } else {
        writenObject[key][key2] = await Assets.load(readenObject[key][key2]);
      }
    }
  }
}
