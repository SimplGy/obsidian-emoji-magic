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

const {fromCodePoints, toCodePoints} = require('./code_points');



describe("Codepoint Conversion", () => {
  
  it('converts a single codepoint emoji back and forth', () => {
    const char = '💙';
    const codes = toCodePoints(char);
    expect(codes).toEqual([128153]); // an array with only one code in it
    expect(fromCodePoints(codes)).toBe(char);
  });

  it('converts a multi codepoint emoji back and forth', () => {
    const char = '🇨🇨';
    const codes = toCodePoints(char);
    expect(codes.length).toBe(2);
    expect(fromCodePoints(codes)).toBe(char);
  });

  it("converts '🙇‍♀️' back and forth", () => {
    const char = '🙇‍♀️';
    expect(fromCodePoints(toCodePoints(char))).toBe(char);
  });

  it("converts '👨‍👩‍👧‍👦' back and forth", () => {
    const char = '👨‍👩‍👧‍👦';
    expect(fromCodePoints(toCodePoints(char))).toBe(char);
  });
});
