import { isMutant } from "../search/sentinel";

let mutantSequence = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
let mutantData = { name: "mutant", rows: mutantSequence};

let HumanSequence = ["TTGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CACCTA", "TCACTG"];
let humantData = { name: "human", rows: HumanSequence};

describe(`${mutantData.name} solver`, () => {
    it(`should find a ${mutantData.name} `, () => {
        const matches = isMutant(mutantData.rows);
        expect(matches).toEqual(true)       
    })
});

describe(`${humantData.name} solver`, () => {
    it(`should find a ${humantData.name} `, () => {
        const matches = isMutant(humantData.rows);
        expect(matches).toEqual(false)       
    })
});