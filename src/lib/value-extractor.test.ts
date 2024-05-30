import { describe, beforeEach, it, expect, jest } from "@jest/globals";
import * as sampleText from "../data/standardized_text.json";
import ValueExtractor from "./value-extractor";

describe("Class: ValueExtractor", () => {
  const extractor = new ValueExtractor(sampleText);

  describe("Private method: getAnchorLine", () => {
    it("returns the matching line from the text if it exists", () => {
      const actual = extractor["getAnchorLine"]("distance");
      const expected = {
        text: "Distance",
        boundingPolygon: [
          {
            x: 2.005,
            y: 4.224,
          },
          {
            x: 2.438,
            y: 4.224,
          },
          {
            x: 2.438,
            y: 4.328,
          },
          {
            x: 2.005,
            y: 4.328,
          },
        ],
      };
      expect(actual).toEqual(expected);
    });

    it("throws an error if a match is not found", () => {
      expect(() => extractor["getAnchorLine"]("purple platypus")).toThrow(
        "Anchor text not found",
      );
    });
  });

  describe("Public method: extractLabel", () => {
    describe("Input: below left", () => {
      it("returns the closest line below and left of the anchor", () => {
        const actual = extractor.extractLabel({
          id: "label",
          position: "below",
          textAlignment: "left",
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
        const actual = extractor.extractLabel({
          id: "label",
          position: "above",
          textAlignment: "left",
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
        const actual = extractor.extractLabel({
          id: "label",
          position: "below",
          textAlignment: "right",
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
        const actual = extractor.extractLabel({
          id: "label",
          position: "above",
          textAlignment: "right",
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
  });

  describe("Public method: extractRow", () => {
    describe("Input: right first", () => {
      it("returns the first line to the right of the anchor", () => {
        const actual = extractor.extractRow({
          id: "row",
          position: "right",
          tiebreaker: "first",
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
        const actual = extractor.extractRow({
          id: "row",
          position: "left",
          tiebreaker: "first",
          anchor: "price breakdown",
        });
        const expected = {
          text: "Rate confirmation",
          boundingPolygon: [
            {
              x: 0.943,
              y: 1.599,
            },
            {
              x: 2.155,
              y: 1.599,
            },
            {
              x: 2.155,
              y: 1.754,
            },
            {
              x: 0.943,
              y: 1.754,
            },
          ],
        };
        expect(actual).toEqual(expected);
      });
    });

    describe("Input: right second", () => {
      it("returns the second line to the right of the anchor", () => {
        const actual = extractor.extractRow({
          id: "row",
          position: "right",
          tiebreaker: "second",
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
        const actual = extractor.extractRow({
          id: "row",
          position: "left",
          tiebreaker: "second",
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
        const actual = extractor.extractRow({
          id: "row",
          position: "right",
          tiebreaker: "last",
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
        const actual = extractor.extractRow({
          id: "row",
          position: "left",
          tiebreaker: "last",
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
  });
});