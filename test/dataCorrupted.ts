import { ITestUnitConfig } from "./testUnitConfigI";

export const input: string[] = [
  "// comments which should not be affected",
  "let hello: string='text';   ",
  "const longerVar: boolean  =   false;  ",
];

export const tests: ITestUnitConfig[] = [
  {
    config: [
      {
        leftCount:  -1,
        rightCount: 1,
        symbol:     ":",
      },
      {
        leftCount:  1,
        rightCount: 1,
        symbol:     ":",
      },
    ],
    expected: [],
    title: "Duplicate entry in config",
  },
  {
    expected: [],
    config: [],
    title: "Empty config settings",
  },
];
