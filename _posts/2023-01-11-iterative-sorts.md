---
title: &title Iterative Sorts
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/16m87yrVshMG_XJmF6qYHfWVJCbZMOFffSr-7Fwb6PpQ/edit?usp=sharing
canonical_url: *redirect
---

Iterative improvement
Starting with [1, 5, 0, 1, 2, 3], show the array after each iteration of the given sort.
1
Selection sort
Insertion sort
[0, 5, 1, 1, 2, 3]
[1, 5, 0, 1, 2, 3] (no changes)
[0, 1, 5, 1, 2, 3]
[1, 5, 0, 1, 2, 3] (no changes)

A mystery of sorts
Suppose someone sorted an input array of 8 integers, and we need to determine the sorting algorithm that was used. The only hint that we have is the order of the integers at some point during sorting.
Input array.		[0, 4, 2, 7, 6, 1, 3, 5]
During sorting.	[0, 2, 4, 7, 1, 6, 3, 5]
Which sorting algorithm could it be? Insertion sort, selection sort, or neither? Why?
2

Stability
A sorting algorithm is considered stable if the relative order of equivalent items is maintained after sorting.
Is selection sort a stable sort? Why or why not?



Is insertion sort a stable sort? Why or why not?
3

Invariants
Fill in the blank to describe an invariant for selection sort.

After k iterations, the ______________________________________ items will be sorted.


Fill in the blank to describe an invariant for insertion sort.

After k iterations, the ______________________________________ items will be sorted.
4
