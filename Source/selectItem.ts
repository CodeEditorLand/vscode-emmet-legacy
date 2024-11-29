"use strict";

import parseStylesheet from "@emmetio/css-parser";
import parse from "@emmetio/html-matcher";
import Node from "@emmetio/node";
import * as vscode from "vscode";

import { nextItemHTML, prevItemHTML } from "./selectItemHTML";
import { nextItemStylesheet, prevItemStylesheet } from "./selectItemStylesheet";
import { isStyleSheet, validate } from "./util";

export function fetchSelectItem(direction: string): void {
	let editor = vscode.window.activeTextEditor;

	if (!validate()) {
		return;
	}

	let nextItem;

	let prevItem;

	let parseContent;

	if (isStyleSheet(editor.document.languageId)) {
		nextItem = nextItemStylesheet;

		prevItem = prevItemStylesheet;

		parseContent = parseStylesheet;
	} else {
		nextItem = nextItemHTML;

		prevItem = prevItemHTML;

		parseContent = parse;
	}

	let rootNode: Node = parseContent(editor.document.getText());

	let newSelections: vscode.Selection[] = [];

	editor.selections.forEach((selection) => {
		let updatedSelection =
			direction === "next"
				? nextItem(selection, editor, rootNode)
				: prevItem(selection, editor, rootNode);

		newSelections.push(updatedSelection ? updatedSelection : selection);
	});

	editor.selections = newSelections;
}
