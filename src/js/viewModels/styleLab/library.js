/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['appController'],       
function(app) {
    var viewModel = function() {
        this.docresourcesConfig = app.createConfigGetter("docresources.html");
    }

    return viewModel;
}); 

