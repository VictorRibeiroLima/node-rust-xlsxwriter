// @ts-check
const { test } = require('node:test');
const assert = require('node:assert');
const {
  Workbook,
  ConditionalFormatDuplicate,
  Color,
  Format,
} = require('../../src/index');
const fs = require('fs');
const findRootDir = require('../util');
const rootPath = findRootDir(__dirname);
const path = rootPath + '/temp/conditional_format';

test('save to file with conditional format ("ConditionalFormatDuplicate")', async (t) => {
  const workbook = new Workbook();
  const sheet = workbook.addSheet();

  const lightRed = new Color({
    red: 255,
    green: 102,
    blue: 102,
  });

  const lightGreen = new Color({
    red: 102,
    green: 255,
    blue: 102,
  });

  const duplicated = new Format({
    backgroundColor: lightRed,
  });

  const unique = new Format({
    backgroundColor: lightGreen,
  });

  const duplicateFormat = new ConditionalFormatDuplicate({
    format: duplicated,
  });

  const uniqueFormat = new ConditionalFormatDuplicate({
    format: unique,
    invert: true,
  });

  sheet.addConditionalFormat({
    firstRow: 2,
    lastRow: 11,
    firstColumn: 1,
    lastColumn: 10,
    format: duplicateFormat,
  });

  sheet.addConditionalFormat({
    firstRow: 2,
    lastRow: 11,
    firstColumn: 1,
    lastColumn: 10,
    format: uniqueFormat,
  });

  for (let row = 2; row <= 11; row++) {
    for (let col = 1; col <= 10; col++) {
      if (row % 2 === 0) {
        sheet.writeString(row, col, `${row}-${col}`);
      } else {
        sheet.writeString(row, col, 'duplicated');
      }
    }
  }

  const fileName =
    path + '/save-to-file-with-format-conditional-format-duplicate.xlsx';

  await workbook.saveToFile(fileName);

  assert.ok(fs.existsSync(fileName), 'File has been saved to the file system');
});
