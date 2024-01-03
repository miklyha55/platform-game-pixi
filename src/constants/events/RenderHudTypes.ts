const Enum = {
  Ui: "Ui",
};

export type RenderHudTypesCfg = {[key in keyof typeof Enum]: string };

const RenderHudTypes: RenderHudTypesCfg = Object.assign({}, Enum);

export default RenderHudTypes;
