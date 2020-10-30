/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'promise', 'ojs/ojknockout',
        'ojs/ojbutton',
        'ojs/ojdialog',
        'ojs/ojpopup',
        'ojs/ojrouter'],

function(oj, ko, $, app)
{



    var viewModel = function(params)
    {

        var self = this;

        self.tourParams = params.tourParams;
        self.tourStops = params.tourStops;

        self.tourCurrentIndex = ko.observable(0);

        self.stopModuleConfig = ko.observable({view: []});
        ko.computed(function() {
          // when the tour current index changes, change the module config
          var moduleName = self.tourStops[self.tourCurrentIndex()].modulename;
          var configPromise = app.getModuleConfigPromise(moduleName + ".html", moduleName, {tourParams: self.tourParams});
          configPromise.then(function(config) {
            self.stopModuleConfig(config);
          })
        });
        self.openTourPop = function(event)
        {
          self.tourMove();
        }

        self.transitionCompleted = function()
        {
          // console.log('transitionCompleted');

          // the new module content needs to load before you move the popup
          // or the popup moves and aligns itself based on the size
          // of the old content, then when the new content loads the
          // popup points to the wrong place. To avoid that add a listener
          // that detects children being added and only move then.

          // select the target node
          var target = document.querySelector('#popContent');

          // create an observer instance
          var observer = new MutationObserver(function(mutations) {
            //console.log('new kids');
            self.tourMove();
          });

          // configuration of the observer:
          var config = { childList: true };

          // pass in the target node, as well as the observer options
          observer.observe(target, config);
        }

        self.showPrev = function()
        {
          if (self.tourCurrentIndex() == 0)
            return false;
          else
            return true;
        }

        self.showNext = function()
        {
          var max = self.tourStops.length;

          var i = self.tourCurrentIndex();

          if ( i+1 == max)
            return false;
          else
            return true;
        }

        self.tourPrev = function(data, event)
        {
          self.tourCurrentIndex(self.tourCurrentIndex() - 1);
        };

        self.tourNext = function(data, event)
        {
          self.tourCurrentIndex(self.tourCurrentIndex() + 1);
        };

        self.tourMove = function()
        {
          var tourStop = self.tourStops[self.tourCurrentIndex()];
          var position = tourStop.position;

          if (position == null)
          {
            position = {'my': 'left center', 'at': 'right center', 'collision': 'flipfit'};
          }

          position.of = tourStop.launcher;
          $('#tourPop').ojPopup('option', 'position', position);


          var tail = tourStop.tail;

          if (tail == null)
          {
            tail = "simple";
          }

          $('#tourPop').ojPopup('option', 'tail', tail);
        }

        self.tourEnd = function(data, event)
        {
          $('#tourPop').ojPopup('close');
          self.tourCurrentIndex(0);
        };

    }

    return viewModel;
});

