import * as sampleText from "./data/standardized_text.json";
import { BELOW, FIRST, LABEL, LEFT, Label, RIGHT, ROW, Row } from "./lib/types";
import ValueExtractor from "./lib/value-extractor";

const extractor = new ValueExtractor(sampleText);
const labelInput: Label = {
	id: LABEL,
	position: BELOW,
	textAlignment: LEFT,
	anchor: "distance",
};
const labelOutput = extractor.extractValue(labelInput);
const rowInput: Row = {
	id: ROW,
	position: RIGHT,
	tiebreaker: FIRST,
	anchor: "line haul",
};
const rowOutput = extractor.extractValue(rowInput);

console.log(
	`Value for label ${JSON.stringify(labelInput)}:\n${JSON.stringify(labelOutput, null, 2)}\n`,
);
console.log(
	`Value for row ${JSON.stringify(rowInput)}:\n${JSON.stringify(rowOutput, null, 2)}\n`,
);
