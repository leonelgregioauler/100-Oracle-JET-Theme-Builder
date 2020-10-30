/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
var jetThemeSettingsSessionStorageName = "jetThemeSettings3";

function initThemeSettings()
{
  // Retrieve the site settings object from storage
  var retrievedObject = sessionStorage.getItem(jetThemeSettingsSessionStorageName);
  var themeSettings = JSON.parse(retrievedObject);

  if (themeSettings == null)
  {
    theme.demoTheme = "none";
    theme.sourcemaps = true;
    theme.compatibility = false;
    theme.highcontrast = false;
    // I REALLY want to get rid of the base theme and use
    // a combo of theme name and target platform
    theme.baseTheme = "alta";
  }
  else
  {
    theme = themeSettings;
  }

  var themeFileName = "";
  var colorThemeFileName = "";

  if (theme.demoTheme == "none" )
  {
    var themeName = "alta";

    themeFileName = "css/alta/9.1.0/" + baseThemeToPlatformMap[theme.baseTheme] + "/" + themeName;

    colorThemeFileName = "css/altacolors/" + baseThemeToPlatformMap[theme.baseTheme] + "/alta-colors";

    if (theme.compatibility)
    {
      themeFileName = themeFileName + "-notag";
    }

  }
  else
  {
      themeFileName = "css/" + theme.demoTheme + "/" +
                      baseThemeToPlatformMap[theme.baseTheme] + "/" + theme.demoTheme;
      colorThemeFileName = themeFileName + "-colors";

  }

  if (theme.sourcemaps == false)
  {
    themeFileName = themeFileName + "-min";
  }

  themeFileName = themeFileName + ".css";
  themeColorScssFileName = colorThemeFileName + ".css";


  document.open();
  document.write("<link rel=\"stylesheet\" id=\"css\" href=\"" + themeFileName + "\">");
  document.write("<link rel=\"stylesheet\" id=\"themecolorscss\" href=\"" + themeColorScssFileName + "\">");

  document.close();
}

var baseThemeToPlatformMap = {
                    'alta': 'web',
                    'alta-ios': 'ios',
                    'alta-android': 'android',
                    'alta-windows': 'windows'};

var platformToAltaDirMap = { 'web': 'alta',
                    'ios': 'alta-ios',
                    'android': 'alta-android',
                    'windows': 'alta-windows'};
var theme = {};
initThemeSettings();

function getThemeSettings()
{
  return theme;
}

function saveThemeSettings()
{
  try {
    sessionStorage.setItem(jetThemeSettingsSessionStorageName, JSON.stringify(theme));
  }
  catch (e)
  {
    // Safari private mode doesn't allow session storage, which was messing up the dialog: do nothing and just don't save the setting
  }
}
