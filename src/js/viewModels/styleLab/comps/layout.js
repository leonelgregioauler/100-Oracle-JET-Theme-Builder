/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout',
        'ojs/ojcollapsible',
        'ojs/ojaccordion',
        'ojs/ojpopup',
        'ojs/ojdialog',
        'ojs/ojradioset',
        'ojs/ojnavigationlist',
        'ojs/ojswitch'],
       
function(oj, ko, $)
{    
    
    var viewModel = function()
    {
        
        
        self.navlistSelectedItem = ko.observable("item2");
        self.navlistdisplay = ko.observable('all');
        self.isContrastBackground = ko.observable(false);
        self.isContrastBackground.subscribe(function(newValue){
                if(newValue){
                    $("#navlistdisplay").addClass("oj-contrast-background oj-contrast-marker");
                    $("#navtabsdisplay").addClass("oj-contrast-background oj-contrast-marker");
                    $("#horizontalnavlistdisplay").addClass("oj-contrast-background oj-contrast-marker");
                    $("#horizontalnavtabsdisplay").addClass("oj-contrast-background oj-contrast-marker");
                }else{
                    $("#navlistdisplay").removeClass("oj-contrast-background oj-contrast-marker");
                    $("#navtabsdisplay").removeClass("oj-contrast-background oj-contrast-marker");
                    $("#horizontalnavlistdisplay").removeClass("oj-contrast-background oj-contrast-marker");
                    $("#horizontalnavtabsdisplay").removeClass("oj-contrast-background oj-contrast-marker");
                } 
        });

    }

    return viewModel;
}); 

