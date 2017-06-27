import { ITestUnitConfig } from "./testUnitConfigI";

export const tests: ITestUnitConfig[] = [
  {
    config: [
      {
        enabledRegex: "^\\s*import\\s",
        leftCount:    1,
        rightCount:   1,
        symbol:       "from",
      },
    ],
    expected: [
      "//not import and do not from align anything here",
      "import { ConfigAlignSymbol } from './tsalignment';",
      "import * as vscode           from 'vscode';",
      "import Helper                from './helper';",
    ],
    input: [
      "//not import and do not from align anything here",
      "import { ConfigAlignSymbol } from './tsalignment';",
      "import * as vscode from 'vscode';",
      "import Helper from './helper';",
    ],
    title: "from alignment on imports",
  },
  {
    config: [
      {
        enabledRegex: "^\\s*import\\s",
        leftCount:    1,
        rightCount:   1,
        symbol:       "from",
      },
    ],
    expected: [
      "//not import and do not align, nor affect position of other from",
      "import { ConfigAlignSymbol } from './tsalignment';",
      "import * as vscode           from 'vscode';",
      "import Helper                from './helper';",
    ],
    input: [
      "//not import and do not align, nor affect position of other from ",
      "import { ConfigAlignSymbol } from './tsalignment';",
      "import * as vscode from 'vscode';",
      "import Helper from './helper';",
    ],
    title: "from in comments doesn't affect position",
  },
];
