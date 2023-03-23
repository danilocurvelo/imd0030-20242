---
layout: minimal
title: Shortest Paths
description: &desc Designing and analyzing shortest paths.
summary: *desc
nav_order: 4
parent: Projects
grand_parent: CSE 373
youtube: yes
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

Shortest paths is not only essential for navigation directions in Husky Maps, but also essential for image processing. **Seam carving** is a technique for _image resizing_ where the size of an image is reduced by one pixel in height (by removing a horizontal seam) or width (by removing a vertical seam) at a time. Rather cropping pixels from the edges or scaling the entire image, seam carving is considered _content-aware_ because it attempts to identify and preserve the most important content in an image.

{% include youtube.html id="6NcIJXTlugc" aspect_ratio="4/3" thumbnail="hqdefault.jpg" %}

In this project, we will compare 2 graph representations, 2 graph algorithms, and 1 dynamic programming algorithm for seam carving. By the end of this project, students will be able to:

- **Design and implement** graph representations and graph algorithms for image processing.
- **Analyze and compare** the runtimes and affordances for graph algorithms.

<details markdown="block">
<summary>What am I submitting at the end of this project?</summary>

Satisfactory completion of the project requires a **video-recorded team presentation that addresses all the green callouts** meeting the following requirements:

- **Each team member needs to present** part of the presentation in order to receive credit for the assignment.
- Your presentation should not be much longer than **7 minutes** and should **include your voiceover**. (Your video is appreciated but not necessary.)
- Your presentation should include some kind of **visually-organizing structure**, such as slides or a document.
- After submitting to Canvas, **add a submission comment** linking to your slides or document.
</details>

## Seam-finding interfaces

Seam carving depends on algorithms that can find a least-noticeable horizontal seam. The seam-finding interfaces are defined in the `src/seamfinding` folder.

`SeamFinder`
: An interface specifying a single method, `findHorizontal`, for finding a least-noticeable horizontal seam in a given `Picture` according to the `EnergyFunction`. The horizontal seam is returned as a list of integer indices representing the _y_-value (vertical) pixel indices for each pixel in the width of the picture.

`Picture`
: A class representing a digital image where the color of each pixel is an `int`. In image processing, pixel _(x, y)_ refers to the pixel in column _x_ and row _y_ where pixel _(0, 0)_ is the upper-left corner and the lower-right corner is the pixel with the largest coordinates.

{: .warning }
This is opposite to linear algebra, where _(i, j)_ is row _i_ column _j_ and _(0, 0)_ is the lower-left corner.

`EnergyFunction`
: An interface specifying a single method, `apply`, for computing the importance of a given pixel in the picture. The higher the energy of a pixel, the more noticeable it is in the picture.

Seam finder implementations work by applying the `EnergyFunction` to each pixel in the given `Picture`. Then, we can use a shortest paths algorithm to find the least-noticeable horizontal seam from the left side of the picture to the right side of the picture.

## Graph interfaces

The graph interfaces and algorithms are defined in the `src/graphs` folder.

`Graph`
: An interface representing a directed weighted graph with a single method that returns a list of the `neighbors` of a given vertex. The directed `Edge` class provides 3 fields: the origin vertex `from`, the destination vertex `to`, and the edge `weight`.

`ShortestPathSolver`
: An interface for finding a shortest paths tree in a `Graph`. Implementations of this interface must provide a public constructor that accepts two parameters: a `Graph` and a start vertex. The `solution` method returns the list of vertices representing a shortest path from the start vertex to the given `goal` vertex.

{: .hint }
The generic type `V` is used throughout the `graphs` package to indicate the vertex data type. For seam carving, all vertices will be of the interface type `Node` (introduced below).

## Reference implementation

`AdjacencyListSeamFinder` implements `SeamFinder` by building an _adjacency list graph representation_ of the picture and then running a _single-source shortest paths algorithm_ to find a lowest-cost horizontal seam.

```java
public List<Integer> findHorizontal(Picture picture, EnergyFunction f) {
    PixelGraph graph = new PixelGraph(picture, f);
    List<Node> seam = sps.run(graph, graph.source).solution(graph.sink);
    seam = seam.subList(1, seam.size() - 1); // Skip the source and sink nodes
    List<Integer> result = new ArrayList<>(seam.size());
    for (Node node : seam) {
        // All remaining nodes must be Pixels
        PixelGraph.Pixel pixel = (PixelGraph.Pixel) node;
        result.add(pixel.y);
    }
    return result;
}
```

Here's how each line of code in this method works starting from the method signature.

`findHorizontal(Picture picture, EnergyFunction f)`
: The `Picture` represents the image we want to process. The `EnergyFunction` defines the way that we want to measure the importance of each pixel.

`PixelGraph graph = new PixelGraph(picture, f)`
: The first line creates a `PixelGraph` where each vertex represents a pixel and each edge represents the energy cost for the neighboring pixel. The `PixelGraph` constructor creates a new `Pixel` (node) for each pixel in the image. It also creates a `source` node and a `sink` node.

`List<Node> seam = sps.run(graph, graph.source).solution(graph.sink)`
: `sps.run` calls the `ShortestPathSolver` (such as `DijkstraSolver`) to find the shortest path in the `PixelGraph` from the `source` and immediately asks for a shortest path to the `sink`. The `seam` stores the solution to the shortest path problem.

`seam = seam.subList(1, seam.size() - 1)`
: The `seam` includes the `source` and `sink`, which we don't need in our final solution.

`for (Node node : seam) { ... }`
: Since the remaining nodes in the `seam` must be `Pixel` nodes, add each pixel's `y` index to the `result` list and return the `result`.

{: .hint }
Look inside the `AdjacencyListSeamFinder` class to find a static nested class called `PixelGraph`. `PixelGraph` implements `Graph<Node>` by constructing a 2-dimensional grid storing each `Node` in the seam carving graph. This class also includes two fields called `source` and `sink`.

### Node interface

`Node` is an interface that adapts the `Graph.neighbors` method for use with different types of nodes in the `AdjacencyListSeamFinder`. This is helpful because not all nodes are the same. Although most nodes represent pixels that have `x` and `y` coordinates, the graph also contains `source` and `sink` nodes that don't have `x` or `y` coordinates! Using the `Node` interface allows for these different kinds of nodes to all work together in a single program.

Inside of the `PixelGraph` class, you'll find the three types of nodes implemented as follows.

`source`
: A field that implements `Node.neighbors` by returning a list of `picture.height()` outgoing edges to each `Pixel` in the first column of the picture. The weight for each outgoing edge represents the energy of the corresponding pixel in the leftmost column.

`Pixel`
: An inner class representing an _(x, y)_ pixel in the picture with directed edges to its _right-up_, _right-middle_, and _right-down_ neighbors. Most pixels have 3 adjacent neighbors except for pixels at the boundary of the picture that only have 2 adjacent neighbors. The weight of an edge represents the energy of the neighboring `to`-side pixel.

`sink`
: A field that implements `Node.neighbors` by returning an empty list. It has one incoming edge from each `Pixel` in the rightmost column of the picture.

{: .hint }
The `source` and `sink` are defined using a feature in Java called [anonymous classes](https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html). Anonymous classes are great for objects that implement an interface but only need to be instantiated once.

## Design and implement

Design and implement 1 graph representation, 1 graph algorithm, and 1 dynamic programming algorithm for seam finding.

{: .warning }
All team members must work together and fully understand each implementation. Do not assign each implementation to individual team members. The implementations are described in order of increasing complexity so later implementations will require significantly more work.

### GenerativeSeamFinder

A graph representation that implements `SeamFinder`. Similar to `AdjacencyListSeamFinder` but rather than creating the neighbors for every node in the `PixelGraph` constructor ahead of time, this approach only creates vertices and edges when `Pixel.neighbors` is called.

1. Study the `AdjacencyListSeamFinder.PixelGraph` constructor, which constructs the entire graph and represents it as a `Pixel[][]`.
1. Adapt the ideas to implement `GenerativeSeamFinder.PixelGraph.Pixel.neighbors`, which should return the list of neighbors for a given `Pixel`. Create a new `Pixel` for each neighbor.
1. Then, define the `source` and `sink` nodes.

{% include slides.html id="1B-faTKm7eIkpvoaetXutsyoSEk-heidbFpC0dJcjcZw" aspect_ratio="16/9" %}

{: .deliverable }
Explain the part of the `GenerativeSeamFinder` class that you're most proud of programming.

### ToposortDAGSolver

A graph algorithm that implements `ShortestPathSolver`. Finds a shortest paths tree in a directed acyclic graph using topological sorting.

1. Initialize `edgeTo` and `distTo` data structures just as in `DijkstraSolver`.
1. List all reachable vertices in **depth-first search postorder**. Then, `Collections.reverse` the list.
1. For each node in reverse DFS postorder, relax each neighboring edge.

Edge relaxation
: If the new distance to the neighboring node using this edge is better than the best-known `distTo` the node, update `distTo` and `edgeTo` accordingly.

### DynamicProgrammingSeamFinder

A dynamic programming algorithm that implements `SeamFinder`. The dynamic programming approach processes pixels in a topological order: start from the leftmost column and work your way right, using the previous columns to help identify the best shortest paths. The difference is that dynamic programming does not create a graph representation (vertices and edges) nor does it use a graph algorithm.

How does dynamic programming solve the seam finding problem? We need to first generate a dynamic programming table storing the accumulated path costs, where each entry represents the total energy cost of the least-noticeable path from the left edge to the given pixel.

1. Initialize a 2-d `double[picture.width()][picture.height()]` array.
2. Fill out the leftmost column in the 2-d array with the energy for each pixel.
3. For each pixel in each of the remaining columns, determine the lowest-energy predecessor to the pixel: the minimum of its _left-up_, _left-middle_, and _left-down_ neighbors. Compute the total energy cost to the current pixel by adding its energy to the total cost for the least-noticeable predecessor.

{% include slides.html id="1W4XA1yPZaPIrNXGOkcXc6PhW31EiQJGJ9sxE9C12Qos" aspect_ratio="16/9" %}

Once we've generated this table, we can use it to find the shortest path.

1. Add the _y_ value of the least-noticeable pixel in the rightmost column to the result.
1. Follow the path back to the left by adding the _y_-value of each predecessor to the result.
1. Finally, to get the coordinates from left to right, `Collections.reverse` the result.

{: .deliverable }
Explain the part of the `DynamicProgrammingSeamFinder` class that you're most proud of programming.

## Analyze and compare

### Affordance analysis

How does the choice of energy function affect the effectiveness of the seam carving algorithm? The `DualGradientEnergyFunction` defines the energy of a pixel as a function of red, green, and blue color differences in adjacent horizontal and vertical pixels.[^1] (The exact details of how the energy calculated isn't important for the purposes of your analysis.)

[^1]: Josh Hug, Maia Ginsberg, and Kevin Wayne. 2015. "3x4.png" in [Programming Assignment 7: Seam Carving](https://www.cs.princeton.edu/courses/archive/spring15/cos226/assignments/seamCarving.html).

![A 3-by-4 image and the gradients of each pixel]({{ site.baseurl }}{% link assets/images/dual-gradient.webp %})

However, some images don't work well with seam carving for content-aware image resizing.

![Cat picture mangled by seam carving]({{ site.baseurl }}{% link assets/images/meow.webp %})

{: .deliverable }
Identify affordances of dual-gradient energy seam carving. Then, evaluate the affordances by applying the three value-sensitive design principles. Describe (or select) some example images that we should be particularly concerned about when evaluating an pixel-based seam carving algorithm.

### Experimental analysis

Run the provided `RuntimeExperiments` to compare the real-world runtime of each implementation. For each implementation, `RuntimeExperiments` constructs an empty instance and records the number of seconds to `findHorizontal` through randomly-generated pictures of increasing resolution.

Copy-paste the text into plotting software such as [Desmos](https://www.desmos.com/calculator). Plot the runtimes of all 5 approaches.

- `AdjacencyListSeamFinder(DijkstraSolver::new)`
- `AdjacencyListSeamFinder(ToposortDAGSolver::new)`
- `GenerativeSeamFinder(DijkstraSolver::new)`
- `GenerativeSeamFinder(ToposortDAGSolver::new)`
- `DynamicProgrammingSeamFinder()`

{: .deliverable }
Compare the runtimes across all 5 approaches. Are certain algorithms faster than others? What might explain the differences? How does the choice of `SeamFinder` and the choice of `ShortestPathSolver` affect the runtime? Briefly speculate possible implications for algorithm design.

## Apply and Extend

You've now completed 2 SeamFinder implementations and 1 ShortestPathSolver implementation, analyzed the runtimes across multiple graph traversal algorithms experimentally, and thought about graphs conceptually in your assessments. You've not only gotten a sense of how Seam Carving for image reduction might be implemented, but have gained a stronger understanding of how graphs may be applied to a real world context.

Hopefully, you've had some fun seam-carving your own images as well! Here are some examples and ideas (aka "grapplications") of how you can expand upon your knowledge of graphs to other problems!

- **LeetCode.** Minimum Cost to Make at least One Valid Path in a Grid can be solved using Dijkstra's Algorithm!
- **Extend your knowledge to Web Design.** Consider taking CSE 154 and INFO 340 so you can build interfaces for your Seam Carver!
- **Problem Solving using Graphs.**
    - `Graph Theory:` Crop harvesting in Stardew Valley!
    - `Google PageRank:` The algorithm behind how Google ranks their search results.
- **Research at UW using Graphs.**
    - `Pathways through Conspiracy:` How does conspiracy radicalization process evolve for users on Reddit?
    - `Wikipedia2Vec:` How can we learn the embeddings of words and entities from Wikipedia?
- **Graph puns.** Pretty self-edgeplanatory.

### LeetCode: Minimum Cost to Make at least One Valid Path in a Grid

This problem is directly taken from Leetcode problem 1368: Minimum Cost to Make at least One Valid Path in a Grid - [https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/)

**Problem Statement:**

Given an `m x n` grid. Each cell of the grid has a sign pointing to the next cell you should visit if you are currently in this cell. The sign of `grid[i][j]` can be:

- `1` which means go to the cell to the right. (i.e go from `grid[i][j]` to `grid[i][j + 1]`)
- `2` which means go to the cell to the left. (i.e go from `grid[i][j]` to `grid[i][j - 1]`)
- `3` which means go to the lower cell. (i.e go from `grid[i][j]` to `grid[i + 1][j]`)
- `4` which means go to the upper cell. (i.e go from `grid[i][j]` to `grid[i - 1][j]`)

Notice that there could be some signs on the cells of the grid that point outside the grid.

You will initially start at the upper left cell `(0, 0)`. A valid path in the grid is a path that starts from the upper left cell `(0, 0)` and ends at the bottom-right cell `(m - 1, n - 1)` following the signs on the grid. The valid path does not have to be the shortest.

You can modify the sign on a cell with `cost = 1`. You can modify the sign on a cell **one time only**.

Return the _minimum cost to make the grid have at least one valid path_.

(See original problem for examples and constraints.)

**Live Code/Problem Walkthrough:**

{% include youtube.html id="GWGcwUY5HAQ" aspect_ratio="1280/777" %}

Feel free to look through the Solution code after trying the Leetcode problem out yourself!

<details>
<summary>Solution Code:</summary>

```java
class Solution {

    // handle location of GridCell along with the cost to get to it!
    class GridCell {
        int row, col, cost;
        public GridCell(int r, int c, int costVal) {
            row = r;
            col = c;
            cost = costVal;
        }
    }

    public int minCost(int[][] grid) {

        // Permiter of the grid -> Rows and Columns!
        int rows = grid.length;
        int columns = grid[0].length;

        // Initializing the start and target nodes to run Dijkstras!
        GridCell start = new GridCell(0, 0, 0);
        int targetRow = grid.length - 1;
        int targetCol = grid[0].length - 1;

        // To keep track of the seen GridCells and ensure we don't change the sign more than once!
        boolean[][] seen = new boolean[rows][columns];

        // min-heap store GridCell values -> The row, the col; order the minHeap with the cost!
        PriorityQueue<GridCell> minHeap = new PriorityQueue<>((a, b) -> (a.cost - b.cost));

        minHeap.add(start);

        // Run Dijkstras!
        while(!minHeap.isEmpty()) {
            // Initialize a couple important variables!
            GridCell cur = minHeap.poll();
            int row = cur.row;
            int col = cur.col;
            seen[row][col] = true;

            // End Dijkstras when we reach the Target!
            if (row == targetRow && col == targetCol) {
                return cur.cost;
            }

            // Traverse through the other nodes!!

            // If we are going Right! -> 1!
            if (col + 1 != columns && !seen[row][col + 1]) {
                minHeap.add(new GridCell(row, col + 1, (grid[row][col] == 1 ? 0 : 1) + cur.cost));
            }

            // If we are going Left! -> 2!
            if (col - 1 != -1 && !seen[row][col - 1]) {
                minHeap.add(new GridCell(row, col - 1, (grid[row][col] == 2 ? 0 : 1) + cur.cost));
            }

            // If we are going Down! -> 3!
            if (row + 1 != rows && !seen[row + 1][col]) {
                minHeap.add(new GridCell(row + 1, col, (grid[row][col] == 3 ? 0 : 1) + cur.cost));
            }

            // If we are going Up! -> 4!
            if (row - 1 != -1 && !seen[row - 1][col]) {
                minHeap.add(new GridCell(row - 1, col, (grid[row][col] == 4 ? 0 : 1) + cur.cost));
            }
        }
        return 0;
    }
}
```
</details>

### Extend your knowledge to Web Design

A way you can extend the knowledge you have learned in the Shortest Path Project is to make a client side code that makes seam carving more user friendly! If you are familiar with web design or are interested, you can attempt to create an app or website that can allow a user to use seam carving themselves—instead of having to do it through Intelli J which can be confusing even for software engineers. You can experiment with user design, typography, and learn to insert a link to other platforms (such as social media platforms) to display the new photo generated. And if you have no experience with web design, here are two incredible classes you can take next quarter that will: CSE 154 and INFO 340. Having your own finished website that displays work from both client and server side would be very impressive to show to future recruiters or any employer since this process is both difficult and requires prior knowledge to complete.

### Problem Solving using Graphs

- [Solving a Stardew Valley Routing Problem with Graph Theory & Python.](https://towardsdatascience.com/solving-a-stardew-valley-routing-problem-with-graph-theory-python-fd4471077b3a) _Lily Wu._
    - **Summary:** In this article, Lilly will take you through how they conceptualised their Stardew Valley farm as a graph, the algorithms they explored for shortest path and minimum spanning tree problems and how these inspired the algorithm they wrote in Python to find the fastest way to harvest their crops.
    - **Use of graph algorithms:** Starts with solutions using BFS, Dijkstra's, Bellman-Ford, Prim's, and Kruskal's, and improves upon these solutions to create Farmer Lily's algorithm!
- [How Google's PageRank Algorithm Works.](https://www.youtube.com/watch?v=meonLcN7LD4) _Spanning Tree._
    - **Summary:** Google's PageRank algorithm is one of the most important algorithms on the Internet. The algorithm attempts to rank pages according to their importance. But what does it mean for a web page to be "important"? In this video, we explore the "random surfer" model, which allows us to calculate a page's PageRank by simulating a random surfer who browses the web one page at a time.
    - **Use of graphs:** Each webpage can be represented by a node, and links between webpages can be represented by edges! The probability of going from one page to another will affect the weight of that edge.
        - If you're interested in learning more about the math behind PageRank using linear algebra or Markov chains, check out these videos:
            - [The algorithm that started google.](https://www.youtube.com/watch?v=qxEkY8OScYY) _Zach Star._
            -[PageRank: A Trillion Dollar Algorithm.](https://www.youtube.com/watch?v=JGQe4kiPnrU) _Reducible._

### Research at UW using Graphs

- [Pathways through Conspiracy: The Evolution of Conspiracy Radicalization through Engagement in Online Conspiracy Discussions.](https://arxiv.org/abs/2204.10729) _Shruti Phadke, Mattia Samory, Tanushree Mitra._ [Social Computing and ALgorithmic Experiences Lab (SCALE)]
    - **Summary:** What are the pathways of online conspiracy engagement? How does conspiracy radicalization process evolve for users? Through a theory-driven, empirical study of the conspiracy radicalization process, we answer these questions by studying 36K Reddit users through their 169M contributions.
    - **Use of Graphs:** Uses a subreddit-entity network to represent relationships between subreddits that discuss the same topics. Nodes represent subreddits, and edges exist between subreddits if top posts from both subreddits mention the same entity (person, place, organization, etc.).
- [Wikipedia2Vec: An Efficient Toolkit for Learning and Visualizing the Embeddings of Words and Entities from Wikipedia.](https://arxiv.org/abs/1812.06280) Ikuya Yamada, Akari Asai, Jin Sakuma, Hiroyuki Shindo, Hideaki Takeda, Yoshiyasu Takefuji, Yuji Matsumoto.
    - **Summary:** The embeddings of entities in a large knowledge base (e.g., Wikipedia) are highly beneficial for solving various natural language tasks that involve real world knowledge. In this paper, we present Wikipedia2Vec, a Python-based open-source tool for learning the embeddings of words and entities from Wikipedia. [Demo.](https://wikipedia2vec.github.io/demo/)
    - **Use of Graphs:** Uses an undirected Wikipedia-link graph where nodes are entities, and edges exist between nodes if links exists between the two entities. Graph is stored as an adjacency matrix, where rows and columns are entities, and a value exists at arr[i][j] if entities i and j are linked.

### Graph puns

<details>
<summary>What do you call using Shaprie on the wall of a classroom to finda shortest paths tree?</summary>
Graph-iti!
</details>

<details>
<summary>How do you express your thanks for having learning about data structures composed of vertices and edges?</summary>
Graph-titude!
</details>

<details>
<summary>What do you call the act of appreciating graph-related humor?</summary>
Graphing. Hahaha....ha?
</details>
