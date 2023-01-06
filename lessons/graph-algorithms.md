---
layout: minimal
title: Graph Algorithms
description: &desc Shortest paths trees and dynamic programming.
summary: *desc
nav_order: 6
parent: Lessons
grand_parent: CSE 373
youtube: yes
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

## Shortest Paths Trees

Breadth-first search (BFS) can be used to solve the **unweighted shortest paths problem**, of which we've studied 3 variations:

Single-pair shortest paths
: Given a source vertex _s_ and target _t_, what is the shortest path from _s_ to _t_?

Single-source shortest paths
: Given a source vertex _s_ what are the shortest paths from _s_ to all vertices in the graph?

Multiple-source shortest paths
: Given a set of source vertices _S_, what are the shortest paths from any vertex in _S_ to all vertices in the graph.

In the context of BFS and unweighted shortest paths, the metric by which we define "shortest" is the number of edges on the path. But, in Husky Maps, we need a metric that is sensitive to the fact that road segments are not all the same length. In Husky Maps, the weight of an edge represents the physical distance of a road segment. Longer road segments have larger weight values than shorter road segments.

Weighted shortest paths problem
: For the single pair variant: Given a source vertex _s_ and target vertex _t_ what is the shortest path from _s_ to _t_ minimizing the _sum total weight of edges_?

{% include youtube.html id="Qf8cBml2R2s" start="473" end="680" aspect_ratio="16/9" %}

In this lesson, we'll learn about Dijkstra's algorithm as a modification of Prim's algorithm. It's important to keep in mind that the algorithms are designed to find different kinds of trees. Watch this short visualization to see the difference.

{% include youtube.html id="ZCMTccvfaTQ" start="210" end="256" aspect_ratio="16/9" %}

### Dijkstra's algorithm

**Dijkstra's algorithm** is the most well-known algorithm for finding a weighted SPT in a graph. Just as Prim's algorithm built on the foundation of BFS, Dijkstra's algorithm can be seen as a variation of Prim's algorithm.

Dijkstra's algorithm gradually builds a shortest paths tree on each iteration of the `while` loop. But whereas Prim's algorithm selects the next unvisited vertex based on _edge weight alone_ Dijkstra's algorithm selects the next unvisited vertex based on the **sum total cost of its shortest path**. Review the comments in this code snippet to identify how this change appears in Dijkstra's algorithm.

```java
public class DijkstraSolver<V> implements ShortestPathSolver<V> {
    private final Map<V, Edge<V>> edgeTo;
    // Maps each vertex to the weight of the best-known shortest path.
    private final Map<V, Double> distTo;

    /**
     * Constructs a new instance by executing Dijkstra's algorithm on the graph from the start.
     *
     * @param graph the input graph.
     * @param start the start vertex.
     */
    public DijkstraSolver(Graph<V> graph, V start) {
        edgeTo = new HashMap<>();
        distTo = new HashMap<>();

        MinPQ<V> pq = new DoubleMapMinPQ<>();
        pq.add(start, 0.0);

        // The shortest path from the start to the start requires no edges (0 cost).
        edgeTo.put(start, null);
        distTo.put(start, 0.0);

        Set<V> visited = new HashSet<>();

        while (!pq.isEmpty()) {
            V from = pq.removeMin();
            visited.add(from);

            for (Edge<V> e : graph.neighbors(from)) {
                V to = e.to;
                // oldDist is the weight of the best-known path not using this edge.
                double oldDist = distTo.getOrDefault(to, Double.POSITIVE_INFINITY);
                // newDist is the weight of the shortest path using this edge.
                double newDist = distTo.get(from) + e.weight;
                // Check that we haven't added the vertex to the SPT already...
                // AND the path using this edge is better than the best-known path.
                if (newDist < oldDist) {
                    edgeTo.put(to, e);
                    distTo.put(to, newDist);
                    if (pq.contains(to)) {
                        pq.changePriority(to, newDist);
                    } else {
                        pq.add(to, newDist);
                    }
                }
                // This entire if block is called "relaxing" an edge.
            }
        }
    }

    /** Returns a single-pair weighted shortest path from start to goal. */
    public List<V> solution(V goal) {
        List<V> path = new ArrayList<>();
        V curr = goal;
        path.add(curr);
        while (edgeTo.get(curr) != null) {
            curr = edgeTo.get(curr).from;
            path.add(curr);
        }
        Collections.reverse(path);
        return path;
    }
}
```

{% include youtube.html id="_lHSawdgXpI" start="18" end="131" aspect_ratio="16/9" %}

This code works fine, but in practice, you'll often see a similar version of this code that is basically the same except it makes no mention of the `visited` set. If we were to remove the `visited` set from BFS or Prim's algorithm, BFS and Prim's algorithms can get stuck in a loop or cause other kinds of problems. But Dijkstra's algorithm actually runs the same with or without the `visited` set. In class, we'll learn more about why this optimization works without causing any infinite loops.

### Topological sorting DAG algorithm

**Topological sorting** is a graph problem for ordering all the vertices in a directed acyclic graph (DAG).

{% include youtube.html id="TyZN6HKk6wE" end="393" aspect_ratio="16/9" %}

The algorithm that we'll introduce to solve topological sorting [doesn't have a commonly-accepted name](https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search). The algorithm solves topological sorting by returning all the vertices in the graph in **reverse DFS postorder**:

DFS
: Depth-first search.

DFS postorder
: A particular way of running depth-first search. DFS is recursive, so we can process each value either before or after the recursive calls to all the neighbors. A preorder processes the value before the recursive calls while a postorder processes the value after the recursive calls.

Reverse DFS postorder
: The DFS postorder list, but in backwards (reverse) order.

```java
public class ReverseDFSPostorderToposort<V> {
    private final List<V> result;

    public ReverseDFSPostorderToposort(Graph<V> graph) {
        result = new ArrayList<>();
        Set<V> visited = new HashSet<>();
        // Run the algorithm from all possible start points
        // if there are multiple disjoint parts of the graph.
        for (V start : graph.vertices()) {
            if (!visited.contains(start)) {
                dfsPostorder(graph, start, visited);
            }
        }
        // Reverse the DFS postorder.
        Collections.reverse(result);
    }

    private void dfsPostorder(Graph<V> graph, V from, Set<V> visited) {
        visited.add(from);
        for (Edge<V> edge : graph.neighbors(from)) {
            V to = edge.to;
            if (!visited.contains(to)) {
                dfsPostorder(graph, to, visited);
            }
        }
        // Postorder: Add current vertex after visiting all the neighbors
        result.add(from);
    }

    /** Returns a topological sorting of vertices in the graph. */
    public List<V> toposort() {
        return result;
    }
}
```

In the following visualization, notice how the first value in the DFS postorder is 4 because 4 has no outgoing neighbors! We then add 1 after visiting all of 1's neighbors. And repeat!

{% include slides.html src="https://www.cs.princeton.edu/courses/archive/spring22/cos226/demos/42DemoTopologicalSort/index.html" aspect_ratio="16/9" %}

In (forward) DFS postorder, we add the following vertices:

- The first vertex added to the `result` list is like a leaf in a tree: **it has no outgoing neighbors** so it is not a "prerequisite" for any other vertex.
- The second vertex added to the `result` list points to the first vertex.
- ...
- The final vertex added to the `result` list is the start vertex.

So the reverse DFS postorder has the first vertex (the "leaf") at the end of the `result` list where it belongs in the topological sorting.

Topological sorting provides an alternative way to find a shortest paths tree in a **directed acyclic graph** (DAG) by relaxing edges in the order given by the topological sort. In class, we'll learn more about the significance of this alternative approach and what it means in comparison to Dijkstra's algorithm.
