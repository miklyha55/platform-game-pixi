import { Application } from "pixi.js";
import "@pixi/math-extras";
import "./css/main.css";
import GameEvents from "./constants/GameEvents";
import Game from "./app/Game";

const app: Application = new Application({
  resizeTo: window,
  backgroundColor: 0x222222,
  antialias: true,
  autoDensity: true,
  resolution: 2,
});

const game: Game = new Game(app);

window.onresize = () => {
  app.stage.emit(GameEvents.RESIZE);
};
app.stage.addChild(game);

game.init();

export default app;
