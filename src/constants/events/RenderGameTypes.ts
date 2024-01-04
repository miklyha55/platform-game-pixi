const Constants = {
  Bg: "Bg",
  Blocks: "Blocks",
  Character: "Character",
};

export type RenderGameTypesCfg = {[key in keyof typeof Constants]: string };

const RenderGameTypes: RenderGameTypesCfg = Object.assign({}, Constants);

export default RenderGameTypes;
