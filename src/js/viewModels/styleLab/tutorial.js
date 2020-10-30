/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout',
        'ojs/ojbutton',
        'ojs/ojtrain'],

function(oj, ko, $, app)
{

    function themeFileLoad(filepath, editorid, dialogid)
    {
        var $div = $('<div>');
        $div.load(filepath, null, function (response) {
            // the .text(response).html() code seen below escapes any html in the scss file
            $("#" + editorid).text(response).html();
            // originally I was applying the code editor, but it's crashing the page.
            // applyCodeEditor(document.getElementById(editorid),response,"text/x-scss","nocursor");
        });
        $("#" + dialogid).ojDialog("open");
    }

    var viewModel = function()
    {
        var self = this;


        var tutorialId = sessionStorage.getItem('tutorial');

        if (tutorialId == null || theme.demoTheme == 'none')
        {
          tutorialId = 'intro';
        }

        self.currentStepValue = ko.observable(tutorialId);

        self.currentStepValue.subscribe(function(newValue){
          try {
            sessionStorage.setItem('tutorial', newValue);
          }
          catch (e)
          {
            // Safari private mode doesn't allow session storage
          }
        });

        self.staticFileWarning = "Note: this is a read only view of the file as it was when 'grunt serve' was last called."

        self.baseThemeToPlatformMap = {
                    'alta': 'web',
                    'alta-ios': 'ios',
                    'alta-android': 'android',
                    'alta-windows': 'windows'};

        self.nextStep = function () {
            var next = $("#themetrain").ojTrain("nextSelectableStep");
            if (next != null)
                self.currentStepValue(next);
        };

        self.previousStep = function () {
            var prev = $("#themetrain").ojTrain("previousSelectableStep");
            if (prev != null)
                self.currentStepValue(prev);
        };
        self.stepArray =
                ko.observableArray(
                        [{label: 'Introduction', id: 'intro'},
                            {label: 'Aggregating', id: 'aggregating'},
                            {label: 'Settings', id: 'customvars'},
                            {label: 'Available Vars', id: 'basevars'}]);
                                    this.baseSettingsFileUrl = ko.computed(function() {
                         return 'scss/oj/' + theme.baseTheme +
                                '/_oj.' + theme.baseTheme.replace('-', '.') + '.settings.scss'}, this);

                    this.demoSettingsFileUrl = ko.computed(function() {
                         return 'themes/' +
                                    theme.demoTheme + '/' + self.baseThemeToPlatformMap[theme.baseTheme] +
                                    '/_' + theme.demoTheme + '.' + self.baseThemeToPlatformMap[theme.baseTheme] + '.settings.scss'}, this);

                    this.demoAggregatorFileUrl = ko.computed(function() {
                         var basethemeroot = theme.baseTheme.indexOf('-');

                         if (basethemeroot == -1)
                            basethemeroot = theme.baseTheme;
                         else
                            basethemeroot = theme.baseTheme.substring(0, theme.baseTheme.indexOf('-'));

                         return 'themes/' +
                                    theme.demoTheme + '/' + self.baseThemeToPlatformMap[theme.baseTheme] +
                                    '/' + theme.demoTheme + '.scss'}, this);




        self.loadFiles = function () {
            // base vars
            var baseSettings =
            themeFileLoad(this.baseSettingsFileUrl(),
                    "markup-example-basevars");

            if (theme.demoTheme != 'none')
            {
                // base vars in train
                themeFileLoad(this.baseSettingsFileUrl(),
                        "markup-example-basevars2");

                // custom vars
                themeFileLoad(this.demoSettingsFileUrl(),
                        "markup-example-customvars");

                // aggregator
                themeFileLoad(this.demoAggregatorFileUrl(),
                        "markup-example-aggregator");
            }
        };


        this.showSettingsDialog = function () {
            ko.dataFor($('#headerId')[0]).showSettingsDialog();
        };

        this.transitionCompleted = function() {
                self.loadFiles();
        }

        self.docresourcesConfig = app.createConfigGetter("docresources.html");
        self.docaggregatingConfig = app.createConfigGetter("docaggregating.html", "docaggregating");

    }

    return viewModel;
});
