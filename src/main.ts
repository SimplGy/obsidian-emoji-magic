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

import { App, Plugin, PluginSettingTab, Setting, MarkdownView, Editor } from 'obsidian';

import { SearchModal } from './search_modal';
// import { SearchModal } from './search_modal_suggest_variant';

// The compiled "database" from Emoji Magic upstream
// import {array as emojilibThesaurus} from '../lib/emoji-magic/src/app_data/emoji_data.js';

const CHROME_EXTENSION_URL = 'https://chrome.google.com/webstore/detail/emoji-magic/jfegjdogmpipkpmapflkkjpkhbnfppln';
const GITHUB_REPO_URL = 'https://github.com/SimplGy/obsidian-emoji-magic';



interface MyPluginSettings {
}

const DEFAULT_SETTINGS: MyPluginSettings = {
};

// ---------------------------------------------------- Plugin Definition
export default class MyPlugin extends Plugin {
	
	settings: MyPluginSettings;
	
	async onload() {
		await this.loadSettings();

		// For fun, print how many keywords this plugin  (except don't live-calculate, because it's slow to calculate)
		const emojiCount = 1_812; // emojilibThesaurus.length;
		const words = 119_658; // emojilibThesaurus.reduce((sum, obj) => sum + obj.keywords.length + obj.thesaurus.flat().length, 0);
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
		// update the commands, which is what hotkeys are set against
		this.resetCommands();
	}


	// ---------------------------------------------------- Command Setup
	resetCommands() {
		// if you "add" with the same id, it works as an "update"
		this.addCommand({
			id: 'emoji-magic-insert', // should not change over time
			name: `Find an emoji and insert it where your cursor is`,
			callback: () => this.openSearchUX(),
		});
	}


	// ---------------------------------------------------- Actual Behavior
	openSearchUX() {
		const modal = new SearchModal(this.app, this.insertTextAtCursor);
		modal.open();
	}

	insertTextAtCursor = (text: string) => {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			
		// Make sure the user is editing a Markdown file.
		if (view) {
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
}



// ---------------------------------------------------- Settings Screen
class SettingsTab extends PluginSettingTab {
	
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h1", { text: this.plugin.manifest.name });
		containerEl.createEl("h3", { text: 'How to use' });
		containerEl.addClass('emoji-magic-settings');

		// what it does
		// Most useful if you add a hotkey. I like `cmd + shift + e` ("e" for "emoji")
		// All you need to do is hit the 

		const aside = document.createElement('aside');
		aside.innerHTML = `
			<p>This plugin is Most useful if you add a hotkey.</p>
			<p>I like: <code style="background-color: var(--color-base-20): padding: 0 3px;">cmd + shift + e</code></p>
			<p>("e" for "emoji")</p>

			<hr/>
			
			<p>Emoji Magic is also available as a <a href="${CHROME_EXTENSION_URL}" >Chrome Extension</a>.</p>
			<p>Please report problems with specific search phrases in the <a href="${GITHUB_REPO_URL}">GitHub repo</a>.</p>
		`;

		this.containerEl.appendChild(aside);

		// const setting = new Setting(this.containerEl);
	  // setting.setName("Setting for 'foo'");
		// setting.addText(cb => {
		// 	cb
		// 		.setPlaceholder("placeholder text")
		// 		.setValue(this.plugin.settings.foo)
		// 		.onChange(value => {
		// 			this.plugin.settings.foo = value;
		// 			this.plugin.saveSettings();
		// 		});
		// });		
	}
}



// ---------------------------------------------------- dep-free Util Function Lib
function prettyNum(n: number) {
	return new Intl.NumberFormat().format(n);
}