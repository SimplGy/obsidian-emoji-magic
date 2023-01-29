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

const {prefixOverlap, maxPrefixOverlap, calcPrefixOverlaps, prefixOverlapsByQueryTerm, prefixOverlapsByWordSet, minPrefixOverlapsByWordSet} = require('./matchers');



describe("matchers.js", () => {

  describe("prefixOverlap()", () => {
    it('sees matches', () => {
      const result = prefixOverlap('foo')('foobar');
      expect(result).toBeGreaterThan(0);
    });
    it('only matches prefixes', () => {
      expect(prefixOverlap('a')('ab')).toBeGreaterThan(0);
      expect(prefixOverlap('b')('ab')).toBe(0);
    });
    it('does not match a blank keyword', () => {
      expect(prefixOverlap('')('foo')).toBe(0);
    });
    it('calculates expected prefix ratios', () => {
      expect(prefixOverlap('f')('farm')).toBe(0.25);
      expect(prefixOverlap('fa')('farm')).toBe(0.50);
      expect(prefixOverlap('far')('farm')).toBe(0.75);
      expect(prefixOverlap('farm')('farm')).toBe(1);
    });
  });

  describe("maxPrefixOverlap()", () => {
    it('returns 0 for no matches', () => {
      expect(maxPrefixOverlap('a')(['boo', 'baby', 'car'])).toBe(0);
    });
    it('returns the expected maximum', () => {
      const candidates = ['camera', 'california', 'card', 'cabrio'];
      expect(maxPrefixOverlap('ca')(candidates)).toBe(0.5); // 50% overlap in 'ca'/'card'
    });
  });

  describe("calcPrefixOverlaps()", () => {
    it('calculates overlaps for multiple word sets', () => {
      const keywords = ['card', 'camera'];
      const lessCertainKeywords = ['cardinals', 'car'];
      const term = 'car';
      const result = calcPrefixOverlaps(term)([keywords, lessCertainKeywords]);
      expect(result).toEqual([
        0.75, // car/card
        1,    // car/car
      ]);
    });
  });

  describe("prefixOverlapsByQueryTerm()", () => {
    const a = ['card', 'camera', 'redemption', 'foo'];
    const b = ['cardinals', 'car', 'bar', 'baz'];
    const result = prefixOverlapsByQueryTerm('red car goes')([a, b]);
    it('uses query terms as the primary dimension', () => {
      expect(result.length).toBe(3);
      expect(result[0].length).toBe(2);
    });
    it('calculates overlaps for a multi-term query against multiple word sets', () => {
      expect(result).toEqual([
      // a    b
        [.3,  0],  // 'red'
        [.75, 1],  // 'car'
        [0,   0],  // 'goes'
      ]);
    });
  });
  
  describe("prefixOverlapsByWordSet()", () => {
    const a = ['card', 'camera', 'redemption', 'foo'];
    const b = ['cardinals', 'car', 'bar', 'baz'];
    const result = prefixOverlapsByWordSet('red car goes')([a, b]);
    it('uses candidate word sets as the primary dimension', () => {
      expect(result.length).toBe(2);
      expect(result[0].length).toBe(3);
    });
    it('calculates overlaps for a multi-term query against multiple word sets', () => {
      expect(result).toEqual([
      // red car  goes
        [.3, .75, 0],   // a
        [0,  1,   0],   // b
      ]);
    });
  });
  
  describe("minPrefixOverlapsByWordSet()", () => {
    const a = ['card', 'carmen', 'red'];
    const b = ['cardinals', 'car', 'redemptive'];
    const result = minPrefixOverlapsByWordSet('red car')([a, b]);
    it('picks the min for each word set', () => {
      //                      a     b
      expect(result).toEqual([.75, .3]);
                          // car/card
                                 // red/redemptive
    });
  });
  
});
