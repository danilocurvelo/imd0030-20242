---
layout: minimal
title: Isomorphism
description: &desc LLRB trees, quicksort, and counting sorts.
summary: *desc
nav_order: 3
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

## Left-Leaning Red-Black Trees

{% include learning_objectives.md lesson="Left-Leaning Red-Black Trees" %}

Although 2-3 trees addressed the worst-case runtime problem with binary search trees by overstuffing and splitting nodes, they are rarely used in the real world. Overstuffing and splitting nodes involves constructing a lot of new 2-nodes and 3-nodes, which is not only complicated to design and implement, but also incurs a significant runtime cost since new nodes are constantly created in a 2-3 tree. Although creating new nodes doesn't affect the asymptotic analysis, this cost is often noticeable in experimental analysis.

In Java, `TreeSet` is the standard implementation of a set that uses a self-balancing binary search tree data structure called a **red-black tree**. We were careful to note that 2-3 trees were not binary search trees because 3-nodes (nodes with 2 keys and 3 non-null children) can't be found in a binary search tree. The difference with red-black trees is that they are valid binary search trees. Red-black trees take the idea of overstuffing and splitting in a 2-3 tree and map them back to binary search tree operations. This data structure has all the asymptotic runtime guarantees of a 2-3 tree without the experimental runtime slowdowns.

### Rotation

Before we introduce red-black trees formally, we'll first need a way to reorganize elements in a binary search tree. Depending on the order elements are inserted into the tree, there are many different ways to construct a binary search tree containing the same set of elements. But insertion order is not the only way to build different configurations of the same set of elements. We can change the structure of a binary tree through **rotation**.

{% include youtube.html id="kkd8d0QhiQ0" start="202" aspect_ratio="16/9" %}

Each rotation makes a local adjustment to the tree. Sometimes, this local adjustment increases the height of the tree; other times, it decreases the height of the tree. However, rotations always respect the binary search tree invariant. Elements that are ordered between **B** and **D** in the example below stay ordered after a rotation.

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

### One-to-one correspondence and isomorphism

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

{% include youtube.html id="q7sfCkdrtEs" start="217" aspect_ratio="16/9" %}

The **left-leaning red-black (LLRB) tree** data structure is exactly the same as left-leaning BSTs except "glue" edges connecting 3-nodes (in the corresponding 2-3 tree) are colored red. Red edges help us immediately tell which nodes are part of a 3-node in the _corresponding 2-3 tree_.

One-to-one correspondence (bijection)
: A mapping between two types of elements where elements of each type are paired with exactly one other element of the other type. One-to-one correspondence between 2-3 trees and LLRB trees implies that every 2-3 tree has a unique corresponding LLRB tree associated with it, and vice versa.

Algorithmic isomorphism
: A one-to-one correspondence between two types of data structures or algorithms that also preserves structure. Isomorphism between 2-3 trees and LLRB trees implies that a change in a 2-3 tree produces a proportional change in the isomorphic LLRB tree, and vice versa.

LLRB tree invariants follow entirely from isomorphism with 2-3 trees.

- **Red edges lean left** because that's the convention we chose to represent 3-nodes.
- **No node has two red edges connected to it** because 2-3 trees only allow 2-nodes and 3-nodes.
- **Every root-to-null path has the same number of black edges** because all 2-3 tree leaf nodes are the same depth from the root.

We'll often use "corresponding" and "isomorphic" interchangeably, but isomorphism is a stronger and more descriptive term because it implies the structure-preserving property. Isomorphism allows us to switch between thinking about a 2-3 tree as an LLRB tree or vice versa at any point in time.

### What would a 2-3 tree do?

Isomorphism enables a powerful way of thinking about LLRB tree operations. In any situation, we can always ask: **What would a 2-3 tree do?**

{% include youtube.html id="GjTDBrB7QV4" aspect_ratio="16/9" %}

The following slides visualize the procedure for adding several elements to a LLRB tree. Nodes are recursively added to the LLRB tree as new leaf nodes just like in a binary search tree. After reaching the recursive base case and creating the new leaf node, before returning, the program will perform rotations and color flips to [maintain LLRB tree invariants](https://github.com/kevin-wayne/algs4/blob/48ad6a3fa0e062941aa93c43860be331c2ad57a1/src/main/java/edu/princeton/cs/algs4/RedBlackBST.java#L183-L221).

{: .hint }
LLRB tree balance is maintained using only [3 lines of code](https://github.com/kevin-wayne/algs4/blob/48ad6a3fa0e062941aa93c43860be331c2ad57a1/src/main/java/edu/princeton/cs/algs4/RedBlackBST.java#L215-L217). But it's also possible to reason about the data structure by visualizing the corresponding 2-3 tree: try simulating the sequence of insertions from the slides below in the [2-3 Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/BTree.html) and compare the results.

{% include slides.html src="https://www.cs.princeton.edu/courses/archive/spring22/cos226/demos/33DemoRedBlackBST/index.html" aspect_ratio="16/9" %}

## Quicksort

{% include learning_objectives.md lesson="Quicksort" %}

Isomorphism not only inspires new ideas for data structures, but also new ideas for algorithms too. In our study of sorting algorithms, we learned that a sorting algorithm is considered **stable** if it preserves the original order of equivalent keys. Which sorting algorithms does Java use when you call `Arrays.sort`? It depends on whether we need stability.

Stable system sort
: When sorting an array of objects (like emails), Java uses a sorting algorithm called **Timsort**, which is based on merge sort and has the same linearithmic worst-case runtime as merge sort.

{: .note }
> Timsort is a _hybrid sort_ that combines ideas from merge sort with insertion sort. Experimental analysis reveals that the fastest sorting algorithm for small arrays is often insertion sort. Instead of merge sort's base case of 1 element, Java Timsort uses a base case of 32 elements which are then insertion sorted. Insertion sort can be further sped up by using binary search to find the insertion point for the next unsorted element.
>
> Timsort is also an _adaptive sort_ that changes behavior depending on the input array. Many real-world arrays are not truly random. They often contain _natural runs_, or sorted subsequences of elements that could be efficiently merged. Rather than recursively dividing top-down, Timsort works bottom-up by identifying natural runs in the input array and combining them from left to right.

Unstable system sort
: When sorting an array of numbers or booleans, Java uses a sorting algorithm called **quicksort**. Quicksort has many variants, each of which are isomorphic to a different type of search tree such as a binary search tree and a 2-3 search tree.

### Single-pivot quicksort and binary search trees

Quicksort relies on the idea of recursively **partitioning** an array around a pivot element, `data[i]`. A partitioning of an array rearranges its elements in a weaker way than sorting by requiring elements in the order:

- All elements to the left of the pivot are less than or equal to the pivot element.
- The **pivot element**, `data[i]`, moves to position `j`. (The pivot might not need to move.)
- All elements to the right of the pivot are greater than or equal to the pivot element.

Consider partitioning the array [5, 550, 330, 10, 4, 10, 9] around the pivot element `data[3]` (the first 10).

<details markdown="block">
<summary>Is [5, 9, 10, 4, 10, 550, 330] a valid partitioning?</summary>

The answer to this question is not simply yes or no because it depends whether the index of the pivot. If the pivot index `j = 2`, then this is not a valid partitioning because the element 4 is to the right of the pivot. If the pivot index `j = 4`, then this is a valid partitioning because all requirements are satisfied.
</details>

Partitioning an array around a pivot element in quicksort is like selecting a root element in a binary search tree. All the elements in the left subtree will be less than the root element, and all the elements in the right subtree will be greater than the root element.

![Quicksort isomorphism to binary search trees]({{ site.baseurl }}{% link assets/images/quicksort-bst.svg %})

The quicksort on the left always chooses the leftmost element as the pivot element and uses an ideal partitioning that maintains the relative order of the remaining elements. The binary search tree on the right shows the result of inserting each element in the left-to-right input order given by the array.

{: .hint }
> Open the VisuAlgo module to visualize sorting algorithms. Press `Esc` to exit the e-Lecture Mode, and choose **QUI** from the top navigation bar to switch to quicksort. Run the sorting algorithm using **Sort** from the bottom left menu.
>
> [Sorting Visualization](https://visualgo.net/en/sorting){: .btn .btn-purple target="_blank" }
>
> Note that the visualization does not use an ideal partitioning algorithm for quicksort.

### Dual-pivot quicksort and 2-3 search trees

If choosing 1 pivot element is like choosing 1 root element in a binary node, then choosing 2 pivot elements is like choosing 2 root elements in a 3-child node. Dual-pivot quicksort chooses 2 pivots on each level, just like how 3-child nodes in 2-3 trees maintain 2 keys and 3 children.

{: .hint }
Strictly speaking, dual-pivot quicksort is not isomorphic to 2-3 trees because there does not exist a one-to-one correspondence. Consider 2-3 trees that only contain 2-child nodes: the corresponding quicksort is single-pivot quicksort, not dual-pivot quicksort.

Partitioning an array around 2 pivot elements, _p_<sub>1</sub> and _p_<sub>2</sub> where _p_<sub>1</sub> ≤ _p_<sub>2</sub>, rearranges its elements by requiring elements in the order:

- All elements less than _p_<sub>1</sub>.
- The pivot element _p_<sub>1</sub>.
- All elements _x_ where _p_<sub>1</sub> ≤ _x_ ≤ _p_<sub>2</sub>.
- The pivot element _p_<sub>2</sub>.
- All elements greater than _p_<sub>2</sub>.

Dual-pivot quicksort is a relatively new algorithm published in 2009. Experimental analysis revealed that dual-pivot quicksort is significantly faster than single-pivot quicksort on modern computers. Computer scientists attribute the performance improvement due to advances in CPU caching and memory hierarchy since the 1960s and 1970s when single-pivot quicksort was first introduced.
