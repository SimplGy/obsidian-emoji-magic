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



module.exports = (() => {

  // Given an emoji, return an array of code points.
  // Must be an array to support multichar emoji like "🇨🇨" (2) and "🙇‍♀️" (4)
  function toCodePoints(char) {
    return Array.from(char).map(s => s.codePointAt(0));
  }

  // Given an array of numeric "code points", return a char
  function fromCodePoints(arr = []) {
    return arr.map(n => String.fromCodePoint(n)).join('');
  }

  return {
    toCodePoints,
    fromCodePoints,
    __id__: 'code_points',
  }
})();
