const Constants = {
  Run: 0,
  Jump: 1,
};

export type CharacterAnimationTypeCfg = {
  [key in keyof typeof Constants]: number;
};

const CharacterAnimationType: CharacterAnimationTypeCfg = Object.assign(
  {},
  Constants
);

export default CharacterAnimationType;
