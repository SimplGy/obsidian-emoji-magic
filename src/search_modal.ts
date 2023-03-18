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

import { Modal, Plugin } from 'obsidian';

import { EmojiMagicSettings, Emoji } from './interfaces';

// from Emoji Magic upstream
import {search as emojiSearch, htmlForAllEmoji as htmlForTheseEmoji, RECENT_SELECTION_LIMIT, DEFAULT_RESULTS, toObj as toEmojiObj} from '../lib/emoji-magic/src/app_data/emoji.js';
import {CHROME_EXTENSION_URL, STATIC_WEB_APP_URL} from './cfg';

const EMOJIS_PER_ROW = 8; // Not 100% fixed, depends on font size/zoom settings
const RESULT_LIMIT = EMOJIS_PER_ROW * 15; // for render perf, don't draw everything.
const SEARCH_CHARS_NEEDED = 2; // don't bother searching if user has typed fewer than this many letters.

// Rotate these messages whenever the popup opens to maybe keep things fresh/fun
const MESSAGES = [
  `Also available as a <a href="${CHROME_EXTENSION_URL}">Chrome Extension</a>`,
  `Brought to you by <a href="http://www.simple.gy">simple.gy</a>`,
  `Check out the <a href="${STATIC_WEB_APP_URL}">web app</a>`,
];
const EXAMPLE_SEARCHES = [ 'party', 'thank', 'happy', 'new', 'food', 'drink' ];

// keycodes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const ENTER = 13;

interface EmojiPickerDom {
  // must be the elemen that gets document.activeElement focus
  searchEl: HTMLInputElement,
  // must have direct children whose count exactly equals the count of emoji in the search results
  // (enables index-based lookup into dom)
  resultsEl: HTMLOListElement,
}



export class SearchModal extends Modal {
    result: string;
    private dom?: EmojiPickerDom;

    constructor(
      readonly plugin: Plugin, // generic plugin to avoid circular dep
      readonly onSubmit: (result: string) => void,
      readonly settings: EmojiMagicSettings,
    ) {
        super(plugin.app);
        this.modalEl.addClass('emoji-magic-modal');
    }

    public onOpen() {
        const { contentEl } = this;

        // ------------------------ Search Box
        const searchEl = document.createElement('input');
        searchEl.setAttribute('type', 'search');
        searchEl.setAttribute('autofocus', 'true');
        const eg = randomPick(EXAMPLE_SEARCHES);
        searchEl.setAttribute('placeholder', `Search for emoji (eg: "${eg}")`);

        // ------------------------ Grid of Emoji results
        const resultsEl = document.createElement('ol');
        resultsEl.addClass('results');
        
        // ------------------------ Grid of Emoji results
        const footerEl = document.createElement('footer');
        
        // ------------------------ Footer with a rotating message
        footerEl.innerHTML = randomPick(MESSAGES);

        // ------------------------ DOM mutation
        contentEl.appendChild(searchEl);
        contentEl.appendChild(resultsEl);
        contentEl.appendChild(footerEl);
        this.dom = {
          searchEl,
          resultsEl,
        };

        // ------------------------ Event Listeners
        searchEl.addEventListener('keyup', evt => {
          this.onKeyupSearchArea(evt, this.dom!);
        });
        // delegated button click handler. Is also fired for keyboard enter on button elements.
        contentEl.addEventListener('click', this.onAnyClick);
        contentEl.addEventListener('keyup', this.onAnyKey);
    }

    private onKeyupSearchArea = (evt, dom: EmojiPickerDom) => {
      const el = evt.target as HTMLInputElement|undefined;
      const str = el?.value ?? '';

      if (evt.keyCode === ENTER) {
        const emoji = getFirstEmoji(dom);
        this.chooseEmoji(emoji);
      } else {
        this.filterAndRender(str);
      }
    };

    private filterAndRender(str: string) {
      // Empty or short query? show recent or default
      const str = str.trim();
      const el = this.dom?.resultsEl;

      // No search, show recent/default
      if (str.length === 0) {
        const emoji: Emoji[] = this.getRecentEmoji().map(toEmojiObj);
        renderEmoji(emoji, el);

      // Typing, but not enough yet? show nothing.
      } else if (str.length < SEARCH_CHARS_NEEDED) {
        renderEmoji([],  el);

      // Search for emoji
      } else {
        const emoji: Emoji[] = emojiSearch(str);
        // console.log(`Emoji Magic: results for '${str}'`, emoji);
        renderEmoji(emoji, el);
      }
      
    }

    // Get recently used emoji chars, falling back to defaults as necessary.
    getRecentEmoji() {
      const recent = this.settings.recentEmoji;
      return recent.length === 0 ? DEFAULT_RESULTS : recent;
    }

    private onAnyClick = (evt) => {
      if (isButton(evt.target)) {
        this.onEmojiButtonPress(evt.target);
      }
    };

    private onAnyKey = (evt) => {
      if (this.dom == null) return console.warn("keypress, but dom not cached");
      
      // Handle the arrow keys with nice 2d grid support
      switch (evt.keyCode) {
        case LEFT:
          moveFocusX(-1, this.dom);
          break;
        case RIGHT:
          moveFocusX(+1, this.dom);
          break;
        case UP:
          moveFocusY(-1, this.dom);
          break;
        case DOWN:
          moveFocusY(+1, this.dom);
          break;
      }
    };

    private onEmojiButtonPress(buttonEl: HTMLButtonElement) {
      this.chooseEmoji(buttonEl.innerText);
    }

    private chooseEmoji(char: string = '') {
      this.trackRecent(char);
      this.close();
      this.onSubmit(char);
    }

    public onClose() {
      this.contentEl.empty();
      this.contentEl.removeEventListener('click', this.onAnyClick);
    }

  // add recent selection, but only track the most recent k
  // also deduplicates: if it's already present, remove matches first before putting the most recent at the front
  private trackRecent(char: string) {
    if (!char) return;

    let arr = this.settings.recentEmoji.slice();

    arr = arr.filter(c => c !== char);
    arr.unshift(char);
    if (arr.length > RECENT_SELECTION_LIMIT) {
      arr = arr.slice(0, RECENT_SELECTION_LIMIT);
    }

    this.settings.recentEmoji = arr;
    this.plugin.saveData(this.settings);
  }
}



// ----------------------------------------------------- Lovely isolated pure function lib, but DOM-coupled
function getFirstEmoji(dom: EmojiPickerDom) {
  const btn = dom.resultsEl.querySelector('button'); // get the first button
  if (!btn) return;
  const char = btn.innerText;
  return char;
}

// Move focus horizontally. +1 is right, -1 is left.
// wraps around
// boundary protection works because focusOn just exits if it doesn't find an el to focus
// really really dom coupled
function moveFocusX(direction = 0, dom: EmojiPickerDom) {
  const wasFromSearch = document.activeElement === dom.searchEl;
  if (wasFromSearch) return; // don't do custom arrow behavior if we're in the search box already

  const curLi = document.activeElement?.parentElement;
  if (!curLi) return;
  const idx = Array.from(dom.resultsEl.children).indexOf(curLi);
  focusOn(idx + direction, dom);
}

// +1 is down, -1 is up
function moveFocusY(direction = 0, dom: EmojiPickerDom) {

  // special case: moving down from search
  const wasFromSearch = document.activeElement === dom.searchEl;
  if(wasFromSearch) {
    if (direction > 0) {
      focusOn(0, dom);
    }
    return; // don't do more custom arrow behavior if we're just now exiting the search box
  }

  let el = document.activeElement?.parentElement;
  if (el == null) return;
  
  const left = el.offsetLeft;
  const top = el.offsetTop;
  let prevEl;

  // if we're going down a row...
  if (direction > 0) {
    // 1. look forward until we find something with a higher offsetTop (first el of next row)
    while(el && el.offsetTop <= top) {
      prevEl = el;
      el = el.nextElementSibling as HTMLElement|undefined;
    }

    // 2. look forward until we find something >= the current offsetLeft (same col, or close)
    while (el && el.offsetLeft < left) {
      prevEl = el;
      el = el.nextElementSibling as HTMLElement|undefined;
    }
    
    // another approach: just look for the next element with nearly the same left position, it'll be in the next row.
    // I like the way the current one handles sparse rows though.

  // if we're going up a row...
  } else if (direction < 0) {
    // 1. look backward until we find something with a lower offsetTop (last el of previous row)
    while(el && el.offsetTop >= top) {
      prevEl = el;
      el = el.previousElementSibling as HTMLElement|undefined;
    }
    // 2. look backward until we find something <= the current offsetLeft
    while (el && el.offsetLeft > left) {
      prevEl = el;
      el = el.previousElementSibling as HTMLElement|undefined;
    }
  }

  if (el) {
    el.querySelector('button')?.focus();
  } else if(prevEl) {
    // if moving up and we didn't find a correct focus target, choose the search box
    if (direction < 0) {
      dom.searchEl.focus();
      dom.searchEl.select();
    } else {
      prevEl.querySelector('button')?.focus();
    }
  }

}

function focusOn(idx, dom: EmojiPickerDom) {
  const li = dom.resultsEl.children[idx];
  if (!li) return;
  li.querySelector('button')?.focus();
}




// ----------------------------------------------------- Lovely isolated pure function lib
function randomPick<T>(arr: Array<T>): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function isButton(o: any): o is HTMLButtonElement {
  if ((o as HTMLButtonElement)?.tagName === 'BUTTON') return true;
  return false;
}

function renderEmoji(emojiObjects, targetEl) {
  emojiObjects = emojiObjects.slice(0, RESULT_LIMIT);
  const html = htmlForTheseEmoji(emojiObjects);
  targetEl.innerHTML = html;
}
