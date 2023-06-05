/*
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { App, Plugin, PluginSettingTab } from 'obsidian';

import { SearchModal } from './search_modal';
import { EmojiMagicSettings, EmojiMagicPluginType } from './interfaces';
import {CHROME_EXTENSION_URL, GITHUB_BUG_REPORT_PATH} from './cfg';

// The compiled "database" from Emoji Magic upstream
// import {array as emojilibThesaurus} from '../lib/emoji-magic/src/app_data/emoji_data.js';

const emojiCount = 1_812; // emojilibThesaurus.length;
const words = 119_658; // emojilibThesaurus.reduce((sum, obj) => sum + obj.keywords.length + obj.thesaurus.flat().length, 0);

const DEFAULT_SETTINGS: EmojiMagicSettings = {
	recentEmoji: [],
};

// ---------------------------------------------------- Plugin Definition
export default class EmojiMagicPlugin extends Plugin implements EmojiMagicPluginType {
	
	settings: EmojiMagicSettings;
	
	async onload() {
		await this.loadSettings();

		// For fun, print how many keywords this plugin  (except don't live-calculate, because it's slow to calculate)
		console.log(`${this.manifest.name}: Loading ${prettyNum(emojiCount)} emoji with ${prettyNum(words)} searchable keywords and thesaurus entries`);

		this.addSettingTab(new SettingsTab(this.app, this));
		this.resetCommands();
	}

	onunload() {
		// no-op
	}

	async loadSettings() {
		this.settings = {...DEFAULT_SETTINGS, ...await this.loadData()};
	}

	// note: this is called ~every keystroke, so be aware
	async saveSettings() {
		await this.saveData(this.settings);
	}


	// ---------------------------------------------------- Command Setup
	resetCommands() {
		// if you "add" with the same id, it works as an "update"
		this.addCommand({
			id: 'insert', // automatically prefixed with plugin name
			name: `Insert emoji...`,
			callback: () => this.openSearchUX(this.insertTextAtCursor),
		});
		this.addCommand({
			id: 'copy',
			name: `Copy emoji to clipboard...`,
			callback: () => this.openSearchUX(this.copyToClipboard, "Copy emoji"),
		});
		this.addCommand({
			id: 'add-to-filename-start',
			name: `Add emoji to filename...`,
			callback: () => this.openSearchUX(this.updateFilenameStart, "Add emoji to filename"),
		});
	}


	// ---------------------------------------------------- Actual Behavior

	// Open the search UX. when complete, calls the callback with the selected emoji.
	// if you want, override the placeholder message
	openSearchUX(callback: (text?: string) => void, placeholder?: string) {
		const modal = new SearchModal(this, callback, placeholder);
		modal.open();
	}

	insertTextAtCursor = (text: string = '') => {
		const view = this.app.workspace.activeEditor;
			
		// Make sure the user is editing a Markdown file.
		if (view?.editor) {
			// Insert text
			const cursor = view.editor.getCursor();
			view.editor.replaceRange(text, cursor);
			// then, move their cursor *after* the text we inserted
			const newPos = cursor.ch + text.length;
			view.editor.setCursor({ ...cursor, ch: newPos });
		} else {
			console.warn("Asked to insertTextAtCursor, but didn't find a MarkdownView");
		}
	};

	copyToClipboard = (text?: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text)
	};
	
	updateFilenameStart = (text?: string) => {
		if (!text) return;
		const view = this.app.workspace.activeEditor;
		if (!view?.file) return console.warn('no view.file');
		
		// Calculate the new "path" (simple file rename)
		let curPath = view.file.path;
		const idx = curPath.lastIndexOf(view.file.name);
		const start = curPath.substring(0, idx);
		const end = curPath.substring(idx)
		const newPath = `${start}${text} ${end}`;

		// Set the value
		this.app.fileManager.renameFile(view.file, newPath);
	};
	
}



// ---------------------------------------------------- Settings Screen
class SettingsTab extends PluginSettingTab {
	
	plugin: EmojiMagicPlugin;

	constructor(app: App, plugin: EmojiMagicPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h1", { text: this.plugin.manifest.name });
		containerEl.createEl("h3", { text: 'How to use' });
		containerEl.addClass('emoji-magic-settings');

		const aside = containerEl.createEl('aside');
		aside.createEl('p', { text: 'This plugin is most useful if you add a hotkey. eg:' });
		aside.createEl('p', { text: '' }).createEl('code', {text: 'cmd + shift + e'});
		aside.createEl('hr');
		aside.createEl('p', { text: 'Your recent emoji:' }).createEl('code', {text: this.plugin.settings.recentEmoji.join('  '), cls: 'padded-sides' });
		aside.createEl('hr');
		aside.createEl('p', { text: 'Emoji Magic is also available as a ', cls: 'muted' }).createEl('a', {text: 'Chrome Extension', href: CHROME_EXTENSION_URL});
		aside.createEl('p', { text: 'Please report problems with specific search phrases on ', cls: 'muted' }).createEl('a', {text: 'GitHub', href: GITHUB_BUG_REPORT_PATH});
	}
}



// ---------------------------------------------------- dep-free Util Function Lib
function prettyNum(n: number) {
	return new Intl.NumberFormat().format(n);
}