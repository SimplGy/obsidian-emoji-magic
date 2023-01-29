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

  const QUERY_SEPARATORS = /\s+/; // Specifies how search strings are tokenized
  const min = arr => Math.min.apply(Math, arr);
  const max = arr => Math.max(Math.max.apply(Math, arr), 0);

  // Given a pair of strings, how much does the `keyword` prefix the `candidate`?
  // eg: "foo", "foobar" -> 0.50 prefix
  // eg: "b",   "bake"   -> 0.25 prefix
  // Returns a number between 0 and 1, representing the overlap ratio
  const prefixOverlap = (term = '') => (candidate = '') => {
    if (term.length === 0 || candidate.lenth === 0) return 0;

    if(candidate.startsWith(term)) {
      return term.length / candidate.length;
    }

    return 0;
  };

  // Given a string, then an array of strings, return the maxPrefixOverlap
  // eg: "ca", ["cake", "calendar"] -> 0.5 is the max prefix overlap
  // Returns a number between 0 and 1, representing the overlap ratio
  const maxPrefixOverlap = (term = '') => (candidates = []) => {
    if (term.length === 0 || candidates.lenth === 0) return 0;

    const weights = candidates.map(prefixOverlap(term));
    return max(weights);
  };

  // Given a string, then a string[][], calculate the maxPrefixOverlap for each candidate array
  // eg: "ca", [["cake", "calendar"],["ca"]] -> [0.5, 1] is the max for each
  // Returns an array of numbers between 0 and 1, one number for each element in arr.
  const calcPrefixOverlaps = (term) => (arr = []) =>
    arr.map(maxPrefixOverlap(term));
  
  // Given a (possibly) multi-term query, call calcPrefixOverlaps for each term
  // Return an array of prefixOverlap arrays, one for each term
  // eg:
  // "red car goes", [a, b] ->
  // 'red':  [number, number]
  // 'car':  [number, number]
  // 'goes': [number, number]
  const prefixOverlapsByQueryTerm = (queryString = '') => (arr = []) => {
    const terms = queryString.split(QUERY_SEPARATORS);
    return terms.map(t => calcPrefixOverlaps(t)(arr));
  };
  
  // Given a (possibly) multi-term query, call calcPrefixOverlaps for each set of words
  // same as prefixOverlapsByQueryTerm, but the first dimension is the set of words, rather than the query term
  // Return an array of prefixOverlap arrays, one for each word set
  // eg:
  // "red car goes", [a, b] ->
  // a: [number, number, number]
  // b: [number, number, number]
  const prefixOverlapsByWordSet = (queryString = '') => (arr = []) => {
    const terms = queryString.split(QUERY_SEPARATORS);
    return arr.map(candidates =>
      terms.map(t => maxPrefixOverlap(t)(candidates))
    );
  };

  const minPrefixOverlapsByWordSet = (queryString = '') => {
    const fn = prefixOverlapsByWordSet(queryString);
    return (arr = []) => fn(arr).map(min);
  };
    

    
  return {
    QUERY_SEPARATORS,
    prefixOverlap,
    maxPrefixOverlap,
    calcPrefixOverlaps,
    prefixOverlapsByQueryTerm,
    prefixOverlapsByWordSet,
    minPrefixOverlapsByWordSet,
    __id__: 'matchers',
  }
})();
