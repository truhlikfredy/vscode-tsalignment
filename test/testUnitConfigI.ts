import { IConfigAlignSymbol } from "./../src/tsalignment";

export interface ITestUnitConfig {
  title:                 string;
  config:                IConfigAlignSymbol[];
  alignFirstSymbolOnly?: boolean;
  input?:                string[];
  expected:              string[];
}
