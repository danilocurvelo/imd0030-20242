---
title: &title Quicksort
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1fWNJ_7VlHSvf4RFZl6jdlvxqHYCed4mKs6Iwyf2THdw/edit?usp=sharing
canonical_url: *redirect
---

Quicksort isomorphism
Give an asymptotic runtime analysis of single-pivot quicksort with the isomorphism to BSTs. Assume the pivot is always data[0] and partitioning is in linear time.
Best case.



Worst case.



Describe a way to generate a best case or worst case input array for a given size N. Remember that quicksort pivots are like interior nodes in a binary search tree.
1

Partitioning algorithm
Partitioning. Given an array of colors where the zero-th element is white and the remaining elements are red (less) or blue (greater), rearrange the array so that red elements are to the left of the white element and blue elements are to the right.
Describe an algorithm for this problem in O(N) time.
2
Josh Hug. 2020. Quicksort. In CS 61B Spring 2020.
6
8
3
1
2
7
4
blue
blue
red
red
red
red
pivot

Quicksort stability
Although we introduced quicksort as an unstable sort, quicksort can be made a stable sort if we have a stable partitioning algorithm and consider pivot choice.
If we always pick the leftmost element as the pivot p, fill in each blank with one symbol from the choices { <, ≤, >, ≥ } to partition the elements to ensure stability.


If we always pick the rightmost element as the pivot p, fill in each blank with one symbol from the choices { <, ≤, >, ≥ } to partition the elements to ensure stability.


What can we do to ensure stability when we pick an element p from somewhere in the middle?
3
elements ____ p
p
elements ____ p
elements ____ p
p
elements ____ p

Median finding
Exact median finding. Must consider all elements at least once, hence Ω(N) time.
Approximate median finding. Real-world quicksort implementations choose the median of 3 elements: the first, middle, and last elements in constant time.
Doesn’t change worst-case asymptotic analysis.
Even if you are unlucky enough to have a pivotthat never lands near the middle, but is at least10% from the edge, runtime is still O(N log N)!

4
a = data[0];
b = data[data.length / 2];
c = data[data.length - 1];
if (a < b)
  if      (b < c) return b;
  else if (a < c) return c;
  else            return a;
else
  if      (a < c) return a;
  else if (b < c) return c;
  else            return b;
N
N/10
9N/10
N/100
9N/100
9N/100
81N/100
Josh Hug. 2020. Quicksort. In CS 61B Spring 2020.
