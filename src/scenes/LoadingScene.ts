import { Container } from "pixi.js";
import { load } from "../configs/loader";

export default class LoadingScene extends Container {
  constructor() {
    super();
  }

  async create() {
    await load();
  }
}
