/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */


function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }

    return null;
}


// saved dir to be set on html tag
function setDir(dir)
{
  $( "html" ).attr( "dir", dir);
}

var jetDirSessionStorageName = "jetDirSettings";

function getDirSettings()
{
  // Retrieve the dir object from storage
  var dir = sessionStorage.getItem(jetDirSessionStorageName);

  if (!dir)
    return "ltr";

  return dir;
}

function saveDirSettings(dir)
{
  try {
    sessionStorage.setItem(jetDirSessionStorageName, dir);
  }
  catch (e) {
    // Safari private mode doesn't allow session storage, which was messing up the dialog: do nothing and just don't save the setting
  }
}

// saved font size to be set on html tag
function setFontsize(size)
{
  $( "html" ).css( "font-size", size);
}

var jetFontsizeSessionStorageName = "jetFontsizeSettings";

function getFontsizeSettings()
{
  // Retrieve the fontsize object from storage
  var size = sessionStorage.getItem(jetFontsizeSessionStorageName);

  // Bug 19606971 - we are getting the item as "null" from the storage. Convert it to null
  // because otherswise the observable will be fixed up with null (since there is no item with the value "null")
  if (size === "null")
  {
    size = null;
  }

  return size;
}

function saveFontsizeSettings(size)
{
  try {
    sessionStorage.setItem(jetFontsizeSessionStorageName, size);
  }
  catch (e) {
    // Safari private mode doesn't allow session storage, which was messing up the dialog: do nothing and just don't save the setting
  }
}

/**
 * The theme can be changed for the site, this method changes the url to the css
 */
function applyThemeSettings()
{

  // in compatibility mode add oj-html and oj-body, otherwise things look
  // very different from alta.
  if (theme.compatibility)
  {
    $("html").addClass("oj-html");
    $("body").addClass("oj-body");
  }
  else
  {
    $("html").removeClass("oj-html");
    $("body").removeClass("oj-body");

  }

  initHighContrast();
}

function initHighContrast()
{

  if (theme.highcontrast)
  {
    $("body").addClass("oj-hicontrast");
  }
  else
  {
    $("body").removeClass("oj-hicontrast");

  }
}


function initFontSize()
{

}


var tourIndex = 0;



// As part of 19598867 need to ensure that theme/fontsize/dir beforeare set demo content will be executed.
// Though we are asynchronously setting these after loading jquery, it looks like this snippet is still executed
// much before as all of demo js content dependent on other libraries along with jquery.

require(['jquery'], function($){
  setDir(getDirSettings());
  setFontsize(getFontsizeSettings());
  applyThemeSettings();
});


/**
 * Example of Require.js boostrap javascript
 */

 // The UserAgent is used to detect IE11. Only IE11 requires ES5.
(function () {
  
  function _ojIsIE11() {
    var nAgt = navigator.userAgent;
    return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
  };
  var _ojNeedsES5 = _ojIsIE11();

  requirejs.config({
    // Path mappings for the logical module names
    paths:
    // injector:mainReleasePaths
    {
      'knockout': 'libs/knockout/knockout-3.5.1.debug',
      'jquery': 'libs/jquery/jquery-3.5.1',
      'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
      'hammerjs': 'libs/hammer/hammer-2.0.8',
      'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2',
      'ojs': 'libs/oj/v9.1.0/debug' + (_ojNeedsES5 ? '_es5' : ''),
      'ojL10n': 'libs/oj/v9.1.0/ojL10n',
      'ojtranslations': 'libs/oj/v9.1.0/resources',
      'signals': 'libs/js-signals/signals',
      'text': 'libs/require/text',
      'customElements': 'libs/webcomponents/custom-elements.min',
      'touchr': 'libs/touchr/touchr',
      'corejs' : 'libs/corejs/shim',
      'regenerator-runtime' : 'libs/regenerator-runtime/runtime'
    }
    // endinjector
    ,
    // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
    // resources with a custom translation file.
    // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
    // a path that is relative to the location of this main.js file.
    config: {
      ojL10n: {
        merge: {
          //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
        }
      }
    }
  });
}());

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
 require(['ojs/ojcore', 'knockout', 'appController', 'ojs/ojknockout', 'ojs/ojrouter',
   'ojs/ojmodule', 'ojs/ojdialog', 'ojs/ojnavigationlist', 'ojs/ojtoolbar',
   'ojs/ojbutton', 'ojs/ojcheckboxset', 'ojs/ojmenu'],
   function (oj, ko, app) { // this callback gets executed when all required modules are loaded

     oj.Router.sync().then(
       function () {
         // bind your ViewModel for the content of the whole page body.
         ko.applyBindings(app, document.getElementById('globalBody'));
       },
       function (error) {
         oj.Logger.error('Error in root start: ' + error.message);
       }
     );
   }
 );
