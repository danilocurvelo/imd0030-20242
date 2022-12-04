---
title: Sorting Algorithms
description: &desc Asymptotic analysis, iterative sorts, and merge sort.
summary: *desc
nav_order: 1
parent: Lessons
grand_parent: CSE 373
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

## Asymptotic analysis

{% include learning_objectives.md lesson="Asymptotic Analysis" %}

In your previous programming experience, we focused on **correctness** and **maintainability**---code that produces the expected output given a particular input, and code that is easy to improve or extend in the future. But, as we'll see throughout this course, it's also important that we design programs with a focus on **efficiency** too.

**Asymptotic runtime analysis** is the process of predicting the amount of time an algorithm will take to run on large inputs. The focus on program efficiency for large inputs (as the size of the input approaches infinity, or its _asymptote_) helps us compare different algorithms for solving the same problem. For example, the performance issue in `ArrayListDeque` only appears when a large number of web pages have been stored in browser history; `ArrayListDeque` is quite fast when only a few web pages have been stored. The differences in runtime become more appreciable when the number of items increases.

The goal of asymptotic runtime analysis is to produce a (1) _predictive_ and (2) _easy-to-compare_ description of the running time of an algorithm.

<details markdown="block">
<summary>Why not just record the time it takes for an algorithm to run?</summary>

This idea, called **experimental analysis**, has some drawbacks. For example, experimental analysis relies on having a program already written. What if you want to know which design is more efficient _before_ coding it? Asymptotic analysis can helps us _predict_ the runtime, not just measure it.

It's also not easy to compare the results of an experimental analysis. We need to not only implement the algorithm, but we also have to make choices about what to measure, how to measure it, and infer results based on the data that we collected.
</details>

Consider the `indexOf` method, which returns the index of a `target` number in an `int[] A` or -1 if `target` is not in the array.

```java
static int indexOf(int[] A, int target) {
    for (int i = 0; i < A.length; i += 1) {
        if (A[i] == target) {
            return i;
        }
    }
    return -1;
}
```

The behavior of the `indexOf` algorithm depends on the input values.

1. Initialize an integer index counter, `i`.
1. Loop over the length of the array. On each iteration, if the `A[i]` is the same as the given `target`, return the current index. Otherwise, increment `i`.
1. If no elements in the array are the same as the given `target`, return -1.

### Model the number of steps

{: .note }
**How many steps (or operations) are needed to run the algorithm?** Operations include assignments, boolean evaluations, arithmetic operations, method calls, etc.

Let's take a look at these two assignment statements to illustrate how to count steps.

```java
int a = 4 * 6;
int b = 9 * (a - 24) / (8 - 7);
```

1. The first assignment to `a` takes one step (1) to compute `4 * 6` and another step (2) to assign the result to the variable `a`.
1. The second assignment to `b` takes one step (1) to compute `a - 24`, another step (2) to compute `9 * (a - 24)`, another step (3) to compute `8 - 7`, another step (4) to compute `9 * (a - 24) / (8 - 7)`, and a final step (5) to assign the result to the variable `b`.

In total, these two lines of code take **7 steps** for the computer to run. The first goal of runtime analysis was to produce a _predictive_ description of the runtime of an algorithm, but in this example, there's not much to predict: the two assignment statements always take precisely 7 steps.

`indexOf` is different: it has a loop and an `if` statement that depends on the values in the `A` compared to the `target`.

{: .note }
**How do we model the number of steps it takes to run an algorithm _in general_?**

How do we define the runtime _in general_? Here are some factors that can affect the number of steps to compute `indexOf`.

1. The length of the `A`.
1. The values of each `int` in the `A` compared to the value of the `target`.

The runtime of many algorithms is greatly affected by the size of the input. A small array typically takes little time to run regardless of whether the algorithm is fast or slow. Where we really start to appreciate the differences in runtime is when the array is very large. Therefore, when computer scientists talk about runtime analysis, the default assumption is asymptotic analysis.

**Asymptotic analysis** is a way of evaluating the efficiency of an algorithm on large inputs. The choice for the "large input" is called the **asymptotic variable**. For `indexOf`, the length of the `A` can be the asymptotic variable.

{: .hint }
In this course, we'll usually tell you the asymptotic variable using the phrases, "with respect to" or "in terms of". Asymptotic analysis is defined in terms of the asymptotic variable, so make sure to confirm the asymptotic variable before proceeding to analyze a program.

But we also know that the runtime depends on other factors such as the relationship between the `target` and the numbers in the `A`. **Case analysis** is a way to account for variation in the model based on interactions between other factors besides the asymptotic variable.

Best case `indexOf`
: The **best case** (most efficient or fastest) occurs when the `target` is the same as the `A[0]`---even when the array is very large.

Worst case `indexOf`
: The **worst case** (least efficient or slowest) occurs when the `target` is the same as the last element in the `A` or not even in the `A` at all.

{: .hint }
All other factors not covered by the asymptotic variable are considered in case analysis. In this course, we'll focus only on the best and worst case: take all the remaining factors that you have at your disposal and choose a situation that produces the fastest (best case) or the slowest (worst case) runtime.

Consider the following `dup1` algorithm for determining if `A` contains any duplicate values by checking every possible pair of values until a duplicate is found. We've chosen `N = A.length` as the asymptotic variable.

```java
boolean dup1(int[] A) {
    int N = A.length;
    for (int i = 0; i < N; i += 1)
        for (int j = i + 1; j < N; j += 1)
            if (A[i] == A[j])
                return true;
    return false;
}
```

<details markdown="block">
<summary>Describe a best case situation for the runtime.</summary>

A very long array where the first pair of items `A[0]` and `A[1]` are duplicates!
</details>

Suppose your teammate answer the above question:

> The best case occurs when `A.length` is 2, so we only need to compare `A[0]` to `A[1]`.

<details markdown="block">
<summary>Explain why your teammate's answer is not an asymptotic analysis.</summary>

Although your teammate makes a good observation about the runtime of the program, asymptotic analysis focuses on large inputs. So we can't use an empty, 1-element, or 2-element array in our reasoning.
</details>

We now have a predictive model for the number of steps (a proxy for the time) it takes to run an algorithm. But this model is not easy to compare. To communicate our model, we'll introduce some new vocabulary used to express asymptotic analysis.

### Formalize the runtime model

{: .note }
**How do we express our model to others so that we can communicate results?**

The **order of growth** relates the size of the input to the time that it takes to run the algorithm on that input. Often, we'll use a mathematical variable like _N_ to refer to the asymptotic variable.

Best case `indexOf` orders of growth
: In the **best case**, the order of growth for the runtime of `indexOf` is **constant**.

Worst case `indexOf` orders of growth
: In the **worst case**, the order of growth for the runtime of `indexOf` is **linear** with respect to _N_, the length of `A`.

{: .hint }
When the order of growth is constant, we don't specify "with respect to _N_" because constant order of growth implies that the runtime does not scale with _N_.

Applying this same process to `dup1`, we can describe the runtime model as:

Best case `dup1` orders of growth
: In the **best case**, the order of growth for the runtime of `dup1` is **constant**.

Worst case `dup1` orders of growth
: In the **worst case**, the order of growth for the runtime of `dup1` is **quadratic** with respect to _N_, the length of `A`.

{: .hint }
In the worst case, there are no duplicates in `A`. If we need to go through all the iterations of the nested for loop, then on the first iteration `i = 0`, the inner loop runs from `j = 1` to `j = N`; then from `j = 2` to `j = N`; then from `j = 3` to `j = N`; and so forth. In total, we end up checking `A[i] == A[j]` exactly (_N_ - 1) + (_N_ - 2) + ... + 3 + 2 + 1 times. [The sum of this series](https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF) is about _N_<sup>2</sup> / 2, which is quadratic.

Orders of growth help us compare runtime in terms of words like _constant_, _linear_, and _quadratic_. In practice, though, you'll rarely see computer scientists writing out the full orders of growth sentence. Instead, computer scientists communicate orders of growth using asymptotic notation.

### Asymptotic notation

Asymptotic notation provides precise, mathematical shorthand for orders of growth.

{% include video.html src="https://www.youtube.com/embed/CGdubALgQw4?start=4&end=240" aspect_ratio="16/9" %}

Consider this graph that depicts three functions of _N_.

{: .full-width style="aspect-ratio: 2" }
<iframe src="https://www.desmos.com/calculator/apxggji6kz?embed" frameborder=0></iframe>

<details markdown="block">
<summary>What do the x-axis and the y-axis represent in the graph?</summary>

The x-axis represents the size of the input, _N_. The y-axis represents the model's prediction for the number of steps that the algorithm will require for an input of a given size.
</details>

The three functions depicted in the graph are:

1. The top blue function depicts 5_N_<sup>2</sup>.
1. The middle red function depicts 40 sin(_N_) + 4_N_<sup>2</sup>.
1. The bottom green function depicts 3_N_<sup>2</sup>.
1. The shaded area shows the functions that fall between the top and bottom functions.

This graph provides a visual demonstration of the big-theta definition. We can say that the function 40 sin(_N_) + 4_N_<sup>2</sup> _is in_ Θ(_N_<sup>2</sup>) because because it is bounded below by the green function 3_N_<sup>2</sup> (_k_<sub>1</sub> = 3) and bounded above by the blue function 5_N_<sup>2</sup> (_k_<sub>2</sub> = 5).

{: .hint }
The red function is only "squeezed" between the blue and green functions for _N_ > 6. This is why big-theta is an _asymptotic notation_: its logic applies to all values of _N_ greater than some initial _N_<sub>0</sub>. When we make a claim about asymptotic runtime, we can't just pick _N_ = 1 billion. We have to make sure that our analysis holds true for all possible "large inputs" _N_.

During class, we'll also introduce two other asymptotic notation called big-oh and big-omega.

### How fast is fast enough?

How much faster is a linear time algorithm versus a quadratic time algorithm? A **quadratic time algorithm** (e.g. worst case `dup1`) might have the following real-world runtimes.

- When _N_ = 10, less than 1 second.
- When _N_ = 100, less than 1 second.
- When _N_ = 1,000, about 1 second.
- When _N_ = 10,000, **about 2 minutes**.
- When _N_ = 100,000, **about 3 hours**.
- When _N_ = 1,000,000, **about 12 days**.

<details markdown="block">
<summary>What do you think the bolded times would be for a linear time algorithm?</summary>

A **linear time algorithm** might have the following real-world runtimes.

- When _N_ = 10, less than 1 second.
- When _N_ = 100, less than 1 second.
- When _N_ = 1,000, less than 1 second.
- When _N_ = 10,000, **less than 1 second**.
- When _N_ = 100,000, **less than 1 second**.
- When _N_ = 1,000,000, **about 1 second**.

Comparing an input of _N_ = 1 million, a quadratic time algorithm takes 12 *days* to process whereas a linear time algorithm only takes about 1 *second*. Given the vast amount of data that internet-connected apps might need to process, there are many situations where quadratic time algorithms are unusably slow.
</details>

Key takeaways
: **Many algorithms (including all the algorithms we will learn in this class) are fast on tiny inputs, e.g. when _N_ < 100**. While there may be situations where we care about the efficiency of algorithms processing tiny inputs, these differences are often unnoticeable. When they are noticeable, they may be caused by fluctuations in your computer's workload rather than algorithms themselves. This is why we always default to the assumption of asymptotic analysis.
: **Differences become more appreciable when inefficient algorithms (e.g. quadratic or worse) run on inputs of size _N_ > 1000**. Whether the runtime is tolerable depends on the problem. An inefficient algorithm may be acceptable if some or all of the conditions are true: we only need to run it infrequently, the size of the input is not particularly big, the amount of processing power can compensate for an inefficient algorithm, or there are no better alternatives available.
: **Conversely, efficient algorithms can process massive amounts of data even as _N_ > 1 million**. Computer scientists generally want algorithms that have either linear order of growth or better. More efficient data structures enable more efficient algorithms, which is why "Data Structures and Algorithms" was coined many decades ago.

## Iterative sorts

{% include learning_objectives.md lesson="Iterative Sorts" %}

There are different ways to find duplicates in an array. `dup1` represents one way to solve the problem: exhaustively check all possible pairs of elements and return whether a duplicate exists among them. In the worst case, `dup1` required quadratic time to return an answer.

However, if our array is _sorted_, then returning whether there are duplicates in the array takes much less time in the worst case. In a sorted array, all duplicate items must be stored right beside each other. It turns out that a significant number of problems in computer science get a lot easier and a lot more efficient to solve if we can first sort our data. Without sorting, many of the systems and software that we have today would not be possible purely because things (like duplicate finding) would take far too long to run.

But data doesn't always come to us in a pre-sorted form. How do we sort---rearrange into order---an array of elements?

{% include video.html src="https://www.youtube.com/embed/i2bdV3WfulE?start=618&end=1099" aspect_ratio="16/9" %}

### Sorting definitions

**Sorting** is the problem of rearranging a sequence of elements into non-decreasing order. How do we define the order of elements? For numbers, smaller values appear before larger values in non-decreasing order. But sorting objects are a bit more complicated.

For objects, the implementer of the class is responsible for defining the ordering relation. Just as numbers have a natural definition for less-than, equal-to, and greater-than relationships, the class's `compareTo` method provides a way to specify the relative order of any two elements of that class.

{: .note }
> For example, if we have emails where each `Email` object has a date, sender, and text, the `compareTo` method could be defined like an inbox where emails are sorted only by date.
>
> ```java
> public int compareTo(Email other) {
>     // Compare the date of this email to the date of the other email.
>     return this.date.compareTo(other.date);
> }
> ```
>
> In other situations like searching for all the emails from a particular sender (ignoring date), it might be more helpful to sort by the sender primarily and the text of their message secondarily.
>
> ```java
> public int compareTo(Email other) {
>     // Compare the sender of this email to the sender of the other email.
>     int cmp = this.sender.compareTo(other.sender);
>     if (cmp != 0) {
>         // If the senders are different, return the difference.
>         return cmp;
>     }
>     // Otherwise, the senders are the same, so compare by text content.
>     return this.text.compareTo(other.text);
> }
> ```

<details markdown="block">
<summary>In the email example, where is the compareTo method defined?</summary>

The `compareTo` method for the `Email` class is defined inside the `Email` class by the people who wrote the class. When we talk about sorting algorithms, the author of the sorting algorithm has no idea the exact objects that they're sorting or the ordering relation. A sorting algorithm just calls `compareTo` to determine whether an object shoulud appear before or after another object. Sorting involves repeatedly asking, "Is this object less-than, equal-to, or greater-than this other object?" by repeatedly calling the `compareTo` method.
</details>

A sort is **stable** if it preserves the original order of equivalent keys. Stability can affect the final sorting output when there are two or more items considered equal according to the ordering relation. For basic data types like numbers, stability doesn't matter: any two numbers that share the same numeric value are just the same either way. But for objects like emails, stability can make a big difference. Imagine sorting emails by sender name: you'll often receive many emails from the same sender, so a stable sort for emails will sort by sender name _and_, for each sender name, maintain the relative order of emails in the original order. An unstable sort doesn't guarantee the original order of emails for each person.

So how do we sort an array? In this lesson, we'll introduce two iterative sorting algorithms: selection sort and insertion sort.

{% include video.html src="https://www.youtube.com/embed/NLZHTAXcfpM" aspect_ratio="16/9" %}

### Selection sort

In each iteration, **selection sort** selects the _smallest unsorted item_ and swaps it into its sorted place.

Selection sort has an important invariant that was introduced called **iterative improvement**. We keep track of a _sorted items_ portion at the front of the array and gradually grow the number of _sorted items_. Once the _sorted items_ portion reaches the full length of the array, we're done sorting the array!

<details markdown="block">
<summary>Give an asymptotic runtime analysis of selection sort with respect to the number of items.</summary>

First, consider if there are any other factors besides number of items (the asymptotic variable) that could require further case analysis. In selection sort, there are no other factors that affect the runtime because we always need to scan across the entire _unsorted items_ portion of the array to find the _smallest unsorted item_.

The runtime for selection sort is similar to the runtime for `dup1`, which we described using the summation (_N_ - 1) + (_N_ - 2) + ... + 3 + 2 + 1, which we determined to have a quadratic order of growth. In other words, we can say that selection sort is in Θ(_N_<sup>2</sup>).
</details>

### Insertion sort

In each iteration, **insertion sort** inserts the _next unsorted item_ into the _sorted items_ portion at the front of the array by swapping it left one index at a time until it is in its correct position. Like selection sort, insertion sort is also an iterative improvement sorting algorithm.

<details markdown="block">
<summary>Give an asymptotic runtime analysis of insertion sort with respect to the number of items.</summary>

Unlike selection sort, insertion sort is affected by the order of items. When the input is _already sorted_, insertion sort has a linear order of growth because there are no items that need to be swapped to the left. On the other hand, given a reverse-sorted input, insertion sort needs to perform a very large number of swaps to move each _next unsorted item_ into its correct position. The summation is exactly the same as `dup1` and selection sort, which we determined to have a quadratic order of growth.
</details>

## Merge sort

{% include learning_objectives.md lesson="Merge Sort" %}

**Sequential search** returns the index of an item in an array in worst case linear time by scanning across the array and comparing each item to the target. Although linear time algorithms are much more efficient than quadratic time algorithms, there are many situations where we need to make a large number of searches on a large amount of data.

A **linear time algorithm** like worst case sequential search might have the following real-world runtimes.

- When _N_ = 1 million, about 1 second.
- When _N_ = 10 million, about 10 seconds.
- When _N_ = 100 million, about 100 seconds.

Imagine how differently we would interact with technologies if search results took 100 or more seconds to process. Sorting items is one way to enable more efficient searching.

**Binary search** returns the index of an item in a _sorted array_ in worst case logarithmic time by using the sorted order to discard half the remaining items after each comparison. Instead of checking each item one-by-one from left-to-right in the array, binary search instead starts at the middle of the current problem and compares to the middle item to decide whether the proceed left or right.

{% include video.html src="https://www.youtube.com/embed/RfoP3xULk70?start=11&end=641" aspect_ratio="16/9" %}

```java
public static int binarySearch(int[] sorted, int target) {
    return binarySearch(sorted, target, 0, sorted.length);
}

private static int binarySearch(int[] sorted, int target, int low, int high) {
    if (low > high) {
        return -1;
    }
    int N = high - low;
    int mid = low + (high - low) / 2;
    if (sorted[mid] < target) {
        return binarySearch(sorted, target, mid + 1, high);
    } else if (sorted[mid] > target) {
        return binarySearch(sorted, target, low, mid - 1);
    } else {
        return mid;
    }
}
```

<details markdown="block">
<summary>When does the best case runtime occur for binary search?</summary>

In the best case, the `target` is the exact middle item in the `sorted` array, which can be found in constant time.
</details>

The worst case order of growth for the runtime for `binarySearch` is **logarithmic** with respect to _N_, the `sorted.length`. In each recursive call of the loop, half the remaining items under consideration can be ignored. In other words, the number of recursive calls is given by the answer to the question:

> How many times do we need to divide _N_ by 2 until only 1 element remains?

This is the definition of the **base-2 logarithm**, often written as either log<sub>2</sub> or the shorthand lg.

### Recurrences

The runtime of a recursive program like binary search can be more effectively modeled using recurrence relations. **Recurrence relations** (aka recurrences) are recursive equations that represent the order of growth for a function in two parts: (1) non-recursive work and (2) recursive work. A recurrence relation describing the worst-case asymptotic runtime for binary search is T(N) = T(N / 2) + 1.

T(N) =
: On the left hand side of the equals sign, T(N) refers to the runtime for binary search in terms of the size of the current subproblem, _N_. In the code above, note that `N = high - low`.

T(N / 2) + 1
: On the right hand side of the equals sign, there are two components. The **recursive work** is given by the expression T(N / 2) because binary search makes a single recursive call to itself on a subproblem of half the size. The **non-recursive work** is given by the expression 1 because, ignoring the recursive calls, binary search spends a constant amount of time comparing `sorted[mid] < target`.

One way to solve a recurrence is by **unrolling the recurrence**, an approach that works by plugging the recurrence back into itself.

1. T(N) = T(N / 2) + 1
1. T(N) = [T(N / 4) + 1] + 1
1. T(N) = [[T(N / 8) + 1] + 1] + 1
1. T(N) = [[[T(N / 16) + 1] + 1] + 1] + 1

We can start to see a pattern emerge. The recursive work will eventually go down to T(1) when it eventually calls the base case. Along the way to the base case, a lot of 1's are added together. How many times are we comparing `sorted[mid]` to the `target`? Put another way, we can ask: How many times do we need to divide _N_ by 2 in order to reduce it to the number 1? This is the base-2 logarithm again!

{: .hint }
Earlier, we introduced an important sum that frequently appears when analyzing iterative algorithms: [1 + 2 + 3 + ... + N](https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF) is about _N_<sup>2</sup> / 2, which is quadratic. For recursive algorithms, we'll need to consider how the problem is subdivided into smaller subproblems. In binary search, the subproblem is divided in half each time. The sum of the series [1 + 2 + 4 + 8 + ... + N](https://en.wikipedia.org/wiki/1_%2B_2_%2B_4_%2B_8_%2B_%E2%8B%AF) is about 2_N_, which is linear.

### Recursive merge sort

Both selection sort and insertion sort have worst case quadratic order of growth, and relied on iterative improvement where a _sorted items_ portion was maintained at the front of the sequence at all times. If recursion was able to speed-up searching, perhaps it can also speed up sorting too.

**Merge sort** represents a different approach to sorting based on the idea of recursion. Merge sort's name derives from the **merge** operation, which takes two _sorted arrays_ and returns a _sorted result_ containing all the items in both arrays.

{% include slides.html src="https://docs.google.com/presentation/d/e/2PACX-1vSTbbKZWOb-ebm9ZjDJld6DsHH_eVsANjWn9RXKKlBdWKTu592cry09QMdq8WK6xDJiOVVdp7W_JBDp/embed" aspect_ratio="16/9" %}

Merge sort is a recursive sorting algorithm that can be described as follows.

1. If the array is of size 1, return.
1. Recursively merge sort the left half.
1. Recursively merge sort the right half.
1. Merge the two sorted halves.

{% include video.html src="https://www.youtube.com/embed/Ns7tGNbtvV4?start=78&end=519" aspect_ratio="16/9" %}

The recurrence relation for the runtime of merge sort can be given as T(N) = T(N / 2) + T(N / 2) + N + 1. The first recursive call to T(N / 2) represents the time it takes to merge sort the left half while the second call represents the time it takes to merge sort the right half. But we could also state it more simply as just T(N) = 2T(N / 2) + N because the runtime is the same regardless of which half we're discussing.

### Recurrence diagrams

Unrolling this equation ends up producing a mess of parentheses and brackets, so let's try drawing a recurrence diagram to explain what's going on and use visuals to help organize our analysis. In a **recurrence diagram**, the recursive work is drawn as nodes (with the current subproblem depicted inside the node) while the non-recursive work is drawn beside the node. If we can add up all of the non-recursive work (numbers outside the node), then we've computed the total work done by the algorithm.

Here's an example of a recurrence diagram for merge sort on a 64-element array.

- The top layer takes about 64 units of time merging 2 sorted halves of 32 items each.
- The second layer also takes about 64 units of time merging 4 sorted halves of 16 items each.
- The third layer also takes about 64 units of time merging 8 sorted halves of 8 items each.
- And on and on until the algorithm reaches its base case.

{: style="display: block; margin: auto; max-height: 16em;" }
{% include_relative _images/recurrence-diagram.svg %}

By identifying the pattern in the recurrence diagram, we can see that all the nodes that are on the same layer will take about 64 units of time. Since the entire runtime of merge sort is represented by this diagram, we can find the total time spent by multiplying the number of layers by the time spent on each layer. If we think about the problem more generally in terms of the size of the current subproblem _N_, then:

- Each layer divides _N_ in half until the base case of 1 element. Therefore, there are log<sub>2</sub> N layers.
- Each layer takes about _N_ total non-recursive time.
- Therefore, the runtime of merge sort is in Θ(N log N).

We call this N log N order of growth **linearithmic** (a portmanteau of "linear" and "logarithmic").
