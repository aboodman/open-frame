var COMMANDS = {
  'open-this-tab': {
    label: 'In this tab',
    handler: function(url, tab) {
      chrome.tabs.update(tab.id, {url: url});
    }
  },

  'open-new-tab': {
    label: 'In a new tab',
    handler: function(url, tab) {
      chrome.tabs.create({url: url});
    }
  },

  'open-new-window': {
    label: 'In a new window',
    handler: function(url, tab) {
      chrome.windows.create({url: url});
    }
  },

  'open-new-incognito-window': {
    label: 'In a new incognito window',
    handler: function(url, tab) {
      chrome.windows.create({url: url, incognito: true});
    }
  }
}

chrome.runtime.onInstalled.addListener(function() {
  for (var commandId in COMMANDS) {
    chrome.contextMenus.create({
      title: COMMANDS[commandId].label,
      contexts: ['frame'],
      id: commandId
    });
  }
});

chrome.contextMenus.onClicked.addListener(function(clickData, tab) {
  var url = clickData.frameUrl || clickData.pageUrl;
  var handler = COMMANDS[clickData.menuItemId].handler;

  handler(url);
});
