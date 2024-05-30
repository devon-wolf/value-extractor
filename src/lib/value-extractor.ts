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
    const anchorLine = this.getAnchorLine(configuration.anchor);

    return {} as StandardizedLine;
  }

  extractRow(configuration: Row): StandardizedLine {
    const anchorLine = this.getAnchorLine(configuration.anchor);
    if (!anchorLine) {
      throw this.NO_ANCHOR_ERROR;
    }
    return {} as StandardizedLine;
  }

  private getAnchorLine(anchor: string): StandardizedLine {
    let anchorLine: StandardizedLine | undefined;

    for (const page of this.text.pages) {
      anchorLine = page.lines.find(
        (line) =>
          line.text.trim().toLowerCase() === anchor.trim().toLowerCase(),
      );
      if (anchorLine) break;
    }

    if (!anchorLine) {
      throw this.NO_ANCHOR_ERROR;
    }

    return anchorLine;
  }
}
