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

import { App, MarkdownView, Plugin, PluginSettingTab, Setting, TFile, moment } from 'obsidian';

// The compiled "database" from Emoji Magic upstream
import {array as emojilibThesaurus} from '../lib/emoji-magic/src/app_data/emojilib_thesaurus.js';

interface MyPluginSettings {
	foo: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	foo: 'Sounds good.'
};

// ---------------------------------------------------- Plugin Definition
export default class MyPlugin extends Plugin {
	
	settings: MyPluginSettings;
	
	async onload() {
		await this.loadSettings();

		// For fun, print how many keywords this plugin supports
		const emojiCount = emojilibThesaurus.length;
		const words = emojilibThesaurus.reduce((sum, obj) => sum + obj.keywords.length + obj.thesaurus.flat().length, 0);
		console.log(`${this.manifest.name}: Loading ${emojiCount} emoji with ${new Intl.NumberFormat().format(words)} searchable keywords and thesaurus entries`);

		this.addSettingTab(new SettingsTab(this.app, this));
		this.resetCommands();
	}

	onunload() {
		console.log('unloading ' + this.manifest.name);
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


	// ---------------------------------------------------- Commands
	resetCommands() {
		// if you "add" with the same id, it works as an "update"
		this.addCommand({
			id: 'emoji-magic-copy', // should not change over time
			name: `Find an emoji and copy it to clipboard`,
			callback: () => {
				console.log('Hello from a plugin command');
			}
		});
		this.addCommand({
			id: 'emoji-magic-insert', // should not change over time
			name: `Find an emoji and insert it where your cursor is`,
			callback: () => {
				console.log('Hello from a plugin command');
			}
		});
	}
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
		containerEl.createEl("h2", { text: this.plugin.manifest.name });
		
		const setting = new Setting(this.containerEl);
	  setting.setName("Setting for 'foo'");
		setting.addText(cb => {
			cb
				.setPlaceholder("placeholder text")
				.setValue(this.plugin.settings.foo)
				.onChange(value => {
					this.plugin.settings.foo = value;
					this.plugin.saveSettings();
				});
		});		
	}
}
