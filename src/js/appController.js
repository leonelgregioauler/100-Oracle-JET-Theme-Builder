/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'navigation', 'ojs/ojmodule-element-utils', 'ojs/ojmodule-element', 'ojs/ojrouter', 'ojs/ojdialog',
  'ojs/ojoffcanvas','ojs/ojknockout'],
  function (oj, ko, nav, moduleUtils) {
    /*
     * Your application specific code will go here
     */
    function AppControllerViewModel() {
      var self = this;

      // Router setup
      self.router = oj.Router.rootInstance;
      self.router.configure(
      {
        'home': { label: 'Home', isDefault: true},
        'library': { label: 'Library' }
      });

      // Configure child router for home.
      self.router.createChildRouter('view', 'home').configure(
      {
        'comps': { label: 'Components', isDefault: true },
        'tutorial': { label: 'Variables' }
      });

      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

      // Change the default location for the viewModel and view files
      oj.ModuleBinding.defaults.modelPath = 'viewModels/styleLab/';
      oj.ModuleBinding.defaults.viewPath = 'text!views/styleLab/';


      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Navigation and Offcanvas
      self.drawerParams = {
        displayMode: 'push',
        selector: '#offcanvas',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      self.toggleDrawer = function() {
        return oj.OffcanvasUtils.toggle(self.drawerParams);
      };
      // Close offcanvas on medium and larger screens
      self.mdScreen.subscribe(function() {oj.OffcanvasUtils.close(self.drawerParams);});
      self.navDataSource = nav.dataSource;
      // Called by nav drawer option change events so we can close drawer after selection
      self.navChange = function(event) {
        if (event.detail.originalEvent) {
          self.toggleDrawer();
          self.topNavBarSelectionChanged(event);
        }
      };

      self.currentModuleConfig = ko.observable({view: []});
      self.viewRouterSelectionState = ko.observable();
      self.topNavBarSelection = ko.observable();

      function getViewPromise(viewPath) {
        return moduleUtils.createView({viewPath: "views/styleLab/" + viewPath});
      }

      function getViewModelConstructorPromise(viewModelPath) {
        return viewModelPath ? moduleUtils.createViewModel({viewModelPath: "viewModels/styleLab/" + viewModelPath}) : Promise.resolve(null);
      }

      self.getModuleConfigPromise = function(viewPath, viewModelPath, viewModelParams) {
        var viewPromise = getViewPromise(viewPath);
        var viewModelConstructorPromise = getViewModelConstructorPromise(viewModelPath);
        return Promise.all([viewPromise, viewModelConstructorPromise]).then(function(values) {
          var view = values[0];
          var viewModelConstructor = values[1];
          var viewModel = viewModelConstructor ? new viewModelConstructor(viewModelParams) : null;
          return {view: view, viewModel: viewModel};
        });
      }

      // If an <oj-module> is inside an <oj-bind-if> and the if condition becomes false,
      // knockout will clean the contained DOM tree.  If that node tree contains a
      // JET custom component, it cannot be reused if the module becomes reactivated in
      // the future.  As a result, this function returns a function that will generate a newly
      // cloned node array each time it is invoked to ensure that the module can safely apply
      // bindings.
      self.createConfigGetter = function(viewPath, viewModelPath, viewModelParams) {
        var viewObservable = ko.observable([]);
        var viewModelConstructor = null;
        function cloneView() {
          var view = viewObservable();
          var clone = new Array(view.length);
          for (var i = 0; i < view.length; i++) {
            clone[i] = view[i].cloneNode(true);
          }
          return clone;
        }
        var viewPromise = getViewPromise(viewPath);
        var viewModelConstructorPromise = getViewModelConstructorPromise(viewModelPath);
        Promise.all([viewPromise, viewModelConstructorPromise]).then(function(values) {
          viewModelConstructor = values[1];
          viewObservable(values[0]);
        });
        var configGetter = function() {
          var viewModel = viewModelConstructor ? new viewModelConstructor(viewModelParams) : null;
          return {view: cloneView(), viewModel:viewModel};
        };
        return configGetter;
      }

      self.topNavBarSelectionChanged = function(event) {
        if (event.detail.originalEvent) {
          var routerPath = event.detail.value;

          if (routerPath === 'home')
            routerPath += '/' + self.viewRouterSelectionState();

          self.router.go(routerPath);
        }
      };

      oj.Router.transitionedToState.add(function(result) {
        if (result.hasChanged) {
          var moduleName = self.router.stateId();
          var moduleConfigPromise = self.getModuleConfigPromise(moduleName + ".html", moduleName, { viewRouterSelectionState: self.viewRouterSelectionState });
          moduleConfigPromise.then(function(config) {
            self.currentModuleConfig(config);
            if (moduleName)
              self.topNavBarSelection(moduleName);
  
            var childViewRouter = self.router.getChildRouter('view');
            if (childViewRouter && childViewRouter.stateId())
              self.viewRouterSelectionState(childViewRouter.stateId());  
          });
        }
      });
    }

    return new AppControllerViewModel();
  }
);
