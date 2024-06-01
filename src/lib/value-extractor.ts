import {
  NO_ANCHOR_ERROR,
  NO_MATCH_ERROR,
  UNSUPPORTED_ID_ERROR,
  UNSUPPORTED_LABEL_POSITION,
  UNSUPPORTED_ROW_POSITION,
  UNSUPPORTED_TEXT_ALIGNMENT,
  UNSUPPORTED_TIEBREAKER,
} from "./constants";
import {
  alignsWithAnchor,
  getAdjacentEdge,
  getAnchorEdge,
  isCloserToAnchorThanPrev,
  isOnTargetSideOfAnchor,
} from "./polygon-utils";
import {
  HorizontalDirection,
  IdType,
  Label,
  Row,
  StandardizedLine,
  StandardizedText,
  Tiebreaker,
  VerticalDirection,
} from "./types";

const { FIRST, SECOND, LAST } = Tiebreaker;
const { LABEL, ROW } = IdType;

export default class ValueExtractor {
  private readonly text: StandardizedText;

  constructor(text: StandardizedText) {
    this.text = text;
  }

  extractValue(configuration: Label | Row): StandardizedLine {
    this.checkConfiguration(configuration);

    const { anchorLine, page } = this.findAnchorLine(configuration.anchor);
    if (!anchorLine) {
      throw new Error(NO_ANCHOR_ERROR);
    }

    const value = this.findValue(configuration, anchorLine, <number>page);
    if (!value) {
      throw new Error(NO_MATCH_ERROR);
    }

    return value;
  }

  private findValue(
    configuration: Label | Row,
    anchorLine: StandardizedLine,
    page: number,
  ): StandardizedLine | undefined {
    const lines = this.getLinesOnTargetSideOfAnchor(
      anchorLine,
      configuration,
      page,
    );

    const tiebreaker =
      configuration.id === LABEL ? FIRST : configuration.tiebreaker;

    switch (tiebreaker) {
      case FIRST:
        return lines[0];
      case SECOND:
        return lines[1];
      case LAST:
        return lines[lines.length - 1];
    }
  }

  private findAnchorLine(anchor: string): {
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

  private getLinesOnTargetSideOfAnchor(
    anchorLine: StandardizedLine,
    configuration: Label | Row,
    page: number,
  ): StandardizedLine[] {
    const { position } = configuration;
    return this.text.pages[page].lines.reduce(
      (lines, currentLine) => {
        const lineEdge = getAdjacentEdge(currentLine.boundingPolygon, position);
        if (
          isOnTargetSideOfAnchor(
            lineEdge,
            getAnchorEdge(anchorLine.boundingPolygon, position),
            position,
          ) &&
          alignsWithAnchor(
            currentLine.boundingPolygon,
            anchorLine.boundingPolygon,
            configuration,
          )
        ) {
          const prev = lines[0];
          if (
            prev &&
            isCloserToAnchorThanPrev(
              currentLine.boundingPolygon,
              prev.boundingPolygon,
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

  private checkConfiguration(configuration: Label | Row) {
    const { id, position } = configuration;
    const horizontalDirections = Object.values(HorizontalDirection);
    const allDirections = [
      ...Object.values(VerticalDirection),
      ...horizontalDirections,
    ];
    const tiebreakers = Object.values(Tiebreaker);
    const idTypes = Object.values(IdType);

    if (!idTypes.includes(id)) {
      throw new Error(UNSUPPORTED_ID_ERROR);
    }
    if (id === LABEL) {
      if (!allDirections.includes(position)) {
        throw new Error(UNSUPPORTED_LABEL_POSITION);
      }
      if (!horizontalDirections.includes(configuration.textAlignment)) {
        throw new Error(UNSUPPORTED_TEXT_ALIGNMENT);
      }
    }
    if (id === ROW) {
      if (!horizontalDirections.includes(position)) {
        throw new Error(UNSUPPORTED_ROW_POSITION);
      }
      if (!tiebreakers.includes(configuration.tiebreaker)) {
        throw new Error(UNSUPPORTED_TIEBREAKER);
      }
    }
  }
}
