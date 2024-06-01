export enum HorizontalDirection {
  RIGHT = "right",
  LEFT = "left",
}

export enum VerticalDirection {
  BELOW = "below",
  ABOVE = "above",
}

export enum Tiebreaker {
  FIRST = "first",
  SECOND = "second",
  LAST = "last",
}

export enum IdType {
  LABEL = "label",
  ROW = "row",
}

export const { FIRST, SECOND, LAST } = Tiebreaker;
export const { LABEL, ROW } = IdType;
export const { RIGHT, LEFT } = HorizontalDirection;
export const { ABOVE, BELOW } = VerticalDirection;
export const horizontalDirections = Object.values(HorizontalDirection);
export const allDirections = [
  ...Object.values(VerticalDirection),
  ...horizontalDirections,
];
export const tiebreakers = Object.values(Tiebreaker);
export const idTypes = Object.values(IdType);

export type Direction = HorizontalDirection | VerticalDirection;

export interface BaseMethod {
  id: IdType;
}

export interface Label extends BaseMethod {
  id: IdType.LABEL;
  position: Direction;
  textAlignment: HorizontalDirection;
  anchor: string;
  multiline?: boolean;
}

export interface Row extends BaseMethod {
  id: IdType.ROW;
  position: HorizontalDirection;
  tiebreaker: Tiebreaker;
  anchor: string;
}

export type Polygon = { x: number; y: number }[];

export type StandardizedLine = {
  text: string;
  boundingPolygon: Polygon;
};

export type StandardizedPage = {
  lines: StandardizedLine[];
};

export type StandardizedText = {
  pages: StandardizedPage[];
};

export type AnchorMapEntry = {
  line: StandardizedLine;
  page: number;
};

export type ExtractedValue = {
  anchor: StandardizedLine;
  value: StandardizedLine;
};
