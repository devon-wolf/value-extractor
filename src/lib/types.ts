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

export type Direction = HorizontalDirection | VerticalDirection;

export interface BaseMethod {
  id: IdType;
}

export interface Label extends BaseMethod {
  id: IdType.LABEL;
  position: Direction;
  textAlignment: HorizontalDirection;
  anchor: string;
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
