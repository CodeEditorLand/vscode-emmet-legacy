"use strict";

import parse from "@emmetio/html-matcher";
import Node from "@emmetio/node";
import * as vscode from "vscode";

import { getNode, getNodeOuterSelection, isStyleSheet } from "./util";

export function mergeLines() {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showInformationMessage("No editor is active");

		return;
	}

	if (isStyleSheet(editor.document.languageId)) {
		return;
	}

	let rootNode: Node = parse(editor.document.getText());

	editor.edit((editBuilder) => {
		editor.selections.reverse().forEach((selection) => {
			let [rangeToReplace, textToReplaceWith] = getRangesToReplace(
				editor.document,
				selection,
				rootNode,
			);

			editBuilder.replace(rangeToReplace, textToReplaceWith);
		});
	});
}

function getRangesToReplace(
	document: vscode.TextDocument,
	selection: vscode.Selection,
	rootNode: Node,
): [vscode.Range, string] {
	let startNodeToUpdate: Node;

	let endNodeToUpdate: Node;

	if (selection.isEmpty) {
		startNodeToUpdate = endNodeToUpdate = getNode(
			rootNode,
			document.offsetAt(selection.start),
		);
	} else {
		startNodeToUpdate = getNode(
			rootNode,
			document.offsetAt(selection.start),
			true,
		);

		endNodeToUpdate = getNode(
			rootNode,
			document.offsetAt(selection.end),
			true,
		);
	}

	let rangeToReplace = new vscode.Range(
		document.positionAt(startNodeToUpdate.start),
		document.positionAt(endNodeToUpdate.end),
	);

	let textToReplaceWith = document
		.getText(rangeToReplace)
		.replace(/\r\n|\n/g, "")
		.replace(/>\s*</g, "><");

	return [rangeToReplace, textToReplaceWith];
}
