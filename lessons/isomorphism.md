---
layout: minimal
title: Isomorphism
description: &desc LLRB trees, quicksort, and counting sorts.
summary: *desc
nav_order: 3
parent: Lessons
grand_parent: CSE 373
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

## Left-Leaning Red-Black Trees

{% include learning_objectives.md lesson="Left-Leaning Red-Black Trees" %}

Although 2-3 trees addressed the worst-case runtime problem with binary search trees by overstuffing and splitting nodes, they are rarely used in the real world. Overstuffing and splitting nodes involves constructing a lot of new 2-nodes and 3-nodes, which is not only complicated to design and implement, but also incurs a significant runtime cost since new nodes are constantly created in a 2-3 tree. Although creating new nodes doesn't affect the asymptotic analysis, this cost is often noticeable in experimental analysis.

In Java, `TreeSet` is the standard implementation of a set that uses a self-balancing binary search tree data structure called a **red-black tree**. We were careful to note that 2-3 trees were not binary search trees because 3-nodes (nodes with 2 keys and 3 non-null children) can't be found in a binary search tree. The difference with red-black trees is that they are valid binary search trees. Red-black trees take the idea of overstuffing and splitting in a 2-3 tree and map them back to binary search tree operations. This data structure has all the asymptotic runtime guarantees of a 2-3 tree without the experimental runtime slowdowns.

### Rotation

Before we introduce red-black trees formally, we'll first need a way to reorganize elements in a binary search tree. Depending on the order items are inserted into the tree, there are many different ways to construct a binary search tree containing the same set of items. But insertion order is not the only way to build different configurations of the same set of items. We can change the structure of a binary tree through **rotation**.

{% include video.html src="https://www.youtube.com/embed/kkd8d0QhiQ0?start=202" aspect_ratio="16/9" %}

Each rotation makes a local adjustment to the tree. Sometimes, this local adjustment increases the height of the tree; other times, it decreases the height of the tree. However, rotations always respect the binary search tree invariant. Items that are ordered between **B** and **D** in the example below stay ordered after a rotation.

![Rotations respect the binary search tree invariant]({{ site.baseurl }}{% link assets/images/rotation-invariants.svg %})

Given a particular node in a tree, we can either rotate it to the left or to the right by making it the child of one of its parents. In these definitions, **G** and **P** correspond to their labels in the tree shown below.

`rotateLeft(G)`
: Let `x` be the right child of **G**. Make **G** the new left child of `x`. We can think of this as temporarily merging **G** and **P**, then sending **G** down and left.

  ![Rotate left on G makes P the new overall root]({{ site.baseurl }}{% link assets/images/rotate-left.svg %})

`rotateRight(P)`
: Let `x` be the left child of **P**. Make **P** the new right child of `x`. We can think of this as temporarily merging **G** and **P**, then sending **P** down and right.

  ![Rotate right on P makes G the new overall root]({{ site.baseurl }}{% link assets/images/rotate-right.svg %})

{: .hint }
These two rotations are inverse operations: one operation undoes the other.

### 1-1 correspondence

Our goal is to develop a self-balancing binary search tree using the self-balancing property of 2-3 trees. Certain 2-3 trees are already valid binary search trees. 2-3 trees that only contain 2-nodes are already valid binary search trees. How might we represent 3-nodes in a binary search tree?

Using an idea from rotation, we can separate a 3-node with the keys **B** and **D** into two nodes exactly as shown during the node rotation process. A **left-leaning binary search tree** is a binary search tree representation of a 2-3 tree where 3-nodes are represented as two binary tree nodes connected with a left-leaning "glue" edge.

![Prefer the left-leaning orientation for a BST representation of a 2-3 tree]({{ site.baseurl }}{% link assets/images/left-leaning-bst.svg %})

{: .hint }
The preference for left-leaning is historical and cultural: perhaps if the data structure inventors preferred how right-leaning looked, we might instead be learning about right-leaning binary search trees instead. Either approach is equally good as long as we're consistent in our decision.

We now have a complete binary search tree representation for any 2-3 tree. The steps for converting a 2-3 tree are as follows. For each node:

- If the node is a 2-node, then leave it the same since it's already a valid binary tree node.
- Otherwise, the node is a 3-node, so represent it with 2 binary tree nodes with a left-leaning "glue" edge.

{% include slides.html id="1jfm7PzASy4K8lKD9ps1HRwjH3hVHIiaNrjk_63EP2lo" aspect_ratio="16/9" %}

Converting from 2-3 trees to left-leaning BSTs is not too bad. But the opposite is not so easy! In the slides above, it's hard to tell that **d** and **f** are the two nodes that are glued together in the 2-3 tree. This is even harder to do in code, so today's topic of left-leaning red-black trees introduces a little bit of extra information in the form of a colorful "glue" edge.

{% include video.html src="https://www.youtube.com/embed/q7sfCkdrtEs?start=217" aspect_ratio="16/9" %}

The **left-leaning red-black (LLRB) tree** data structure is exactly the same as left-leaning BSTs except "glue" edges (representing 3-nodes) are colored red. The red versus black edge coloring is only used to help us distinguish between 2-nodes and 3-nodes. Red edges help us immediately tell which nodes are part of a 3-node in the _corresponding 2-3 tree_.

1-1 correspondence
: The idea that every 2-3 tree has a unique LLRB tree associated with it, and vice versa. We can convert back and forth between any 2-3 tree and its unique left-leaning red-black tree.

LLRB tree invariants follow entirely from 1-1 correspondence with 2-3 trees.

- **Red edges lean left** because that's the convention we chose to represent 3-nodes.
- **No node has two red edges connected to it** because 2-3 trees only allow 2-nodes and 3-nodes.
- **Every root-to-null path has the same number of black edges** because all 2-3 tree leaf nodes are the same depth from the root.

### What would a 2-3 tree do?

The 1-1 correspondence property opens-up a powerful way of thinking about LLRB tree operations. In any situation, we can always ask: **What would a 2-3 tree do?**

{% include video.html src="https://www.youtube.com/embed/GjTDBrB7QV4" aspect_ratio="16/9" %}
