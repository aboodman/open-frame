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
  },

  'copy-url': {
    label: 'Copy frame URL',
    handler: function(url, tab) {
      var bufferNode = document.createElement('textarea');
      document.body.appendChild(bufferNode);
      bufferNode.value = url;
      bufferNode.focus();
      bufferNode.selectionStart = 0;
      bufferNode.selectionEnd = url.length;
      document.execCommand('copy');
      document.body.removeChild(bufferNode);
    },
    insertSeparatorBefore: true
  }
}

chrome.runtime.onInstalled.addListener(function() {
  for (var commandId in COMMANDS) {
    var command = COMMANDS[commandId];

    if (command.insertSeparatorBefore) {
      chrome.contextMenus.create({
        type: 'separator',
        contexts: ['frame'],
        // ID should not be required (http://crbug.com/154644)
        id: commandId + '-separator'
      });
    }

    chrome.contextMenus.create({
      title: command.label,
      contexts: ['frame'],
      id: commandId
    });
  }
});

chrome.contextMenus.onClicked.addListener(function(clickData, tab) {
  var url = clickData.frameUrl || clickData.pageUrl;
  var handler = COMMANDS[clickData.menuItemId].handler;

  handler(url, tab);
});
