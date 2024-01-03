const Enum = {
  TOGGLE_ACTIVE: "TOGGLE_ACTIVE",
  RESIZE: "RESIZE",
  
  TICKER: "TICKER",

  FOLLOW_CAMERA: "FOLLOW_CAMERA",
  ZOOM_CAMERA: "ZOOM_CAMERA",

  GET_RENDER_LAYER: "GET_RENDER_LAYER",
  SET_RENDER_LAYER: "SET_RENDER_LAYER",
  CLEAR_RENDER_LAYER: "CLEAR_RENDER_LAYER",

  GET_GAME_OBJECT: "GET_GAME_OBJECT",
  SET_GAME_OBJECT: "SET_GAME_OBJECT",
  CLEAR_GAME_OBJECT: "CLEAR_GAME_OBJECT",
};

export type GameEventsCfg = {[key in keyof typeof Enum]: string };

const GameEvents: GameEventsCfg = Object.assign({}, Enum);

export default GameEvents;
