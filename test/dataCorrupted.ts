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
    config: [],
    expected: [],
    title: "Empty config settings",
  },
  {
    config: [
      {
        leftCount: -1,
        rightCount: 1,
        symbol: "",
      },
    ],
    expected: [],
    title: "Empty symbol used in one entry",
  },
  {
    config: [
      {
        leftCharacter: "",
        leftCount: -1,
        rightCount: 1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Left character empty",
  },
  {
    config: [
      {
        leftCharacter: "",
        leftCount: -1,
        rightCount: 1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Right character empty",
  },
  {
    config: [
      {
        leftCharacter: "",
        leftCount: -1,
        rightCharacter: "",
        rightCount: 1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Left and right characters are empty",
  },
  {
    config: [
      {
        enabledRegex: "",
        leftCount: -1,
        rightCount: 1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Empty regex",
  },
  {
    config: [
      {
        enabledRegex: "lkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaa " +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa" +
          "kjfdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalkjfdsaaaaaaaaaaaaaaaaaaaaaaaaaa",
        leftCount: -1,
        rightCount: 1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Long regex",
  },
  {
    config: [
      {
        leftCount: -2,
        rightCount: 1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Left -2",
  },
  {
    config: [
      {
        leftCount: 101,
        rightCount: 1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Left 101",
  },
  {
    config: [
      {
        leftCount: -1,
        rightCount: -2,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Right -2",
  },
  {
    config: [
      {
        leftCount: 1,
        rightCount: 101,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Right 101",
  },
  {
    config: [
      {
        leftCount: -1,
        rightCount: -1,
        symbol: "f",
      },
    ],
    expected: [],
    title: "Left and Right negative at the same time",
  },
];
