const Enum = {
  Game: "Game",
};

export type RenderGameTypesCfg = {[key in keyof typeof Enum]: string };

const RenderGameTypes: RenderGameTypesCfg = Object.assign({}, Enum);

export default RenderGameTypes;
