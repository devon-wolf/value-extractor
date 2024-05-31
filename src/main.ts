import ValueExtractor from "./lib/value-extractor";
import * as sampleText from "./data/standardized_text.json";
import { Label, Row } from "./lib/types";

const extractor = new ValueExtractor(sampleText);
const labelInput: Label = {
	id: "label",
	position: "below",
	textAlignment: "left",
	anchor: "distance",
};
const labelOutput = extractor.extractLabel(labelInput);
const rowInput: Row = {
	id: "row",
	position: "right",
	tiebreaker: "first",
	anchor: "line haul",
};
const rowOutput = extractor.extractRow(rowInput);

console.log(
	`Value for label ${JSON.stringify(labelInput)}:\n${JSON.stringify(labelOutput, null, 2)}`,
);
console.log(
	`Value for row ${JSON.stringify(rowInput)}:\n${JSON.stringify(rowOutput, null, 2)}`,
);
