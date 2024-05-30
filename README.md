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
