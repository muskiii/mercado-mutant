"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sentinel_1 = require("../search/sentinel");
let mutantSequence = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
let mutantData = { name: "mutant", rows: mutantSequence };
let HumanSequence = ["TTGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CACCTA", "TCACTG"];
let humantData = { name: "human", rows: HumanSequence };
describe(`${mutantData.name} solver`, () => {
    it(`should find a ${mutantData.name} `, () => {
        const matches = sentinel_1.isMutant(mutantData.rows);
        expect(matches).toEqual(true);
    });
});
describe(`${humantData.name} solver`, () => {
    it(`should find a ${humantData.name} `, () => {
        const matches = sentinel_1.isMutant(humantData.rows);
        expect(matches).toEqual(false);
    });
});
