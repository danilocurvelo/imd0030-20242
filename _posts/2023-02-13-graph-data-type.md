---
title: &title Graph Data Type
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1I2EZFOEGKh7uqwxZiWlb8ruI0y4gZs_Ru5f5McIS5lE/edit?usp=sharing
canonical_url: *redirect
---

Graph identification
What definitions apply to this graph?
Undirected or Directed
Acyclic or Cyclic
List the set of all vertices, V.


List the set of all edges, E.


List the neighbors of the vertex labeled B.
1
B
E
D
C
A

Adjacency list runtime
Give the overall runtime of this code on an adjacency list in terms of |V| & |E|.
for (Point p : neighbors.keySet()) {
    for (Edge<Point> e : neighbors.get(p)) {
        System.out.println(e.from + " -> " + e.to);
    }
}
2

Number of edges
In this course, graphs have no self-loops and no parallel edges.
If a undirected graph has |V| vertices, what is the max number of edges?



If a directed graph has |V| vertices, what is the max number of edges?



Give a big-O bound for the worst-case runtime to print all edges in terms of |V|.
3

Applications
Explain how to model each problem as a graph by describing its vertices and edges. Then, give an example of a program that could be implemented with your graph.
Digital image consisting of a 2-d grid of pixels, i.e. Pixel[][].


Flight schedule consisting of direct, airport-to-airport flights.


WA Notify app consisting of all recent pairs of close contacts.
4
