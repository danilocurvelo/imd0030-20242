---
title: &title Graph Traversals
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1r3RFr1MrNU0arAK6qVRn5hVhKGTgeaag1Psism3B93E/edit?usp=sharing
canonical_url: *redirect
---

Graph traversals
Let’s start by tracing the BFS and DFS algorithms on this graph starting from 0. If a node has multiple neighbors, visit them in increasing order, e.g. visit 1 before 4.
Give the breadth-first search order.



Give the depth-first search order (preorder).
1
0
1
4
5
2
3
6

Depth-first search
DFS adds the current vertex to visited before exploring neighbors.
What happens if we change it to add to visited after exploring neighbors?
dfs(Graph graph, Vertex from) {
    visited.add(from);
    for (Edge edge : graph.neighbors(from)) {
        Vertex to = edge.to;
        if (!visited.contains(to)) {
            dfs(graph, to);
        }
    }
    visited.add(from);
}
2

Breadth-first search
BFS adds neighboring vertices to visited (when relaxing each edge).
What happens if we change it to add the current vertex to visited?
while (!perimeter.isEmpty()) {
    Vertex from = perimeter.remove();
    visited.add(from);
    for (Edge edge : graph.neighbors(from)) {
        Vertex to = edge.to;
        if (!visited.contains(to)) {
            perimeter.add(to);
            visited.add(to);
        }
    }
}
3
relaxing edge

Flood fill
Let’s design a graph and an algorithm for flood fill. Given an image and a start pixel, flood fill paints-over all similarly-colored pixels connected to the start.
Describe the model of the problem: What are the vertices and edges?




This animation shows a BFS approach. What might DFS look like?
4

Affordance analysis
How can we make sure the traversal does not explore differently-colored pixels?




Give an affordance analysis of flood fill for digital photography.
5

6
BLUE SKY
GRAY SKY
