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

import { App, SuggestModal } from 'obsidian';
// import EditTask from './ui/EditTask.svelte';
// import type { Task } from './Task';
// import { StatusRegistry } from './StatusRegistry';
// import { Status } from './Status';




// from Emoji Magic upstream
import {search as emojiSearch, htmlForAllEmoji as htmlForTheseEmoji, summaryString, htmlForEmoji} from '../lib/emoji-magic/src/app_data/emoji.js';




const RESULT_LIMIT = 8 * 15; // for render perf, don't draw everything. size by row assuming default font size/zoom settings.


interface Emoji {
  char: string;
}


export class SearchModal extends SuggestModal<Emoji> {
  emptyStateText = 'Find Emoji by key words';
  
    result: string;
    public readonly onSubmit = (result: string) => {
      console.log('onSubmit', result);
    };

    constructor({ app, onSubmit }: { app: App; onSubmit: (result: string) => void }) {
        super(app);

        // this.task = task;
        // this.onSubmit = (updatedTasks: Task[]) => {
        //     updatedTasks.length && onSubmit(updatedTasks);
        //     this.close();
        // };
    }

    getSuggestions(query: string): Emoji[] {
      if (query.length === 1) return [];
      if (query.length === 2) return [];
      // >3 chars? ok, search:
      
      const emojiObjects = emojiSearch(query);
      console.log(`Emoji Magic: results for '${query}'`, emojiObjects);

      return emojiObjects;
    }
  
    // Renders each suggestion item.
    renderSuggestion(emoji: Emoji, el: HTMLElement) {
      // el.innerHTML = htmlForEmoji(emoji);

      el.createEl("div", { text: emoji.char });
      el.setAttribute('title', summaryString(emoji));
      // el.createEl("small", { text: emoji.author });
    }
  
    // Perform action on the selected suggestion.
    onChooseSuggestion(emoji: Emoji, evt: MouseEvent | KeyboardEvent) {
      // new Notice(`Selected ${book.title}`);
      console.log('Emoji Magic: selected one', emoji);
    }

    public onOpen(): void {
        this.titleEl.setText('Emoji Magic: Search for emoji');
        const { contentEl } = this;
        // const containerEl = contentEl.createEl("div");

        // contentEl.setText("Look at me, I'm a modal! 👀");
        // contentEl.createEl("h1", { text: "What's your name?" });

        // const resultsEl = document.createElement('ol');
        // const searchEl = document.createElement('input');
        // searchEl.setAttribute('type', 'search');
        // searchEl.addEventListener('keyup', evt => {
        //   const str = (evt.target as HTMLInputElement)?.value;
        //   filterAndRender(str, resultsEl);
        // });
        // contentEl.appendChild(searchEl);
        // contentEl.appendChild(resultsEl);






        // function filterAndRender(str: string, targetEl) {
          
        //   renderEmoji(emojiObjects, targetEl);
        // }

        function renderEmoji(emojiObjects, targetEl) {
          emojiObjects = emojiObjects.slice(0, RESULT_LIMIT);
          const html = htmlForTheseEmoji(emojiObjects);
          targetEl.innerHTML = html;
          
          // if (emoji.length === 0) {
          //   $.copyBtn().setAttribute('disabled', true);
          // } else {
          //   $.copyBtn().removeAttribute('disabled');
          // }
        }




        /*
        goal:

        <header style="text-align: center; margin-top: 10px; opacity: 0.2;">
          <input id="SearchBox" type="search" autofocus title="Why is that word matching this emoji?">
        </header>

        <section class="emoji-details" id="Output"></section>
        */

          


    // new Setting(contentEl)
    //   .setName("Name")
    //   .addText((text) =>
    //     text.onChange((value) => {
    //       this.result = value
    //     }));

    // new Setting(contentEl)
    //   .addButton((btn) =>
    //     btn
    //       .setButtonText("Submit")
    //       .setCta()
    //       .onClick(() => {
    //         this.close();
    //         this.onSubmit(this.result);
    //       }));



        // const statusOptions = this.getKnownStatusesAndCurrentTaskStatusIfNotKnown();

        // new EditTask({
        //     target: contentEl,
        //     props: { task: this.task, statusOptions: statusOptions, onSubmit: this.onSubmit },
        // });
    }

    /**
     * If the task being edited has an unknown status, make sure it is added
     * to the dropdown list.
     * This allows the user to switch to a different status and then change their
     * mind and return to the initial status.
     */
    // private getKnownStatusesAndCurrentTaskStatusIfNotKnown() {
    //     const statusOptions: Status[] = StatusRegistry.getInstance().registeredStatuses;
    //     if (StatusRegistry.getInstance().bySymbol(this.task.status.symbol) === Status.EMPTY) {
    //         statusOptions.push(this.task.status);
    //     }
    //     return statusOptions;
    // }

    public onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}