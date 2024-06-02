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
  getAdjacentEdge,
  isCloserToAnchorThanPrev,
  isInTargetRange,
} from "./polygon-utils";
import {
  AnchorMapEntry,
  Direction,
  ExtractedValue,
  FIRST,
  LABEL,
  LAST,
  Label,
  ROW,
  Row,
  SECOND,
  StandardizedLine,
  StandardizedText,
  allDirections,
  horizontalDirections,
  idTypes,
  tiebreakers,
} from "./types";

export default class ValueExtractor {
  private readonly text: StandardizedText;
  private readonly anchorIndex: Map<
    string,
    { line: StandardizedLine; page: number }[]
  >;

  constructor(text: StandardizedText) {
    this.text = text;
    this.anchorIndex = this.buildAnchorIndex();
  }

  extractValue(configuration: Label | Row): ExtractedValue[] {
    this.checkConfiguration(configuration);

    const anchorMatches = this.anchorIndex.get(
      configuration.anchor.trim().toLowerCase(),
    );

    if (!anchorMatches) {
      throw new Error(NO_ANCHOR_ERROR);
    }

    const values = anchorMatches.reduce(
      (acc, anchor) => {
        const value = this.findValue(configuration, anchor.line, anchor.page);
        value && acc.push({ anchor: anchor.line, value });
        return acc;
      },
      <ExtractedValue[]>[],
    );

    if (values.length === 0) {
      throw new Error(NO_MATCH_ERROR);
    }

    return values;
  }

  private buildAnchorIndex(): Map<string, AnchorMapEntry[]> {
    const index = new Map();
    this.text.pages.forEach((page, pageIdx) => {
      page.lines.forEach((line) => {
        const trimmedText = line.text.trim().toLowerCase();
        const entry = index.get(trimmedText);
        if (entry) {
          entry.push({ line, page: pageIdx });
        } else {
          index.set(trimmedText, [{ line, page: pageIdx }]);
        }
      });
    });
    return index;
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

  private getLinesOnTargetSideOfAnchor(
    anchorLine: StandardizedLine,
    configuration: Label | Row,
    page: number,
  ): StandardizedLine[] {
    const { position } = configuration;

    return this.text.pages[page].lines.reduce(
      (lines, currentLine) => {
        if (
          isInTargetRange(
            currentLine.boundingPolygon,
            anchorLine.boundingPolygon,
            configuration,
          )
        ) {
          this.updateTargetLines(lines, currentLine, position);
        }
        return lines;
      },
      <StandardizedLine[]>[],
    );
  }

  private updateTargetLines(
    lines: StandardizedLine[],
    currentLine: StandardizedLine,
    position: Direction,
  ): void {
    // do a partial sort to determine whether the current line should be in any of the targeted positions (first, second, last)
    const lineEdge = getAdjacentEdge(currentLine.boundingPolygon, position);
    if (lines.length === 0) {
      // this is the first pass, push the line into the empty array
      lines.push(currentLine);
    } else {
      const currentClosestEdge = getAdjacentEdge(
        lines[0].boundingPolygon,
        position,
      );
      const currentFarthestEdge = getAdjacentEdge(
        lines[lines.length - 1].boundingPolygon,
        position,
      );

      if (isCloserToAnchorThanPrev(lineEdge, currentClosestEdge, position)) {
        // this line is the new closest
        lines.unshift(currentLine);
      } else if (
        !isCloserToAnchorThanPrev(lineEdge, currentFarthestEdge, position)
      ) {
        // this line is the new farthest
        lines.push(currentLine);
      } else if (lines.length > 1) {
        const currentSecondClosestEdge = getAdjacentEdge(
          lines[1].boundingPolygon,
          position,
        );
        if (
          isCloserToAnchorThanPrev(lineEdge, currentSecondClosestEdge, position)
        ) {
          // this line is the new second closest, shifts rest to the right
          lines.splice(1, 0, currentLine);
        }
      }
    }
  }

  private checkConfiguration(configuration: Label | Row) {
    const { id, position } = configuration;

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
