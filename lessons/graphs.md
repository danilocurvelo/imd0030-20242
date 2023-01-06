---
layout: minimal
title: Graphs
description: &desc Graph data types, traversals, and MSTs.
summary: *desc
nav_order: 5
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

## Graph Data Type

{% include learning_objectives.md lesson="Graph Data Type" %}

Most of the data structures we've seen so far organize elements according to the properties of data in order to implement abstract data types like sets, maps, and priority queues.

- **Search trees** use the properties of an element to determine where it belongs in the search tree. In `TreeSet` and `TreeMap`, the ordering relation is defined by the key's `compareTo`.
- **Binary heaps** compare the given priority values to determine whether to sink or swim a node in the heap. In `PriorityQueue`, the priority values are also defined by the key's `compareTo`.
- **Hash tables** use the properties of an element to determine the hash code for the it, which then becomes a bucket index. In `HashSet` and `HashMap`, the hash function is defined by the key's `hashCode`.

All these data structures rely on properties of data to achieve efficiency. Checking if an element is stored in a balanced search tree containing 1 billion elements only requires about 30 comparisons---which sure beats having to check all 1 billion elements in an unsorted array. This is only possible because (1) the `compareTo` method defines an ordering relation and (2) the balanced search tree maintains log _N_ height for any assortment of _N_ elements.

But if we step back, all of this happens within the internal implementation details of the balanced search tree. Clients or other users of a balanced search tree treat it as an **abstraction**, or a structure that they can use without knowing its implementation details. In fact, the client _can't_ assume any particular implementation because they're writing their code against more general interfaces like `Set`, `Map`, or `Autocomplete`.

**Graphs**, however, represent a totally different kind of abstract data type with different goals. Rather than focus on enabling efficient access to data, graphs focus on representing client-defined relationships between data.

{% include youtube.html id="Ca06m54IxTM" start="290" aspect_ratio="16/9" %}

Although graphs may look like weirdly-shaped trees, they are used in very different situations. The greatest difference lies in how a graph is used by a client. Instead of only specifying the element to add in a graph, we often will also specify the edges or relationships between elements too. Much of the usefulness of a graph comes from the explicit relationships between elements.

### Husky Maps

In the Husky Maps case study, the `MapGraph` class represents all the streets in the Husky Maps app. Let's focus on how data is represented in a graph.

```java
public class MapGraph {
    private final Map<Point, List<Edge<Point>>> neighbors;
}
```

Here's a breakdown of the data type for the `neighbors` variable:

`Map<Point, List<Edge<Point>>>`
: A map where the keys are unique `Point` objects, and the values are the "neighbors" of each `Point`.

`Point`
: An object that has an _x_ coordinate and a _y_ coordinate. Each point can represent a physical place in the real world, like a street intersection.

`List<Edge<Point>>`
: A list of edges to other points. Each key is associated with one list of values; in other words, each `Point` is associated with a list of _neighboring_ points.

![U District map with two markers on NE 43rd St]({{ site.baseurl }}{% link assets/images/u-district-map.webp %})

In this image, the `Point` labeled A represents the intersection _Brooklyn Ave NE & NE 43rd St_ while the `Point` labeled B represents the intersection _University Way NE & NE 43rd St_. We might say that the two points are "neighbors" because there's a stretch of _NE 43rd St_ in front of the light rail station that directly connects the two points.

More generally, a graph is a data type composed of vertices and edges defined by the client. In Husky Maps, the vertices are unique `Point` objects while the edges are stretches of road connecting points. Street intersections are connected to other street intersections. Unlike lists, deques, sets, maps, and priority queues that are defined largely by how they organize elements, graphs are defined by vertices and edges that define relationships between vertices.

{: .hint }
In `MapGraph`, we included an edge representing the stretch of _NE 43rd St_ in front of the light rail station. But this stretch of road is only accessible to buses, cyclists, and pedestrians. Personal vehicles are not allowed on this stretch of road, so the inclusion of this edge suggests that this graph would _afford_ applications that emphasize public transit, bicycling, or walking. Graph designers make key decisions about what data is included and represented in their graph, and these decisions affect what kinds of problems can be solved.

### Vertices and edges

Vertex (node)
: A basic element of a graph.
: In `MapGraph`, vertices are represented using the `Point` class.

Edge
: A direct connection between two vertices _v_ and _w_ in a graph, usually written as (_v_, _w_). Optionally, each edge can have an associated **weight**.
: In `MapGraph`, edges are represented using an `Edge` class.

Given a vertex, its edges lead to **neighboring** (or **adjacent**) vertices. In this course, we will always assume two restrictions on edges in a graph.

- **No self-loops**. A vertex _v_ cannot have an edge (_v_, _v_) back to itself.
- **No parallel (duplicate) edges**. There can only exist at most one edge (_v_, _w_).

There are two types of edges.

Undirected edges
: Represent pairwise connections between vertices allowing movement in both directions. Visualized as lines connecting two vertices.
: In `MapGraph`, undirected edges are like two-way streets where traffic can go in both directions.

Directed edges
: Represent pairwise connections between vertices allowing movement in a single direction. Visualized as arrows connecting one vertex to another.
: In `MapGraph`, directed edges are like one-way streets.

### Undirected graph abstract data type

An **undirected graph** (or simply "graph" without any qualifiers) is an abstract data type that contains zero or more vertices and zero or more _undirected edges_ between pairs of vertices. The following slide[^1] describes some undirected graph terminology.

[^1]: Robert Sedgewick and Kevin Wayne. 2020. [Graphs and Digraphs](https://www.cs.princeton.edu/courses/archive/fall20/cos226/lectures/4GraphsDigraphsI.pdf).

![Undirected graph terminology]({{ site.baseurl }}{% link assets/images/undirected-graph.webp %})

Path
: Sequence of vertices connected by _undirected edges_, with no repeated edges.
: Two vertices are **connected** if there is a path between them.

Cycle
: Path (with 1 or more edges) whose first and last vertices are the same.

Degree
: Number of undirected edges associated with a given vertex.

An interface for an undirected graph could require an `addEdge` and `neighbors` method.

```java
public interface UndirectedGraph<V> {

    /** Add an undirected edge between vertices (v, w). */
    public void addEdge(V v, V w);

    /** Returns a list of the edges adjacent to the given vertex. */
    public List<Edge<V>> neighbors(V v);
}
```

### Directed graph abstract data type

A **directed graph** (or "digraph") is an abstract data type that contains zero or more vertices and zero or more _directed edges_ between pairs of vertices. The following slide[^1] describes some directed graph terminology.

![Directed graph terminology]({{ site.baseurl }}{% link assets/images/directed-graph.webp %})

{: .hint }
Although parallel (duplicate) edges are not allowed, a directed graph can have edges in both directions between each pair of nodes. In the example above, note there are edges (2, 3) and (3, 2), as well as edges (6, 8) and (8, 6). These two pairs of edges allow for movement in both directions.

Directed path
: Sequence of vertices connected by _directed edges_, with no repeated edges.
: Vertex _w_ is **reachable** from vertex _v_ if there is a directed path from _v_ to _w_.

Directed cycle
: Directed path (with 1 or more edges) whose first and last vertices are the same.

Outdegree
: Number of directed edges outgoing from a given vertex.

Indegree
: Number of directed edges incoming to the given vertex.

An interface for an directed graph could also require an `addEdge` and `neighbors` method, just as in the undirected graph example.

```java
public interface DirectedGraph<V> {

    /** Add an directed edge between vertices (v, w). */
    public void addEdge(V v, V w);

    /** Returns a list of the outgoing edges from the given vertex. */
    public List<Edge<V>> neighbors(V v);
}
```


### Adjacency lists data structure

Adjacency lists is a data structure for implementing both undirected graphs and directed graphs.

Adjacency lists
: A graph data structure that associates each vertex with a list of edges.

`MapGraph` uses an adjacency lists data structure: the `neighbors` map associates each `Point` with a `List<Edge<Point>>`. The adjacency lists provides a very direct implementation of the `DirectedGraph` interface methods like `addEdge` and `neighbors`.

```java
public class MapGraph implements DirectedGraph<Point> {
    private final Map<Point, List<Edge<Point>>> neighbors;

    /** Constructs a new map graph. */
    public MapGraph(...) {
        neighbors = new HashMap<>();
    }

    /** Adds a directed edge to this graph if it doesn't already exist using distance as weight. */
    public void addEdge(Point from, Point to) {
        if (!neighbors.containsKey(from)) {
            neighbors.put(from, new ArrayList<>());
        }
        neighbors.get(from).add(new Edge<>(from, to, estimatedDistance(from, to)));
    }

    /** Returns a list of the outgoing edges from the given vertex. */
    public List<Edge<Point>> neighbors(Point point) {
        if (!neighbors.containsKey(point)) {
            return new ArrayList<>();
        }
        return neighbors.get(point);
    }
}
```

{: .hint }
The `MapGraph` class doesn't have a method for adding just a single vertex or getting a list of all the vertices or all the edges. These aren't necessary for Husky Maps. But in other situations, you might like having these methods that provide different functionality. The Java developers did not provide a standard Graph interface like they did for `List`, `Set`, or `Map` because graphs are often custom-designed for specific problems. What works for Husky Maps might not work well for other graph problems.

There are many options for `Map` and `Set` implementations. Instead of `HashMap`, we could have chosen `TreeMap`; instead of `HashSet`, `TreeSet`. However, we'll often visualize adjacency lists by drawing the map as an array associating each vertex with a linked list representing its neighbors. The following graph visualization[^1] on the left matches with the data structure visualization on the right, with the edge (6, 9) marked red in both the left and the right side.

![Adjacency lists representation]({{ site.baseurl }}{% link assets/images/adjacency-lists.webp %})

Adjacency lists aren't the only way to implement graphs. Two other common approaches are adjacency matrices and edge sets. Both of these approaches provide different affordances (making some graph methods easier to implement or more efficient in runtime), but adjacency lists are still the most popular option for the graph algorithms we'll see in this class. [Keith Schwarz writes on StackOverflow](https://stackoverflow.com/a/62614483) about a few graph problems where you might prefer using an adjacency matrix over an adjacency list but summarizes at the top:

> Adjacency lists are generally faster than adjacency matrices in algorithms in which the key operation performed per node is "iterate over all the nodes adjacent to this node." That can be done in time O(deg(v)) time for an adjacency list, where deg(v) is the degree of node v, while it takes time Θ(n) in an adjacency matrix. Similarly, adjacency lists make it fast to iterate over all of the edges in a graph---it takes time O(m + n) to do so, compared with time Θ(n<sup>2</sup>) for adjacency matrices.
>
> Some of the most-commonly-used graph algorithms (BFS, DFS, Dijkstra's algorithm, A* search, Kruskal's algorithm, Prim's algorithm, Bellman-Ford, Karger's algorithm, etc.) require fast iteration over all edges or the edges incident to particular nodes, so they work best with adjacency lists.
