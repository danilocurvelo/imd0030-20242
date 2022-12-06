---
layout: minimal
title: Priority Queues
description: &desc Designing, analyzing, and critiquing priority queues.
summary: *desc
nav_order: 3
# parent: Projects
grand_parent: CSE 373
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

Online social media platforms facilitate the development of social relationships between users by allowing users to create and share content with each other. Most social media platforms rely on algorithms to personalize the content feed presented to each user. This user-generated content requires **moderation**, or methods for managing content shared between users on the platform.

In this project, we will compare 4 implementations of priority queues to simulate a content moderation queue that might be used in a social media platform where content is generated continuously. By the end of this project, students will be able to:

- **Design and implement** multiple data structures to solve complex problems.
- **Analyze and compare** implementation runtimes and interface affordances.
- **Critique and connect** the design of content moderation to information society.

In the next project, we'll also use your priority queues as a building block for shortest paths.

<details markdown="block">
<summary>What am I submitting at the end of this project?</summary>

Satisfactory completion of the project requires a **video-recorded individual presentation that addresses all the green callouts** meeting the following requirements:

- Your presentation should not be much longer than **10 minutes** and should include your voiceover. (Your video is appreciated but not necessary.)
- Your presentation should include some kind of visually-organizing structure, such as slides or a document.
- After submitting to Canvas, add a submission comment linking to your slides or document.
</details>

## Priority queue interface

The `MinPQ` interface represents a priority queue that affords access to minimum-priority items. Priority values are extrinsic to each item: rather than relying on a `compareTo` method, priority values are specified as arguments to the `add` and `changePriority` methods.

`void add(T item, double priority)`
: Adds an item with the given priority value if the item is not already in this priority queue.

`boolean contains(T item)`
: Returns true if the given item is in this priority queue.

`T peekMin()`
: Returns the item with the minimum priority value.

`T removeMin()`
: Returns and removes an item with the minimum priority value.

`void changePriority(T item, double priority)`
: Updates the given item's associated priority value.

`int size()`
: Returns the number of items in this priority queue.

`boolean isEmpty()`
: Returns true if this priority queue contains no items. This is a **default method** that works by calling the `size` method, so implementations do not need to define it.

{: .hint }
A `MinPQ` cannot contain duplicate items. However, different items can have the same priority value. `peekMin` and `removeMin` may return any item with the minimum priority value.

Here's a small example showing how to use the `MinPQ` interface with the `DoubleMapMinPQ` class included in the project. Try it out for yourself by creating a new class in IntelliJ with the following code in the `main` method.

```java
MinPQ<String> pq = new DoubleMapMinPQ<>();
pq.add("1", 1.0);
pq.add("2", 2.0);
pq.add("3", 3.0);
pq.add("4", 4.0);
pq.add("5", 5.0);
pq.add("6", 6.0);

// Call methods to evaluate behavior.
pq.changePriority("3", 0.0);
pq.changePriority("1", 7.0);
while (!pq.isEmpty()) {
    System.out.println(pq.removeMin());
}
```

<details markdown="block">
<summary>Why not just implement Java's PriorityQueue interface?</summary>

The `java.util` standard library includes a binary heap [`PriorityQueue`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/PriorityQueue.html) class. Here are three reasons why we can't implement Java's `PriorityQueue` class in this project.

`PriorityQueue` is a class
: We can't implement the `PriorityQueue` class because it's a _class_, not an _interface_. Although the Java developers designed `Set`, `Map`, and `List` as interfaces, priority queues are so commonly associated with binary heaps that the Java developers broke the pattern and defined `PriorityQueue` as a class.

`PriorityQueue` relies on `compareTo`
: By default, `PriorityQueue` uses elements' `compareTo` method to define the **priority** of an element. For example, the priority of the string "A" is less than "B" because "A" precedes "B" in the alphabet. This makes `PriorityQueue` great for sorting objects, but not great for applications like shortest paths.

`PriorityQueue` disaffords changing priority value
: The fact that `PriorityQueue` uses elements' `compareTo` methods reveals a hidden **disaffordance**. To change the priority of an object in `PriorityQueue`, we need to remove the element from the priority queue and then re-insert it. This workaround is not only inconvenient, but also inefficient and prone to bugs.
</details>

### PriorityNode

Java collections typically only specify a single data type as in `ArrayList<String>`. But a `MinPQ` needs to keep track of each item as well as its associated priority value. We could do this by creating two lists: an `ArrayList<T>` for items and an `ArrayList<Double>` for each item's priority value. However, this approach requires us to ensure the state of both lists are always the same, which introduces additional complexity that makes the code harder to maintain and more brittle or susceptible to future bugs.

The `PriorityNode` class includes two fields representing an `item` together with its `priority` value so that it can be used in a Java collection.

```java
List<PriorityNode<String>> items = new ArrayList<>();
items.add(new PriorityNode<>("example", 0));
```

{: .hint }
Two `PriorityNode` objects are considered equal if and only if their items are equal. Priority values are not checked for equality.

<details markdown="block">
<summary>How will this property of PriorityNode equality help you implement MinPQ?</summary>

`MinPQ` does not allow duplicate items, but does allow duplicate priority values. When using Java collections such as a `List`, methods like `List.contains` or `List.remove` will call `equalsTo` to check for equality. The following `contains` call will return `true`, and the `remove` call will successfully remove the priority node even though their priority values are different.

```java
items.contains(new PriorityNode<>("example", 1));
items.remove(new PriorityNode<>("example", 2));
```
</details>

### Reference implementation

The project code includes a working `DoubleMapMinPQ`. This implementation is called "double map" because it combines the runtime benefits of two maps to solve the problem efficiently. The two maps work together to help achieve **sublinear** (logarithmic or better) runtime for every operation.

`TreeMap`
: Associates each unique priority value to all the items with that priority value. Returning a minimum-priority item involves finding the set of minimum-priority items and picking any item from that set.

`HashMap`
: Associates each item with its priority value in order to speed-up `contains` and `changePriority`.

The state of both maps is synchronized across all methods. Any change to one data structure also requires a change to the other data structure.

## Design and implement

Design and implement 3 implementations of the `MinPQ` interface.

{: .warning }
All team members must work together and fully understand each implementation. Do not assign each implementation to individual team members. The implementations are described in order of increasing complexity so later implementations will require significantly more work.

### UnsortedArrayMinPQ

Items are added to an `ArrayList` in any order. Most operations may need to scan over the entire list.

### HeapMinPQ

A standard binary heap priority queue that delegates all method calls to `java.util.PriorityQueue`. In other words, each `MinPQ` operation is implemented by calling the underlying `PriorityQueue`. This class contains only one field assigned to an instance of `PriorityQueue`.

{: .deliverable }
Explain the part of the `HeapMinPQ` class that you're most proud of programming.

### OptimizedHeapMinPQ

A optimized binary heap priority queue supported by a `HashMap` that associates each item with its array index to speed-up `contains` and `changePriority`. Use the [`MinPQ`](https://github.com/kevin-wayne/algs4/blob/master/src/main/java/edu/princeton/cs/algs4/MinPQ.java) class as a reference.

1. Identify methods in the reference class that are most similar to our interface.
1. Adapt the code to implement our interface. Make sure all tests pass before optimizing the code.
1. Optimize the code by adding a `HashMap` synchronized to the state of the items in the array.

{: .deliverable }
Explain the part of the `OptimizedHeapMinPQ` class that you're most proud of programming.

## Analyze and compare

### Affordance analysis

Sorting presumes that data can be ordered on a line. Priority queues rely on the same presumption, except that items are ordered according to their priority values. In the provided `Moderator` class, messages are entered into an `MinPQ` with "toxicity" scores provided by the [Perspective API](https://perspectiveapi.com/), a machine learning algorithm designed to reduce toxicity online.

[Toxicity scores represent probabilities between 0 and 1](https://developers.perspectiveapi.com/s/about-the-api-training-data) for the predicted likelihood that a human would perceive the comment as "rude, disrespectful, unreasonable, or otherwise somewhat likely to make the user leave a discussion or give up on sharing their perspective."

> For example, a comment like "You are an idiot" may receive a probability score of 0.8 for attribute TOXICITY, indicating that 8 out of 10 people would perceive that comment as toxic.

{: .warning }
Toxicity values are negated before they are added to the `MinPQ`, so each call to `removeMin` will remove the message that is most likely to be toxic.

{: .deliverable }
Give an affordance analysis of `MinPQ` for content moderation when using toxicity scores as the priority value. Identify the affordances of `MinPQ`. Then, evaluate the affordances by applying the three value-sensitive design principles. Your final arguments may combine ideas from 2 or all 3 principles, so it's not necessary to present them separately.

### Asymptotic analysis

{: .deliverable }
Give a big-theta bound for the worst-case runtime of the `removeMin` and `changePriority` methods for each implementation, including `DoubleMapMinPQ`, with respect to *N*, the size of the priority queue. Explain the runtime of each implementation in a couple sentences while referencing the code.

For all array-backed data structures, ignore the time it would take to resize the array.

[`java.util.PriorityQueue`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/PriorityQueue.html) is implemented using an array-representation binary heap that

> provides O(log(n)) time for the enqueuing and dequeuing methods (`offer`, `poll`, `remove()` and `add`); linear time for the `remove(Object)` and `contains(Object)` methods; and constant time for the retrieval methods (`peek`, `element`, and `size`).

`HashSet` and `HashMap` are implemented using resizing separate-chaining hash tables where the number of buckets is always similar to the size. Assume that the hash function evenly distributes elements across the underlying array. The Java implementations include a further optimization.

Tree bucket optimization
: When the [size of a bucket exceeds 8 elements](https://github.com/AdoptOpenJDK/openjdk-jdk11/blob/19fb8f93c59dfd791f62d41f332db9e306bc1422/src/java.base/share/classes/java/util/HashMap.java#L143-L231), the separate chain is automatically converted from a linked list to a red-black tree.

{: .deliverable }
Explain the impact of tree bucket optimization assuming an even distribution of elements across the underlying array. Does the tree bucket optimization help, hurt, or not affect the asymptotic analysis given our assumptions?

## Critique and connect

Unlike traditional news media publications, online platforms are protected under Section 230(c) from civil liability for user-generated content. The [Electronic Frontier Foundation](https://www.eff.org/issues/cda230), a nonprofit organization for digital civil liberties, writes:

> Section 230 says that **"No provider or user of an interactive computer service shall be treated as the publisher or speaker of any information provided by another information content provider"** ([47 U.S.C. § 230](http://www.law.cornell.edu/uscode/text/47/230)). In other words, online intermediaries that host or republish speech are protected against a range of laws that might otherwise be used to hold them legally responsible for what others say and do.

Furthermore, paragraph 2 of the legislation provides platforms protection from liability for their moderation decisions, so platforms are free to do as much or as little moderation as they so choose. Many internet historians agree that Section 230, codified in 1996 at the dawn of the internet age, was a key piece of legislation that enabled the social internet as we know it today. Section 230 made headlines over the 2020 US presidential elections with new [lawsuits](https://arstechnica.com/tech-policy/2021/07/trump-sues-twitter-facebook-and-youtube-in-preposterous-bid-for-reinstatement/) and [antitrust plans](https://arstechnica.com/tech-policy/2021/07/gops-big-tech-plan-ignores-consumers-targets-censorship-of-republicans-instead/), Ars reports.

However, I want to encourage a broader view on content moderation as a practice that defines the social media platform and its relationships to the people that use it. The critique should feel distinct from the affordance analysis in that it "zooms out" even farther to examine the structures of society that led us down the path of needing a content moderation system in the first place. Through critique, we might be able to imagine different foundations for social media platforms. To scaffold your critique, start by skimming UW CSE professor Amy Zhang's talk, [Building technology for society (and all of its complications and messy consequences): case study on automated content moderation](https://social.cs.washington.edu/slides_content_moderation.html). Spend some time pausing and thinking about the questions raised in the "zooming out" yellow-color slides.

![Building technology for society (and all of its complications and messy consequences): case study on automated content moderation](https://social.cs.washington.edu/slides/content_moderation/guestlecture_contentmoderation.001.jpeg)

Synthesize an idea involving least one of the following 3 articles together with a couple additional sources. How do the articles relate to your understanding of the `MinPQ` interface that we designed? How does the author's arguments relate the technology to the distribution of power, benefits, and harms across different people in society? What other questions should we ask about the design of our technology?

**[Custodians of the Internet](http://opentranscripts.org/transcript/custodians-of-the-internet/)**. What are platforms' legal obligations to the public interest? If platforms operate an attention economy, then "content moderation constitutes the platform."

**[To Apply Machine Learning Responsibly, We Use It in Moderation](https://open.nytimes.com/to-apply-machine-learning-responsibly-we-use-it-in-moderation-d001f49e0644)**. Concerns over implicit bias in machine-learning software raised important questions about how New York Times comment moderators can leverage this powerful tool, while also mitigating the risks. What new risks are raised?

**[Who Moderates the Social Media Giants? A Call to End Outsourcing](https://bhr.stern.nyu.edu/tech-content-moderation-june-2020)**. Without content moderation, "platforms would be inundated by harmful content." What are the consequences of outsourcing content moderation to third-party vendors?
