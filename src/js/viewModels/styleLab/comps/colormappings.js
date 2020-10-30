/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojarraytabledatasource',  'ojs/ojbutton', 'ojs/ojinputtext'],

function(oj, ko, $)
{
    var colorMappingviewModel = function()
    {
  		var self = this;

      self.assignedramp = oj.ThemeUtils.parseJSONFromFontFamily("demo-rampassignedvars-map");
      self.assignedArray = ko.observableArray([]);
      for(var j=0; j<self.assignedramp.length; j++) {
        self.assignedArray.push(self.assignedramp[j]);
      }
      self.assigneddatasource = new oj.ArrayTableDataSource(self.assignedArray());

      self.statusText = ko.observable();
      self.notassignedramp = oj.ThemeUtils.parseJSONFromFontFamily("demo-rampunassignedvars-map");
      self.notassignedArray = ko.observableArray([]);
      if(self.notassignedramp.length == 0) {
          self.statusText = ko.observable("N/A all variables assigned to a palette color");
      } else {
        self.statusText = ko.observable("");
      }
      for(var j=0; j<self.notassignedramp.length; j++) {
        self.notassignedArray.push(self.notassignedramp[j]);
      }
      self.notassigneddatasource = new oj.ArrayTableDataSource(self.notassignedArray());
    }
    return colorMappingviewModel;
});
