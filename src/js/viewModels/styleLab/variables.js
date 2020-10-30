/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout',
        'ojs/ojpopup', 'ojs/ojcollapsible'],
       
function(oj, ko, $, app)
{    
        
    
    var viewModel = function(params)
    {
        var self = this;
        self.labitem = params.labitem;

        self.varMap = oj.ThemeUtils.parseJSONFromFontFamily("demo-var-map");

        self.variablesarray = [{title:     "Palette", 
                                id:        "palette", 
                                variables: self.varMap['palette']},
                               {title:     "Controls",
                                id:        "controls", 
                                variables: self.varMap['controls']},
                               {title:     "Layout & Nav", 
                                id:        "layout", 
                                variables: self.varMap['layoutnav']},
                               {title:     "Forms", 
                                id:        "forms", 
                                variables: self.varMap['forms']},
                               {title:     "Collections", 
                                id:        "collections", 
                                variables: self.varMap['collections']},
                               {title:     "Visualizations", 
                                id:        "dvt",  
                                variables: self.varMap['visualizations']}];

        self.variablesConfig = app.createConfigGetter("tour/stops/variables.html", "tour/stops/variables");
    }

    return viewModel;
}); 

