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

import { App, Modal, Setting } from 'obsidian';
// import EditTask from './ui/EditTask.svelte';
// import type { Task } from './Task';
// import { StatusRegistry } from './StatusRegistry';
// import { Status } from './Status';

// TODO
// .modal-container that contains .emoji-magic-modal should do:
// align-items: flex-start
// top: 10% // default max-height is 80% so this will look centered when full size

// from Emoji Magic upstream
import {search as emojiSearch, htmlForAllEmoji as htmlForTheseEmoji} from '../lib/emoji-magic/src/app_data/emoji.js';



const EMOJIS_PER_ROW = 8; // Not 100% fixed, depends on font size/zoom settings
const RESULT_LIMIT = EMOJIS_PER_ROW * 15; // for render perf, don't draw everything.
const CHROME_EXTENSION_URL = 'https://chrome.google.com/webstore/detail/emoji-magic/jfegjdogmpipkpmapflkkjpkhbnfppln';
const STATIC_WEB_APP_URL = 'https://www.simple.gy/emoji-magic/';
const MESSAGES = [
  `Also available as a <a href="${CHROME_EXTENSION_URL}">Chrome Extension</a>`,
  `Brought to you by <a href="http://www.simple.gy">simple.gy</a>`,
  `Check out the  <a href="${STATIC_WEB_APP_URL}">web app</a>`,
];

export class SearchModal extends Modal {
    result: string;

    // public readonly onSubmit: (result: string) => void;

    constructor(
      app: App,
      readonly onSubmit: (result: string) => void,
    ) {
        super(app);
        this.modalEl.addClass('emoji-magic-modal');

    }

    public onOpen() {
        this.titleEl.setText('Add Emoji');
        const { contentEl } = this;

        // ------------------------ Search Box
        const searchEl = document.createElement('input');
        searchEl.setAttribute('type', 'search');
        searchEl.setAttribute('autofocus', 'true');

        // ------------------------ Grid of Emoji results
        const resultsEl = document.createElement('ol');
        resultsEl.addClass('results');
        
        // ------------------------ Grid of Emoji results
        const footerEl = document.createElement('footer');
        
        // ------------------------ Footer with a rotating message
        const msgIdx = Math.floor(Math.random() * MESSAGES.length);
        const msg = MESSAGES[msgIdx];
        footerEl.innerHTML = msg;

        // ------------------------ DOM mutation
        contentEl.appendChild(searchEl);
        contentEl.appendChild(resultsEl);
        contentEl.appendChild(footerEl);

        // ------------------------ Event Listeners
        searchEl.addEventListener('keyup', evt => {
          const str = (evt.target as HTMLInputElement)?.value;
          filterAndRender(str, resultsEl);
        });
        // delegated button click handler. Is also fired for keyboard enter on button elements.
        contentEl.addEventListener('click', this.onAnyClick);
    }

    private onAnyClick = (evt) => {
      if (isButton(evt.target)) {
        this.onEmojiButtonPress(evt.target);
      }
    };

    private onEmojiButtonPress(buttonEl: HTMLButtonElement) {
      const char = buttonEl.innerText;
      this.close();
      this.onSubmit(char);
    }

    public onClose() {
      this.contentEl.empty();
      this.contentEl.removeEventListener('click', this.onAnyClick);
    }
}



// ----------------------------------------------------- Lovely isolated pure function lib
function isButton(o: any): o is HTMLButtonElement {
  if ((o as HTMLButtonElement)?.tagName === 'BUTTON') return true;
  return false;
}

function filterAndRender(str: string, targetEl) {
  if (str.length === 1) return;
  if (str.length === 2) return;
  // >3 chars? ok, search:
  
  const emojiObjects = emojiSearch(str);
  // console.log(`Emoji Magic: results for '${str}'`, emojiObjects);
  renderEmoji(emojiObjects, targetEl);
}

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
