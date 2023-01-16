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

## Counting Sorts

{% include learning_objectives.md lesson="Counting Sorts" %}

In practice, Java's system sorts like Timsort and dual-pivot quicksort have a linearithmic order of growth. Is it possible to sort in faster than worst case Θ(_N_ log _N_) time? In the best case, we know that sorting algorithms like insertion sort can tell that an already-sorted array is indeed sorted in linear time. But can we design an algorithm that sorts an array of _N_ elements in linear time in the worst case?

### Sorting decision tree

We can start by asking, "How many comparisons do we need to make in order to know how to sort an array?" We've actually already asked this question before: in merge sort, we relied on knowing that a single element subarray is already sorted with respect to itself. In other words:

- Sorting an array with 1 element requires 0 comparisons.
- Sorting an array with 2 elements requires 1 comparison.
- Sorting an array with 3 elements requires either 2 or 3 comparisons depending on the questions.

We can draw a sorting decision tree to see exactly what questions we need to ask to determine the sorted order for 3 elements. Each leaf in the decision tree represents a possible sorted order for the elements, and each branch represents a choice of answering either "Yes" or "No" to each comparison question.

![Sorting decision tree for 3 elements]({{ site.baseurl }}{% link assets/images/sorting-decision-tree.svg %})

This decision tree is not only a conceptual visualization, but it can also be implemented as a program consisting of a hierarchy of nested `if` conditional statements. This decision tree represents the **optimal comparison sorting algorithm**: a comparison sort that requires the absolute least number of comparisons to sort a given input array.

```java
if (a < b)
    if      (b < c) return {a, b, c};
    else if (a < c) return {a, c, b};
    else            return {c, a, b};
else
    if      (a < c) return {b, a, c};
    else if (b < c) return {b, c, a};
    else            return {c, b, a};
```

<details markdown="block">
<summary>If 3 elements have 6 permutations, how many permutations are there for 4 elements?</summary>

For each of the 6 permutations in a, b, c, we can insert the fourth element d before, in-between, or after each element. For example, if we consider the permutation `{a, b, c}`, we can insert d in 4 different places: `{d, a, b, c}`, `{a, d, b, c}`, `{a, b, d, c}`, and `{a, b, c, d}`. Ultimately, we take the 6 permutations we had for 3 elements and multiply by 4 to get 24 total permutations for 4 elements. More generally, the number of permutations can be described using the factorial function: 4! = 4 ∙ 3 ∙ 2 ∙ 1.
</details>

If _N_ elements have _N_! factorial potential permutations, and each potential permutation is a leaf in a balanced sorting decision tree, then the optimal comparison sorting algorithm in the worst case needs about log<sub>2</sub> _N_! comparisons to determine the correct sorting of the elements. [Stirling's approximation](https://en.wikipedia.org/wiki/Stirling%27s_approximation) can be used to show that log<sub>2</sub> _N_! ∈ Θ(_N_ log _N_).

In other words, the optimal comparison sorting algorithm requires Θ(_N_ log _N_) comparisons in the worst case. It's not possible to design a comparison sorting algorithm that takes linear time in the worst case.

### Counting sorts and enumeration

The worst case lower bound on comparison sorting algorithms only apply to comparison sorts that use operations like `<`, `>`, or `compareTo` to determine the order of elements. A **counting sort** sorts an array of elements by relying on _enumeration_ instead of _comparison_. Elements are considered comparable if they can be compared with one another. Elements are considered enumerable if they can be listed-out in a sequence from first to last.

Counting sort
: 1. Create a count array that will be used to store the number of times each element occurs in the input array.
  1. Iterate over the input array, updating the count array to reflect the occurrence of each element.
  1. Iterate over the count array, unraveling the number of times each element occurs back into the input array.

{: .hint }
> Open the VisuAlgo module to visualize sorting algorithms. Press `Esc` to exit the e-Lecture Mode, and choose **COU** from the top navigation bar to switch to counting sort. Run the sorting algorithm using **Sort** from the bottom left menu.
>
> [Sorting Visualization](https://visualgo.net/en/sorting){: .btn .btn-purple target="_blank" }

{% include slides.html src="https://www.cs.princeton.edu/courses/archive/spring22/cos226/demos/51DemoKeyIndexedCounting/index.html" aspect_ratio="16/9" %}

### Radix sorts and tries

Counting sorts work great with small integer values when we know the range between the smallest integer and the largest integer. But many other data types, like strings, are more difficult to enumerate because we can always make a more complicated string. For example, suppose we have a string "a" and we decide to put it at index 0 in the count array. Where would the string "b" belong in the count array? We know it comes after "a", but how far after "a"? We might run into strings like "aa", "aaa", "aaaa", etc. and not know how many spaces to reserve for these elements.

To address this issue, we can take inspiration from tries. Just as tries divided a string into its constituent letters and processed each letter individually, we can do the same and apply counting sort on each letter. **Radix sorts** represent a category of counting sorts that divide strings (or string-like objects) into individual subunits that can be separately counting-sorted.

Most-Significant Digit (MSD) radix sort
: Starts from the leftmost (in English, the most significant) character and proceeds to the right.
: Recursively counting sorts the characters separately, proceeding to the next index into the strings.

Least-Significant Digit (LSD) radix sort
: Starts from the rightmost (in English, the least significant) character and proceeds to the left.
: For each index into the strings, iteratively counting sorts all the elements again on the current index.


{: .hint }
> Open the VisuAlgo module to visualize sorting algorithms. Press `Esc` to exit the e-Lecture Mode, and choose **RAD** from the top navigation bar to switch to an LSD radix sort. Run the sorting algorithm using **Sort** from the bottom left menu.
>
> [Sorting Visualization](https://visualgo.net/en/sorting){: .btn .btn-purple target="_blank" }

### 3-way radix quicksort and TSTs

Is there a sorting algorithm analogy for ternary search trees? It exists, and it combines the ideas of radix sort with quicksort just like how ternary search trees represent a midpoint between tries and binary search trees.

3-way radix quicksort
: Select a pivot element for the current index into the strings.
: Partition the array into elements less than, equal to, and greater than the pivot element.
: Recursively sort each of the less than, equal to, and greater than subarrays.
