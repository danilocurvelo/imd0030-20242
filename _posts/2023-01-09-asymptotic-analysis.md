---
title: &title Asymptotic Analysis
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1tit9LSIQbMIQPAhk7InRf1L33ZhhD8lV0Th7tbgn4NA/edit?usp=sharing
canonical_url: *redirect
---

Runtime analysis
What is asymptotic analysis? How is it related to case analysis?


How did we go from this code to the worst case analysis, R(N) ∈ Θ(N2)?
1
boolean dup1(int[] A) {
    int N = A.length;
    for (int i = 0; i < N; i += 1)
        for (int j = i + 1; j < N; j += 1)
            if (A[i] == A[j])
                return true;
    return false;
}

Algorithm optimization
Your friend observes that the LinkedDeque.get method always starts at the front of the deque, so get(size - 1) takes linear time. For items in the latter half of the deque, they want to iterate starting from the back of the deque instead.
Explain how this optimization affects the asymptotic analysis.
2
front
value
 next
??
3
2
size
back
 prev
9
??

dup1
Select all valid runtimes O(1), O(N), O(N2), Ω(1), Ω(N), Ω(N2), Θ(1), Θ(N), Θ(N2) in the:
Best case:									 Θ(1)
Worst case:											   Θ(N2)
Overall:
3
boolean dup1(int[] A) {
    int N = A.length;
    for (int i = 0; i < N; i += 1)
        for (int j = i + 1; j < N; j += 1)
            if (A[i] == A[j])
                return true;
    return false;
}

dup2
Select all valid runtimes O(1), O(N), O(N2), Ω(1), Ω(N), Ω(N2), Θ(1), Θ(N), Θ(N2) in the:
Best case:									 Θ(1)
Worst case:										  Θ(N)
Overall:
4
boolean dup2(int[] sorted) {
    int N = sorted.length;
    for (int i = 0; i < N - 1; i += 1)
        if (sorted[i] == sorted[i + 1])
            return true;
    return false;
}
