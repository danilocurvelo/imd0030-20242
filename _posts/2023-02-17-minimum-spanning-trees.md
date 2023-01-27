---
title: &title Minimum Spanning Trees
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/15Ux-ev3NO0FdEgtpC6lfxGbEOIH_IizJUPG_DaB19wo/edit?usp=sharing
canonical_url: *redirect
---

Prim’s algorithm
Give the order in which Prim’s algorithm selects edges starting from s.





After adding the edge with weight 2 to the visited set, which edges are on the cut between the visited and unvisited vertices?
1
s
9
1
2
8
3
6
5
7
4

Counterexamples
These statements are false. For each, draw a small counterexample with ≤ 5 nodes.
A minimum spanning tree cannot include the maximum-weight edge in the graph.



A weighted undirected graph can only have one (unique) minimum spanning tree.



For each cut in a connected and weighted undirected graph, a minimum spanning tree can only contain the minimum-weight crossing edge.
2

Multiple source shortest paths
Given a directed graph and multiple possible starting vertices, the multiple source shortest paths problem finds the shortest paths from any starting vertex to every vertex in the graph.
For example, consider starting S = {1, 5, 7}.
Shortest path from S to 0 is 7–6–0.
Shortest path from S to 1 is 1 (no edges).
Shortest path from S to 2 is 5–2.
Shortest path from S to 4 is 5–2–4.
Ideally, we want the queue to include {1, 5, 7}. Without changing the code for BFS, describe a modification to the graph (add, remove, or change vertices/edges) so that BFS solves the multiple source shortest paths problem.
3
5
0
1
4
6
3
2
7
8
9

Internet access planning
Let’s get all the units in an apartment building connected to the internet. An apartment unit is connected to the internet if it has either a router (vertex) or a fiber (edge) path to a unit with a router.
The lowest-cost solution to thisgraph installs a router in 1 and 4(50 cost) and adds 65-cost fiber:
0–1 at 20 cost.
1–6 at 15 cost.
3–4 at 25 cost.
4–5 at 5 cost.
What’s different about this problem compared to the standard MST problem?Give a modification to the graph so that Prim’s algorithm can solve the problem.
4
