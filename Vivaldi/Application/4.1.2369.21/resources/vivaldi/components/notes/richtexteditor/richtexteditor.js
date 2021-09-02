// @flow
/* global getSelection */
import '../../common/RichTextEditorInlineReply.js';
import Caret from './Caret.js';
import _ from '../../../util/i18n';
import {
  StackObject,
  UndoStack,
} from '../../../util/undoStack.js';
import type { CaretPos } from './Caret.js';

const undoStack = new UndoStack();
const isMac = process.platform === 'darwin';
let anchor = '';

function fireEvent(event) {
  // Use console.log to notify wrapping container that change has occurred
  console.log(event);
}

const stripInternalUrl = (url) => {
  if (url.includes('richtexteditor.html#')) {
    return url.split('richtexteditor.html')[1];
  }
  return url;
};

const clearPopups = () => {
  [...document.getElementsByClassName('tooltip-text')].forEach(el => {
    el && el.parentElement && el.parentElement.classList.remove('tooltip');
    el.remove();
  });
};

const selectTextAndExec = (command: string, event: MouseEvent) => {
  const sel = getSelection();
  if (sel && sel.focusNode) {
    sel.setBaseAndExtent(
      sel.focusNode, 0, sel.focusNode, sel.focusNode.nodeValue.length
    );
  }
  fireEvent(command);
  event.preventDefault();
  event.stopPropagation();
};

const onKeyDown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  if (event.altKey && event.shiftKey && key === 's') {
    document.execCommand('strikeThrough', false, null);
  } else if (isMac ? event.metaKey : event.ctrlKey) {
    switch (key) {
      case 'z':
        event.preventDefault();
        event.stopPropagation();
        if (event.shiftKey) {
          undoStack.redo();
        } else {
          undoStack.undo();
        }
        break;
      case 'k':
        fireEvent('createLink');
        event.preventDefault();
        event.stopPropagation();
        break;
      case 's':
        // Prevent browser save dialog
        event.preventDefault();
        event.stopPropagation();
        break;
      default:
        break;
    }
  }
};

const preventDefault = (event: MouseEvent) => {
  event.preventDefault();
};

const renderLinkToolbar = (event: MouseEvent) => {
  clearPopups();
  // $FlowFixMe select all anchor text first to remove existing link
  const clickedLink = event.target.closest('a');
  if (!clickedLink) {
    return;
  }

  const tooltip = document.createElement('SPAN');
  tooltip.classList.add('tooltip-text');
  tooltip.setAttribute('contenteditable', 'false');

  const tooltipLink = document.createElement('A');
  const href= stripInternalUrl(clickedLink.href);
  tooltipLink.setAttribute('href', href);
  if (!href.startsWith('#')) {
    tooltipLink.setAttribute('target', '_blank');
  }
  tooltipLink.appendChild(document.createTextNode(href));

  const tooltipCopyButton = document.createElement('INPUT');
  tooltipCopyButton.setAttribute('type', 'button');
  tooltipCopyButton.setAttribute('value', _('link', 'Copy'));
  tooltipCopyButton.setAttribute('title', _('Copy Link Address'));

  const tooltipEditButton = document.createElement('INPUT');
  tooltipEditButton.setAttribute('type', 'button');
  tooltipEditButton.setAttribute('value', _('link', 'Edit'));
  tooltipCopyButton.setAttribute('title', _('Edit Link Address'));

  const tooltipUnlinkButton = document.createElement('INPUT');
  tooltipUnlinkButton.setAttribute('type', 'button');
  tooltipUnlinkButton.setAttribute('value', _('link', 'Remove'));
  tooltipUnlinkButton.setAttribute('title', _('Remove Link'));

  tooltip.appendChild(tooltipLink);
  tooltip.appendChild(tooltipCopyButton);
  tooltip.appendChild(tooltipEditButton);
  tooltip.appendChild(tooltipUnlinkButton);
  clickedLink.classList.add('tooltip');
  clickedLink.appendChild(tooltip);

  tooltipCopyButton.addEventListener('mousedown', preventDefault);
  tooltipCopyButton.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    clearPopups();
    navigator.clipboard.writeText(anchor);
    fireEvent(`copyLink ${anchor}`);
  });
  tooltipEditButton.addEventListener('mousedown', preventDefault);
  tooltipEditButton.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    clearPopups();
    selectTextAndExec('editLink', event);
  });
  tooltipUnlinkButton.addEventListener('mousedown', preventDefault);
  tooltipUnlinkButton.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    clearPopups();
    selectTextAndExec('unlink', event);
  });
};

const getAnchor = () => {
  const sel = getSelection();
  if (sel && sel.focusNode && sel.focusNode.parentElement) {
    const anchorElement: ?Element = sel.focusNode.parentElement.closest('a');
    if (anchorElement instanceof HTMLAnchorElement && anchorElement.href) {
      return stripInternalUrl(anchorElement.href);
    }
  }
  return '';
};

const onSelectionChange = (event: Event) => {
  const currentAnchor = getAnchor();
  if (anchor !== currentAnchor) {
    anchor = currentAnchor;
    fireEvent(`linkupdate ${currentAnchor}`);
  } else if (!currentAnchor) {
    anchor = '';
    fireEvent('linkupdate');
  }
  fireEvent('selectionchange');
};

const setStyle = (isDark: boolean, isNote: boolean, css: string) => {
  // update base colors & theme class
  const styleTag = document.getElementById('richtextstyle');
  const linkTag = document.getElementById('stylesheet');
  if (!styleTag) {
    return;
  }
  styleTag.innerHTML = css;

  if (isNote && linkTag instanceof HTMLLinkElement) {
    linkTag.rel = "stylesheet";
    linkTag.href = "./md.css";
    if (isDark) {
      document.body && document.body.classList.add("theme-dark");
    } else {
      document.body && document.body.classList.remove("theme-dark");
    }
  }
};

const setContent = (content: string, isPlainText: boolean): void => {
  if (!document.body) {
    return;
  }
  if (isPlainText) {
    document.body.innerText = content;
  } else {
    document.body.innerHTML = content;
  }
  currentContent = content;
};

const selectSurrounding = () => {
  const sel = getSelection();
  sel &&
    sel.focusNode &&
    sel.setBaseAndExtent(sel.focusNode, 0, sel.focusNode, sel.focusNode.nodeValue.length);
};

function execCommand (command: string, value: string) {
  switch (command) {
    case "undo":
      undoStack.undo();
      break;
    case "redo":
      undoStack.redo();
      break;
    default:
      document.execCommand(command, false, value);
  }
}

let currentContent: string = "";
let currentCaretPos: CaretPos = { selector: Caret.defaultPath, offset: 0};

type ChangeObj = {|
  content: string,
  caretPos: CaretPos
|};

function startObserving() {
  let skipObserve = false;
  const observer = new MutationObserver(mutations => {
    const updateFunc = (changeObj: ChangeObj) => {
      if (!document.body) {
        return;
      }
      // Don't record changes when redoing/undoing
      skipObserve = true;

      // Change content to recorded state and set caret position
      document.body.innerHTML = changeObj.content;
      Caret.setPosition(changeObj.caretPos);
    };

    mutations.forEach(function (mutation) {
      if (!document.body) {
        return;
      }

      if (skipObserve) {
        skipObserve = false;
        return;
      }
      const newContent = document.body.innerHTML;
      if (newContent !== currentContent) {
        const newCaretPos = Caret.getPosition();
        undoStack.record(
          new StackObject<ChangeObj>(
            { content: currentContent, caretPos: currentCaretPos },
            { content: newContent, caretPos: newCaretPos },
            updateFunc
          )
        );
        currentContent = newContent;
        currentCaretPos = newCaretPos;
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      characterData: true,
      characterDataOldValue: true,
      subtree: true
    });
  }
}

const onInput = (event: MessageEvent) => {
  // Set checkbox attribute in HTML to enable interactive md-todo support
  const input = event.target;
  if (input instanceof HTMLInputElement && input.type === 'checkbox') {
    if (input.checked) {
      input.setAttribute('checked', 'true');
    } else {
      input.removeAttribute('checked');
    }
  }
  fireEvent("input");
};

const onMessage = (event: MessageEvent) => {
  const message = {
    type: "",
    isDark: false,
    isNote: false,
    css: "",
    command: "",
    value: "",
    isPlainText: true,
    ...event.data
  };

  switch (message.type) {
    case "EXEC_COMMAND":
      execCommand(message.command, message.value);
      break;
    case "SELECT_SURROUNDING":
      selectSurrounding();
      break;
    case "SET_STYLE":
      setStyle(message.isDark, message.isNote, message.css);
      startObserving();
      break;
    case "SET_CONTENT":
      setContent(message.value, message.isPlainText);
      break;
  }
};

function init() {
  document.addEventListener('DOMContentLoaded', () => document.body && document.body.focus());
  document.addEventListener('input', onInput);
  document.addEventListener('selectionchange', onSelectionChange);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('click', renderLinkToolbar);
  document.addEventListener("undoredo", () => fireEvent('input'));
  window.addEventListener('blur', clearPopups);
  window.addEventListener("message", onMessage);
}

init();
