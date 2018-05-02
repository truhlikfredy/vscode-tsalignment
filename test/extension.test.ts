import TSAlignment         from "../src/tsalignment";

import * as basic          from "./dataBasicAlign";
import * as corrupted      from "./dataCorrupted";
import * as mixing         from "./dataMixing";
import * as regex          from "./dataRegex";
import { ITestUnitConfig } from "./testUnitConfigI";

import * as assert         from "assert";


suite("Basic Trivial Extension ALIGN Tests [basic,align]", () => {
  basic.tests.forEach((testUnit) => {
    test(testUnit.title, () => {
      TSAlignment.validateSettings(testUnit.config);

      const alignFirstSymbolOnly: boolean = testUnit.alignFirstSymbolOnly == null ? false : true;
      const myExtension = new TSAlignment(basic.input, testUnit.config, alignFirstSymbolOnly);

      myExtension.alignLines();

      assert.deepEqual(myExtension.lines, testUnit.expected);
    });
  });
});

suite("Regular expressions [basic,regex]", () => {
  regex.tests.forEach((testUnit) => {
    test(testUnit.title, () => {
      TSAlignment.validateSettings(testUnit.config);
      const myExtension = new TSAlignment(testUnit.input, testUnit.config, false);
      myExtension.alignLines();

      assert.deepEqual(myExtension.lines, testUnit.expected);
    });
  });
});

suite("Awkward mixing [basic,mixing]", () => {
  mixing.tests.forEach((testUnit) => {
    test(testUnit.title, () => {
      TSAlignment.validateSettings(testUnit.config);
      const myExtension = new TSAlignment(testUnit.input, testUnit.config, false);
      myExtension.alignLines();

      assert.deepEqual(myExtension.lines, testUnit.expected);
    });
  });
});

suite("UI [basic,ui]", () => {
  test("static align without editor", () => {
    TSAlignment.align();
  });
});

suite("Corrupted configs [basic,faulty]", () => {
  corrupted.tests.forEach((testUnit) => {
    // expect.to.
    test(testUnit.title, () => {
      assert.throws( () => TSAlignment.validateSettings(testUnit.config), Error);
    });
  });
});
