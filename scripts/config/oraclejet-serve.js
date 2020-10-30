/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
module.exports = function(grunt)
{
  return {
    connect: {
        webDevServer: {
          options: {
            hostname: '*',
            port: 8000,
            livereload: true,
            base: [
              'web',
              'bower_components/oraclejet/dist/scss',
              'src/themes'],
            open: true
          }
        }
      }
  };
};