import { TrieNode } from "../search/trie";

const trie = new TrieNode();
trie.add("AAAA");
trie.add("GGGG");
trie.add("TTTT");
trie.add("CCCC");

it("should tell when a match is a prefix match", () =>
  expect(trie.isPrefix("A")).toEqual({ isComplete: false, hasMore: true }));

it("should tell when not a match", () => expect(trie.isPrefix("B")).toBeNull());

it("should tell when a terminal complete match", () =>
  expect(trie.isPrefix("AAAA")).toEqual({ isComplete: true, hasMore: false }));

it("should not match suffix", () => expect(trie.isPrefix("AACGT")).toBeNull());