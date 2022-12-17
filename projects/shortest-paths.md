---
layout: minimal
title: Shortest Paths
description: &desc Designing, analyzing, and critiquing shortest paths.
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

{% include youtube.html id="6NcIJXTlugc" aspect_ratio="4/3" %}

In this project, we will compare 2 graph representations, 2 graph algorithms, and 1 dynamic programming algorithm for seam carving. By the end of this project, students will be able to:

- **Design and implement** graph representations and graph algorithms for image processing.
- **Analyze and compare** the runtimes and affordances for graph algorithms.
- **Critique and connect** the implications of automated image processing algorithms.

<details markdown="block">
<summary>What am I submitting at the end of this project?</summary>

Satisfactory completion of the project requires a **video-recorded individual presentation that addresses all the green callouts** meeting the following requirements:

- Your presentation should not be much longer than **10 minutes** and should include your voiceover. (Your video is appreciated but not necessary.)
- Your presentation should include some kind of visually-organizing structure, such as slides or a document.
- After submitting to Canvas, add a submission comment linking to your slides or document.
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

{: .deliverable }
Explain the part of the `ToposortDAGSolver` class that you're most proud of programming.

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

## Critique and connect

{: .deliverable }
Synthesize an idea involving least one of the following 3 articles together with a couple additional sources. How do the articles relate to your understanding of the `SeamFinder` interface that we designed? How does the author's arguments relate the technology to the distribution of power, benefits, and harms across different people in society? What other questions should we ask about the design of our technology?

Harvard professor Sarah Lewis writes for the NY Times about "[The Racial Bias Built Into Photography](https://www.nytimes.com/2019/04/25/lens/sarah-lewis-racial-bias-photography.html)".

> Photography is not just a system of calibrating light, but a technology of subjective decisions. Light skin became the chemical baseline for film technology, fulfilling the needs of its target dominant market. For example, developing color-film technology initially required what was called a Shirley card. When you sent off your film to get developed, lab technicians would use the image of a white woman with brown hair named Shirley as the measuring stick against which they calibrated the colors. Quality control meant ensuring that Shirley's face looked good. It has translated into the color-balancing of digital technology. In the mid-1990s, Kodak created a multiracial Shirley Card with three women, one black, one white, and one Asian, and later included a [Latina](https://www.nytimes.com/2019/04/25/lens/sarah-lewis-racial-bias-photography.html#:~:text=and%20later%20included%20a-,Latina,-model%2C%20in%20an) model, in an attempt intended to help camera operators calibrate skin tones. These were not adopted by everyone since they coincided with the rise of digital photography. The result was film emulsion technology that still carried over the social bias of earlier photographic conventions.

Though the ubiquity of AI-augmented smartphone camera systems has improved photo quality, inherited bias remains a modern issue for camera designers as "[Google is trying to make its image processing more inclusive](https://www.theverge.com/2021/5/18/22442515/google-camera-app-inclusive-image-equity-skintones)", The Verge reports. The history of digital photography raises not only social questions about the chemistry and physics behind photography, but also the people we include (or exclude) in the design process.

**[Gender Shades](http://gendershades.org/) ([Research Paper](http://proceedings.mlr.press/v81/buolamwini18a/buolamwini18a.pdf))**. How well do facial recognition services guess the gender of a face? "We evaluate 3 commercial gender classification systems using our dataset and show that darker-skinned females are the most misclassified group (with error rates of up to 34.7%). The maximum error rate for lighter-skinned males is 0.8%."

[**The Efforts to Make Text-Based AI Less Racist and Terrible**](http://the%20efforts%20to%20make%20text-based%20ai%20less%20racist%20and%20terrible/) and [**DALL**](https://openai.com/blog/dall-e/)-[**E**](https://openai.com/blog/dall-e/). "Language models like GPT-3 can write poetry, but they often amplify negative stereotypes." If a GPT-3 model is then asked to generate images corresponding to text prompts (DALL-E), what kinds of machine bias may result?

**[Everybody Can Make Deepfakes Now!](https://youtu.be/mUfJOQKdtAk) and [This AI Makes "Audio Deepfakes"](https://youtu.be/VQgYPv8tb6A)**. [Deepfakes](https://en.wikipedia.org/wiki/Deepfake) are algorithm-generated images, video, and audio designed to resemble real people. "It is important that everyone knows about the fact that we can both perform joint video and audio synthesis for a target subject."
