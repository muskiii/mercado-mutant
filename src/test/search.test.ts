import testGrups from '../utils/testGroup'
import { isMutant } from "../utils/sentinel";

let mutantSequence = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
let mutantData = { name: "mutant", rows: mutantSequence, words: testGrups };

let HumanSequence = ["TTGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CACCTA", "TCACTG"];
let humantData = { name: "human", rows: HumanSequence, words: testGrups };

describe(`${mutantData.name} solver`, () => {
    it(`should find a ${mutantData.name} `, () => {
        const matches = isMutant(mutantData.rows, mutantData.words, 2);
        expect(matches).toEqual(true)       
    })
});

describe(`${humantData.name} solver`, () => {
    it(`should find a ${humantData.name} `, () => {
        const matches = isMutant(humantData.rows, humantData.words, 2);
        expect(matches).toEqual(false)       
    })
});