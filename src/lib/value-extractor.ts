import {
  Label,
  Polygon,
  Row,
  StandardizedLine,
  StandardizedText,
} from "./types";

export default class ValueExtractor {
  private readonly text: StandardizedText;
  private readonly NO_ANCHOR_ERROR: Error = new Error("Anchor text not found");
  private readonly NO_MATCH_ERROR: Error = new Error(
    "No match found for the requested anchor and position",
  );

  constructor(text: StandardizedText) {
    this.text = text;
  }

  extractLabel(configuration: Label): StandardizedLine {
    const { anchorLine, page } = this.getAnchorLine(configuration.anchor);

    if (!anchorLine) {
      throw this.NO_ANCHOR_ERROR;
    }

    const { position, textAlignment, anchor } = configuration;
    if (position === "left" || position === "right") {
      return this.extractRow({
        id: "row",
        position,
        tiebreaker: "first",
        anchor,
      });
    }

    let matchingLine: StandardizedLine | undefined;

    const anchorEdge =
      position === "above"
        ? this.getTopPoint(anchorLine.boundingPolygon)
        : this.getBottomPoint(anchorLine.boundingPolygon);

    const alignmentPoint =
      textAlignment === "right"
        ? this.getRightmostPoint(anchorLine.boundingPolygon)
        : this.getLeftmostPoint(anchorLine.boundingPolygon);

    matchingLine = this.text.pages[<number>page].lines.reduce(
      (prev, currentLine) => {
        if (position === "above") {
          const bottomLineEdge = this.getBottomPoint(
            currentLine.boundingPolygon,
          );
          if (
            bottomLineEdge <= anchorEdge &&
            this.overlapsWithAlignmentPointX(
              currentLine.boundingPolygon,
              alignmentPoint,
            )
          ) {
            if (prev) {
              if (this.getBottomPoint(prev.boundingPolygon) < bottomLineEdge) {
                return currentLine;
              }
            } else {
              return currentLine;
            }
          }
          return prev;
        }
        const topLineEdge = this.getTopPoint(currentLine.boundingPolygon);
        if (
          topLineEdge >= anchorEdge &&
          this.overlapsWithAlignmentPointX(
            currentLine.boundingPolygon,
            alignmentPoint,
          )
        ) {
          if (prev) {
            if (this.getTopPoint(prev.boundingPolygon) > topLineEdge) {
              return currentLine;
            }
          } else {
            return currentLine;
          }
        }
        return prev;
      },
      <StandardizedLine | undefined>undefined,
    );

    if (!matchingLine) {
      throw this.NO_MATCH_ERROR;
    }

    return matchingLine;
  }

  extractRow(configuration: Row): StandardizedLine {
    const { anchorLine, page } = this.getAnchorLine(configuration.anchor);

    if (!anchorLine) {
      throw this.NO_ANCHOR_ERROR;
    }

    const { position, tiebreaker } = configuration;
    let matchingLine: StandardizedLine | undefined;

    const anchorEdge =
      position === "left"
        ? this.getLeftmostPoint(anchorLine.boundingPolygon)
        : this.getRightmostPoint(anchorLine.boundingPolygon);

    const linesOnRelevantSide = this.text.pages[<number>page].lines.reduce(
      (acc, currentLine) => {
        if (position === "left") {
          const rightLineEdge = this.getRightmostPoint(
            currentLine.boundingPolygon,
          );
          if (
            rightLineEdge <= anchorEdge &&
            this.verticallyOverlapsWithAnchor(
              currentLine.boundingPolygon,
              anchorLine.boundingPolygon,
            )
          ) {
            acc.push(currentLine);
          }
          return acc;
        }

        const leftLineEdge = this.getLeftmostPoint(currentLine.boundingPolygon);
        if (
          leftLineEdge >= anchorEdge &&
          this.verticallyOverlapsWithAnchor(
            currentLine.boundingPolygon,
            anchorLine.boundingPolygon,
          )
        ) {
          acc.push(currentLine);
        }
        return acc;
      },
      <StandardizedLine[]>[],
    );

    linesOnRelevantSide.sort((lineA, lineB) => {
      if (position === "left") {
        const lineARightEdge = this.getRightmostPoint(lineA.boundingPolygon);
        const lineBRightEdge = this.getRightmostPoint(lineB.boundingPolygon);
        return lineBRightEdge - lineARightEdge;
      }
      const lineALeftEdge = this.getLeftmostPoint(lineA.boundingPolygon);
      const lineBLeftEdge = this.getLeftmostPoint(lineB.boundingPolygon);
      return lineALeftEdge - lineBLeftEdge;
    });

    if (tiebreaker === "first") matchingLine = linesOnRelevantSide[0];
    if (tiebreaker === "second") matchingLine = linesOnRelevantSide[1];
    if (tiebreaker === "last")
      matchingLine = linesOnRelevantSide[linesOnRelevantSide.length - 1];

    if (!matchingLine) {
      throw this.NO_MATCH_ERROR;
    }

    return matchingLine;
  }

  private getRightmostPoint(polygon: Polygon): number {
    return Math.max(polygon[1].x, polygon[2].x);
  }

  private getLeftmostPoint(polygon: Polygon): number {
    return Math.min(polygon[0].x, polygon[3].x);
  }

  private getTopPoint(polygon: Polygon): number {
    return Math.min(polygon[0].y, polygon[1].y);
  }

  private getBottomPoint(polygon: Polygon): number {
    return Math.max(polygon[3].y, polygon[2].y);
  }

  private verticallyOverlapsWithAnchor(
    polygon: Polygon,
    anchor: Polygon,
  ): boolean {
    const polygonTop = this.getTopPoint(polygon);
    const polygonBottom = this.getBottomPoint(polygon);
    const anchorTop = this.getTopPoint(anchor);
    const anchorBottom = this.getBottomPoint(anchor);

    const bottomBelowAnchorTop = polygonBottom >= anchorTop;
    const topAboveAnchorBottom = polygonTop <= anchorBottom;
    const topBelowAnchorTop = polygonTop >= anchorTop;
    const bottomAboveAnchorBottom = polygonBottom <= anchorBottom;

    return (
      (topAboveAnchorBottom && topBelowAnchorTop) ||
      (bottomBelowAnchorTop && bottomAboveAnchorBottom)
    );
  }

  private overlapsWithAlignmentPointX(
    polygon: Polygon,
    alignmentPoint: number,
  ) {
    const polygonLeft = this.getLeftmostPoint(polygon);
    const polygonRight = this.getRightmostPoint(polygon);
    return alignmentPoint >= polygonLeft && alignmentPoint <= polygonRight;
  }

  private getAnchorLine(anchor: string): {
    anchorLine: StandardizedLine | undefined;
    page: number | undefined;
  } {
    let anchorLine: StandardizedLine | undefined;
    let page: number | undefined;

    for (let i = 0; i < this.text.pages.length; i++) {
      anchorLine = this.text.pages[i].lines.find(
        (line) =>
          line.text.trim().toLowerCase() === anchor.trim().toLowerCase(),
      );
      if (anchorLine) {
        page = i;
        break;
      }
    }

    return { anchorLine, page };
  }
}
