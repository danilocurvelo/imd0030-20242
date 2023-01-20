---
layout: minimal
title: Search Trees
description: &desc Binary, ternary, and 2-3 search trees.
summary: *desc
nav_order: 2
parent: Lessons
grand_parent: CSE 373
youtube: yes
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

## Search Trees

{% include learning_objectives.md lesson="Search Trees" %}

A sorted array enables logarithmic-time algorithms like binary search. To determine if a certain element is in a sorted array containing 100,000,000 elements, binary search only needed log<sub>2</sub> 100,000,000, or about 27 comparisons! The combination of **sorting algorithms** and **searching algorithms** can enable efficient features like autocomplete that shape how people make sense of the world.

Let's say we wanted to implement the autocomplete feature in Husky Maps. One approach is to implement a `BinarySearchAutocomplete` data type.

Representation
: Potential search results are stored in a sorted array. In Husky Maps, this contains the names of all the places near the UW Seattle campus.

Functionality
: The `addAll` method adds new elements to the data type. After the elements are added, the entire array is re-sorted to maintain the sorted representation.
: The `allMatches` method returns all the elements that start with the given prefix. Since the terms are stored in a sorted array, we can use binary search to find the first term that starts with the prefix in the sorted array and then iterate to the right to collect the all the remaining prefix-matching terms.

`BinarySearchAutocomplete` provides a very efficient `allMatches`, but needs to spend a lot of time sorting all the elements in the data type after each call to `addAll`. Even if we add only one element, putting that element in the right place in the sorted array takes at least linear time. If `addAll` is called infrequently, this might not be a problem. But, in real-world mapping applications, we might need to respond to new information about the world. How might we design a more robust data type that can not only find elements efficiently, but also add or remove elements efficiently too?

When designing data structure representations, computer scientists often compare arrays and nodes.

Arrays
: Enable efficient access to elements by index because each array access takes constant time no matter where the element is located inside the array. For the same reason, it's also efficient to change a single element in an array if we have its index.

Nodes
: Almost the opposite of arrays in runtime. Nodes are inefficient at accessing elements by index, but efficient at adding or removing elements without having to shift over all other elements so long as there's a reference to the node that needs to change.

How might we efficiently perform binary search on nodes?

### Binary search trees

The **binary search tree** (BST) is a hierarchical node-based data structure designed for efficient binary search. Each node in a binary search tree has a left and right child node, where all the elements to the left are less than the current element and all the elements to the right are greater than the current element. Binary search trees are commonly used to implement sets or maps.

Set abstract data type
: A collection of unique elements or "keys". Unlike lists and deques, sets do not maintain indices for each element, which enables more efficient data structure implementations.

Map abstract data type
: A collection that associates each unique key with a value. Maps are like sets except each key can have a (not necessarily unique) value.

{% include slides.html id="1E81_dZ7x06XyYBM-k9xs4CKIan8C2YaEJTKgrPz7y8U" aspect_ratio="16/9" %}

The letters in the tree are arranged in sorted order when flattened vertically: "A" is the leftmost letter in the tree while "G" is the rightmost letter in the tree. At any given node, we can decide whether to go left or right and ignore up to half the remaining elements. Just as binary search was able to find an element by recursively narrowing-down the search window, a binary search tree also shrinks its search window when considering each node. Elements can be added to a binary search tree as a new leaf in its sorted position within the tree.

The runtime of binary search tree methods depend on the **height** of the tree, or the number of references on the path from the overall root to the deepest leaf node. For example, the ABCDEFG tree depicted above has a height of 2 because there are only two edges from the overall root to any of the deepest leaf nodes. In this case, the height of the binary search tree (height 2) is logarithmic with respect to the total size of the tree (size 7). But BSTs are not necessarily balanced.

{: .hint }
> Open the VisuAlgo module to visualize binary search trees. Press `Esc` to exit the e-Lecture Mode and use **Create** from the bottom left menu. Try creating all of the different types of trees and comparing their properties. Try searching or inserting an element into some of the trees.
>
> [Binary Search Tree Visualization](https://visualgo.net/en/bst){: .btn .btn-purple target="_blank" }

{% include youtube.html id="0SCtnf84QrI" start="15" end="461" aspect_ratio="16/9" %}

But our asymptotic analysis of binary search trees ignores one potentially important cost: the time it takes to compare two strings by calling `compareTo`. We've assumed that the time it takes to compare any two elements is always constant and not a factor in the asymptotic runtime analysis. In a computer, characters are represented as numbers: the character 'a' has the numeric value 97, for example. Computers can compare these the numeric values for each character using the `<`, `==`, and `>` operators in constant time.

<details markdown="block">
<summary>If comparing characters takes constant time, why might string comparison take longer?</summary>

Strings can be composed of many characters. Given two strings, Java checks both strings character-by-character until the first difference or the end of the strings. Even though each character comparison may take constant time, these comparisons may need to be repeated through the length of the string. For example, DNA strings might store genetic information for organisms can be composed of a large number of base pairs represented by the letters A, C, G, and T. In this situation, we might need to store a large number of very long and very similar-looking strings.

To enable efficient DNA search, we'll need more specialized data structures designed for handling strings.
</details>

### Tries

The **trie** (pronounced "try") data structure is a specialized tree designed for storing string data by subdividing strings into individual characters. Whereas each node in a binary search tree represents an entire element, each node in a trie represents a single character within a string. To indicate that a node represents a complete word: in a trie map the value associated with the node is null; in a trie set the value associated with the node is true.

{% include slides.html src="https://www.cs.princeton.edu/courses/archive/spring22/cos226/demos/52DemoTrie/index.html" aspect_ratio="16/9" %}

{: .hint }
> Open the Algorithm Visualizations module to visualize tries. Insert words and predict how the data structure will change.
>
> [Trie Visualization](https://www.cs.usfca.edu/~galles/visualization/Trie.html){: .btn .btn-purple target="_blank" }

The number of children per trie node can vary and depends on the size of the alphabet, which we often call _R_. In the case of English, there are 26 lowercase letters and 26 uppercase letters, so each node can maintain its own _R_ = 52 length array with references to other nodes. By splitting words into individual characters, tries bound the time to search for a single string to the length of the string rather than the total number of strings.

Tries, however, may need to consume a lot of memory space in order to store such a large number of _R_-length arrays. For larger alphabets, such as the unicode alphabet that represents all possible `char` values has _R_ = 65536. In other words, each node in this kind of trie would need to maintain its own 65536-length array. How might we reduce the memory space usage?

### Ternary search trees

The **ternary search tree** (TST) is a specialized data structure designed for storing string data that combine ideas from tries and search trees. Just like in a trie, TSTs also subdivide each string into individual characters, giving each character its own node. Whereas a trie can have up to 65536 non-null children, TST nodes can only have up to 3 non-null children:

Left child
: All strings _not using_ the current character, and before the current string in the alphabet.

Middle child
: All strings _using_ the current character.

Right child
: All strings _not using_ the current character, and after the current string in the alphabet.

{% include slides.html src="https://www.cs.princeton.edu/courses/archive/spring22/cos226/demos/52DemoTST/index.html" aspect_ratio="16/9" %}

{: .hint }
> Open the Algorithm Visualizations module to visualize ternary search trees. Insert words and predict how the data structure will change. Notice that the visualization differs from the slides in how they represent complete words.
>
> [Ternary Search Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/TST.html){: .btn .btn-purple target="_blank" }

## 2-3 Trees

{% include learning_objectives.md lesson="2-3 Trees" %}

Binary search trees aimed to address the linear-time worst case for adding or removing elements from a sorted array set. Yet we now know that binary search trees not only fail to improve on this worst case runtime, but can also degrade performance on methods like `contains` that were much faster when we performed a binary search on a sorted array.

{% include youtube.html id="yz850zzjrHQ" start="220" aspect_ratio="16/9" %}

To realize the promise of a more efficient tree data structure, we need stronger invariants that ensure the tree never becomes unbalanced. In inventors of the 2-3 tree hypothesized that unbalanced growth in a binary search tree occurs because adding an element requires creating a new leaf node that unevenly increases the height of the tree. For example, when elements are added in ascending order to a binary search tree, the overall height of the tree increases because the height of only the right child increases.

Given that creating new leaves can lead to unbalanced growth, 2-3 trees avoid creating new leaf nodes entirely. Instead, the nodes of a 2-3 tree can expand to fit more than one key (element) so new elements can be added by fitting them into existing nodes rather than creating new leaves. If new leaf nodes are never created, the tree can never become unbalanced!

{% include youtube.html id="-ECGVvUHA5c" start="12" end="418" aspect_ratio="16/9" %}

The **2-3 search tree** (often shortened to just "2-3 tree") is a _self-balancing_ search tree designed to ensure a logarithmic-height tree no matter the order that elements are added to the data structure. Whereas each node in a binary search tree can only contain a single key per node, the nodes of a 2-3 tree can be either:

2-node
: A node that contains exactly 1 key and 2 non-null children.

3-node
: A node that contains exactly 2 keys and 3 non-null children.

<details markdown="block">
<summary>If we allowed 4-nodes, how many keys and non-null children would they have?</summary>

A 2-3 tree doesn't contain 4-nodes. But if it did, it could have exactly 3 keys and 4 non-null children. The number of non-null children in each node is always one greater than the number of keys because the keys serve as dividers in the search process. For example, in binary search, the middle element exactly splits the left part from the right part. If we have 2 keys, then we have 3 parts. If we have 3 keys, then we have 4 parts.
</details>

This definition does not allow nodes that have just 1 non-null child. A 2-3 tree ensures that all nodes have either 2 or 3 non-null children so that the height will always be between about log<sub>2</sub> _N_ and log<sub>3</sub> _N_. Furthermore, because height is added evenly to all children, all leaf nodes in a 2-3 tree are the same distance from the overall root.

{% include slides.html src="https://www.cs.princeton.edu/courses/archive/spring22/cos226/demos/33Demo23Tree/index.html" aspect_ratio="16/9" %}

{: .hint }
> Open the Algorithm Visualizations module to visualize B-trees with max degree = 3. Insert words or numbers and predict how the data structure will change.
>
> [2-3 Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/BTree.html){: .btn .btn-purple target="_blank" }

## Memory Hierarchy

At the start of this lesson, we introduced an efficient way to carry-out binary search by using a hierarchical node data structure called a binary search tree.

{% include youtube.html id="rhSySpkKD9I" start="652" aspect_ratio="16/9" %}

One limitation of asymptotic analysis is that it doesn't help us understand how computer hardware actually runs a program. In asymptotic analysis, we assume that each individual operation takes about the same time. Although each operation in a real computer might take constant time, there can still be some dramatic differences when running a program on real computer hardware.

{% include youtube.html id="QmUYOVuxtWo" aspect_ratio="16/9" %}

There are 3 key components to take away from the memory hierarchy.

Cache
: Temporary space for data in a running program that may be needed soon. CPUs have a physical cache that is extremely fast, extremely small (just a couple megabytes of storage), and relatively expensive to produce. Cache is cleared when your computer shuts down.

RAM (main memory)
: Temporary space for your running programs that is much larger than caches. Many of today's computers come with 8 or 16 gigabytes of RAM. However, RAM is typically 10 or 100 times slower than cache. RAM is cleared when your computer shuts down.

Disk (storage)
: Permanent storage space for your files and programs. It's often much larger than main memory (usually 256GB or larger) but another 10, 100, 1000, or more times slower than RAM.

Programmers rarely have direct control over how data flows between these 3 components of a computer. Instead, these resources are typically managed by your computer's operating system and hardware. Memory and caching is designed around two general principles that attempt to predict the program data that will be needed next.

Spatial locality
: The tendency for programs to access locations nearby to recent locations. For example, iteration patterns often continue in the same direction so spatial locality suggests that adjacent or nearby memory addresses will be accessed next.

Temporal locality
: The tendency for programs to access data that was recently accessed. For example, variables that are most recently declared such as loop variables are probably more likely to be accessed than variables used a long time ago.

Writing memory- and cache-efficient programs requires an understanding of how these systems interact according to general principles.
