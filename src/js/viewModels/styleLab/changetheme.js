/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout',
        'ojs/ojbutton',
        'ojs/ojdialog',
        'ojs/ojpopup',
        'ojs/ojrouter'],

function(oj, ko, $, app)
{



    var viewModel = function(params)
    {

        var self = this;
        self.theme = {};



        self.themeTargetPlatform = oj.ThemeUtils.getThemeTargetPlatform();

        self.theme.baseTheme = ko.observable(theme.baseTheme);
        self.theme.demoTheme = ko.observable(theme.demoTheme);

        self.theme.baseTheme.subscribe(function(newValue) {
            theme.baseTheme = newValue;

            if (theme.demoTheme == 'stealth')
            {
              theme.demoTheme = 'none';
            }


            saveThemeSettings();
            // stuff is bound to the base and demo theme, so just
            // reload the page so that css is set before binding applied
            window.location.reload()
        });


        self.theme.demoTheme.subscribe(function(newValue) {
            if (newValue != "none")
            {
                theme.compatibility = false;
            }

            theme.demoTheme = newValue;
            saveThemeSettings();
            // stuff is bound to the base and demo theme, so just
            // reload the page so that css is set before binding applied
            window.location.reload()

        });

        self.platformthemeConfig = app.createConfigGetter("tour/stops/platformtheme.html", "tour/stops/platformtheme");
        self.customthemeConfig = app.createConfigGetter("tour/stops/customtheme.html", "tour/stops/customtheme");
    }

    return viewModel;
});
