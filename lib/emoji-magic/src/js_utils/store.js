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

/* 
 * @fileoverview
 * An abstraction around a client-side persistent storage mechanism.
 * You can keep stuff here and it'll last between usages of the tool on the user's device.
 * Data is not sent to any server.
 */

module.exports = ((global) => {
  const noop = () => {};
  
  // Get and set for LocalStorage
  const localStoreGet = (key, fn) => {
    const val = localStorage.getItem(key);
    // Warning: localStorage always returns strings. Does chrome.storage do the same?
    fn(JSON.parse(val));
  };
  const localStoreSet = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // Get and set for chrome.storage
  // const isRunningAsExtension = chrome.storage && chrome.storage.local;
  // const chromeGet = (key, fn)  => chrome.storage.local.get([key], fn);
  // const chromeSet = (key, val) => chrome.storage.local.set({[key]: val});
  // Guard: Are we running in a chrome context with access to chrome.storage?
  // if (!isRunningAsExtension) {
    //   console.info("chrome.storage.local not available");
  // }
    
  // Guard: Are we running in a node context with no localStorage?
  if (global == null || global.localStorage == null) {
    return {
      get: noop,
      set: noop,
    };
  } else {
    return {
      get: localStoreGet,
      set: localStoreSet,
      __id__: 'store', // emulated node modules
    };
  }
})(this);