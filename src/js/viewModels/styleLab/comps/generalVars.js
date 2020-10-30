/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojarraytabledatasource'],

function(oj, ko, $) {
  var viewModel = function() {

    var self = this;

    var generalVarsMap = oj.ThemeUtils.parseJSONFromFontFamily("demo-general-vars-map");

    self.generalVarsDataArray = generalVarsMap.map(function (category) {
      return {
        'name': category.name,
        'map': new oj.ArrayTableDataSource(category.map, {idAttribute: 'name'})
      }
    });

    self.columnArray = [
      {
        "headerText": "Value", 
        "field": "value"
      },
      {
        "headerText": "General Var", 
        "field": "name"
      },
      {
        "headerText": "Vars", 
        "renderer": oj.KnockoutTemplateUtils.getRenderer("mapped_vars", true)
      }
    ];
  }

  return viewModel;
});
