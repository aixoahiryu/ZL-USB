// @flow
/* global getSelection */
import MarkdownFormatter from "../MarkdownFormatter.js";
import _ from "../../../util/i18n";
import {
  createLink,
  findLineStart,
  formatBlock,
  getBlockState,
  getInlineState,
  getNodesInOrder,
  getRange,
  indent,
  insertList,
  liberate,
  outdent,
  removeList,
  surround,
} from "../markdownActions.js";
import { toNumber } from "lodash";

import type { CaretState } from "../markdownActions.js";

const markdownFormatter = new MarkdownFormatter();
const isMac = process.platform === "darwin";

let startOffsetOnNewline = 0;
let caretState: CaretState = {
  bold: false,
  italic: false,
  strikeThrough: false,
  formatBlock: "p",
  insertOrderedList: false,
  insertUnorderedList: false
};

const fireEvent = (event: string, data?: any) => {
  // Use console.log to notify wrapping container that change has occurred
  console.log(event, JSON.stringify(data));
};

/* Check if all lines of highlighted text are part of a list */
const isListSelected = (
  sel: Selection
): {|
  insertOrderedList: boolean,
  insertUnorderedList: boolean
|} => {
  const ret = {
    insertOrderedList: false,
    insertUnorderedList: false,
  };
  const selectionNodes = getNodesInOrder(sel);
  if (!selectionNodes) {
    return ret;
  }
  const [startNode, endNode] = selectionNodes;
  const regex = /^(\s*)(\d+.|\*|-|\+)\s/;
  const match = regex.exec(startNode.nodeValue);
  if (!match) {
    return ret;
  }
  const [symbols, nesting, prefix] = match;
  if (["*", "-", "+"].includes(prefix)) {
    // Bullet list
    let isList = true;
    let node = startNode;
    while (isList && node) {
      isList = (node instanceof HTMLBRElement) || node.nodeValue.startsWith(symbols);
      if (node.isSameNode(endNode)) {
        break;
      }
      node = node.nextSibling;
    }
    ret.insertUnorderedList = isList;
  } else {
    // ordered list
    let isList = true;
    let node = startNode;
    const check = new RegExp(`^${nesting}\\d+.`);
    while (isList && node) {
      isList = (node instanceof HTMLBRElement) || check.test(node.nodeValue);
      if (node.isSameNode(endNode)) {
        break;
      }
      node = node.nextSibling;
    }
    ret.insertOrderedList = isList;
  }

  return ret;
};

const onSelect = (e: Event) => {
  const sel = getSelection();
  if (!sel || !markdownFormatter) {
    return;
  }

  const node = sel.anchorNode;
  const nodeText = (node && node.textContent) || "";

  const ast = markdownFormatter.remarkable.parseInline(nodeText, {
    references: {}
  });

  const range = getRange(sel);
  const inlineState = getInlineState(ast[0], (range && range.startOffset) || 0);

  if (sel.isCollapsed) {
    caretState = {
      ...inlineState,
      ...getBlockState(sel)
    };
  } else {
    const selection = sel.toString();
    caretState = {
      bold: inlineState.bold && `${selection}*`.indexOf("**") === -1,
      italic: inlineState.italic && selection.indexOf("_") === -1,
      strikeThrough:
        inlineState.strikeThrough && `${selection}~`.indexOf("~~") === -1,
      formatBlock: "p",
      ...isListSelected(sel)
    };
  }
  fireEvent("caretState", caretState);
};

const onKeyDown = (event: KeyboardEvent) => {
  const key: string = event.key.toLowerCase();
  if (isMac ? event.metaKey : event.ctrlKey) {
    switch (key) {
      case "b":
        execCommand("bold", "");
        event.preventDefault();
        break;
      case "i":
        execCommand("italic", "");
        event.preventDefault();
        break;
      case "k":
        fireEvent("createLink", "");
        event.preventDefault();
        event.stopPropagation();
        break;
      case "s":
        // Prevent browser save dialog
        event.preventDefault();
        event.stopPropagation();
        break;
      default:
        return;
    }
  } else if (event.altKey && event.shiftKey && key === "s") {
    execCommand("strikeThrough", "");
  } else if (key === "backspace") {
    onBackSpace();
  } else if (key === "enter") {
    onNewline(event);
  }
};

const onKeyUp = (event: KeyboardEvent) => {
  const key: string = event.key.toLowerCase();
  const startOffset = startOffsetOnNewline;
  if (key === "enter" && startOffset > 0) {
    const sel = getSelection();
    const range = getRange(sel);
    const node = sel && sel.anchorNode;

    if (range && node) {
      range.setStart(node, range.startOffset + startOffset);
    }
    startOffsetOnNewline = 0;
  }
};

const execCommand = (command: string, value: string) => {
  const sel: ?Selection = getSelection();
  if (!sel) {
    return;
  }

  switch (command) {
    case "bold":
      if (caretState.bold) {
        liberate(sel, "**");
      } else {
        surround(sel, "**", _("Strong text"));
      }
      break;
    case "italic":
      if (caretState.italic) {
        liberate(sel, "_");
      } else {
        surround(sel, "_", _("Emphasized text"));
      }
      break;
    case "strikeThrough":
      if (caretState.strikeThrough) {
        liberate(sel, "~~");
      } else {
        surround(sel, "~~", _("Deleted text"));
      }
      break;
    case "insertUnorderedList":
      if (caretState.insertUnorderedList) {
        removeList(sel, false);
      } else {
        insertList(sel, false);
      }
      break;
    case "insertOrderedList":
      if (caretState.insertOrderedList) {
        removeList(sel, true);
      } else {
        insertList(sel, true);
      }
      break;
    case "indent":
      indent(sel);
      break;
    case "formatBlock":
      formatBlock(sel, value);
      break;
    case "outdent":
      outdent(sel, (caretState.insertOrderedList || caretState.insertUnorderedList));
      break;
    case "createLink":
      document.body && document.body.focus();
      createLink(sel, value);
      break;
    case "undo":
    case "redo":
      document.execCommand(command, false, null);
      break;
    default:
      return;
  }
};

const onNewline = (event: KeyboardEvent) => {
  const sel = getSelection();

  if (!sel) {
    return;
  }

  const range = getRange(sel);
  const node = sel.anchorNode;
  const nodeText = (node && node.textContent) || "";
  const start = findLineStart(nodeText, range ? range.startOffset : 0);

  const regex = /^(\s*)(\*|\+|-|>|\d+\.)\s(.*)/;
  const match = regex.exec(nodeText.substr(start));
  if (!match || !node) {
    return;
  }
  const [, nesting, prefix, content] = match;

  // Remove bullet/number if line is otherwise empty
  if (content.length === 0) {
    const end = start + nesting.length + prefix.length + 1;
    const delRange = new Range();
    delRange.collapse(false);
    // In a nested list we just want to decrease the indentation
    if (nesting.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      delRange.setStart(node, start + nesting.length - 4);
    } else {
      delRange.setStart(node, start);
    }
    delRange.setEnd(node, end);
    sel.removeAllRanges();
    sel.addRange(delRange);
    document.execCommand("delete", false);
    delRange.collapse(true);
    return;
  }

  // Add bullet/number if previous line is not empty and has a bullet/number
  if (nodeText.endsWith("\n\n")) {
    return;
  }

  // Move caret to "start of line" if it's current placed in the space reserved
  // for the bullet/number
  const startOfLine = start + nesting.length + prefix.length + 1;
  if (range && range.startOffset < startOfLine) {
    range.setStart(node, startOfLine);
  }

  // Insert the bullet at caret. Let the event propagate to create a new line
  // and then move the caret after the bullet in the onKeyUp event
  let insertText;
  if (prefix.length === 1) {
    insertText = `${nesting}${prefix} `;
  } else {
    insertText = `${nesting}${toNumber(prefix) + 1}. `;
  }
  startOffsetOnNewline = insertText.length;
  const rangeBefore = range && range.cloneRange();
  document.execCommand("InsertText", false, insertText);

  if (rangeBefore) {
    sel.removeAllRanges();
    sel.addRange(rangeBefore);
  }
};

const onBackSpace = () => {
  const sel = getSelection();
  if (!sel) {
    return;
  }
  const range = getRange(sel) || new Range();
  const node = sel.anchorNode;
  if (!node) {
    return;
  }
  const nodeText = (node && node.textContent) || "";
  const start = findLineStart(nodeText, range.startOffset);

  const regex = /^(\*|\+|-|>|\d+\.|#+)\s(.*)/;
  const match = regex.exec(nodeText.substr(start));
  if (!match) {
    return;
  }
  const trimEnd = start + match[1].length + 1;
  const trailingText: string = match && match[2];
  if (trailingText.length === 0 || trailingText.startsWith("\n")) {
    range.setStart(node, start);
    range.setEnd(node, trimEnd);
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("delete", false);
  }
};

const onMessage = (event: MessageEvent) => {
  const message = { type: "", command: "", value: "", ...event.data };
  if (message.type === "BUTTON_CLICK") {
    execCommand(message.command, message.value);
  }
};

function init() {
  document.body && document.body.focus();
  document.addEventListener("input", () => fireEvent("input"));
  document.addEventListener("selectionchange", onSelect);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  window.addEventListener("message", onMessage);
}

window.onButtonClicked = execCommand;

init();
