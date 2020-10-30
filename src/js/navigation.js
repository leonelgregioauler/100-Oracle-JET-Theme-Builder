/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Navigation module
 */
define(['ojs/ojcore', 'ojs/ojarraytabledatasource'],
  function (oj) {
    /**
     * The shared view model for navigation
     */
    function NavigationViewModel() {
      var self = this;

      // Shared navigation data for Nav Bar (medium and larger screens) and Nav List (small screens)
      var data = [
        {name: 'Home', id: 'home',
          iconClass: 'demo-home-icon-24 demo-icon-font-24 oj-navigationlist-item-icon'},
        {name: 'Instructions', id: 'library',
          iconClass: 'demo-library-icon-24 demo-icon-font-24 oj-navigationlist-item-icon'}
      ];

      self.dataSource = new oj.ArrayTableDataSource(data, {idAttribute: 'id'});
    }

    return new NavigationViewModel();
  }
);
