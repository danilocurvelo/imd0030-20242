---
title: &title Disjoint Sets
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1snljlDSDj1pXerjG7B3DdWO-chS_w0Dl_CxGGqrVSCs/edit?usp=sharing
canonical_url: *redirect
---

Kruskal’s algorithm
Give the order in which Kruskal’s algorithm selects edges.





After considering the edge with weight 2, circle the connected components above.
1
d
a
b
c
e
f
9
1
2
8
3
6
5
7
4

Kruskal’s runtime
Prim’s algorithm is in Θ(|E| log |V|) time overall.
Fill in the blanks with the greatest big-O bounds for isConnected and connect if we know that Kruskal’s algorithm is in Θ(|E| log |E|) time overall.
Merge sort the list of edges in the graph.				Θ(|E| log |E|)
While the size of the MST < |V| - 1…
Determine if find(e.from).equals(find(e.to)).	________________
If false, union(e.from, e.to) and add e to result.	________________
Then, fill in the table with the worst-case runtime for each implementation.
2
Disjoint Sets
find runtime
union runtime
Quick Find (QF)
Quick Union (QU)
Weighted QU

Path compression
Path compression reassigns the parent of each node visited by find to the root.









Analogous to balancing a search tree by rotations or color flips. Θ(𝛂(N)) amortized.
3
15
11
5
12
13
6
1
7
14
8
2
9
10
3
0
4

Bounded weights
We are trying to find the minimum spanning tree of a graph where edge weights are double (decimal) values bounded between 0 and 255. Is it possible to find an MST in runtime faster than Θ(|E| log |E|)? If so, explain how. Else, explain why not.
4
