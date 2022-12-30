---
layout: minimal
title: Deques
description: &desc Designing and analyzing double-ended queues.
summary: *desc
nav_order: 1
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

In Java, every variable has a **data type** like `int`, `boolean`, `String`, `List`, or the name of any interface or class defined by a programmer. Data types combine representation and functionality.

Representation
: The specific way that data is stored or represented within the computer.

Functionality
: The actions or operations that determine how we can use the data type.

{: .hint }
For example, we can have an `int x = 373` and a `String s = "373"`. Although they both hold similar content, their representation and functionality are very different. In Java, an `int` can only represent integer numbers within a certain range, whereas a `String` represents data as a sequence of characters. The functionality of the plus operator differs for `x + x` versus `s + s`.

**Abstract data types** are data types that do not specify a single representation of data and only include a specification for the functionality of the data type. In Java, abstract data types are often represented using interfaces like `List`, `Set`, or `Map`. Java provides **implementations** or specific representations of each interface through classes like `ArrayList`, `TreeSet`, or `HashMap`.

A **deque** (pronounced "deck") is an abstract data type representing a **d**ouble-**e**nded **que**ue. Deques are linear collections (like lists, stacks, and queues) optimized for accessing, adding, and removing elements from both the front and the back. Deques differ from lists in that they do not allow elements to be added or removed from anywhere except for the front or the back. This restriction might make it seem like deques are much less useful than lists. Indeed, any problem you can solve using a deque you can also solve using a list!

But usefulness is not the only metric for determining the quality of a program. Imagine you're on a team engineering a [web browser](https://en.wikipedia.org/wiki/Web_browser), and you're working on addressing a performance problem that has been reported in the browser history feature. When a user visits a web page, the page visit is recorded in the browser history by adding the link and the date of visit to the end of an `ArrayList`. But users are reporting that the option to clear-out the history of pages that were visited over 3 months is unusually slow.

In this project, we'll study this performance problem by designing and analyzing different approaches to implement a deque. By the end of this project, students will be able to:

- **Design and implement** node-based and array-based data structures.
- **Analyze and compare** runtimes using asymptotic and experimental analysis.

<details markdown="block">
<summary>Can I work with someone else on this project?</summary>

Although this project requires an individual submission, we welcome collaboration and teamwork in this class. There are very few limits on collaboration in this course; our primary rule is that we ask that you do not claim to be responsible for work that is not yours. If you get a lot of help from someone else or from an online resource, cite it. I believe that there is a lot of value in learning from others, and even in reading others' solutions, so long as you do not deprive yourself (or others) of the opportunity to learn.

We are comfortable doing this because each submission in this class comes in the form of a video that you record. Your video is a demonstration of everything that you learned throughout the process of working on an assignment. Our goal is for students to support each other and find community through this course. The real advantage of taking a course on-campus at a university is to be able to connect with others who share common interests in learning.
</details>

<details markdown="block">
<summary>What am I submitting at the end of this project?</summary>

Satisfactory completion of the project requires a **video-recorded individual presentation that addresses all the green callouts**.

{: .deliverable }
The project instructions contain a lot of details to provide context, clarify common confusions, and help students get started. Your video explanation only needs to address tasks that are described in green callouts like this one.

Your video presentation should meet the following requirements:

- Your presentation should not be much longer than 6 minutes and should include your voiceover. (Your video is appreciated but not necessary.)
- Your presentation should include some kind of visually-organizing structure, such as slides or a document.
- After submitting to Canvas, add a submission comment linking to your slides or document.

We do not ask for your code. Given enough time and support, we're certain you would be able to write a fully-functional program that meets the specification. The goal of this course is to learn how to design program specifications in the first place. Although this doesn't requires fully-functional code, you'll often need to write programs that are close enough to the specification for it to provide a meaningful basis for further analysis and discussion.
</details>

## Deque interface

Interfaces are a useful way to indicate common methods that will be provided by different implementations (Java classes). For example, `List` is an interface with implementations such as `ArrayList` and `LinkedList`. Deques are like lists but without the capability to add, remove, or get elements from anywhere except for the front or the back. For testing purposes, we included a method to get any element by its index in the deque.

Implementations of `Deque` must provide the following methods:

`void addFirst(E element)`
: Adds an element of type `E` to the front of the deque.

`void addLast(E element)`
: Adds an element of type `E` to the back of the deque.

`E get(int index)`
: Gets the element at the given index, where 0 is the front, 1 is the next element, etc.

`boolean isEmpty()`
: Returns true if deque is empty, false otherwise.

`E removeFirst()`
: Removes and returns the element at the front of the deque.

`E removeLast()`
: Removes and returns the element at the back of the deque.

`int size()`
: Returns the number of elements in the deque.

The interface defines a **default method** `isEmpty` that returns `size() == 0`.

### Reference implementation

We've provided a reference implementation that will help us evaluate the performance problem with `ArrayList`. The `ArrayListDeque` class implements `Deque` using an `ArrayList`. The class maintains a single field called `list` that stores all the elements in the deque, where the _i_-th element in the deque is always stored at `list[i]`.

## Design and implement

Unlike your prior programming courses, the focus of this course is not only to build programs that work according to specifications but also to compare different approaches and evaluate the consequences of our designs. In this project, we'll compare the `ArrayListDeque` reference implementation to two other  ways to implement the `Deque` interface: `ArrayDeque` and `LinkedDeque`.

### ArrayDeque

An **array deque** is like an `ArrayList`, but different in that elements aren't necessarily stored starting at index 0. Instead, their start and end positions are determined by two fields called `front` and `back`.[^1]

{% include slides.html id="1c9RdR7fz-CyTH9bHzJ5bhlfmlUHgpC-EK9d3a8PMiuo" aspect_ratio="16/9" %}

{: .hint }
To step back in the slides, click on the slides and press the left arrow key or the backspace key.

[^1]: Josh Hug. 2019. [cs61b sp19 proj1 slides](https://docs.google.com/presentation/d/1XBJOht0xWz1tEvLuvOL4lOIaY0NSfArXAvqgkrx0zpc/edit).

We've provided an `ArrayDeque` class that includes a bug, and a failing test case that causes the bug to emerge. Identify and fix the bug in the `ArrayDeque` class by **changing at least 2 lines of code**. Follow the debugging cycle to address the bug.

1. Review `ArrayDeque` to see how its methods and fields work together to implement `Deque`.
1. Run the `ArrayDequeTests` class inside the `test/deques` folder.
1. Read the test result and review the stack trace (the chain of calls that caused the exception).
1. Review `ArrayDeque` again, this time focusing on methods most relevant to the failing test. You can open the `DequeTests` file and [drag the tab for a side-by-side view](https://www.jetbrains.com/idea/guide/tips/drag-and-dock/).
1. Based on what you know about the bug, develop a hypothesis for the cause of the problem.

For example, we might _hypothesize_ that the problem is caused by the `newIndex` variable inside the `resize` method going outside the bounds of the `newData` array. Gathering information that can confirm or deny this hypothesis can help us zero-in on the problem, leading us to generate another hypothesis or a potential fix to the bug. Debugging is the process of exploring hypotheses, generating potential fixes, trying them out, and learning more information about the problem until we finally identify the root cause of the bug.

{: .hint }
It's easy to lose track of time and get stuck in a deep hole when debugging. Come to office hours, chat with other students, or return after taking a break!

To develop a hypothesis, we can use the debugger to pause the program at any point in time. [Watch this video](https://youtu.be/e7K8CNr3j2w) by one of our TAs, Iris Zhou, to learn more about how to debug your deques in IntelliJ. At each step, compare your thinking to the state of the debugger. If it's a bit hard to understand the state of the debugger, try switching over to the **jGRASP** tab while debugging the program.

{% include youtube.html id="e7K8CNr3j2w" aspect_ratio="1280/777" %}

After you implement a fix that resolves the bug in the `confusingTest`, make sure that it also works with this alternative sequence of tricky removes. Edit the `confusingTest` and swap out the final two code segments for the following code.

```java
// Test a tricky sequence of removes
assertEquals(5, deque.removeLast());
assertEquals(4, deque.removeLast());
assertEquals(3, deque.removeLast());
assertEquals(2, deque.removeLast());
assertEquals(1, deque.removeLast());

int actual = deque.removeLast();
assertEquals(0, actual);
```

{: .deliverable }
Explain your hypothesis for the bug in the `ArrayDeque` class and the lines of code that you changed to address the hypothesis.

### LinkedDeque

Implement the `LinkedDeque` class with the following additional requirements:

1. The methods `addFirst`, `addLast`, `removeFirst`, and `removeLast` must run in constant time with respect to the size of the deque. To achieve this, don't use any iteration or recursion.
1. The amount of memory used by the deque must always be proportional to its size. If a client adds 10,000 elements and then removes 9,999 elements, the resulting deque should use about the same amount of memory as a deque where we only ever added 1 element. To achieve this, remove references to elements that are no longer in the deque.
1. The class is implemented with the help of **sentinel nodes** according to the following invariants. Use the doubly-linked `Node` class defined at the bottom of the `LinkedDeque.java` file.

Invariant
: An property of an implementation that must be true before and after any methods. For example, in an `ArrayList`, the _i_-th element in the list is always stored at `elementData[i]`.

Sentinel node
: A sentinel node is a special node in a linked data structure that doesn't contain any meaningful data and is always present in the data structure, even when it's empty. Because we no longer need to check if the current node is null before accessing it, we can simplify the number of conditions that are needed to implement `LinkedDeque` methods. We recommend using two sentinel nodes to simplify your code, providing access to both the front and the back of the deque.[^2]

{% include slides.html id="1qNaYV6fq-ARyhMGnY5-HJXHG1srNf3R5uofhYiJ80Y0" aspect_ratio="16/9" %}

[^2]: Josh Hug. 2019. [cs61b lec5 2019 lists3, dllists and arrays](https://docs.google.com/presentation/d/1nRGXdApMS7yVqs04MRGZ62dZ9SoZLzrxqvX462G2UbA/edit).

A `LinkedDeque` should always maintain the following invariants before and after each method call:

- The `front` field always references the front sentinel node, and the `back` field always references the back sentinel node.
- The sentinel nodes `front.prev` and `back.next` always reference null. If `size` is at least 1, `front.next` and `back.prev` reference the first and last regular nodes.
- The nodes in your deque have consistent `next` and `prev` fields. If a node `curr` has a `curr.next`, we expect `curr.next.prev == curr`.

{: .hint }
Write down what your `LinkedDeque` will look like on paper before writing code! Drawing more pictures often leads to more successful implementations. Better yet, if you can find a willing partner, have them give some instructions while you attempt to draw everything out. Plan-out and double-check what you want to change before writing any code. The staff solution adds between 4 to 6 lines of code per method and doesn't introduce any additional `if` statements.

To assist in debugging, we've provided a `checkInvariants` method that returns a string describing any problems with invariants (at the time the method is called), or null if there are no problems. You can use this by adding debugging print statements to help you verify a hypothesis. But it can be tedious editing code, moving the line around, and then running it again just to call `checkInvariants` at a different point in time. A better way is by [Using Evaluate Expression and Watches with IntelliJ](https://youtu.be/u5NSgMCkqOg). This allows you to pause the program at any point in time and call `checkInvariants()`.

Lastly, if your first try goes badly, don't be afraid to scrap your code and start over.

{: .deliverable }
Explain the part of the `LinkedDeque` class that you're most proud of programming.

## Analyze and compare

### Asymptotic analysis

In computer science, simpler solutions are typically preferred over more complicated solutions because they're less likely to contain subtle bugs. `ArrayListDeque` provided a simple solution to implementing a deque, but exhibited significantly degraded performance on some methods. How does `ArrayDeque` compare to `ArrayListDeque`?

{: .deliverable }
Give a best-case and worst-case asymptotic runtime analysis for each of `addFirst`, `addLast`, `removeFirst`, and `removeLast` in both `ArrayDeque` and `ArrayListDeque`. Explain the runtime of each implementation in a couple sentences while referencing the code. Summarize your results by explaining why experienced software engineers prefer `ArrayDeque` over `ArrayListDeque` for implementing browser history.

### Experimental analysis

At the bottom of the `DequeTests` class, you'll find a nested class called `RuntimeExperiments`. This nested class defines the code that will be used to evaluate the program's runtime by measuring how long it takes to run on your computer.

Run the deque tests and open the test results. For each implementation's `RuntimeExperiments`, open it to see the average time it takes to make a single call to `addLast` on a deque that already contains `size` number of elements.

Copy and paste each result into its own [Desmos graphing calculator](https://www.desmos.com/calculator) to plot all the points. For each plot, [calculate a line of best fit using Desmos](https://youtu.be/ADaNyIf6NhY) for the time it takes to call `addLast`. Adjust the line of best fit accordingly based on your asymptotic analysis. For example, if you predicted a constant runtime, choose a constant line of best fit.

{: .deliverable }
Compare your plots and lines of best fit for the `addLast` method between all three implementations: `ArrayListDeque`, `ArrayDeque`, and `LinkedDeque`. Then, identify an operation that should show a significant difference between `ArrayListDeque` and the `ArrayDeque`, and modify the `RuntimeExperiments` class so that it measures this difference. Compare your new plots and lines of best fit to confirm that `ArrayDeque` is more efficient than `ArrayListDeque` for your operation.
