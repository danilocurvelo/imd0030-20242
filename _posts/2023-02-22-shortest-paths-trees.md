---
title: &title Shortest Paths Trees
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1d5PlGbPhxL2oORaUsbVM5P2JgEbhiDvp2kSrEgUuULU/edit?usp=sharing
canonical_url: *redirect
---

Dijkstra’s order
Let’s find a weighted shortest paths tree (SPT) starting from A.








What is the cost of the shortest path from A to G, i.e. distTo.get(G)?
Give the order in which Dijkstra's algorithm removes vertices from the perimeter.
1
A
B
C
F
E
H
D
G
5
1
6
4
4
4
5
2
2
3

Negative edge weights
Using the previous graph, let’s think about how negative weights affects Dijkstra’s.
Which edge, if replaced with the weight -100, would cause Dijkstra’s algorithm to compute an incorrect shortest paths tree from A?


Explain in your own words why Dijkstra’s algorithm might not work if there are negative edge weights in the graph.


True or false: If the only negative-weight edges in a directed graph are outgoing edges from the start node, then Dijkstra's algorithm will compute a correct shortest paths tree. Assume that the start node is not part of a cycle.
2

ToposortDAGSolver
Change one edge weight to make Dijkstra’s fail to find a valid shortest paths tree.








Give a topological sorting for the above graph. (Many possible answers!)
Why does ToposortDAGSolver find a correct SPT in DAGs with negative weights?
3
A
B
C
F
E
H
D
G
5
1
6
4
4
4
5
2
2
3

Dijkstra’s runtime
Give the worst-case number of calls to removeMin and addOrChangePriority.
perimeter.add(start, 0.0);
while (!perimeter.isEmpty()) {
    Vertex from = perimeter.removeMin();
    for (Edge edge : graph.neighbors(from)) {
        Vertex to = edge.to;
        double oldDist = distTo.getOrDefault(to, ∞);
        double newDist = distTo.get(from) + edge.weight;
        if (newDist < oldDist) {
            edgeTo.put(to, edge);
            distTo.put(to, newDist);
            perimeter.addOrChangePriority(to, newDist);
        }
    }
}
4

A* search
perimeter.add(start, 0.0);
while (!perimeter.isEmpty()) {
    Vertex from = perimeter.removeMin();
    for (Edge edge : graph.neighbors(from)) {
        Vertex to = edge.to;
        double oldDist = distTo.getOrDefault(to, ∞);
        double newDist = distTo.get(from) + edge.weight;
        if (newDist < oldDist) {
            edgeTo.put(to, edge);
            distTo.put(to, newDist);
            double priority = newDist + graph.est(to, goal);
            perimeter.addOrChangePriority(to, priority);
        }
    }
}
5

Bellman–Ford algorithm
Negative-weight shortcuts are no problem for the Bellman–Ford algorithm.
for (int i = 1; i < graph.vertices().size(); i += 1) {
    for (Vertex from : graph.vertices()) {
        for (Edge edge : graph.neighbors(from)) {
            Vertex to = edge.to;
            double oldDist = distTo.getOrDefault(to, ∞);
            double newDist = distTo.get(from) + edge.weight;
            if (newDist < oldDist) {
                edgeTo.put(to, edge);
                distTo.put(to, newDist);
            }
        }
    }
}
Our graphs lack the vertices() affordance so Bellman–Ford is very slow.
6
