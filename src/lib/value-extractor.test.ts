import { describe, expect, it } from "@jest/globals";
import * as sampleText from "../data/standardized_text.json";
import * as shuffledSample from "../data/test/shuffled_text.json";
import {
  UNSUPPORTED_ID_ERROR,
  UNSUPPORTED_LABEL_POSITION,
  UNSUPPORTED_ROW_POSITION,
  UNSUPPORTED_TEXT_ALIGNMENT,
  UNSUPPORTED_TIEBREAKER,
} from "./constants";
import {
  ABOVE,
  BELOW,
  FIRST,
  LABEL,
  LAST,
  LEFT,
  Label,
  RIGHT,
  ROW,
  Row,
  SECOND,
  StandardizedLine,
} from "./types";
import ValueExtractor from "./value-extractor";

describe("Class: ValueExtractor", () => {
  const extractor = new ValueExtractor(sampleText);
  const shuffledExtractor = new ValueExtractor(shuffledSample);

  describe("Feature: Extracting label values", () => {
    describe("Input: below left", () => {
      it("returns the closest line below and left of the anchor", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: BELOW,
          textAlignment: LEFT,
          anchor: "distance",
        });
        const expected = [
          {
            anchor: {
              text: "Distance",
              boundingPolygon: [
                { x: 2.005, y: 4.224 },
                { x: 2.438, y: 4.224 },
                { x: 2.438, y: 4.328 },
                { x: 2.005, y: 4.328 },
              ],
            },
            value: {
              text: "733mi",
              boundingPolygon: [
                { x: 2.005, y: 4.413 },
                { x: 2.374, y: 4.413 },
                { x: 2.374, y: 4.541 },
                { x: 2.005, y: 4.541 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: above left", () => {
      it("returns the closest line above and left of the anchor", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: ABOVE,
          textAlignment: LEFT,
          anchor: "19,748lbs",
        });
        const expected = [
          {
            anchor: {
              text: "19,748lbs",
              boundingPolygon: [
                { x: 0.943, y: 4.413 },
                { x: 1.52, y: 4.413 },
                { x: 1.52, y: 4.541 },
                { x: 0.943, y: 4.541 },
              ],
            },
            value: {
              text: "Weight",
              boundingPolygon: [
                { x: 0.943, y: 4.224 },
                { x: 1.297, y: 4.224 },
                { x: 1.297, y: 4.328 },
                { x: 0.943, y: 4.328 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: below right", () => {
      it("returns the closest line below and right of the anchor", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: BELOW,
          textAlignment: RIGHT,
          anchor: "cargo value",
        });
        const expected = [
          {
            anchor: {
              text: "Cargo Value",
              boundingPolygon: [
                { x: 5.189, y: 4.224 },
                { x: 5.785, y: 4.224 },
                { x: 5.785, y: 4.328 },
                { x: 5.189, y: 4.328 },
              ],
            },
            value: {
              text: "$100000.00",
              boundingPolygon: [
                { x: 5.189, y: 4.413 },
                { x: 5.915, y: 4.413 },
                { x: 5.915, y: 4.541 },
                { x: 5.189, y: 4.541 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: above right", () => {
      it("returns the closest line above and right of the anchor", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: ABOVE,
          textAlignment: RIGHT,
          anchor: "wire",
        });
        const expected = [
          {
            anchor: {
              text: "WIRE",
              boundingPolygon: [
                { x: 0.943, y: 5.056 },
                { x: 1.26, y: 5.056 },
                { x: 1.26, y: 5.184 },
                { x: 0.943, y: 5.184 },
              ],
            },
            value: {
              text: "Commodity",
              boundingPolygon: [
                { x: 0.943, y: 4.866 },
                { x: 1.524, y: 4.866 },
                { x: 1.524, y: 4.97 },
                { x: 0.943, y: 4.97 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left [any]", () => {
      it("returns the closest line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: LEFT,
          textAlignment: LEFT,
          anchor: "dot number",
        });
        const expected = [
          {
            anchor: {
              text: "DOT number",
              boundingPolygon: [
                { x: 4.725, y: 1.482 },
                { x: 5.358, y: 1.482 },
                { x: 5.358, y: 1.586 },
                { x: 4.725, y: 1.586 },
              ],
            },
            value: {
              text: "MC number",
              boundingPolygon: [
                { x: 3.832, y: 1.482 },
                { x: 4.411, y: 1.482 },
                { x: 4.411, y: 1.586 },
                { x: 3.832, y: 1.586 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: right [any]", () => {
      it("returns the closest line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: RIGHT,
          textAlignment: RIGHT,
          anchor: "dispatch phone calls",
        });
        const expected = [
          {
            anchor: {
              text: "Dispatch phone calls",
              boundingPolygon: [
                { x: 0.943, y: 3.368 },
                { x: 1.838, y: 3.368 },
                { x: 1.838, y: 3.458 },
                { x: 0.943, y: 3.458 },
              ],
            },
            value: {
              text: "Reefer Requirements (for reefer shipments only)",
              boundingPolygon: [
                { x: 4.13, y: 3.368 },
                { x: 6.231, y: 3.368 },
                { x: 6.231, y: 3.458 },
                { x: 4.13, y: 3.458 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: Multiline", () => {
      it("returns the closest multiline group to the requested side of the anchor", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: BELOW,
          textAlignment: LEFT,
          anchor: "pickup notes",
          multiline: true,
        });
        const expected = [
          {
            anchor: {
              text: "Pickup Notes",
              boundingPolygon: [
                { x: 4.293, y: 6.216 },
                { x: 4.94, y: 6.216 },
                { x: 4.94, y: 6.32 },
                { x: 4.293, y: 6.32 },
              ],
            },
            value: {
              text: '"TRACKING - The driver must be EASY to contact or active on the Uber Freight app at all times during the transit of this load, in order to provide updates to the tracking team."',
              boundingPolygon: [
                { x: 4.293, y: 6.408 },
                { x: 7.295, y: 6.408 },
                { x: 7.295, y: 6.869 },
                { x: 4.293, y: 6.869 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: Anchor not in document", () => {
      it("returns an empty array if the anchor text is not in the document", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: BELOW,
          textAlignment: LEFT,
          anchor: "purple platypus",
        });
        const expected: StandardizedLine[] = [];
        expect(actual).toEqual(expected);
      });
    });

    describe("Text: No match", () => {
      it("returns an empty array if there is no match for the criteria in the document", () => {
        const actual = extractor.extractValue({
          id: LABEL,
          position: ABOVE,
          textAlignment: LEFT,
          anchor: "Email freight-carrier@uber.com",
        });
        const expected: StandardizedLine[] = [];
        expect(actual).toEqual(expected);
      });
    });

    describe("Text: different order", () => {
      it("does not rely on the order of the lines to return the closest line based on requested criteria", () => {
        const actual = shuffledExtractor.extractValue({
          id: LABEL,
          position: BELOW,
          textAlignment: LEFT,
          anchor: "distance",
        });
        const expected = [
          {
            anchor: {
              text: "Distance",
              boundingPolygon: [
                { x: 2.005, y: 4.224 },
                { x: 2.438, y: 4.224 },
                { x: 2.438, y: 4.328 },
                { x: 2.005, y: 4.328 },
              ],
            },
            value: {
              text: "733mi",
              boundingPolygon: [
                { x: 2.005, y: 4.413 },
                { x: 2.374, y: 4.413 },
                { x: 2.374, y: 4.541 },
                { x: 2.005, y: 4.541 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("Feature: Extracting row values", () => {
    describe("Input: right first", () => {
      it("returns the first line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: RIGHT,
          tiebreaker: FIRST,
          anchor: "line haul",
        });
        const expected = [
          {
            anchor: {
              text: "Line Haul",
              boundingPolygon: [
                { x: 4.13, y: 1.994 },
                { x: 4.695, y: 1.994 },
                { x: 4.695, y: 2.122 },
                { x: 4.13, y: 2.122 },
              ],
            },
            value: {
              text: "$1770.00",
              boundingPolygon: [
                { x: 6.765, y: 1.994 },
                { x: 7.315, y: 1.994 },
                { x: 7.315, y: 2.122 },
                { x: 6.765, y: 2.122 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left first", () => {
      it("returns the first line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: LEFT,
          tiebreaker: FIRST,
          anchor: "packaging",
        });
        const expected = [
          {
            anchor: {
              text: "Packaging",
              boundingPolygon: [
                { x: 6.251, y: 4.224 },
                { x: 6.761, y: 4.224 },
                { x: 6.761, y: 4.328 },
                { x: 6.251, y: 4.328 },
              ],
            },
            value: {
              text: "Cargo Value",
              boundingPolygon: [
                { x: 5.189, y: 4.224 },
                { x: 5.785, y: 4.224 },
                { x: 5.785, y: 4.328 },
                { x: 5.189, y: 4.328 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: right second", () => {
      it("returns the second line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: RIGHT,
          tiebreaker: SECOND,
          anchor: "19,748lbs",
        });
        const expected = [
          {
            anchor: {
              text: "19,748lbs",
              boundingPolygon: [
                { x: 0.943, y: 4.413 },
                { x: 1.52, y: 4.413 },
                { x: 1.52, y: 4.541 },
                { x: 0.943, y: 4.541 },
              ],
            },
            value: {
              text: "VAN",
              boundingPolygon: [
                { x: 3.066, y: 4.413 },
                { x: 3.333, y: 4.413 },
                { x: 3.333, y: 4.541 },
                { x: 3.066, y: 4.541 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left second", () => {
      it("returns the second line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: LEFT,
          tiebreaker: SECOND,
          anchor: "pallet",
        });
        const expected = [
          {
            anchor: {
              text: "PALLET",
              boundingPolygon: [
                { x: 6.251, y: 4.413 },
                { x: 6.723, y: 4.413 },
                { x: 6.723, y: 4.541 },
                { x: 6.251, y: 4.541 },
              ],
            },
            value: {
              text: "0",
              boundingPolygon: [
                { x: 4.128, y: 4.413 },
                { x: 4.208, y: 4.413 },
                { x: 4.208, y: 4.541 },
                { x: 4.128, y: 4.541 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: right last", () => {
      it("returns the last line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: RIGHT,
          tiebreaker: LAST,
          anchor: "733mi",
        });
        const expected = [
          {
            anchor: {
              text: "733mi",
              boundingPolygon: [
                { x: 2.005, y: 4.413 },
                { x: 2.374, y: 4.413 },
                { x: 2.374, y: 4.541 },
                { x: 2.005, y: 4.541 },
              ],
            },
            value: {
              text: "PALLET",
              boundingPolygon: [
                { x: 6.251, y: 4.413 },
                { x: 6.723, y: 4.413 },
                { x: 6.723, y: 4.541 },
                { x: 6.251, y: 4.541 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left last", () => {
      it("returns the last line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: LEFT,
          tiebreaker: LAST,
          anchor: "$100000.00",
        });
        const expected = [
          {
            anchor: {
              text: "$100000.00",
              boundingPolygon: [
                { x: 5.189, y: 4.413 },
                { x: 5.915, y: 4.413 },
                { x: 5.915, y: 4.541 },
                { x: 5.189, y: 4.541 },
              ],
            },
            value: {
              text: "19,748lbs",
              boundingPolygon: [
                { x: 0.943, y: 4.413 },
                { x: 1.52, y: 4.413 },
                { x: 1.52, y: 4.541 },
                { x: 0.943, y: 4.541 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: Anchor not in document", () => {
      it("returns an empty array if the anchor text is not in the document", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: RIGHT,
          tiebreaker: FIRST,
          anchor: "purple platypus",
        });
        const expected: StandardizedLine[] = [];
        expect(actual).toEqual(expected);
      });
    });

    describe("Text: No match", () => {
      it("returns an empty array if there is no match for the criteria in the document", () => {
        const actual = extractor.extractValue({
          id: ROW,
          position: RIGHT,
          tiebreaker: LAST,
          anchor: "pallet",
        });
        const expected: StandardizedLine[] = [];
        expect(actual).toEqual(expected);
      });
    });

    describe("Text: different order", () => {
      it("does not rely on the order of the lines to return the closest line based on requested criteria", () => {
        const actual = shuffledExtractor.extractValue({
          id: ROW,
          position: RIGHT,
          tiebreaker: SECOND,
          anchor: "distance",
        });
        const expected = [
          {
            anchor: {
              text: "Distance",
              boundingPolygon: [
                { x: 2.005, y: 4.224 },
                { x: 2.438, y: 4.224 },
                { x: 2.438, y: 4.328 },
                { x: 2.005, y: 4.328 },
              ],
            },
            value: {
              text: "Packaging count",
              boundingPolygon: [
                { x: 4.128, y: 4.224 },
                { x: 4.951, y: 4.224 },
                { x: 4.951, y: 4.328 },
                { x: 4.128, y: 4.328 },
              ],
            },
          },
        ];
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("Handling bad input", () => {
    it("throws an error if input ID is not supported", () => {
      expect(() =>
        extractor.extractValue({
          id: "column",
          position: ABOVE,
          textAlignment: RIGHT,
          anchor: "distance",
        } as unknown as Label),
      ).toThrow(UNSUPPORTED_ID_ERROR);
    });

    it("throws an error if label input position is not supported", () => {
      expect(() =>
        extractor.extractValue({
          id: LABEL,
          position: "lower",
          textAlignment: LEFT,
          anchor: "distance",
        } as unknown as Label),
      ).toThrow(UNSUPPORTED_LABEL_POSITION);
    });

    it("throws an error if row input position is not supported", () => {
      expect(() => {
        extractor.extractValue({
          id: ROW,
          position: "east",
          tiebreaker: FIRST,
          anchor: "distance",
        } as unknown as Row);
      }).toThrow(UNSUPPORTED_ROW_POSITION);
    });

    it("throws an error if label textAlignment is not supported", () => {
      expect(() =>
        extractor.extractValue({
          id: LABEL,
          position: ABOVE,
          textAlignment: "justified",
          anchor: "distance",
        } as unknown as Label),
      ).toThrow(UNSUPPORTED_TEXT_ALIGNMENT);
    });

    it("throws an error if row tiebreaker is not supported", () => {
      expect(() => {
        extractor.extractValue({
          id: ROW,
          position: RIGHT,
          tiebreaker: "third",
          anchor: "distance",
        } as unknown as Row);
      }).toThrow(UNSUPPORTED_TIEBREAKER);
    });
  });
});
