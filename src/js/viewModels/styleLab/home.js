/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodule-element', 'ojs/ojknockout',
        'ojs/ojnavigationlist',
        'ojs/ojbutton',
        'ojs/ojdialog',
        'ojs/ojpopup',
        'ojs/ojmodule',
        'ojs/ojrouter',
        'ojs/ojselectcombobox',
        'ojs/ojoffcanvas'],

function(oj, ko, $, app)
{

    function saveToSessionStorage(key, value)
    {
      try {
        sessionStorage.setItem(key, value);
      }
      catch (e)
      {
        console.log("exception calling sessionStorage.setItem, likely cause is private browsing mode which doesn't allow saving to sessionStorage");
      }
    }


    var viewModel = function(params)
    {

            var self = this;


            // ------- START TOUR RELATED---------

            var tourParams = {};

            // create the tour stops

            // shared tour stops
            var platform   = { modulename: 'tour/stops/platformtheme',
                               launcher:   '#platformPicker' };
            var custom     = { modulename: 'tour/stops/customtheme',
                               launcher:   '#customPicker'};
            var variables  = { modulename: 'tour/stops/variables',
                               launcher:   '#varHeader'};
            var mashup     = { modulename: 'tour/stops/mashup',
                               launcher:   '#mashup',
                               position:   {'my': 'center top', 'at': 'center bottom', 'collision': 'flipfit' },
                               // if I set the tail to none the popup ends up under the glass pane!
                               tail:       'simple'};
            var builderInstructions = {
                             modulename: 'tour/stops/builderinstructions',
                             launcher: '#library',
                             position: {'at': 'center bottom','my': 'end top', 'collision': 'flipfit' } };


            var tourStops = [builderInstructions, mashup, platform, custom, variables];

            self.startTour = function() {
              // todo: hack! the tour is in another module,
              // how can I tell the tour to start without knowing the popup id?
              $('#tourPop').ojPopup("open");
            }

            // whether to pulse the tour button when the page is first loaded
            self.tourPulse = false;

            try {
              var tourPulseKey = "tourPulse4";
              self.tourPulse = localStorage.getItem(tourPulseKey) == null ? true: false;
              localStorage.setItem(tourPulseKey, false);
            }
            catch (e)
            {
              console.log("exception thrown: likely cause is private browsing mode which doesn't allow saving to local or session storage");
              console.log(e);
            }

            // ------- END TOUR RELATED---------

            self.mdDownQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_DOWN);

            self.mdDown = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(self.mdDownQuery);

            self.startDrawer =
            {
              "edge": "start",
              "displayMode": "push",
              "selector": "#startDrawer",
              "query":  oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP)
            };

            self.isLaunchMenuVisible = function(edge)
            {
              return ($("#" + edge).css("display") !== "none");
            }

            self.isOffcanvasOpen = function(offcanvas)
            {
              return $(offcanvas.selector).hasClass("oj-offcanvas-open");
            }

            self._toggleOpenClose = function(edge)
            {
            }

            self.toggleStart = function()
            {
              var offcanvas = self.startDrawer;

              //if hamburger icon is visible then hide or show the offcanvas
              if (self.isLaunchMenuVisible('start'))
              {
                if (self.isOffcanvasOpen(offcanvas))
                {
                  return oj.OffcanvasUtils.close(offcanvas);
                }
                else
                {
                  return oj.OffcanvasUtils.open(offcanvas);
                }
              }
            }

            self.connected = function()
            {

            //setup the offcanvas
            oj.OffcanvasUtils.setupResponsive(self.startDrawer);
            }

            self.router = oj.Router.rootInstance;
            self.childRouter = self.router.getChildRouter('view');

            self.componentTypes = [
              {id: 'all', label: 'All'},
              {id: 'controls', label: 'Controls'},
              {id: 'layout', label: 'Layout & Nav' },
              {id: 'forms', label: 'Forms' },
              {id: 'collections', label: 'Collections' },
              {id: 'dvt', label: 'Visualizations' }
            ];

            self.viewRouterSelectionState = params['viewRouterSelectionState'];
            self.viewRouterSelectionState.subscribe(function(newValue){
              var curValue = self.childRouter.stateId();
              if (curValue != newValue) {
                self.router.go('home/' + newValue);
              }
            });

            self.bgcolor = ko.observableArray(['transparent']);

            var compRouterId = sessionStorage.getItem('labitem');

            if (compRouterId == null)
            {
              compRouterId = 'all';
            }

            self.labitem = ko.observable(compRouterId);

            self.labitem.subscribe(function(newValue){
              saveToSessionStorage('labitem', newValue);
            });

            self.variableType = [
             {id: 'variablelist', label: 'Files' },
             {id: 'createpalette', label: 'Palette' },
             {id: 'colormappings', label: 'Color Mappings' },
             {id: 'contrast', label: 'Contrast' },
             // {id: 'generalVars', label: 'General Vars' }
            ];
            var varRouterId = sessionStorage.getItem('varlabitem');
            if(varRouterId == null) {
              varRouterId = 'variablelist';
            }
            self.varlabitem = ko.observable(varRouterId);
            self.varlabitem.subscribe(function(newValue){
              saveToSessionStorage('varlabitem', newValue);
            });

            self.tourConfig = app.createConfigGetter("tour/tour.html", "tour/tour", {tourStops: tourStops, tourParams: tourParams});
            self.changethemeConfig = app.createConfigGetter("changetheme.html", "changetheme");
            self.variablesConfig = app.createConfigGetter("variables.html", "variables", {labitem: self.labitem});
            self.contrastConfig = app.createConfigGetter("comps/contrast.html", "comps/contrast");
            self.createpaletteConfig = app.createConfigGetter("comps/createpalette.html", "comps/createpalette");
            self.generalVarsConfig = app.createConfigGetter("comps/generalVars.html", "comps/generalVars");
            self.tutorialConfig = app.createConfigGetter("tutorial.html", "tutorial");
            self.controlsConfig = app.createConfigGetter("comps/controls.html", "comps/controls");
            self.layoutConfig = app.createConfigGetter("comps/layout.html", "comps/layout");
            self.formsConfig = app.createConfigGetter("comps/forms.html", "comps/forms");
            self.dataConfig = app.createConfigGetter("comps/data.html", "comps/data");
            self.dvtConfig = app.createConfigGetter("comps/dvt.html", "comps/dvt");
    }

    return viewModel;
});
