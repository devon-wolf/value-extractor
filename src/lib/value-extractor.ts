import {
  Direction,
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

  extractValue(configuration: Label | Row): StandardizedLine {
    const { anchorLine, page } = this.getAnchorLine(configuration.anchor);
    if (!anchorLine) {
      throw this.NO_ANCHOR_ERROR;
    }
    const value = this.findValue(configuration, anchorLine, <number>page);
    if (!value) {
      throw this.NO_MATCH_ERROR;
    }
    return value;
  }

  private findValue(
    configuration: Label | Row,
    anchorLine: StandardizedLine,
    page: number,
  ): StandardizedLine | undefined {
    const lines = this.getLinesOnRelevantSideOfAnchor(
      anchorLine,
      configuration,
      page,
    );

    const tiebreaker =
      configuration.id === "label" ? "first" : configuration.tiebreaker;

    switch (tiebreaker) {
      case "first":
        return lines[0];
      case "second":
        return lines[1];
      case "last":
        return lines[lines.length - 1];
    }
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

  private getLinesOnRelevantSideOfAnchor(
    anchorLine: StandardizedLine,
    configuration: Label | Row,
    page: number,
  ): StandardizedLine[] {
    const { position } = configuration;
    return this.text.pages[page].lines.reduce(
      (lines, currentLine) => {
        const lineEdge = this.getAdjacentEdge(
          currentLine.boundingPolygon,
          position,
        );
        if (
          this.isOnTargetSideOfAnchor(
            lineEdge,
            this.getAnchorEdge(anchorLine.boundingPolygon, position),
            position,
          ) &&
          this.alignsWithAnchor(
            currentLine.boundingPolygon,
            anchorLine,
            configuration,
          )
        ) {
          if (
            lines[0] &&
            this.isCloserToAnchorThanPrev(
              lineEdge,
              this.getAdjacentEdge(lines[0].boundingPolygon, position),
              position,
            )
          ) {
            lines.unshift(currentLine);
          } else {
            lines.push(currentLine);
          }
        }
        return lines;
      },
      <StandardizedLine[]>[],
    );
  }

  private alignsWithAnchor(
    polygon: Polygon,
    anchorLine: StandardizedLine,
    configuration: Label | Row,
  ) {
    if (
      configuration.position === "above" ||
      configuration.position === "below"
    ) {
      return this.alignsWithHorizontalAnchorPoint(
        polygon,
        this.getAnchorEdge(
          anchorLine.boundingPolygon,
          configuration.textAlignment,
        ),
      );
    }
    return this.alignsVerticallyWithAnchor(polygon, anchorLine.boundingPolygon);
  }

  private alignsWithHorizontalAnchorPoint(
    polygon: Polygon,
    alignmentPoint: number,
  ): boolean {
    const polygonLeft = this.getLeftmostPoint(polygon);
    const polygonRight = this.getRightmostPoint(polygon);
    return alignmentPoint >= polygonLeft && alignmentPoint <= polygonRight;
  }

  private alignsVerticallyWithAnchor(
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

  private isCloserToAnchorThanPrev(
    currentEdge: number,
    prevEdge: number,
    position: Direction,
  ): boolean {
    switch (position) {
      case "right":
        return currentEdge < prevEdge;
      case "left":
        return currentEdge > prevEdge;
      case "below":
        return currentEdge < prevEdge;
      case "above":
        return currentEdge > prevEdge;
    }
  }

  private isOnTargetSideOfAnchor(
    lineEdge: number,
    anchorEdge: number,
    position: Direction,
  ): boolean {
    switch (position) {
      case "right":
        return lineEdge >= anchorEdge;
      case "left":
        return lineEdge <= anchorEdge;
      case "below":
        return lineEdge >= anchorEdge;
      case "above":
        return lineEdge <= anchorEdge;
    }
  }

  private getAnchorEdge(polygon: Polygon, position: Direction): number {
    switch (position) {
      case "right":
        return this.getRightmostPoint(polygon);
      case "left":
        return this.getLeftmostPoint(polygon);
      case "below":
        return this.getBottomPoint(polygon);
      case "above":
        return this.getTopPoint(polygon);
    }
  }

  private getAdjacentEdge(polygon: Polygon, position: Direction): number {
    switch (position) {
      case "right":
        return this.getLeftmostPoint(polygon);
      case "left":
        return this.getRightmostPoint(polygon);
      case "below":
        return this.getTopPoint(polygon);
      case "above":
        return this.getBottomPoint(polygon);
    }
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
}
