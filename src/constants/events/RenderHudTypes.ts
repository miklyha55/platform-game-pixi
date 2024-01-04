const Constants = {
  Ui: "Ui",
};

export type RenderHudTypesCfg = {[key in keyof typeof Constants]: string };

const RenderHudTypes: RenderHudTypesCfg = Object.assign({}, Constants);

export default RenderHudTypes;
