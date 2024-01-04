const Constants = {
  Game: "Game",
};

export type RenderGameTypesCfg = {[key in keyof typeof Constants]: string };

const RenderGameTypes: RenderGameTypesCfg = Object.assign({}, Constants);

export default RenderGameTypes;
