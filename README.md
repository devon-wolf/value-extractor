# value-extractor

## Prompt

> The objective of the exercise is to implement label and row extraction methods that run on standardized text output from a PDF. These are two of the earliest methods we implemented in the platform. Label finds a value adjacent to an anchor line (some static line of text in the document), and row finds a value at approximately the same vertical position as the anchor line. I've attached a text file with sample input and output, a types file specifying the relevant types for the exercise, a redacted source PDF, and its text (in StandardizedText format, with the redacted pieces changed from their originals). A bonus challenge would be to expand the label method to capture multiline values, like under the pickup notes anchor in the PDF.

## Scripts

| Command              | Description                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`      | removes prior build from `/dist` folder, then runs the TypeScript compiler (`tsc`) on the `/src` directory and outputs JS files to the `/dist` folder |
| `npm run start`      | starts the app with an entry point of `dist/main.js` (it assumes the `/dist` folder has already been built)                                           |
| `npm run dev`        | builds and starts the app, then watches for changes, rebuilds as-needed, and restarts the app when changes are detected                               |
| `npm run test`       | runs the test files in the project                                                                                                                    |
| `npm run test:watch` | runs the test files in the project and watches for changes; reruns tests on changes                                                                   |
| `npm run fix`        | runs the Prettier formatter on the project, writes formatting changes to files                                                                        |

## Usage

The main feature of this exercise is the `ValueExtractor` class, which takes in a `StanardizedText` object and makes an `extractValues` method available for acting on that text.

The `extractValues` method takes in a `Label` or a `Row`. It returns an array of matches in the form of `{ anchor: StandardizedLine, value: StandardizedLine }`, where `anchor` is a line matching the specified anchor text.

Example usage:

```ts
const extractor = new ValueExtractor(sampleText);
const input: Label = {
  id: "label",
  position: "below",
  textAlignment: "left",
  anchor: "distance",
};
const output = extractor.extractValue(input);

/*
output:
[
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
]
*/
```

The provided sample input is run in `main.ts`. You can run this in your terminal two ways:

- `npm run build` followed by `npm run start` for a one-off run
- `npm run dev` to run and watch for changes, retranspiling when needed

There is also a suite of basic tests covering the many possible combinations of input that might be passed to the method. These tests can be run with `npm run test` for a one-off or `npm run test:watch` to run and watch for changes.

## Assumptions

I have made several assumptions that are reflected in the design of the code:

- That I could not rely on the order that lines would appear in a `StandardizedPage`. It might actually be reasonable to assume several things about the order of the lines in a page object, but without more knowledge about how those objects are produced I would not feel comfortable relying on specific patterns I saw in the order.
  - If, in fact, the order can be relied on, some of the match search times can potentially be cut down, since I would be able to target only the portion of the array on the desired side of the anchor (though I did not confirm this).
- That there may be multiple instances of an anchor in the text, and that each should be returned.
  - This led to changing the signature of the output from a single `StandardizedLine` to an array of anchors and their matching lines. I also assumed it would be valuable to know the position of which anchor belonged to which value.
- That an error should be thrown if an anchor does not appear in the text, or if there are no matches for the anchor.
- That the polygons are all quadrilaterals but are not _necessarily_ rectangles.
  - Realistically, all the polygons in the sample are rectangles, and as such there are probably some rectangle-related assumptions that have snuck into the code since I did not have other shapes to test against.
  - If they are in fact always rectangles, that may open opportunities for simplification.

## Feature Considerations

There were some features I did not implement, but that in the real world I would include in tickets of features to be worked on:

- Matching lines across pages. For example, when a label is at the bottom of page 1 and its value is at the top of page 2. For simplicity, I did not explore what would be required to implement this.
- Multiline values. Right now, only the first line of a multiline value is returned as a match.
  - I began work on this, but did not come to a reasonable conclusion about how to know when to stop adding lines. I'd note that as the main problem to be solved in order to implement this feature.
