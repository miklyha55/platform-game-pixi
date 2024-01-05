const Constants = {
  Collectable: 0,
  Block: 1,
};

export type PlaceObjectTypeCfg = {
  [key in keyof typeof Constants]: number;
};

const PlaceObjectType: PlaceObjectTypeCfg = Object.assign(
  {},
  Constants
);

export default PlaceObjectType;