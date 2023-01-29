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

const emojiData = require('./emoji_data');



describe("emoji_data.js", () => {
  describe("data array", () => {
    it("has more than 1500 emojis", () => {
      expect(emojiData.array.length).toBeGreaterThan(1500);
    });
    it("does not always copy the 'name' into 'keywords'", () => {
      const o = emojiData.toObj('💚');
      expect(o.name).toBe('green heart');
      expect(o.keywords).not.toContain('green');
      expect(o.keywords).not.toContain('heart');
      expect(o.keywords).not.toContain('green heart');
    });
    it("has the full_slug in 'keywords'", () => {
      const o = emojiData.toObj('💚');
      expect(o.slug).toBe('green_heart');
      expect(o.keywords).toContain('green_heart');
    });
    it("provides a special location for multi word names", () => {
      const o = emojiData.toObj('💚');
      expect(o.name).toBe('green heart');
      expect(o.nameParts).toContain('green');
      expect(o.nameParts).toContain('heart');
    });
    // Validate this, because then the search weighting score would count it for both
    it("never has a name that exactly matches a keyword", () => {
      for (let emoji of emojiData.array) {
        for (let namePart of emoji.nameParts) {
          expect(emoji.keywords).not.toContain(namePart, emoji.char);
        }
      }
      const o = emojiData.toObj('💚');
      expect(o.slug).toBe('green_heart');
      expect(o.keywords).toContain('green_heart');
    });
  });
});