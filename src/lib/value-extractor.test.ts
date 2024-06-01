import { describe, expect, it } from "@jest/globals";
import * as sampleText from "../data/standardized_text.json";
import {
  HorizontalDirection,
  IdType,
  Label,
  Row,
  Tiebreaker,
  VerticalDirection,
} from "./types";
import ValueExtractor from "./value-extractor";

describe("Class: ValueExtractor", () => {
  const extractor = new ValueExtractor(sampleText);
  const reversedSample = {
    ...sampleText,
    pages: sampleText.pages.map((page) => ({
      lines: [...page.lines].reverse(),
    })),
  };
  const reversedExtractor = new ValueExtractor(reversedSample);

  describe("Handling bad input", () => {
    it("throws an error if input ID is not supported", () => {
      expect(() =>
        extractor.extractValue({
          id: "column",
          position: VerticalDirection.ABOVE,
          textAlignment: HorizontalDirection.RIGHT,
          anchor: "distance",
        } as unknown as Label),
      ).toThrow("ID must be of type 'label' or 'row'");
    });

    it("throws an error if label input position is not supported", () => {
      expect(() =>
        extractor.extractValue({
          id: IdType.LABEL,
          position: "lower",
          textAlignment: HorizontalDirection.LEFT,
          anchor: "distance",
        } as unknown as Label),
      ).toThrow(
        "Position for label type must be 'above', 'below', 'left', or 'right'",
      );
    });

    it("throws an error if row input position is not supported", () => {
      expect(() => {
        extractor.extractValue({
          id: IdType.ROW,
          position: "east",
          tiebreaker: Tiebreaker.FIRST,
          anchor: "distance",
        } as unknown as Row);
      }).toThrow("Position for row type must be 'left' or 'right'");
    });

    it("throws an error if label textAlignment is not supported", () => {
      expect(() =>
        extractor.extractValue({
          id: IdType.LABEL,
          position: VerticalDirection.ABOVE,
          textAlignment: "justified",
          anchor: "distance",
        } as unknown as Label),
      ).toThrow("Text alignment must be 'left', or 'right'");
    });

    it("throws an error if row tiebreaker is not supported", () => {
      expect(() => {
        extractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.RIGHT,
          tiebreaker: "third",
          anchor: "distance",
        } as unknown as Row);
      }).toThrow("Tiebreaker must be 'first', 'second', or 'last'");
    });
  });

  describe("Feature: Extracting label values", () => {
    describe("Input: below left", () => {
      it("returns the closest line below and left of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.LABEL,
          position: VerticalDirection.BELOW,
          textAlignment: HorizontalDirection.LEFT,
          anchor: "distance",
        });
        const expected = {
          text: "733mi",
          boundingPolygon: [
            {
              x: 2.005,
              y: 4.413,
            },
            {
              x: 2.374,
              y: 4.413,
            },
            {
              x: 2.374,
              y: 4.541,
            },
            {
              x: 2.005,
              y: 4.541,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: above left", () => {
      it("returns the closest line above and left of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.LABEL,
          position: VerticalDirection.ABOVE,
          textAlignment: HorizontalDirection.LEFT,
          anchor: "19,748lbs",
        });
        const expected = {
          text: "Weight",
          boundingPolygon: [
            {
              x: 0.943,
              y: 4.224,
            },
            {
              x: 1.297,
              y: 4.224,
            },
            {
              x: 1.297,
              y: 4.328,
            },
            {
              x: 0.943,
              y: 4.328,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: below right", () => {
      it("returns the closest line below and right of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.LABEL,
          position: VerticalDirection.BELOW,
          textAlignment: HorizontalDirection.RIGHT,
          anchor: "cargo value",
        });
        const expected = {
          text: "$100000.00",
          boundingPolygon: [
            {
              x: 5.189,
              y: 4.413,
            },
            {
              x: 5.915,
              y: 4.413,
            },
            {
              x: 5.915,
              y: 4.541,
            },
            {
              x: 5.189,
              y: 4.541,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: above right", () => {
      it("returns the closest line above and right of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.LABEL,
          position: VerticalDirection.ABOVE,
          textAlignment: HorizontalDirection.RIGHT,
          anchor: "wire",
        });
        const expected = {
          text: "Commodity",
          boundingPolygon: [
            {
              x: 0.943,
              y: 4.866,
            },
            {
              x: 1.524,
              y: 4.866,
            },
            {
              x: 1.524,
              y: 4.97,
            },
            {
              x: 0.943,
              y: 4.97,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left [any]", () => {
      it("returns the closest line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.LABEL,
          position: HorizontalDirection.LEFT,
          textAlignment: HorizontalDirection.LEFT,
          anchor: "dot number",
        });
        const expected = {
          text: "MC number",
          boundingPolygon: [
            {
              x: 3.832,
              y: 1.482,
            },
            {
              x: 4.411,
              y: 1.482,
            },
            {
              x: 4.411,
              y: 1.586,
            },
            {
              x: 3.832,
              y: 1.586,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: right [any]", () => {
      it("returns the closest line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.LABEL,
          position: HorizontalDirection.RIGHT,
          textAlignment: HorizontalDirection.RIGHT,
          anchor: "dispatch phone calls",
        });
        const expected = {
          text: "Reefer Requirements (for reefer shipments only)",
          boundingPolygon: [
            {
              x: 4.13,
              y: 3.368,
            },
            {
              x: 6.231,
              y: 3.368,
            },
            {
              x: 6.231,
              y: 3.458,
            },
            {
              x: 4.13,
              y: 3.458,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: Anchor not in document", () => {
      it("throws an error if the anchor text is not in the document", () => {
        expect(() =>
          extractor.extractValue({
            id: IdType.LABEL,
            position: VerticalDirection.BELOW,
            textAlignment: HorizontalDirection.LEFT,
            anchor: "purple platypus",
          }),
        ).toThrow("Anchor text not found");
      });
    });

    describe("Text: No match", () => {
      it("throws an error if there is no match for the criteria in the document", () => {
        expect(() =>
          extractor.extractValue({
            id: IdType.LABEL,
            position: VerticalDirection.ABOVE,
            textAlignment: HorizontalDirection.LEFT,
            anchor: "Email freight-carrier@uber.com",
          }),
        ).toThrow("No match found for the requested anchor and position");
      });
    });

    describe("Text: different order", () => {
      it("does not rely on the order of the lines to return the closest line based on requested criteria", () => {
        const actual = reversedExtractor.extractValue({
          id: IdType.LABEL,
          position: VerticalDirection.BELOW,
          textAlignment: HorizontalDirection.LEFT,
          anchor: "distance",
        });
        const expected = {
          text: "733mi",
          boundingPolygon: [
            {
              x: 2.005,
              y: 4.413,
            },
            {
              x: 2.374,
              y: 4.413,
            },
            {
              x: 2.374,
              y: 4.541,
            },
            {
              x: 2.005,
              y: 4.541,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("Feature: Extracting row values", () => {
    describe("Input: right first", () => {
      it("returns the first line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.RIGHT,
          tiebreaker: Tiebreaker.FIRST,
          anchor: "line haul",
        });
        const expected = {
          text: "$1770.00",
          boundingPolygon: [
            {
              x: 6.765,
              y: 1.994,
            },
            {
              x: 7.315,
              y: 1.994,
            },
            {
              x: 7.315,
              y: 2.122,
            },
            {
              x: 6.765,
              y: 2.122,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left first", () => {
      it("returns the first line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.LEFT,
          tiebreaker: Tiebreaker.FIRST,
          anchor: "packaging",
        });
        const expected = {
          text: "Cargo Value",
          boundingPolygon: [
            {
              x: 5.189,
              y: 4.224,
            },
            {
              x: 5.785,
              y: 4.224,
            },
            {
              x: 5.785,
              y: 4.328,
            },
            {
              x: 5.189,
              y: 4.328,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: right second", () => {
      it("returns the second line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.RIGHT,
          tiebreaker: Tiebreaker.SECOND,
          anchor: "19,748lbs",
        });
        const expected = {
          text: "VAN",
          boundingPolygon: [
            {
              x: 3.066,
              y: 4.413,
            },
            {
              x: 3.333,
              y: 4.413,
            },
            {
              x: 3.333,
              y: 4.541,
            },
            {
              x: 3.066,
              y: 4.541,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left second", () => {
      it("returns the second line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.LEFT,
          tiebreaker: Tiebreaker.SECOND,
          anchor: "pallet",
        });
        const expected = {
          text: "0",
          boundingPolygon: [
            {
              x: 4.128,
              y: 4.413,
            },
            {
              x: 4.208,
              y: 4.413,
            },
            {
              x: 4.208,
              y: 4.541,
            },
            {
              x: 4.128,
              y: 4.541,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: right last", () => {
      it("returns the last line to the right of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.RIGHT,
          tiebreaker: Tiebreaker.LAST,
          anchor: "733mi",
        });
        const expected = {
          text: "PALLET",
          boundingPolygon: [
            {
              x: 6.251,
              y: 4.413,
            },
            {
              x: 6.723,
              y: 4.413,
            },
            {
              x: 6.723,
              y: 4.541,
            },
            {
              x: 6.251,
              y: 4.541,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: left last", () => {
      it("returns the last line to the left of the anchor", () => {
        const actual = extractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.LEFT,
          tiebreaker: Tiebreaker.LAST,
          anchor: "$100000.00",
        });
        const expected = {
          text: "19,748lbs",
          boundingPolygon: [
            {
              x: 0.943,
              y: 4.413,
            },
            {
              x: 1.52,
              y: 4.413,
            },
            {
              x: 1.52,
              y: 4.541,
            },
            {
              x: 0.943,
              y: 4.541,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: Anchor not in document", () => {
      it("throws an error if the anchor text is not in the document", () => {
        expect(() =>
          extractor.extractValue({
            id: IdType.ROW,
            position: HorizontalDirection.RIGHT,
            tiebreaker: Tiebreaker.FIRST,
            anchor: "purple platypus",
          }),
        ).toThrow("Anchor text not found");
      });
    });

    describe("Text: No match", () => {
      it("throws an error if there is no match for the criteria in the document", () => {
        expect(() =>
          extractor.extractValue({
            id: IdType.ROW,
            position: HorizontalDirection.RIGHT,
            tiebreaker: Tiebreaker.LAST,
            anchor: "pallet",
          }),
        ).toThrow("No match found for the requested anchor and position");
      });
    });

    describe("Text: different order", () => {
      it("does not rely on the order of the lines to return the closest line based on requested criteria", () => {
        const actual = reversedExtractor.extractValue({
          id: IdType.ROW,
          position: HorizontalDirection.RIGHT,
          tiebreaker: Tiebreaker.FIRST,
          anchor: "line haul",
        });
        const expected = {
          text: "$1770.00",
          boundingPolygon: [
            {
              x: 6.765,
              y: 1.994,
            },
            {
              x: 7.315,
              y: 1.994,
            },
            {
              x: 7.315,
              y: 2.122,
            },
            {
              x: 6.765,
              y: 2.122,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });
  });
});
