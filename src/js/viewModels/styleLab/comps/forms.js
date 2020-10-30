/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojarraydataprovider',
        'ojs/ojconverterutils-i18n',
        'ojs/ojconverter-datetime',
        'ojs/ojknockout',
        'ojs/ojselectcombobox',
        'ojs/ojdatetimepicker',
        'ojs/ojinputtext',
        'ojs/ojradioset',
        'ojs/ojcheckboxset',
        'ojs/ojinputnumber',
        'ojs/ojswitch',
        'ojs/ojslider',
        'ojs/ojbutton',
        'ojs/ojcolorspectrum',
        'ojs/ojcolorpalette',
        'ojs/ojselectsingle'],

function(oj, ko, $, ArrayDataProvider, ConverterUtils, DateTimeConverter)
{

    var viewModel = function()
    {

      var self = this;


      self.placeholder = ko.observable(false);

      self.formState = ko.observable('enabled');

      self.disableFormControls = ko.computed(function () {
        if (self.formState() == 'disabled')
          return true;
        else
          return false;
      });

      self.readonlyFormControls = ko.computed(function () {
        if (self.formState() == 'readonly')
          return true;
        else
          return false;
      });

      self.formControls = ko.observableArray([]);
      self.messages = ko.observableArray([]);
      var _errorMsg = {summary: 'Error'};
      var _warningMsg = {summary: 'Warning', severity: 'warning'};
      var _infoMsg = {summary: 'Info', severity: 'info'};
      var _confirmationMsg = {summary: 'Confirmation', severity: 'confirmation'};

      self.messages = ko.computed(function () {
          var msgs = [];

          if (self.formState() == 'enabled')
          {
            if (self.formControls.indexOf('error') > -1)
            {
                msgs.push(_errorMsg);
            }
            if (self.formControls.indexOf('warning') > -1)
            {
                msgs.push(_warningMsg);
            }
            if (self.formControls.indexOf('info') > -1)
            {
                msgs.push(_infoMsg);
            }
            if (self.formControls.indexOf('confirmation') > -1)
            {
                msgs.push(_confirmationMsg);
            }
          }

          return msgs;
      });

      self.isoDate = ko.observable(ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date()));

      self.colorSpectrumValue = new oj.Color('rgba(21,0,255,0.8)');
      self.colorPaletteValue = new oj.Color('rgb(255,0,0)');
      self.colorPickerPalette = [
        {"color": new oj.Color("#000000")},
        {"color": new oj.Color("#c0c0c0")},
        {"color": new oj.Color("#808080")},
        {"color": new oj.Color("#ffffff")},
        {"color": new oj.Color("#800000")},
        {"color": new oj.Color("#ff0000")},
        {"color": new oj.Color("#800080")},
        {"color": new oj.Color("#ff00ff")},
        {"color": new oj.Color("#008000")},
        {"color": new oj.Color("#00ff00")},
        {"color": new oj.Color("#808000")},
        {"color": new oj.Color("#ffff00")},
        {"color": new oj.Color("#000080")},
        {"color": new oj.Color("#0000ff")},
        {"color": new oj.Color("#008080")},
        {"color": new oj.Color("#00ffff")},
        {"color": oj.Color.TRANSPARENT, label: "None"}
      ];

      self.browsersDP = new ArrayDataProvider([
        {value: 'IE', label: 'Internet Explorer'},
        {value: 'FF', label: 'Firefox'},
        {value: 'CH', label: 'Chrome'},
        {value: 'OP', label: 'Opera'},
        {value: 'SA', label: 'Safari'}
      ], {keyAttributes: 'value'});

      // do nothing converter
      var converter = {
        'parse' : function (value) {return value;},
        // take model value and display it
        'format' : function (value) {return value;},
      };
      var loadConverter = function () {
        // Use setTimeout to simulate a slow loading converter.
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
          resolve(converter);
          }, 6000);
        });
      };
      self.mySlowLoadingConverter = loadConverter();

      var dateOptions = { formatType: 'datetime', dateFormat: 'medium' };
      var dateConverter = new DateTimeConverter.IntlDateTimeConverter(dateOptions);
      self.myDateTimeSlowLoadingConverter = function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(dateConverter);
            }, 6000);
        });
      }();

      self.smOnlyQuery = oj.ResponsiveUtils.getFrameworkQuery(
                              oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);

      self.smOnly = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(self.smOnlyQuery);
    }

    return viewModel;
});

