"use strict";

import * as vscode from "vscode";

import {
	expandAbbreviation,
	wrapWithAbbreviation,
} from "./abbreviationActions";
import { balanceIn, balanceOut } from "./balance";
import { fetchEditPoint } from "./editPoint";
import { EmmetCompletionItemProvider } from "./emmetCompletionProvider";
import { matchTag } from "./matchTag";
import { mergeLines } from "./mergeLines";
import { removeTag } from "./removeTag";
import { fetchSelectItem } from "./selectItem";
import { splitJoinTag } from "./splitJoinTag";
import { toggleComment } from "./toggleComment";
import { updateTag } from "./updateTag";

interface ISupportedLanguageMode {
	id: string;

	triggerCharacters: string[];
}

const SUPPORTED_LANGUAGE_MODES: ISupportedLanguageMode[] = [
	{ id: "html", triggerCharacters: ["!", "."] },
	{ id: "jade", triggerCharacters: ["!", "."] },
	{ id: "slim", triggerCharacters: ["!", "."] },
	{ id: "haml", triggerCharacters: ["!", "."] },
	{ id: "xml", triggerCharacters: ["."] },
	{ id: "xsl", triggerCharacters: ["."] },

	{ id: "css", triggerCharacters: [":"] },
	{ id: "scss", triggerCharacters: [":"] },
	{ id: "sass", triggerCharacters: [":"] },
	{ id: "less", triggerCharacters: [":"] },
	{ id: "stylus", triggerCharacters: [":"] },

	{ id: "javascriptreact", triggerCharacters: ["."] },
	{ id: "typescriptreact", triggerCharacters: ["."] },
];

export function activate(context: vscode.ExtensionContext) {
	let completionProvider = new EmmetCompletionItemProvider();

	for (let language of SUPPORTED_LANGUAGE_MODES) {
		const selector: vscode.DocumentFilter = {
			language: language.id,
			scheme: "file",
		};

		const provider = vscode.languages.registerCompletionItemProvider(
			selector,
			completionProvider,
			...language.triggerCharacters,
		);

		context.subscriptions.push(provider);
	}

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.wrapWithAbbreviation", () => {
			wrapWithAbbreviation();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.expandAbbreviation", () => {
			expandAbbreviation();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.removeTag", () => {
			removeTag();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.updateTag", () => {
			vscode.window
				.showInputBox({ prompt: "Enter Tag" })
				.then((tagName) => {
					updateTag(tagName);
				});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.matchTag", () => {
			matchTag();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.balanceOut", () => {
			balanceOut();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.balanceIn", () => {
			balanceIn();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.splitJoinTag", () => {
			splitJoinTag();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.mergeLines", () => {
			mergeLines();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.toggleComment", () => {
			toggleComment();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.nextEditPoint", () => {
			fetchEditPoint("next");
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.prevEditPoint", () => {
			fetchEditPoint("prev");
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.selectNextItem", () => {
			fetchSelectItem("next");
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("emmet.selectPrevItem", () => {
			fetchSelectItem("prev");
		}),
	);
}

export function deactivate() {}
