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

const {array, toChars, toObj} = require('./emoji_data');
const store = require('../js_utils/store');
const emoji = require('./emoji');

function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}



describe("emoji.js", () => {

  // shorthand for doing an emoji search and converting the results to chars instead of objects
  s = (term) => toChars(emoji.search(term));

  // expect that a term includes emojiChar somewhere in results
  expectSearchIncludes = (term, emojiChar) => {
    let result = s(term);
    expect(result).toContain(emojiChar);
  };

  // expect that the top ranked result for a term is emojiChar
  expectFirstResult = (term, emojiChar) => {
    const result = s(term);
    expect(result[0]).toBe(emojiChar);
  };

  describe("setup", () => {
    it("has prerequisites defined", () => {
      expect(store).toBeDefined();
      expect(emoji).toBeDefined();
    });
  });
  
  describe("emoji.search()", () => {
    it('returns an array of structured objects', () => {
      const result = emoji.search('diamond');
      expect(result.length).toBeGreaterThanOrEqual(6); // might add more emoji. Never remove or invalidate keywords
      expect(toChars(result)).toContain('💍');
      expect(result[0].nameParts.length).toBeGreaterThan(0);
      expect(result[0].keywords.length).toBeGreaterThan(0);
      expect(result[0].thesaurus.length).toBeGreaterThan(0);
    });
    it("matches epected symbols for 'crystal'", () => {
      const result = s('crystal');
      // WARNING: if you check length on a joined string result instead of this array, you'll probably see 4, not 2, because many emoji are multi-byte chars.
      expect(result).toContain('🔮');
      expect(result).toContain('💠');
    });

    it("matches epected symbols for 'pepper'", () => {
      const topThreeResults = s('pepper').slice(0,3);
      expect(topThreeResults).toContain('🌶️');
    });

    it("matches other simple searches", () => {
      expect(s('green')).toContain('💚');
    });

    it("handles multi-word searches", () => {
      expectFirstResult('blue heart', '💙');
      expectFirstResult('  heart    blue ', '💙'); // funny spacing
      expectFirstResult('green ball', '🎾');
      expectFirstResult('sad cat', '😿');
    });

    it("only matches prefixes", () => {
      const result = s('ice');
      expect(result).not.toContain('👨‍💼'); // Shouldn't match "off[ice] worker"
    });

    it("matches some common prefixes", () => {
      const result = s('fire');
      expect(result).toContain('🔥'); // fire
      expect(result).toContain('🚒'); // fire engine
      expect(result).toContain('👩‍🚒'); // woman firefighter
    });

    it("can match the second word of multi word emoji names like 'shaved ice'", () => {
      const emojiObj = toObj('🍧');
      expect(emojiObj.name).toBe('shaved ice');

      // even though it doesn't startWith "ice", because it's in the name, it matches
      expectSearchIncludes('ice', '🍧')
    });

    it("does't just blindly match anywhere in multi word emoji names", () => {
      const emojiObj = toObj('🍧');
      expect(emojiObj.name).toBe('shaved ice');

      // even though it doesn't startWith "ice", because it's in the name, it matches
      expect(s('have')).not.toContain('🍧') // "have" does not match "shaved"
    });
  });
    
  describe("emoji.computeMatchVectorForEmoji(emojiObj, query)", () => {
    const subject = toObj('💚');
    it('calculates a three component vector', () => {
      const result = emoji.computeMatchVectorForEmoji(subject, 'love green heart');
      expect(result.length).toBe(3);
    });
    it('finds "green heart" in keywords for "💚"', () => {
      const [n, k, t] = emoji.computeMatchVectorForEmoji(subject, 'green heart');
      expect(n).toBe(1); // 100% match on name -- all of the input words match 100% of something in corpus
    });
    it('finds "love" in "💚"', () => {
      const [n, k, t] = emoji.computeMatchVectorForEmoji(subject, 'love');
      expect(k).toBeGreaterThan(0, 'keyword match strength');
      expect(t).toBeGreaterThan(0, 'thesaurus match strength');
    });
    it('returns a zero score on "rutabaga" for "💚"', () => {
      const [n, k, t] = emoji.computeMatchVectorForEmoji(subject, 'rutabaga');
      expect(n + k + t).toBe(0);
    });
  });

  describe("emoji.matchStrengthFor(emojiObj, query)", () => {
    // mock "emoji" data with known match percentages
    const subject = {
      char: 'z',
      nameParts: ['aaaaaaaa', 'cc'],
      keywords: ['aaaa', 'cc'],
      thesaurus: [
        ['aa', 'cccccccc'],
        ['aaa', 'ccccc']
      ],
    };
    // Multi word query, so all words must match at least a little bit
    const query = 'aa cc';

    it('computeMatchVectorForEmoji() returns expected vector strengths', () => {
      const [n, k, t] = emoji.computeMatchVectorForEmoji(subject, query);
      expect(n).toBe(0.25, 'name'); // "aa" is the weakest query term at "aa"/"aaaaaaaa" -- 25% match
      expect(k).toBe(0.5, 'keyword'); // "aa" is the weakest query term at "aa"/"aaaa" -- 50% match
      expect(t).toBe(0.4, 'thesaurus'); // "cc" is the weakest query term at "cc"/"ccccc" -- 40% match
    });
    it('calculates match strength as expected', () => {
      // Test the vector combination "math"
      const strength = emoji.matchStrengthFor(subject, query);
      const name = 0.25; // known result, validated in test above
      const keyword = 0.5; // known result
      const thesaurus = 0.4; // known result
      expect(strength).toBe(name + keyword/10 + thesaurus/1000); // the keywords and thesaurus matches are downweighted so they sort lower
    });
  });
  
  describe("Thesaurus Matching", () => {
    
    it("finds things using thesaurus it otherwise wouldn't (eg: 😀)", () => {
      expectSearchIncludes('visage', '😀');
    });

    it("finds things using thesaurus it otherwise wouldn't (eg: 🥶)", () => {
      expectSearchIncludes('ice', '🥶');
      
    });

    it("finds things using thesaurus it otherwise wouldn't (eg: 🤬)", () => {
      expectSearchIncludes('tempestuous', '🤬');
    });
    
    it("finds synonyms for 'barf'", () => {
      expectSearchIncludes('sick', '🤮'); // this is the human entered, "canonical" keyword
      expectSearchIncludes('barf', '🤮');
      expectSearchIncludes('puke', '🤮');
    });
  });



  // -------------------------------------------- Reverse search. Do we see expected keywords and synonyms for a symbol?
  describe("Emoji Objects", () => {
    const sickEmoji = toObj('🤮');
    it('has keywords', () => {
      expect(sickEmoji.keywords.length).toBeGreaterThanOrEqual(2); // '🤮' has some keywords
    });
    it('has a reasonable looking thesaurus', () => {
      const sickThesaurus = flatten(sickEmoji.thesaurus);
      expect(sickThesaurus.length).toBeGreaterThan(80);
      // Has expected synonyms
      expect(sickThesaurus).toEqual(jasmine.arrayContaining(['afflicted','seasick','dizzy','unwell']));
      // And not ones you wouldn't
      expect(sickThesaurus).not.toEqual(jasmine.arrayContaining(['giraffe','elephant']));
    });
  });

});
