"use strict";

import parse from "@emmetio/html-matcher";
import Node from "@emmetio/node";
import * as vscode from "vscode";

import { getNode } from "./util";

export function updateTag(tagName: string) {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showInformationMessage("No editor is active");

		return;
	}

	let rootNode: Node = parse(editor.document.getText());

	let rangesToUpdate = [];
	editor.selections.reverse().forEach((selection) => {
		rangesToUpdate = rangesToUpdate.concat(
			getRangesToUpdate(editor, selection, rootNode),
		);
	});

	editor.edit((editBuilder) => {
		rangesToUpdate.forEach((range) => {
			editBuilder.replace(range, tagName);
		});
	});
}

function getRangesToUpdate(
	editor: vscode.TextEditor,
	selection: vscode.Selection,
	rootNode: Node,
): vscode.Range[] {
	let offset = editor.document.offsetAt(selection.start);

	let nodeToUpdate = getNode(rootNode, offset);

	let openStart = editor.document.positionAt(nodeToUpdate.open.start + 1);

	let openEnd = openStart.translate(0, nodeToUpdate.name.length);

	let ranges = [new vscode.Range(openStart, openEnd)];

	if (nodeToUpdate.close) {
		let closeStart = editor.document.positionAt(
			nodeToUpdate.close.start + 2,
		);

		let closeEnd = editor.document.positionAt(nodeToUpdate.close.end - 1);
		ranges.push(new vscode.Range(closeStart, closeEnd));
	}
	return ranges;
}
