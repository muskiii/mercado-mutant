"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const directions_1 = require("./directions");
const trie_1 = require("./trie");
const testGroup_1 = __importDefault(require("./testGroup"));
function isMutant(rows) {
    const words = testGroup_1.default;
    const assertions = 2;
    const directions = directions_1.Directions;
    const matches = [];
    let mutantFound = false;
    const trie = new trie_1.TrieNode();
    for (const word of words) {
        trie.add(word);
    }
    for (let startRowIdx = 0; startRowIdx < rows.length; startRowIdx++) {
        const row = rows[startRowIdx];
        for (let startColIdx = 0; startColIdx < row.length; startColIdx++) {
            for (const direction of directions) {
                let rowIdx = startRowIdx;
                let colIdx = startColIdx;
                let seen = "";
                while (!mutantFound &&
                    rowIdx >= 0 &&
                    rowIdx < rows.length &&
                    colIdx >= 0 &&
                    colIdx < rows[rowIdx].length) {
                    seen += rows[rowIdx][colIdx];
                    const result = trie.isPrefix(seen);
                    if (result === null) {
                        break;
                    }
                    if (result.isComplete) {
                        matches.push(seen);
                        if (matches.length == assertions) {
                            mutantFound = true;
                        }
                        break;
                    }
                    rowIdx += direction.rowIdx;
                    colIdx += direction.colIdx;
                }
            }
        }
    }
    return mutantFound;
}
exports.isMutant = isMutant;
