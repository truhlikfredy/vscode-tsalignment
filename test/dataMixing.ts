import { ITestUnitConfig } from "./testUnitConfigI";

export const tests: ITestUnitConfig[] = [
  {
    config: [
      {
        leftCount:  0,
        rightCount: 1,
        symbol:     ":",
      },
      {
        leftCount:  1,
        rightCount: 1,
        symbol:     "=",
      },
    ],
    expected: [
      "this.alignEverythingHere    = 0;",
      "this.alignEverythingHereOld = 0;",
      "this.doAlignmentAgain       = false;",
      "this.alignSymbol            = { symbol: '', leftCount: 0, rightCount: 0 };",
    ],
    input: [
      "this.alignEverythingHere = 0;",
      "this.alignEverythingHereOld = 0;",
      "this.doAlignmentAgain = false;",
      "this.alignSymbol = { symbol: '', leftCount: 0, rightCount: 0 };",
    ],
    title: "primitives with a objects",
  },
];
