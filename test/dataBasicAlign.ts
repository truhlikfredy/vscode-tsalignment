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
        leftCount:   1,
        rightCount:  2,
        symbol:      ":",
      },
    ],
    expected: [
      "// comments which should not be affected",
      "let hello       :  string='text';",
      "const longerVar :  boolean  =   false;",
    ],
    title: "colon multiple spaces",
  },
  {
    config: [
      {
        leftCount:   0,
        rightCount:  2,
        symbol:      ":",
      },
    ],
    expected: [
      "// comments which should not be affected",
      "let hello      :  string='text';",
      "const longerVar:  boolean  =   false;",
    ],
    title: "colon 0 spaces take 1",
  },
  {
    config: [
      {
        leftCount:   1,
        rightCount:  0,
        symbol:      ":",
      },
    ],
    expected: [
      "// comments which should not be affected",
      "let hello       :string='text';",
      "const longerVar :boolean  =   false;",
    ],
    title: "colon 0 spaces take 2",
  },
  {
    config: [
      {
        leftCount:   0,
        rightCount:  0,
        symbol:      ":",
      },
    ],
    expected: [
      "// comments which should not be affected",
      "let hello      :string='text';",
      "const longerVar:boolean  =   false;",
    ],
    title: "colon 0 spaces take 3",
  },
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
      "// comments which should not be affected",
      "let hello      : string  = 'text';",
      "const longerVar: boolean = false;",
    ],
    title: "colon and equals",
  },
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
        symbol:     "=",
      },
    ],
    expected: [
      "// comments which should not be affected",
      "let hello:       string  = 'text';",
      "const longerVar: boolean = false;",
    ],
    title: "colon (left aligned) and equals normally",
  },
  {
    config: [
      {
        leftCount: 1,
        rightCount: -1,
        symbol: ":",
      },
      {
        leftCount: 1,
        rightCount: 1,
        symbol: "=",
      },
    ],
    expected: [
      "// comments which should not be affected",
      "let hello       :string  = 'text';",
      "const longerVar :boolean = false;",
    ],
    title: "colon (right aligned) and equals normally",
  },
  {
    alignFirstSymbolOnly: true,
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
      "// comments which should not be affected",
      "let hello      : string='text';",
      "const longerVar: boolean  =   false;",
    ],
    title: "colon and equals, but do only first",
  },
  {
    config: [
      {
        leftCount:      0,
        rightCharacter: "\t",
        rightCount:     2,
        symbol:         ":",
      },
      {
        leftCount:  1,
        rightCount: 1,
        symbol:     "=",
      },
    ],
    expected: [
      "// comments which should not be affected",
      "let hello      :\t\tstring  = 'text';",
      "const longerVar:\t\tboolean = false;",
    ],
    title: "tabs and spaces",
  },

];
