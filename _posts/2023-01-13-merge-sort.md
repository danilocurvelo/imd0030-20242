---
title: &title Merge Sort
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1MuBH3YHD2eUA8VRFBxU61Y5bLXe3zFXdI0y0oCUND5I/edit?usp=sharing
canonical_url: *redirect
---

Unrolling recurrences
How much do print debugging statements cost in terms of runtime? In the lesson, we studied the recurrence T(N) = T(N / 2) + 1. Let’s consider T(N) = T(N / 2) + N.
What is the recursive work in the recurrence? What is the non-recursive work?


Unroll the recurrence and give a big-theta bound for T(N).
1

Invariants
Without simulating an actual run of merge sort, show the two arrays that will be merged by the final step of merge sort on: [9, 1, 1, 3, 5, 5, 6, 8].

Last time, we determined that the sorting algorithm run on this input array couldn’t have been insertion sort or selection sort. Could it have been merge sort instead?
Input array.		[0, 4, 2, 7, 6, 1, 3, 5]
During sorting.	[0, 2, 4, 7, 1, 6, 3, 5]
2

Multiple recursion
Give a recurrence T(N) describing the runtime of g(N, 1) with respect to N.

Draw the first 3 levels and the final level of a recurrence diagram representing the runtime of g(N, 1).
3
static void g(int goal, int step) {
    if (step > goal) {
        return;
    }
    for (int i = 0; i < goal; i += step) {
        System.out.print(i + " ");
    }
    System.out.println();
    g(goal, step * 2);
    g(goal, step * 2);
}

Case analysis





Assume k() runs in constant time and returns a boolean.
Give a recurrence relation describing the best case and worst case runtime for g.
4
static void g(int N) {
    if (N == 0)
        return;
    g(N / 2);
    if (k())
        g(N / 2);
}
