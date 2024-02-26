---
title: &title Binary Heaps
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/102seDXpFXnjsrdCjYPRTRiXiTg8KfVDGUqsr7BgfGPE/edit?usp=sharing
canonical_url: *redirect
---

Heap operations
Draw the state of this min-heap after each line of code.
removeMin()




add(0)
1
1
6
1
5
2
8
8

Array representation
Consider this binary min-heap whose values coincidentally match the array indices.
What is the index of the leftmost leaf node?
What is the index of the right child of 3?
What is the index of the parent of 10?



The above array is sorted. Give an example of an array min-heap that is not sorted.
2
1
2
3
4
5
6
7
8
9
10
11

Heapsort
In the worst-case, removeMin and add take Θ(log N) time to sink or swim elements. Your teammate wonders if it is possible to improve the worst-case runtime to Θ(1).
Explain why this optimization is impossible by showing how it could be used to break the Ω(N log N) worst-case lower bound for comparison sorting.
3

Heap invariants
For this min-heap, assume all values are unique! (Don’t assume this in general!)
If the first two shaded nodes hold the minimum and next-min values, where could we find the third-smallest value? Where could we find the largest value?
4
A
B
C
D
E
F
G
minimum
next-min
