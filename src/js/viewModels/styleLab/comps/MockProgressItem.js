/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Implementation of the oj.ProgressItem interface. 
 */

"use strict";
define(['jquery', 'ojs/ojprogresslist'], function($, ProgressItem) {

  /**
   * Constructs a Progress Item
   *
   * @param {Object} object
   * @constructor
   * @export
   */
  function MockProgressItem(item) {
    var self = this;

    //save item object info
    this._item = item;

    if (item)
    {
      this._name = item.name;
      this._total = item.total;
      this._status = oj.ProgressItem.Status['QUEUED'];

      Object.defineProperty(this, "item", {
        get: function(){return self._item},
        enumerable: true
      });
      Object.defineProperty(this, "name", {
        get: function(){return self._name},
        enumerable: true
      });
      Object.defineProperty(this, "total", {
        get: function(){return self._total},
        enumerable: true
      });
      Object.defineProperty(this, "status", {
        get: function(){return self._status},
        enumerable: true
      });
      Object.defineProperty(this, "loaded", {
        get: function(){return self._loaded},
        enumerable: true
      });
    }

    this._listeners = [];

    //export methods
    this["dispatchEvent"] = _dispatchEvent;
    this["addEventListener"] = _addEventListener;
    this["removeEventListener"] = _removeEventListener;

    //this method is called internally by the transport
    //info object: {loaded, status, error}
    this.updateStates = function(info) {
      if (! info)
        return;

      if (info.status)
        self._status = info.status;

      if (info.loaded == 0 || info.loaded)
        self._loaded = info.loaded;

      //fire a progressEvent
      if (! info.status) {
        if (! self._status) {
          self._status = oj.ProgressItem.Status['LOADSTARTED'];
        }
        _fireProgressEvent(self, oj.ProgressItem.EventType['PROGRESS']);
      }
      else {
        switch (info.status) {
        //1) complete
        case oj.ProgressItem.Status['LOADED']:
          //fire a final progressEvent before fire LOAD and LOADEND events
          if (self._loaded < self.total) {
            self._loaded = self.total;
            _fireProgressEvent(self, oj.ProgressItem.EventType['PROGRESS']);
          }
          _fireProgressEvent(self, oj.ProgressItem.EventType['LOAD']);
          _fireProgressEvent(self, oj.ProgressItem.EventType['LOADEND']);
          break;

        //2) error 
        case oj.ProgressItem.Status['ERRORED']:
          if (info.error) {
            _fireProgressEvent(self, oj.ProgressItem.EventType['ERROR'], info.error);
            _fireProgressEvent(self, oj.ProgressItem.EventType['LOADEND']);
          }
          break;

        //3) load start
        case oj.ProgressItem.Status['LOADSTARTED']:
          _fireProgressEvent(self, oj.ProgressItem.EventType['LOADSTART']);
          break;
        }
      }
    };
  };

  function _fireProgressEvent(progressItem, eventType, error) {
    var event = $.Event(eventType,
                        {'lengthComputable': true,
                         'total': progressItem.total,
                         'loaded': progressItem.loaded,
                         'target': progressItem});
    if (error) {
      event.error = error;
    }
    return progressItem.dispatchEvent(event);
  };


  /**
   * Dispatch events.
   *
   * @member
   * @name dispatchEvent
   * @memberof ProgressItem
   * @instance
   * @param {Event} event
   * @return {boolean} Returns false if event is cancelled
   * @export
   */
  function _dispatchEvent(event)
  {
    var i, returnValue;
    var eventType = event.type;
    for (i = 0; i < this._listeners.length; i++) {
      var eventHandler = this._listeners[i];
      if (eventHandler['eventType'] == eventType) {
        returnValue = eventHandler['eventHandlerFunc'].call(this, event);

        // event cancelled
        if (returnValue === false) {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * Attach an event handler
   *
   * @member
   * @name addEventListener
   * @memberof ProgressItem
   * @instance
   * @param {string} eventType eventType
   * @param {function(Object)} eventHandler event handler function
   * @export
   */
  function _addEventListener(eventType, eventHandler) 
  {
    var foundEventHandler = false, i;
    for (i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i]['eventType'] == eventType && 
          this._listeners[i]['eventHandlerFunc'] == eventHandler) {
        foundEventHandler = true;
        break;
      }
    }
    if (!foundEventHandler) {
      this._listeners.push({'eventType': eventType, 'eventHandlerFunc': eventHandler});
    }
  };

  /**
   * Detach an event handler
   *
   * @member
   * @name removeEventListener
   * @memberof ProgressItem
   * @instance
   * @param {string} eventType eventType
   * @param {function(Object)} eventHandler event handler function
   * @export
   */
  function _removeEventListener(eventType, eventHandler)
  {
    var i;
    for (i = this._listeners.length-1; i >= 0; i--) {
      if (this._listeners[i]['eventType'] == eventType && 
          this._listeners[i]['eventHandlerFunc'] == eventHandler) {
        this._listeners.splice(i, 1);
        break;
      }
    }
  };


  return MockProgressItem;
});


