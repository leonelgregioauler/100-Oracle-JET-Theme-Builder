/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojcore', 'knockout', 'jquery',
        './MockProgressItem',
        'promise', 'ojs/ojknockout',
        'ojs/ojcollapsible',
        'ojs/ojbutton',
        'ojs/ojmenu',
        'ojs/ojmenuselectmany',
        'ojs/ojprogress',
        'ojs/ojconveyorbelt',
        'ojs/ojfilmstrip',
        'ojs/ojpagingcontrol',
        'ojs/ojaccordion',
        'ojs/ojtrain',
        'ojs/ojfilepicker',
        'ojs/ojarraytabledatasource',
        'ojs/ojprogresslist',
        'ojs/ojavatar',
        'ojs/ojinputtext',
        'ojs/ojmessages',
        'ojs/ojmessage'],

function(oj, ko, $, ProgressItem)
{
  var viewModel = function()
  {
    var self = this;
    self.disableButtons = ko.observableArray();

    //For the Progress list
    self.dataSource = new oj.ArrayTableDataSource([], {idAttribute: 'name'});
    self.itemQ = new ProgressItem({name: "item-q", total: 100});
    self.itemP = new ProgressItem({name: "item-p", total: 100});
    self.itemD = new ProgressItem({name: "item-d", total: 20});
    self.itemE = new ProgressItem({name: "item-e", total: 50});

    self.dataSource.add(self.itemQ);
    self.dataSource.add(self.itemP);
    self.dataSource.add(self.itemD);
    self.dataSource.add(self.itemE);

    //For TRAIN
    var trainStepsNormal = [{label:"Step One", visited:true, id:"stp1"},
            {label:"Step Two has a very long label to show whether there is wrapping or not", id:"stp2"},
            {label:"Step Three", id:"stp3"},
            {label:"Step Four", id:"stp4"}];
    var trainStepsDisabled = [{label:"Step One", disabled:true, id:"stp1"},
            {label:"Step Two has a very long label to show whether there is wrapping or not", disabled:true,id:"stp2"},
            {label:"Step Three", disabled:true, id:"stp3"},
            {label:"Step Four", disabled:true, id:"stp4"}];
    self.trainDisabled = ko.observableArray();
    self.trainSteps = ko.computed(function() {
      if(self.trainDisabled().length > 0) {
        return trainStepsDisabled;
      }
      return trainStepsNormal;
    })
    var trainMessageStepsNormal = [{label:"Error", messageType: "error", id:"stpA"},
            {label:"Warning", messageType: "warning", id:"stpB"},
            {label:"Info", messageType: "info", id:"stpC"},
            {label:"Confirmation", messageType: "confirmation", id:"stpD"}];
    var trainMessageStepsDisabled = [{label:"Error", messageType: "error", disabled:true, id:"stpA"},
            {label:"Warning", messageType: "warning", disabled:true, id: "stpB"},
            {label:"Info", messageType: "info", disabled:true, id:"stpC"},
            {label:"Confirmation", messageType: "confirmation", disabled:true, id:"stpD"}];
    self.trainMessageDisabled = ko.observableArray();
    self.trainMessageSteps = ko.computed(function() {
      if(self.trainMessageDisabled().length > 0) {
        return trainMessageStepsDisabled;
      }
      return trainMessageStepsNormal;
    })

    //For Film Strip
    self.filmStripPagingModel = ko.observable(null);

    self.transitionCompleted = function()
    {
      var filmStrip = document.getElementById('filmStrip');
      var busyContext = oj.Context.getContext(filmStrip).getBusyContext();
      busyContext.whenReady().then(function ()
      {
        // Set the Paging Control pagingModel
        self.filmStripPagingModel(filmStrip.getPagingModel());
      });
    };

    function updateStatus(progressItem, loaded, status, error) {
      var stateInfo = {
        "loaded": loaded,
        "status": status
      }

      if (error) {
        stateInfo["error"] = error;

        //clear file items from the progress status
        window.clearInterval(self.timerID);
      }
      progressItem.updateStates(stateInfo);
    };

    self.timerID = window.setInterval(function() {
      updateStatus(self.itemP, 40);
      updateStatus(self.itemD, 20, oj.ProgressItem.Status['LOADED']);
      updateStatus(self.itemE, 20, oj.ProgressItem.Status['ERRORED'], new Error("Error"));
    }, 30);

    self.menuSelectManyValue = ko.observableArray(['zoomTextOnly']);
  }

  return viewModel;

});
