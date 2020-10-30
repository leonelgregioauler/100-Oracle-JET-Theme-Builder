/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout'],

function(oj, ko, $)
{

    var viewModel = function()
    {

      var self = this;

        self.varMap = oj.ThemeUtils.parseJSONFromFontFamily("demo-theming-contrast-map");

        self.compcolors = self.varMap['contrastCompColors'];
        self.colors = self.varMap['paletteGeneralBg'];
        self.textcolors = self.varMap['paletteGeneralText'];


    }

    return viewModel;
});
