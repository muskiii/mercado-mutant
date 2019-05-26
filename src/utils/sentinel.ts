
import { Directions, Displacement } from "./directions";
import { TrieNode } from "./trie";
import testGrups from '../utils/testGroup';

export function isMutant(rows: string[]): boolean {
  const words: string[] = testGrups;
  const assertions: number = 2;
  const directions: Displacement[] = Directions
  const matches: String[] = [];
  let mutantFound = false;

  const trie = new TrieNode();
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

        while (
          !mutantFound &&
          rowIdx >= 0 &&
          rowIdx < rows.length &&
          colIdx >= 0 &&
          colIdx < rows[rowIdx].length
        ) {
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

// V2 busqueda parametrizada
export function isMutantV2(
  rows: string[],
  words: string[],
  assertions: number,
  directions: Displacement[] = Directions
): boolean {
  const trie = new TrieNode();
  for (const word of words) {
    trie.add(word);
  }

  const matches: String[] = [];
  let mutantFound = false;

  for (let startRowIdx = 0; startRowIdx < rows.length; startRowIdx++) {
    const row = rows[startRowIdx];
    for (let startColIdx = 0; startColIdx < row.length; startColIdx++) {
      for (const direction of directions) {
        let rowIdx = startRowIdx;
        let colIdx = startColIdx;
        let seen = "";


        while (
          !mutantFound &&
          rowIdx >= 0 &&
          rowIdx < rows.length &&
          colIdx >= 0 &&
          colIdx < rows[rowIdx].length
        ) {
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