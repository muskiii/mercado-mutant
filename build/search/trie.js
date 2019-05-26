"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TrieNode {
    constructor() {
        this.isTerminal = false;
        this.children = new Map();
    }
    add(word) {
        if (word.length === 0) {
            this.isTerminal = true;
            return;
        }
        const prefix = word[0];
        const child = this.getOrAdd(prefix);
        child.add(word.slice(1));
    }
    isPrefix(word) {
        if (word.length === 0) {
            return {
                isComplete: this.isTerminal,
                hasMore: this.children.size > 0
            };
        }
        const prefix = word[0];
        const child = this.children.get(prefix);
        if (!child) {
            return null;
        }
        return child.isPrefix(word.slice(1));
    }
    getOrAdd(prefix) {
        let node = this.children.get(prefix);
        if (!node) {
            node = new TrieNode();
            this.children.set(prefix, node);
        }
        return node;
    }
}
exports.TrieNode = TrieNode;
