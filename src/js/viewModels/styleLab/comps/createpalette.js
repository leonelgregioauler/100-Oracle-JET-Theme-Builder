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
    var colorPaletteviewModel = function()
    {
  		var self = this;

      self.brandRampVarMap = oj.ThemeUtils.parseJSONFromFontFamily("demo-brandramp-map");
      self.varholdingArray = ko.observableArray([]);
      for(var j=0; j<self.brandRampVarMap.length; j++) {
        self.varholdingArray.push(self.brandRampVarMap[j]);
      }
      self.colordatasource = new oj.ArrayTableDataSource(self.varholdingArray(), {idAttribute: 'ColorId'});

      self.brandRampVarMapNeutral = oj.ThemeUtils.parseJSONFromFontFamily("demo-brandNeutralramp-map");
      self.varholdingArrayNeutral = ko.observableArray([]);
      self.varholdingArrayNeutralbasecolor = ko.observableArray([]);
      for(var j=0; j<self.brandRampVarMapNeutral.length; j++) {
        self.varholdingArrayNeutral.push(self.brandRampVarMapNeutral[j]);
        if(j==2) {
          self.varholdingArrayNeutralbasecolor.push({'hue':self.brandRampVarMapNeutral[j].hslvalue.split(',')[0].slice(1,7), 'saturation': self.brandRampVarMapNeutral[j].hslvalue.split(',')[1]});
        }
      }
      self.neutralBaseColorDatasource = new oj.ArrayTableDataSource(self.varholdingArrayNeutralbasecolor());
      self.colordatasourceNeutral = new oj.ArrayTableDataSource(self.varholdingArrayNeutral(), {idAttribute: 'NeutralColorId'});

      self.accentRamp = oj.ThemeUtils.parseJSONFromFontFamily("demo-Accentramp-map");
      self.varholdingAccentramp = ko.observableArray([]);
      for(var j=0; j<self.accentRamp.length; j++) {
        self.varholdingAccentramp.push(self.accentRamp[j]);
      }
      self.accentcolordatasource = new oj.ArrayTableDataSource(self.varholdingAccentramp());

      self.textRamp = oj.ThemeUtils.parseJSONFromFontFamily("demo-textramp-map");
      self.varholdingtextramp = ko.observableArray([]);
      var textColorBaseArr = [{ name: '$textColorBase', value: self.textRamp[0].value }];
      self.textColorBaseDataSource = new oj.ArrayTableDataSource(textColorBaseArr, {idAttribute: 'name'});
      for(var j=0; j<self.textRamp.length; j++) {
        self.varholdingtextramp.push(self.textRamp[j]);
      }
      self.textdatasource = new oj.ArrayTableDataSource(self.varholdingtextramp());

    }
    return colorPaletteviewModel;
});
