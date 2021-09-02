/* This is the script for undocked devtools in Vivaldi */

/*eslint-disable no-undef*/

let _theWebview;
let _inspectingTabId;

// vivaldiInspectTabId is set on the contentWindow in the document loading
function init() {
  _theWebview = document.createElement("webview");
  _theWebview.inspect_tab_id = _inspectingTabId = vivaldiInspectTabId;
  const webviewdiv = document.getElementById("webviewdiv");
  webviewdiv.appendChild(_theWebview);
  const webpagecontainer = document.getElementById("webview-container");
  webpagecontainer.style.visibility = "visible";
  attachWebViewListeners();
  attachDevtoolsListeners();

  chrome.tabs.get(_inspectingTabId, tab => {
    document.title = "Developer Tools - Vivaldi - " + tab.url;
  });
  _theWebview.focus();
}

function attachWebViewListeners() {
  _theWebview.addEventListener("newwindow", onNewWindow);
  _theWebview.addEventListener("close", onClose);
  _theWebview.addEventListener("dialog", onJavascriptDialog);
}

function attachDevtoolsListeners() {
  vivaldi.devtoolsPrivate.onDockingStateChanged.addListener(
      onDockingStateChanged);
  vivaldi.devtoolsPrivate.onClosed.addListener(
      onDevtoolsClosed);
  vivaldi.devtoolsPrivate.onActivateWindow.addListener(
      onActivateWindow);
}


function closeWindow() {
  webviewdiv.removeChild(_theWebview);
  window.close();
}

function onDevtoolsClosed(tabId) {
  if (tabId === _inspectingTabId) {
    closeWindow();
  }
}

function onActivateWindow(tabId) {
  if (tabId === _inspectingTabId) {
    const thisAppWindow = chrome.app.window.current();
    thisAppWindow.focus();
    _theWebview.focus();
  }
}

function onDockingStateChanged(tabId, dockingState) {
  if (tabId === _inspectingTabId && dockingState !== "undocked") {
    closeWindow();
  }
}

function onClose(event) {
  const thisAppWindow = chrome.app.window.current();
  thisAppWindow.close();
}

function onNewWindow(event) {
  event.window.accept(vivaldiWindowId + ";1");
}

function onJavascriptDialog(event) {
  // This only opens as a confirmation dialog for deleting an override
  // directory. We currently don't have code for dialogs outside react, so just
  // ok it here instead.
  event.preventDefault();
  event.dialog.ok(event.defaultPromptText);
}

window.onload = init;
