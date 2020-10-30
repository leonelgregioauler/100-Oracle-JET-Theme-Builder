/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const fs = require('fs-extra');
const path = require('path');

module.exports = function()
{
  fs.removeSync(path.resolve('src/themes/mytheme/theme.json'));

  let mythemeBase = 'src/themes/mytheme';
  const allPlatforms = ['android', 'ios', 'web', 'windows'];
  const jetVersion = _getJetVersion();
  allPlatforms.forEach((platform) => {
    let valuePairs = _getValuePairsArray(jetVersion, platform);
    let filePath = path.resolve(mythemeBase, platform, `_mytheme.${platform}.settings.scss`);
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    valuePairs.forEach((valuePair) => {
      fileContent = fileContent.replace(valuePair.str, valuePair.newStr);
    });
    fs.outputFileSync(filePath, fileContent);
  });

  return {
    copySrcToStaging: {
        fileList: [
          {
            buildType: 'release',
            cwd: 'src',
            src: [
              '**',
              '!js/**/*.js',
              'js/main.js',
              'js/libs/**',
              '!js/libs/**/*debug*',
              '!js/libs/**/*debug*/**',
              '!themes/**'
            ],
            dest: 'web'
          },
          {
            buildType: 'dev',
            cwd: 'src',
            src: [
              '**',
              '!themes/**',
              ],
            dest: 'web'
          },
          {
            cwd: 'src-web',
            src: ['**'],
            dest: 'web'          },
          {
            cwd: 'src/themes',
            src: ['**', '!**/*.scss', '!**.map', '!**/*.json'],
            dest: 'themes'
          },
          {
            cwd: 'src/themes',
            src:[
              '**',
              '!**/*.json'
            ],
            dest:'web/scss/themes'
          },
          {
            cwd: 'src/themes',
            src:[
              '**',
              '!**/*.json'
            ],
            dest:'web/themes'
          },
        ],
      },
  };
};

function _getValuePairsArray(jetVersion, platform) {
  return [
    {
      // Replace lines starting with '$imageDir:', ignoring whitespace (and indirectly comments).
      str: new RegExp('\s*^\\$imageDir\s*:\s*.*', 'g'),
      newStr: `$imageDir: "../../../css/alta/${jetVersion}/${platform}/images/" !default;`,
    },
    {
      // Replace lines starting with '$fontDir:', ignoring whitespace (and indirectly comments).
      str: new RegExp('\s*^\\$fontDir\s*:\s*.*', 'g'),
      newStr: `$fontDir:  "../../../css/alta/${jetVersion}/${platform}/fonts/" !default;`,
    },
    {
      // Replace lines starting with '$commonImageDir:', ignoring whitespace (and indirectly comments).
      str: new RegExp('\s*^\\$commonImageDir\s*:\s*.*', 'g'),
      newStr: `$commonImageDir:  "../../../css/alta/${jetVersion}/common/images/" !default;`,
    },
  ];
}

function _getJetVersion() {
  let packageJSON = path.resolve('node_modules/@oracle/oraclejet/package.json');
  packageJSON = fs.readJsonSync(packageJSON);
  return packageJSON.version;
}
