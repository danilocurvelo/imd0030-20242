---
layout: minimal
title: Heaps and Hashing
description: &desc Binary heaps, hash tables, and affordance analysis.
summary: *desc
nav_order: 4
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

## Binary Heaps

{% include learning_objectives.md lesson="Binary Heaps" %}

Compared to binary search trees, 2-3 trees and left-leaning red-black trees provided two solutions to avoiding worst case height. But neither a 2-3 tree nor a left-leaning red-black tree maintain a _perfectly-balanced binary search tree_. A 2-3 tree maintains perfect balance, but needs 3-child nodes. A left-leaning red-black tree is a binary search tree, but it doesn't maintain perfect balance: in the worst case, the left side can be up to double the height of the right side.

How do we even define _perfect balance_? One definition is called **completeness**.

Complete tree
: A tree where every level, except possibly the last level, is completely filled. If the last level is not completely filled, all nodes must be as far left as possible.

It's not easy maintaining a **complete binary search tree**: a tree that simultaneously satisfies all three of the definitions for a _complete tree_, a _binary tree_, and a _search tree_. In the worst case, adding a new element might require moving all its elements to new places.

![Adding to a complete binary search tree]({{ site.baseurl }}{% link assets/images/complete-bst.svg %})

Of the tree data structures that we've studied, our best approaches only satisfy two out of three properties:

2-3 tree
: A tree data structure that satisfies the definitions for a _complete tree_ and a _search tree_, but it is not a _binary tree_.

LLRB tree
: A tree data structure that satisfies the definitions for a _binary tree_ and a _search tree_, but it is not a _complete tree_.

A **binary heap** is the final option in the 3-choose-2 data structure design.

Binary heap
: A tree data structure that satisfies the definitions for a _complete tree_ and a _binary tree_, but it is not a _search tree_.

What can we do with a binary tree without the search tree property? 2-3 trees and LLRB trees provided efficient implementations for sets and maps because of the combination of their search tree property and height invariants. Binary heaps instead implement a different abstract data type called _priority queue_.

### Priority queue abstract data type

The **priority queue** is an abstract data type where elements are organized according to their associated priority values. Priority queues have direct real world applications. For example, they can be used to triage patients in a hospital emergency room. Rather than serving patients first-come, first-served (as in a regular queue), a priority queue can be used to ensure patients with the most severe or time-sensitive conditions are treated first even if someone else arrived earlier.

The min-oriented priority queue `MinPQ` interface supports 3 important operations:

`void add(E element, double priority)`
: Adds the given element with the given priority value.

`E peekMin()`
: Returns the element with the minimum priority value.

`E removeMin()`
: Returns and removes the element with the minimum priority value.

Likewise, the max-oriented priority queue `MaxPQ` could be defined with methods that allow access to the element with the maximum priority value. Priority queues differ from sets in two ways.

1. **Multiple elements can share the same priority value**. For example, two patients can be equally in need of care. Ties between priority value can go either way because either one is an element with the minimum (or maximum) priority value.
1. In some implementations, **duplicate elements are allowed**. This doesn't make sense for the emergency room application since you can't have two copies of a person, but we'll later see some algorithms that rely on storing duplicates.

### Heap invariant

To implement a priority queue, binary heaps maintain a **heap invariant** that depends on whether the heap implements a `MinPQ` or a `MaxPQ`.

Min-heap invariant
: The priority value of each node must be **less than or equal to** the priority values of all its children.

Max-heap invariant
: The priority value of each node must be **greater than or equal to** the priority values of all its children.

{: .hint }
For simplicity, our visualizations will only show the priority value. Implementations of the priority queue abstract data type typically require not just the priority value, but also the element associated with the priority value.

{% include slides.html id="1GewUL8p6ITB-oC_Y3-_80sMWOOfYyEFP8bvxg3zrlHM" aspect_ratio="16/9" %}

Implementing `peekMin` just requires returning the overall root element because the min-heap invariant ensures that the element with the minimum priority value will be stored at the very top of the tree.

Implementing `removeMin`, however, requires more work to maintain the completeness property.

1. Swap the root with the last leaf.
1. Remove the last leaf.
1. Sink the new root to its proper place, promoting the lower-priority child.

{: .hint }
Heaps defined two private helper methods called `sink` (percolate down) and `swim` (percolate up) that are used to restore heap invariants after the removal or addition of an element (respectively). The `sink` method repeatedly swaps the current node with the lower-priority child until heap invariants are restored. The `swim` method repeatedly swaps the current node with its parent until heap invariants are restored.

Finally, the `add` method can be implemented by adding the element to the next open position that maintains completeness before swimming the element to restore heap invariants.

### Array representation

Despite all of this work, it turns out that binary heaps are not any more asymptotically efficient than using a balanced search tree like a 2-3 tree or a left-leaning red-black tree. In practice, the main advantage of using a binary heap to implement a priority queue is due to a way that we can represent the tree using an array.

{% include youtube.html id="3ThF4vKz-Gg" start="50" end="406" aspect_ratio="16/9" %}

Array representation is the default and assumed representation for a binary heap.

Node representation
: Explicitly maintains tree structure through a hierarchy of references.
: Only maintains parent-to-child references, which makes `swim` challenging to efficiently implement.

Array representation
: Implicitly maintains tree structure through a mapping between array indices and tree location.
: Both parent-to-child and child-to-parent indices can be computed using arithmetic.

The following slides and visualizations show a **binary max-heap** where the heap is organized around access to the maximum element at the top of the heap.

{% include slides.html src="https://www.cs.princeton.edu/courses/archive/spring22/cos226/demos/24DemoBinaryHeap/index.html" aspect_ratio="16/9" %}

{: .hint }
> Open the VisuAlgo module to visualize binary max-heap operations. Press `Esc` to exit the e-Lecture Mode. Choose **ExtractMax()** from the bottom left menu and select **1x (Once)** to see the result of removing the element associated with the maximum priority value. The red number under each node represents the index in the array representation of the tree.
>
> [Binary Heap Visualization](https://visualgo.net/en/heap){: .btn .btn-purple target="_blank" }

## Hash Tables

{% include learning_objectives.md lesson="Hash Tables" %}

Java's `TreeSet` and `TreeMap` classes are implemented using red-black trees that guarantee logarithmic time for most individual element operations. This is a massive improvement over linear search: a balanced search tree containing over 1 million elements has a height on the order of about 20!

But it turns out that we can do even better by studying Java's `HashSet` and `HashMap` classes, which are implemented using hash tables. Under certain conditions, hash tables can have **constant time** for most individual element operations---regardless of whether your hash table contains 1 million, 1 billion, 1 trillion, or even more elements.

### Data-indexed integer set case study

{% include youtube.html id="rSqSlu8sEkI" aspect_ratio="16/9" %}

Arrays store data contiguously in memory where each array index is next to each other. Unlike linked lists, arrays do not need to follow references throughout memory. Indexing into an array is a constant time operation as a result.

`DataIndexedIntegerSet` uses this idea of an array to implement a set of integers. It maintains a `boolean[] present` of length 2 billion, one index for almost every non-negative integer. The boolean value stored at each index `present[x]` represents whether or not the integer `x` is in the set.

`void add(int x)`
: Adds `x` to the set by assigning `present[x] = true`.

`boolean contains(int x)`
: Returns the value of `present[x]`.

`void remove(int x)`
: Removes `x` from the set by assigning `present[x] = false`.

While this implementation is simple and fast, it takes a lot of memory to store the 2-billion length `present` array---and it doesn't even work with negative integers or other data types. How might we generalize this concept to support strings?

### Data-indexed string set case study

Let's design a `DataIndexedStringSet` using a 27-element array: 1 array index for each lowercase letter in the English alphabet starting at index 1. A word starting with the letter 'a' goes to index 1, 'b' goes to index 2, 'c' goes to index 3, etc. To study the behavior of this program, let's consider these three test cases.

```java
DataIndexedStringSet set = new DataIndexedStringSet();
set.add("cat");

System.out.println(set.contains("car"));
```

```java
DataIndexedStringSet set = new DataIndexedStringSet();
set.add("cat");

set.add("car");
set.remove("cat");
System.out.println(set.contains("car"));
```

```java
DataIndexedStringSet set = new DataIndexedStringSet();
set.add("cat");

set.add("dog");
System.out.println(set.contains("dog"));
```

Some of the test cases work as we would expect a set to work, but other test cases don't work.

<details markdown="block">
<summary>Which of these test cases will behave correctly?</summary>

Only the third test case works as expected. "cat" and "car" collide because they share the same index, so changes to "cat" will also affect "car" and vice versa. This is unexpected because the set should treat the two strings as different from each other, but it turns out that changing the state of one will also change the state of the other.
</details>

A **collision** occurs when two or more elements share the same index. One way we can avoid collisions in a `DataIndexedStringSet` is to be more careful about how we assign each English word. If we make sure every English word has its own unique index, then we can avoid collisions!

Suppose the string "a" goes to 1, "b" goes to 2, "c" goes to 3, ..., and "z" goes to 26. Then the string "aa" should go to 27, "ab" to 28, "ac" to 29, and so forth. Since there are 26 letters in the English alphabet, we call this enumeration scheme **base 26**. Each string gets its own number, so as strings get longer and longer, the number assigned to each string grows larger and larger as well.

Using base 26 numbering, we can compute the index for "cat" as (3 ∙ 26<sup>2</sup>) + (1 ∙ 26<sup>1</sup>) + (20 ∙ 26<sup>0</sup>) = 2074. Breaking down this equation, we see that "cat" is a 3-letter word so there are 3 values added together:

(3 ∙ 26<sup>2</sup>)
: 3 represents the letter 'c', which is the **3rd** letter in the alphabet.
: 26 is raised to the **2nd** power for the two subsequent letters.

(1 ∙ 26<sup>1</sup>)
: 1 represents the letter 'a', which is the **1st** letter in the alphabet.
: 26 is raised to the **1st** power for the one subsequent letter.

(20 ∙ 26<sup>0</sup>)
: 20 represents the letter 't', which is the **20th** letter in the alphabet.
: 26 is raised to the **0th** power for the zero subsequent letters.

So long as we pick a base that's at least 26, this hash function is guaranteed to assign each lowercase English word a unique integer. But it doesn't work with uppercase characters or punctuation. Furthermore, if we want to support other languages than English, we'll need an even larger base. For example, there are 40,959 characters in the Chinese language alone. If we wanted to support all the possible characters in the Java built-in `char` type---which includes emojis, punctuation, and characters across many languages---we would need base 65536. Hash values generated this way will grow exponentially with respect to the length of the string!

### Separate chaining hash tables

In practice, collisions are unavoidable. Instead of trying to avoid collisions by assigning a unique number to each element, **separate chaining hash tables** handle collisions by replacing the `boolean[] present` with an array of _buckets_, where each _bucket_ can store zero or more elements.

{% include youtube.html id="ix2frc8dHbw" aspect_ratio="16/9" %}

{% include youtube.html id="5caI6XD_YLA" aspect_ratio="16/9" %}

Since separate chaining addresses collisions, we can now use smaller arrays. Instead of directly using the hash code as the index into the array, take the modulus of the hash code to compute an index into the array. Separate chaining turns the process from a single step to multiple steps:

1. Call the **hash function** on the given element to get a **hash code**, aka the number for that element.
1. Compute the **bucket index** by taking the modulus of the hash code by the array length.
1. Search the bucket for the given element.

{% include slides.html id="1WRDUsnt_R0AovH5zxv3CfSHuNOXxBq4Hdd-iNs0lw5M" aspect_ratio="16/9" %}

Separate chaining comes with a cost. The worst case runtime for adding, removing, or finding an item is now in Θ(Q) where Q is the size of the largest bucket.

{% include youtube.html id="KHHi_LVjDLs" aspect_ratio="16/9" %}

In general, the runtime of a separate chaining hash table is determined by a number of factors. We'll often need to ask a couple of questions about the hash function and the hash table before we can properly analyze or predict the data structure performance.

- What is the hash function's likelihood of collisions?
- What is the strategy for resizing the hash table.
- What is the runtime for searching the bucket data structure.

To make good on our promise of a worst case constant time data structure for sets and maps, here's the assumptions we need to make.

- Assume the hash function distributes items uniformly.
- Assume the hash table resizes by doubling, tripling, etc. upon exceeding a constant load factor.
- Assume we ignore the time it takes to [occasionally resize the hash table](https://stackoverflow.com/a/249695).

## Affordance Analysis

{% include learning_objectives.md lesson="Affordance Analysis" %}

In the previous module focusing on implementing tree data structures and studying sorting algorithms, we learned methods for runtime analysis in order to help us evaluate the quality of an idea. The goal of runtime analysis was to produce a (1) _predictive_ and (2) _easy-to-compare_ description of the running time of an algorithm.

For the remaining half of the course, we'll be studying a different category of data structures and algorithms called **graphs**. Unlike the study of tree data structures and sorting algorithms that focused on abstract inputs, the study of graph data structures and graph algorithms is often closely coupled with discussions about real-world data and problems. Runtime analysis will remain an important tool, but we also need methods of analysis to address questions at the intersection of algorithm design and the social responsibility that comes with it.

**Affordance analysis** is a method of analysis that measures which actions and outcomes that an abstraction makes more likely (affordances), and then evaluates the effects of these affordances on people and power hierarchies.

Affordances
: Properties of objects that make specific outcomes _more likely_ through the possible actions that it presents to users. In the context of designed physical objects, for example, a screwdriver _affords_ turning screws (what it was designed for) but also affords other uses like digging narrow holes for planting seeds.
: Likewise, _disaffordances_ are properties that make certain outcomes _less likely_ through the possible actions that it presents to users. A screwdriver _disaffords_ ladling soup.

Affordance analysis is a process composed of two steps. First, identify affordances for the specific outcomes that they make more likely. Then, evaluate affordances according to how they shape social relations in particular applications.

### Identify affordances

**In Java, a `class` or `interface` defines public methods that afford certain actions.** Many of these actions will seem quite value-neutral when defined in isolation from potential applications. For example:

- We can `add`, `remove`, or check for an item at a given index in a list.
- We can `add`, `removeMin`, or `peekMin` from a priority queue according to their priority values.
- In `Autocomplete`, the `allMatches` method returns a list of all terms that match the given prefix.

In "[The Limits of Correctness](https://student.cs.uwaterloo.ca/~cs492/11public_html/p18-smith.pdf)" (1985), Brian Cantwell Smith observes that a "correct" program is really only correct with respect to the programmer's model of the problem:

> When you design and build a computer system, you first formulate a model of the problem you want it to solve, and then construct the computer program in its terms. For example, if you were to design a medical system to administer drug therapy, you would need to model a variety of things: the patient, the drug, the absorption rate, the desired balance between therapy and toxicity, and so on and so forth. The absorption rate might be modelled as a number proportional to the patient's weight, or proportional to body surface area, or as some more complex function of weight, age, and sex.

The choice of which _model_ to use---such as (1) patient weight, (2) body surface area, or (3) weight + age + sex---encodes ideas about what is relevant or irrelevant. The results of software programs are determined by what and how we choose to model the problem.

**Programming** is the manipulation of this model by using calculation to change the rules and representations "_at some particular level of abstraction_ [...] So the drug model mentioned above would probably pay attention to the patients' weight, but ignore their tastes in music." When we choose to use certain data structures or algorithms, we are choosing to the model the problem in a certain way at a _particular level of abstraction_. We decide what is relevant or irrelevant in the model.

For example, we might ask: What are some affordances of comparison sorting algorithms? In comparison sorting, elements are rearranged according to an ordering relation defined by the `compareTo` method. It is assumed that these pairwise comparisons can be used to order all the elements on a line from least to greatest.

{: .hint }
A Science and Technology Studies (STS) perspective might even suggest that sorting in and of itself---before any specific examples are introduced---is value-laden because sorting implies a way to order items on a line. Implementing `compareTo` is like assigning student grades: it takes all the complex dimensions of a human being and reduces them to a number compared against other peoples' numbers. Using a sorting algorithm _requires_ a programmer to select the aspects of an object that are most desirable for the task. This can be especially morally problematic when it is done without consent.

### Value-sensitive design

Data is a key part of affordance analysis. But you might have noticed that your computing education rarely actually considers data on its own merit:

- When verifying the correctness of your programs, we write code that generates dummy data or reads an example dataset without explanation about the data, who or what it aims to represent, and why the data was chosen.
- When analyzing the running time of your programs, data matters to the extent that it helps us in case analysis, asymptotic analysis, or experimental analysis. Data is reduced to variables like _N_ or abstract inputs.

**To evaluate affordances, we will need to think about how each affordance interacts with the world by thinking through more realistic data and problems.**

It helps to understand how managers, designers, and engineers are already thinking about the social implications of technologies. One framework for thinking through design is [**value-sensitive design**](https://vsdesign.org/vsd/) (VSD), a "theory and method that accounts for human values in a principled and structured manner throughout the design process."

Technologies that benefit some people can harm others. Batya Friedman, a Professor in the iSchool and one of the inventors of the method, surfaces this in a value scenario for *SafetyNet*, an imaginary service that helps people avoid "unsafe" areas.

{% include youtube.html id="6HPgN050DIw" start="1897" end="2127" aspect_ratio="16/9" %}

{: .hint }
_SafetyNet_ is not just a hypothetical either. David Ingram and Cyrus Farivar [write for NBC News](https://www.nbcnews.com/tech/tech-news/citizen-public-safety-app-pushing-surveillance-boundaries-rcna1058): "Inside Citizen: The public safety app pushing surveillance boundaries." It wouldn't be hard to imagine a future where [UW Alert](https://www.washington.edu/safety/alert/) partners with a tech company to create an app with functions similar to _SafetyNet_.

This _SafetyNet_ value scenario imagines what the future could hold for different peoples and how the introduction of a technology changes how people behave. Batya's value scenario highlights several different perspectives in evaluating a system by:

1. foregrounding _human **values**_ (what is important to people in their lives),
2. considering the impacts of _pervasive **uptake**_ (adoption, usage) of a technology,
3. and identifying _direct and indirect **stakeholders**_ (people with concern or interest).

What kinds of human values could we consider? Batya suggests, as a starting point: privacy, trust, security, safety, community, freedom from bias, autonomy, identity, ownership, freedom of expression, dignity, calmness, compassion, respect, peace, wildness, sustainability, healing.

One key idea in this framework is the concept of **value tensions**: that human values do not exist in isolation and instead involve a balance between values that can come into tension when considering different individuals, groups, or societies. The goal of thinking through value tensions is to recognize the diverse values that exist in tension and work toward solutions that can engage with all of them.

### Evaluate affordances

Whereas Batya's _SafetyNet_ value scenario focuses more on the large-scale overall product design, in this class, we focus on the details of how programs are implemented. As designers and implementers of interfaces, we might wonder about our responsibility in thinking through social implications.

Earlier, we identified that in the `Autocomplete` interface, the `allMatches` method returns a list of all terms that match the given prefix. Note that the method does not guarantee any particular order of results.

```java
List<CharSequence> allMatches(CharSequence prefix)
```

How might we evaluate autocomplete in Husky Maps using the value-sensitive design perspectives?

Human values
: The list of results produced by autocomplete provides users with everything that matches their search query. But the `Autocomplete` interface does not personalize these results at all: given a search query, everyone sees the same results. There is no parameter or field for storing the personalization information. Results could be more helpful if they were tuned to your profile.
: Personalization, however, is not always a win. Personalization requires personal data that, in some cases, people may not actually want to disclose even if they "Agree" to the terms and conditions of using an app. Also, the value of convenience and helpfulness to the individual user can conflict with the goal of everyone receiving the same information. Hyper-personalized content feeds can lead to two people receiving drastically different information about the world.

Pervasive uptake
: When everyone sees the same results, there can be material impacts if money and attention is directed in ways that reinforce existing social inequities. If everyone follows the same first-few suggestions, then we drive money and attention to those few places. This can also have downstream effects on public policy if it changes our perceptions of what we think of as important or valuable places. For example, public spaces like parks might lose our attention (and, therefore, public funding) if our app never recommended them.

Direct and indirect stakeholders
: We can certainly imagine different situations around who might receive benefits or harms from the pervasive uptake of this technology. You can draw different examples by thinking about how different datasets could lead to different outcomes. Another perspective is to think about who does the work of managing or inputting the data. Is the data on places provided by the government, by individual owners of each place, by volunteers gathering data from the world? How might people want to change how places are represented or named in the app? Who is given the right to make these decisions?

{: .hint }
You could also apply this same set of perspectives but instead focus on sorting the output list. Sorting requires selecting an abstraction for objects so that they can be ordered on a line. Husky Maps sorts autocomplete suggestions [using importance values from the OpenStreetMap project](https://help.openstreetmap.org/questions/24864/how-does-nominatim-determine-importance-of-places). Combining these two pieces of information (the affordances of sorting and the example dataset) can lead to another affordance analysis.

Thinking through each perspective separately can help you assemble a more cohesive argument that considers the different potential impacts of software design. But in your final affordance analysis, you might find that your arguments combine ideas from 2 or all 3 perspectives. This recognizes the interconnectedness between the different ideas in your analysis.

### Beyond value-sensitive design

Value-sensitive design, however, is just one theory or method for evaluating a technology. In _Design Justice_, Sasha Costanza-Chock [critiques VSD](https://designjustice.mitpress.mit.edu/pub/3h2zq86d#hard-coding-liberation-new-developments-in-scholarship-and-practice):

> VSD is descriptive rather than normative: it urges designers to be intentional about encoding values in designed systems but does not propose any particular set of values at all, let alone an intersectional understanding of racial, gender, disability, economic, environmental, and decolonial justice. VSD never questions the standpoint of the professional designer, doesn't call for community inclusion in the design process (let alone community accountability or control), and doesn't require an impact analysis of the distribution of material and symbolic benefits that are generated through design. Values are treated as disembodied abstractions, to be codified in libraries from which designers might draw to inform project requirements. In other words, in VSD we are meant to imagine that incorporating values into design can be accomplished largely by well-meaning expert designers.

VSD helped us think about data and problems on their own merit rather than as abstract concepts. But, in presenting evaluation as a process for designers to just think-through and analyze on their own---without consulting real people---values are treated as abstract concepts rather than situated in real human experiences.

If you'd like to learn more approaches to evaluating affordances, consider taking courses in (1) human--computer interaction, (2) qualitative research methods, or (3) community-engaged research.
