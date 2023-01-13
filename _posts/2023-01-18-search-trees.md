---
title: &title Search Trees
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1W82wy3rXTe8JIlqeHTL2M84WDMffCxhZYwyIE7Wr2Ao/edit?usp=sharing
canonical_url: *redirect
---

Emoji search tree
Consider this BST of emoji. List the emoji in sorted order. Then, reorganize the items in the BST so that there’s no dangling 💡 leaf at the bottom.
1
❤️
😭
🐕
🤔
🔥
✨
💡

Tries
Draw the trie containing all the words in: “she sells sea shells by the sea shore”. Omit null references to keep your drawing simple.








Then, identify the subtree containing all words starting with “se”.
2
Draw the trie containing all the words in: “she sells sea shells by the sea shore”. Omit null references to keep your drawing simple.















Then, identify the subtree containing all words starting with “se”.

Ternary search trees
What node represents the string CAC? Where would we insert the string CCC?
3
A
C
C
G
G
C
G
C
C
A
G
C
C
1
2
3
4
5
6
*
*
*
*
*
*
*

Collecting strings
Consider the collect method, which can be used to collect all the strings in a TST.
List<String> list = new LinkedList<>();collect(overallRoot, "", list);
Why add node.data in the mid case? Why are the recursive calls in this order?
4
void collect(Node node, String prefix, List<String> list) {
    if (node == null) {
        return;
    }
    collect(node.left, prefix, list);
    if (node.isTerm) {
        list.add(prefix + node.data);
    }
    collect(node.mid, prefix + node.data, list);
    collect(node.right, prefix, list);
}
