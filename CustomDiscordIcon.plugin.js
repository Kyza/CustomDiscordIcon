//META{"name":"CustomDiscordIcon","website":"https://github.com/KyzaGitHub/CustomDiscordIcon","source":"https://raw.githubusercontent.com/KyzaGitHub/CustomDiscordIcon/master/CustomDiscordIcon.plugin.js"}*//

var CustomDiscordIcon = function() {};

var updateInterval;

const {
  remote
} = require('electron');
const win = remote.getCurrentWindow();
var fs = require("fs");
var path = require('path');
var configPath = path.join(__dirname, "CustomDiscordIcon.config.json");

CustomDiscordIcon.prototype.start = function() {
  /* Start Libraries */

  let libraryScript = document.getElementById("ZLibraryScript");
  if (!libraryScript || !window.ZLibrary) {
    if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
    libraryScript = document.createElement("script");
    libraryScript.setAttribute("type", "text/javascript");
    libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
    libraryScript.setAttribute("id", "ZLibraryScript");
    document.head.appendChild(libraryScript);
  }

  libraryScript = document.querySelector('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js"]');
  if (!libraryScript || performance.now() - libraryScript.getAttribute("date") > 600000) {
    if (libraryScript) libraryScript.remove();
    libraryScript = document.createElement("script");
    libraryScript.setAttribute("type", "text/javascript");
    libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js");
    libraryScript.setAttribute("date", performance.now());
    document.head.appendChild(libraryScript);
  }

  updateInterval = setInterval(() => {
    ZLibrary.PluginUpdater.checkForUpdate("CustomDiscordIcon", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/CustomDiscordIcon/master/CustomDiscordIcon.plugin.js");

		// Might as well use this interval for making sure the icon is set.
		if (loadSettings() != undefined) {
			// TODO Make the plugin get the current guild icon, save it, and set it as the taskbar icon.
			if (loadSettings().useGuildIcons) {
			} else {
				win.setIcon(loadSettings().customImagePath);
			}
		}
  }, 5000);
};

CustomDiscordIcon.prototype.load = function() {};

CustomDiscordIcon.prototype.unload = function() {};

CustomDiscordIcon.prototype.stop = function() {
  clearInterval(updateInterval);
};

CustomDiscordIcon.prototype.onMessage = function() {};

CustomDiscordIcon.prototype.onSwitch = function() {};

CustomDiscordIcon.prototype.observer = function(e) {
  //raw MutationObserver event for each mutation
};

CustomDiscordIcon.prototype.getSettingsPanel = function() {
  var settingsWrapper = document.createElement("div");
  settingsWrapper.setAttribute("style", "width; 100%; height: auto;");

  var iconPath = document.createElement("input");
  iconPath.setAttribute("id", "custom-icon-path");
  iconPath.setAttribute("placeholder", "Enter the path to the image.");
  iconPath.setAttribute("type", "text");
  iconPath.setAttribute("style", "width: 100%; height: 30px;");

  var errorHTML = "<br>Your image must use a standard format such as <strong>PNG or JPG</strong>.<br>Animated GIFs are not supported and never will be.<br>Your image can't be a URL to something online, it has to ba saved somewhere.";
  iconPath.oninput = () => {
    saveSettings();

    try {
      const win = remote.getCurrentWindow();
      win.setIcon(document.getElementById("custom-icon-path").value);
      removeError();
    } catch (e) {
      settingsWrapper.appendChild(createError(errorHTML));
    }
  };

  settingsWrapper.appendChild(iconPath);
  iconPath.value = (loadSettings() == undefined ? "" : loadSettings().customImagePath);

  // Try setting the icon right away.
  try {
    const {
      remote
    } = require('electron');
    const win = remote.getCurrentWindow();
    win.setIcon(document.getElementById("custom-icon-path").value);
    removeError();
  } catch (e) {
    settingsWrapper.appendChild(createError(errorHTML));
  }

  BdApi.showToast("CustomDiscordIcon: Your settings will be saved automatically.", {});

  return settingsWrapper;
};

function createError(errorHTML) {
  if (document.getElementById("custom-icon-error")) {
    document.getElementById("custom-icon-error").remove();
  }
  var error = document.createElement("div");
  error.setAttribute("id", "custom-icon-error");
  error.setAttribute("style", "color: red;");
  error.innerHTML = errorHTML;
  return error;
}

function removeError() {
  if (document.getElementById("custom-icon-error")) {
    document.getElementById("custom-icon-error").remove();
  }
}



function createSettingsFile() {
  var defaultStructure = {
    useGuildIcons: false,
    customImagePath: ""
  };
  fs.writeFile(configPath, JSON.stringify(defaultStructure, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }
    return loadSettings();
  });
}

function loadSettings() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath));
  } else {
    return createSettingsFile();
  }
}

function saveSettings() {
  fs.writeFile(configPath, JSON.stringify({
    useGuildIcons: false,
    customImagePath: document.getElementById("custom-icon-path").value
  }, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }
  });
}


CustomDiscordIcon.prototype.getName = function() {
  return "CustomDiscordIcon";
};

CustomDiscordIcon.prototype.getDescription = function() {
  return "This BetterDiscord plugin allows you to change Discord's icon in the taskbar.";
};

CustomDiscordIcon.prototype.getVersion = function() {
  return "1.0.0";
};

CustomDiscordIcon.prototype.getAuthor = function() {
  return "Kyza#9994";
};
