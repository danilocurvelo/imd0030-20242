---
layout: minimal
title: Autocomplete
description: &desc Designing and analyzing autocomplete.
summary: *desc
nav_order: 2
parent: Projects
grand_parent: CSE 373
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

**Autocomplete** is a feature that helps a user select valid search results by showing possible inputs as they type. For example, in a map app, autocomplete might allow the user to enter a prefix such as _Sea_ and automatically suggest the city, _Seattle_.

In addition to autocompleting names, places, or things, autocomplete can also be a useful abstraction for implementing DNA subsequence search. Instead of indexing a list of all the city names or places, a DNA data structure can index all the suffixes of a very long DNA sequence. Autocompleting the DNA suffixes enables efficient search across all the DNA substrings for medical applications, genomics, and forensics.

In this project, we will compare 4 implementations (described later) and 2 applications (city search and DNA search) of autocomplete. By the end of this project, students will be able to:

- **Design and implement** tree-based and array-based search data structures.
- **Analyze and compare** runtimes using asymptotic and experimental analysis.

<details markdown="block">
<summary>How are we collaborating on this project?</summary>

Collaboration is required for this project and all future projects. Students may choose teammates from their enrolled quiz section to form a team of 2 or 3 students. If you have a group of 4 people who all want to work together, divide into two teams of 2 students each. If you don't have any teammates in mind, talk to people in class. Whether your team has 2 or 3 students doesn't make a difference in terms of workload because the **projects are designed to be worked on together at the same time**, not divided and assigned to individual team members.

We require teams because this course is predicated on communication. Success in this course is not just about what you bring as an individual contributor, but also how you can deepen a team's collective understanding of a problem. Many questions in this course and in the real world don't admit simple answers. Teamwork helps us learn how to navigate tensions around the values that go into designing, analyzing, and critiquing specifications.
</details>

<details markdown="block">
<summary>What am I submitting at the end of this project?</summary>

Satisfactory completion of the project requires a **video-recorded team presentation that addresses all the green callouts** meeting the following requirements:

- **Each team member needs to present** part of the presentation in order to receive credit for the assignment.
- Your presentation should not be much longer than **7 minutes** and should **include your voiceover**. (Your video is appreciated but not necessary.)
- Your presentation should include some kind of **visually-organizing structure**, such as slides or a document.
- After submitting to Canvas, **add a submission comment** linking to your slides or document.
</details>

## Autocomplete interface

Implementations of `Autocomplete` must provide the following methods:

`void addAll(Collection<? extends CharSequence> terms)`
: Adds all the terms to the autocompletion dataset. Each term represents a possible autocompletion search result. Behavior is not defined if duplicate terms are added to the dataset.

{: .hint }
> [`Collection`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collection.html)
> : The parent interface to lists and sets in Java. Using `Collection` rather than `List` lets clients use _any_ list or set or other collection that they've already created in their program.
>
> [`CharSequence`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/CharSequence.html)
> : An interface that generalizes the concept of a `String` of characters. Using `CharSequence` rather than `String` lets clients define specialized implementations for long strings like DNA.
>
> `Collection<? extends CharSequence>`
> : The type of the parameter, read: a `Collection` of any type of elements that extend `CharSequence`. The `? extends` lets clients call the method with a `Collection<String>` or a `Collection<SuffixSequence>` instead of having to strictly use a `Collection<CharSequence>`.

`List<CharSequence> allMatches(CharSequence prefix)`
: Returns a list of all terms that begin with the same characters as the given prefix.

Given the terms [alpha, delta, do, cats, dodgy, pilot, dog], `allMatches("do")` should return [do, dodgy, dog] in any order. Try this example yourself by writing a new test case in the `AutocompleteTests` class. You can write additional test cases like this to assist in debugging.

```java
@Test
void compareSimple() {
    List<CharSequence> terms = List.of(
        "alpha", "delta", "do", "cats", "dodgy", "pilot", "dog"
    );
    Autocomplete testing = createAutocomplete();
    testing.addAll(terms);

    CharSequence prefix = "do";
    List<CharSequence> expected = List.of("do", "dodgy", "dog");
    List<CharSequence> actual = autocomplete.allMatches(prefix);

    assertEquals(expected.size(), actual.size());
    assertTrue(expected.containsAll(actual));
    assertTrue(actual.containsAll(expected));
}
```

### Reference implementation

The project code includes a fully functional `TreeSetAutocomplete` implementation that stores all the terms in a `TreeSet`. The class contains a single field for storing the underlying `TreeSet` of terms. Rather than declare the field as a `Set`, we've chosen to use the more specialized subtype `NavigableSet` because it includes helpful methods that can be used to find the first term that matches the prefix.

```java
private final NavigableSet<CharSequence> elements;
```

The constructor assigns a new `TreeSet` collection to this field. In Java, `TreeSet` is implemented using a red-black tree, a type of balanced search tree where access to individual elements are worst-case logarithmic time with respect to the size of the set. `CharSequence::compare` tells the `TreeSet` to use the natural dictionary order when comparing any two elements.

```java
public TreeSetAutocomplete() {
    elements = new TreeSet<>(CharSequence::compare);
}
```

{: .hint }
If you've ever used a `TreeSet<String>`, you might be surprised to see the argument `CharSequence::compare`. This is not necessary for `TreeSet<String>`, but it is necessary for `TreeSet<CharSequence>` because `CharSequence` does not implement `Comparable<CharSequence>`. You can [read more in the Java developers mailing list](https://bugs.openjdk.org/browse/JDK-8137326?focusedCommentId=13889936&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-13889936).

The `addAll` method calls [`TreeSet.addAll`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeSet.html#addAll(java.util.Collection)) to add all the terms to the underlying `TreeSet`.

```java
@Override
public void addAll(Collection<? extends CharSequence> terms) {
    elements.addAll(terms);
}
```

The `allMatches` method:

1. Ensures the prefix is valid. If the prefix is `null` or empty, returns an empty list.
1. Finds the first matching term by calling [`TreeSet.ceiling`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeSet.html#ceiling(E)), which returns "the least element in this set greater than or equal to the given element, or `null` if there is no such element."
1. Collects the remaining matching terms by iterating over the [`TreeSet.tailSet`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeSet.html#tailSet(E)), which is "a view of the portion of this set whose elements are greater than or equal to `fromElement`."
1. If we reach a term that no longer matches the `prefix`, returns the list of results.

```java
@Override
public List<CharSequence> allMatches(CharSequence prefix) {
    List<CharSequence> result = new ArrayList<>();
    if (prefix == null || prefix.length() == 0) {
        return result;
    }
    CharSequence start = elements.ceiling(prefix);
    if (start == null) {
        return result;
    }
    for (CharSequence term : elements.tailSet(start)) {
        if (Autocomplete.isPrefixOf(prefix, term)) {
            result.add(term);
        } else {
            return result;
        }
    }
    return result;
}
```

{: .hint }
> In Java, a **view** is a clever way of working with a part of a data structure without making a copy of it. For example, the `ArrayList` class has a [`subList`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/ArrayList.html#subList(int,int)) method with the following method signature.
>
> ```java
> public List<E> subList(int fromIndex, int toIndex)
> ```
>
> `subList` returns another `List`. But instead of constructing a new `ArrayList` and copying over all the elements from the `fromIndex` to the `toIndex`, the Java developers defined a `SubList` class that provides a slice of the data structure using the following fields (some details omitted).
>
> ```java
> private static class SubList<E> implements List<E> {
>     private final ArrayList<E> root;
>     private final int offset;
>     private int size;
> }
> ```
>
> The `SubList` class keeps track of its `ArrayList root`, an `int offset` representing the start of the sublist, and the `int size` of the sublist. The sublist serves as an intermediary that implements `get(index)` by checking that the index is in the sublist before returning the offset index.
>
> ```java
> public E get(int index) {
>     if (index < 0 || index >= size) {
>         throw new IndexOutOfBoundsException();
>     }
>     return root.elementData[offset + index];
> }
> ```

## Design and implement

Design and implement 3 implementations of the `Autocomplete` interface.

{: .warning }
All team members must work together and fully understand each implementation. Do not assign each implementation to individual team members. The implementations are described in order of increasing complexity so later implementations will require significantly more work.

### SequentialSearchAutocomplete

Terms are added to an `ArrayList` in any order. Because there elements are not stored in any sorted order, the `allMatches` method must scan across the entire list and check every term to see if it matches the `prefix`.

### BinarySearchAutocomplete

Terms are added to a sorted `ArrayList`. When additional terms are added, the entire list is re-sorted using [`Collections.sort`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collections.html#sort(java.util.List,java.util.Comparator)). Since the terms are in a list sorted according to natural dictionary order, all matches must be located in a contiguous sublist. [`Collections.binarySearch`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collections.html#binarySearch(java.util.List,T,java.util.Comparator)) can find the start index for the first match. After the first match is found, we can collect all remaining matching terms by iterating to the right until it no longer matches the prefix.

```java
List<CharSequence> elements = new ArrayList<>();
elements.add("alpha");
elements.add("delta");
elements.add("do");
elements.add("cats");

System.out.println("before: " + elements);
Collections.sort(elements, CharSequence::compare);
System.out.println(" after: " + elements);

CharSequence prefix = "bay";
System.out.println("prefix: " + prefix);
int i = Collections.binarySearch(elements, prefix, CharSequence::compare);
System.out.println("     i: " + i);
```

{: .hint }
> This program produces the following output.
>
> ```
> before: [alpha, delta, do, cats]
>  after: [alpha, cats, delta, do]
> prefix: bay
>      i: -2
> ```
>
> The index `i` is negative because `Collections.binarySearch` [returns a negative value](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collections.html#binarySearch(java.util.List,T,java.util.Comparator)) to report that an exact match for the prefix was not found in the sorted list.
>
> Returns
> : the index of the search key, if it is contained in the list; otherwise, `(-(insertion point) - 1)`. The _insertion point_ is defined as the point at which the key would be inserted into the list: the index of the first element greater than the key, or `list.size()` if all elements in the list are less than the specified key. Note that this guarantees that the return value will be `>= 0` if and only if the key is found.
>
> Since the prefix often will not exactly match an element in the list, we can use algebra to recover the _insertion point_. The `start` value represents the index of the first term that could match the prefix.
>
> ```java
> int start = i;
> if (i < 0) {
>     start = -(start + 1);
> }
> ```

{: .deliverable }
Explain the part of the `BinarySearchAutocomplete` class that you're most proud of programming.

### TernarySearchTreeAutocomplete

Terms are added to a ternary search tree using the [`TST`](https://github.com/kevin-wayne/algs4/blob/master/src/main/java/edu/princeton/cs/algs4/TST.java) class as a reference.

1. Skim the `TST` class. What do you notice will work for `Autocomplete`? What needs to change?
1. Identify methods in the `TST` class that are most similar to `Autocomplete`.
1. Adapt the code to implement the `Autocomplete` interface.

{: .hint }
Don't copy and paste code! Most of the time, we will need to make many changes, and we might introduce subtle bugs when we copy code that we don't fully understand. Instead, rewrite the code in your own words after making sense of the purpose of each line. We often don't need all the lines of code, and the code can be rewritten in ways that are more suitable for the problem at hand.

It's okay if your `TernarySearchTreeAutocomplete` throws a `StackOverflowError` when running the `DNASearch` class. This is caused by Java's built-in limit on recursive depth. There are different ways to work around this limit, but it's not relevant to this project.

{: .deliverable }
Explain the part of the `TernarySearchTreeAutocomplete` class that you're most proud of programming.

## Analyze and compare

### Asymptotic analysis

{: .deliverable }
Give a big-theta bound for the worst-case runtime of the `addAll` and `allMatches` methods for each implementation, including `TreeSetAutocomplete`, with respect to _N_, the total number of terms **already stored in the data structure**. Explain the runtime of each implementation in a couple sentences while referencing the code.

As you perform your asymptotic analysis, make sure to carefully read through and keep in mind the assumptions and hints given below.

What does the underlying data structure look like in the worst case? How are terms organized? Based on that worst case, analyze the runtime of operations performed on that data structure.

`addAll`
: Assume a constant number of terms are added to a dataset that already contains _N_ terms.
: Assume that arrays can accommodate all the new terms without resizing.
: `Collections.sort` uses Timsort, an optimized version of merge sort with runtime in [O(_N_ log _N_)](https://drops.dagstuhl.de/opus/volltexte/2018/9467/) where _N_ is the size or length of the collection or array.

`allMatches`
: Consider the relationship between the added terms and the prefix. How many matches will we have if all the terms in the dataset begin with _A_ and the prefix is _A_? How many matches will we have if all the terms in the data set begin with _B_ and the prefix is _A_?

Assume all strings have a constant length. `TreeSet` is implemented using a red-black tree, which has the same asymptotic runtime as a left-leaning red-black tree or a 2-3 tree.

### Experimental analysis

{: .deliverable }
Compare the runtimes across all 4 implementations, including `TreeSetAutocomplete`. Are certain algorithms faster than others? Are there any disagreements between the runtimes you hypothesized in asymptotic analysis and the runtimes you observed in your experimental graphs? Describe how differences between the theoretical assumptions made for asymptotic analysis and the actual settings in `RuntimeExperiments` might explain those disagreements. For `allMatches`, describe how the default prefix affects the experimental analysis.

Run the provided `RuntimeExperiments` to compare the real-world runtime of each implementation. For each implementation, `RuntimeExperiments` constructs an empty instance and records the number of seconds to add _N_ terms to the dataset and then compute all matches for the `prefix` (such as _Sea_).

- The first column denotes _N_, the total number of terms.
- The second column denotes the average runtime for `addAll` in seconds.
- The third column denotes the average runtime for `allMatches` in seconds.

Copy-paste the text into plotting software such as [Desmos](https://www.desmos.com/calculator). Plot the runtimes of all 4 implementations on `addAll` and `allMatches`.

## Apply and Extend

Now that you've completed 3 implementations of the Autocomplete interface and analyzed its methods both asymptotically and experimentally, you've not only gotten a sense of how Autocomplete in a search engine might be implemented, but have gained a stronger understanding of how different trees optimize for storing and finding information!

Here are a variety of ways we've put together in which you might continue exploring and expanding on your knowledge of Autocomplete and trees!

- **Project Ideas.** Wordscapes!
- **LeetCode.** Count of Range Sum can be solved using a type of binary tree called a Segment Tree.
- **TrieSearchTreeAutocomplete.** If you enjoyed the challenge of implementing and adapting code for the TST and wanted to trie one more implementation, we've provided some resources and starter code for implementing a Trie as well.
- **More connections.**
    - **Predictive Text and Machine Learning.** Our `Autocomplete` implementation outputs all the matching terms from a pre-existing dataset, but machine learning can help us take into consideration other factors that make a predicted term more likely to be typed next.
    - **“Can Large Scale Information Access Systems Be Made Fair, Unbiased, and Transparent?”** -- a UW Data Science Seminar talk by Chirag Shah.

### Project Ideas: Wordscapes

One way to display what you have learned throughout this Autocomplete project is to create your own Wordscapes game! Wordscapes is an app that has multiple levels where you try to fill out a crossword puzzle using only the letters provided. One of the attributes of this game is that, although a set of words can create several valid words, only a select few are considered to fill out the puzzle (perfect place to use isTerm). You can choose an implementation that you feel is most appropriate for the game and also create your own list of words to use for the crosswords you create. This is an awesome way to show future employers you know how to choose the most ideal implementation for a certain situation and use your creativity to utilize it!

### LeetCode: Count of Range Sum

This problem is directly taken from Leetcode problem 327: Count of Range Sum - [https://leetcode.com/problems/count-of-range-sum/](https://leetcode.com/problems/count-of-range-sum/).

**Problem Statement:**

Given an integer array `nums` and two integers `lower` and `upper`, return the *number of range sums that lie in `[lower, upper]` inclusive*.

Range sum `S(i, j)` is defined as the sum of the elements in nums between indices `i` and `j` inclusive, where `i <= j`.

**Example 1:**
```
Input: nums = [-2,5,-1], lower = -2, upper = 2
Output: 3
Explanation: The three ranges are: [0,0], [2,2], and [0,2] and their respective sums are: -2, -1, 2.
```

**Example 2:**
```
Input: nums = [1], k = 1
Output: [1]
```

**Constraints:**
- `1 <= nums.length <= 105`
- `-104 <= nums[i] <= 104`
- `1 <= k <= nums.length`

**Prerequisite Knowledge:**

In order to build a solution for this Leetcode problem, it is essential to understand a data structure called a [Segment Tree](https://en.wikipedia.org/wiki/Segment_tree).

- A Segment Tree is a tree data structure (looks just like a binary tree) for storing intervals, or segments.
- It allows for faster querying operations in these intervals or segments.
- For instance, if we were to find the min value within a segment or interval of an array, Segment Trees can handle such a situation in a very efficient manner.

Watch the video below in order to get a comprehensive understanding and overview of the Segment Tree data structure. The video covers everything you will need in order to come up with a Segment Tree approach solution for the Leetcode problem discussed above.

{% include youtube.html id="rc1HEFA3VwA" aspect_ratio="1280/777" %}

Now that you've watched the video, here is what you should have a decent understanding of in order to solve the LeetCode problem:

- How a Segment Tree is useful in order to solve range query questions.
- How a Segment Tree works to solve range query questions.
- Pseudocode to move from an initial array to an array representation of a Segment Tree (keeping in mind the visualization of a Segment Tree).
- Pseudocode to run a range query given an array representation of a Segment Tree.

Assuming we have a decent understanding of the 4 bullet points mentioned above, go ahead and try to think of ways a Segment Tree can be used to address this Leetcode problem. The video uses finding a min value as an example, while the Leetcode problem asks for the sum.

Feel free to look through the Solution code after trying the Leetcode problem out yourself!

<details markdown="block">
<summary>Solution Code:</summary>

```java
class Solution {

    /**
     * First, we have to make a SegmentTreeNode Class in order to work with and use
     * concepts of Segment tree learned in the previous knowledge section!
     */
    class SegmentTreeNode {
        SegmentTreeNode left; // Left Node
        SegmentTreeNode right; // Right Node
        int count; // Number of sub ranges under a SegmentTreeNode
        long min;
        long max;

        // Constructor
        public SegmentTreeNode(long min, long max) {
            this.min = min;
            this.max = max;
        }
    }

    /**
     * This method should be fairly similar to the psuedocode introduced in the previous
     * knowledge video. We are essentially trying to build the segmentTreeArray from the
     * initialArray!
     */
    private SegmentTreeNode buildSegmentTree(Long[] valArr, int low, int high) {
        if(low > high) {
            return null;
        }
        SegmentTreeNode stn = new SegmentTreeNode(valArr[low], valArr[high]);
        if(low == high) {
            return stn;
        }
        int mid = (low + high)/2;
        stn.left = buildSegmentTree(valArr, low, mid);
        stn.right = buildSegmentTree(valArr, mid+1, high);
        return stn;
    }

    /**
     * In this method, all that we are really doing is updating the value of 'count'
     * with respect to where we are in the segmentTree!
     */
    private void updateSegmentTree(SegmentTreeNode stn, Long val) {
        if(stn == null) {
            return;
        }
        if(val >= stn.min && val <= stn.max) {
            stn.count++;
            updateSegmentTree(stn.left, val);
            updateSegmentTree(stn.right, val);
        }
    }

    /**
     * This method too should be extremely similar to the psuedocode introduced in the video.
     * We are trying to perform the actual range query aspect of this problem!
     */
    private int getCount(SegmentTreeNode stn, long min, long max) {
        if(stn == null) {
            return 0;
        }
        if(min > stn.max || max < stn.min) {
            return 0;
        }
        if(min <= stn.min && max >= stn.max) {
            return stn.count;
        }
        return getCount(stn.left, min, max) + getCount(stn.right, min, max);
    }

    /**
     * Now for the actual method, this method returns the number of range sums that lie between
     * the inputed interval with the help of all the private methods we made earlier that
     * dealt with manipulating a segment tree!
     */
    public int countRangeSum(int[] nums, int lower, int upper) {

        // Base Case!
        if (nums == null || nums.length == 0) {
            return 0;
        }

        // Initialize the final answer we will return!
        int ans = 0;

        // Initialize a Set! We use a set because all that we care about is keeping track of the
        // range of the sum. We do not care about duplicates!
        Set<Long> valSet = new HashSet<Long>();

        // Use Long to prevent overflow!
        long sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += (long) nums[i];
            valSet.add(sum);
        }

        // At this point, it is important to understand that your valSet contains all sum of
        // range(i, j) where i = 0 and j from 0 to nums.length - 1!

        Long[] valArr = valSet.toArray(new Long[0]);

        // We are sorting here because we will be extracting the range of sum!
        Arrays.sort(valArr);

       /*
        * Finally we use Segment Tree and its underlying concept to find the range sum!
        * SegmentTreeNode root = buildSegmentTree(valArr, 0, valArr.length-1);
        *
        * Before manipulating the SegmentTree, here is how you would want to visualize
        * it: You have a binary tree, each node contains a range formed by the "min" and "max".
        * The "min" of a parent node is determined by the minimum lower boundary of all its
        * children. The "max" is determined by the maximum upper boundary of all its children.
        *
        * NOTE: The boundary value must be a sum of a certain range(i, j), and values between
        * min and max may not correspond to a valid sum!
        */
        for (int i = nums.length-1; i >= 0; i--) {

            /*
             * This private method call will update nodes' count value by pushing 1 if the node
             * contains range [sum(0, i)]. Each leaf of the segment tree contains
             * range[sum[0,i], sum[0,i]], where i ranges from 1 to nums.length.
             * Which means, we will definitely find the leaf if we search from the root of
             * the tree.
             * And during the process of finding this leaf node, we update every node's
             * count value by 1 as it must contain the leaf's range by definition!
             */
            updateSegmentTree(root, sum);

            // Doing this enables our sum of range to be (0, i-1) which serves as the initial
            // base for performing range query on the Segment Tree.
            sum -= (long) nums[i];

            /*
             * Get Count method will return how many valid subranges under [sum + lower, sum
             * + upper] exist. We add sum to range[lower, upper] as we want it to search the
             * ranges fromed by all ranges starting from i - 1.
             *
             * For instance, if sum is 0, the method would look like getCount(root, 0 + upper).
             * Which will return number of valid ranges formed by sum(0, j).
             * However, we still need the number of valid ranges fromed by sum(i, j) where i is
             * not 0, which is what Line 109 takes care of.
             */
            ans += getCount(root, (long)lower+sum, (long)upper+sum);
        }

        // finally return ans!
        return ans;
    }
}
```
</details>

### TrieSearchTreeAutocomplete

#### Design and Implement

In lecture, we compared and contrasted the Ternary Search Tree and Trie implementations. Like a TST, a Trie can also be used to implement our Autocomplete interface!

Using this example [`TrieST`](https://github.com/kevin-wayne/algs4/blob/2a3d7f7a36d76fbf5222c26b3d71fcca85d82fc1/src/main/java/edu/princeton/cs/algs4/TrieST.java#L50-L267) class, identify and adapt relevant portions of the code to implement the `Autocomplete` interface. Most of the code in the [`TrieST`](https://github.com/kevin-wayne/algs4/blob/2a3d7f7a36d76fbf5222c26b3d71fcca85d82fc1/src/main/java/edu/princeton/cs/algs4/TrieST.java#L50-L267) class is not needed for implementing `Autocomplete`.

Here is a file containing some starter code and a Trie node class to get you started.

<details markdown="block">
<summary>TrieSearchTreeAutocomplete.java</summary>

```java
package autocomplete;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class TrieSearchTreeAutocomplete implements Autocomplete {
    /**
     * The number of total characters in extended ASCII.
     */
    private static final int R = 256;
    /**
     * The overall root of the tree: the first character any autocompletion term added to this tree.
     */
    private Node overallRoot;

    /**
     * Constructs an empty instance.
     */
    public TrieSearchTreeAutocomplete() { overallRoot = null; }

    @Override
    public void addAll(Collection<? extends CharSequence> terms) {
        // TODO: Replace with your code
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<CharSequence> allMatches(CharSequence prefix) {
        // TODO: Replace with your code
        throw new UnsupportedOperationException("Not implemented yet");
    }

    /**
     * A trie search tree node representing the nth character in an autocompletion term.
     */
    private static class Node {
        private boolean isTerm;
        private Node[] children;

        private Node() {
            this.isTerm = false;
            this.children = new Node[R];
        }
    }
}
```
</details>

In contrast to a `TST`, which maintains left/middle/right children to store strings, each node in a `Trie` maintains its own `Node[]` array, where each index may store a reference to another `Node[]`. Each index in the array corresponds to exactly one ASCII character (ex: a lower case "a" is at the decimal number 97). This implementation makes use of [extended ASCII](https://en.wikipedia.org/wiki/Extended_ASCII), which gives us access to 256 characters rather than the typical 128.

Here are some tips and tricks to help you keep trie-ing if you find yourself getting stuck:

<details markdown="block">
<summary>Trie logistics:</summary>

- In your `TST` class, the left/mid/right fields of a node are initially null, but in the `Trie` class, the children field of a node is initialized with an empty array of 256 buckets. This is intentional! For example, in the string "sells", the last "s" in the string is represented as a pointer from index 18 to a new `Node[]` array. In fact, every string ends in a new, empty `Node[]` array.
- Since the pointer rather than the array itself indicates if we're "using" a character (ex: a pointer from index 18 means we're using "s"), the end of a term is at the empty array being pointed to rather than the array you're pointing from.
- Since our `Node[]` arrays have 256 indices, you don't need to do any work to convert a char to its corresponding decimal representation, Java will implicitly do this for you!
```java
public class Fridge {
    private static final int R = 256;

    public static void main(String[] args) {
        String[] fridge = new String[R];

        // Each char can be used in place of its equivalent
        // decimal value to access indices of an array!
        fridge['a'] = "milk"; // a = 97
        fridge['b'] = "eggs"; // b = 98

        print(fridge);

        // Now, let's access the same buckets and swap out our
        // items using decimal values
        fridge[97] = "cheese";
        fridge[98] = "chicken";

        print(fridge);
    }

    public static void print(String[] arr) {
        // Notice that we can use char types to iterate through
        // an array as well!
        for (char i = 0; i < R; i++) {
            String item = arr[i];
            if (item != null) {
                System.out.println(item + " at index " + (int) i);
            }
        }
        System.out.println();
    }
}
```
</details>

<details markdown="block">
<summary>Debugging Tips:</summary>

- Use the [Trie Visualization](https://www.cs.usfca.edu/~galles/visualization/Trie.html) to see what you expect your tree to look like! Using the `SimpleExample` class may be an easier way to debug `addAll` and `allMatches`.
-  A lot of your `Trie` class will be very structurally similar to your `TST` class! If you get lost in the example `Trie` code, look back to your `TST` class as a reference for the methods used and the structure of the code.
- While the jGRASP debugger can't visualize an entire Trie, it may still be useful for viewing your `overallRoot` array. If your string starts with an "a", you should expect to find something at the corresponding index 97.
</details>

#### Analyze and Compare

In section, we explained why a `TST` has a worst-case runtime of Θ(N+L) and a `Trie` has a worst-case runtime of Θ(L), where N is the number of strings in our data structure, and L is maximum length of a string.

Now that you've implemented both a `TST` and a `Trie`, try running `RuntimeExperiments` on both of them and seeing if these theoretical runtimes hold!

### More Connections

#### Predictive Text and Machine Learning

Have you ever tried turning on predictive text on your phone, typing in a single word, and then clicking whatever your phone suggests to see what kind of story it creates?

Our version of `Autocomplete` uses strings from pre-existing datasets of city names and DNA sequences to find matches with a given prefix. It then outputs all of the matching terms in a sometimes arbitrary order. Predictive text goes beyond just outputing all pre-existing matching terms, but also takes into consideration what's relevant to the user and what's likely based on previous text patterns.

Implementing text prediction involves tools from machine learning, natural language processing, and deep learning that are beyond the scope of this course, but if you're interested in learning more about these topics, here are some resources you may find interesting!

{: .hint }
> If you're interested in learning more about machine learning, [CSE 416](http://courses.cs.washington.edu/courses/cse416/) is a great course to take next (CSE 446 for CS majors, STAT 435 for Statistics). You can continue onto [CSE 490 G1](https://courses.cs.washington.edu/courses/cse599g1/18au/) or LING 574 afterwards to learn about deep learning. If you're interested in the NLP/Computational Linguistics side of the equation, check out LING/CSE 472 or CSE 447.

- [Predictive Text Keyboard using Markov Chains.](https://www.youtube.com/watch?v=WypWvaCw3zs) Here's a short 5 minute video explaining how a predictive text keyboard can be implemented using Markov Chains!
- [Simple Explanation of LSTM | Deep Learning.](https://www.youtube.com/watch?v=LfnrRPFhkuY) This video gives a conceptual overview of a type of neural network that can take those initial words as inputs to predict what words will come later.
- [Next Word Prediction with NLP and Deep Learning.](https://towardsdatascience.com/next-word-prediction-with-nlp-and-deep-learning-48b9fe0a17bf) A tutorial article on implementing next word prediction that takes you from pre-processing the dataset to producing prediction. Understanding the details will require more knowledge of deep learning and neural networks, but it may still be interesting to skim over it to see if this is something you'd be interested in learning more about!
- [Making a Predictive Text Keyboard using Recurrent Neural Networks.](https://medium.com/@curiousily/making-a-predictive-keyboard-using-recurrent-neural-networks-tensorflow-for-hackers-part-v-3f238d824218) Part of a seven part series of articles introducing you to neural networks.

#### [“Can Large Scale Information Access Systems Be Made Fair, Unbiased, and Transparent?”](https://www.youtube.com/watch?v=L2YhtGeQZvA)

In your project, you may have explored more ideas about how search engines display their results, and which sources they chose to display first. In this talk, Chirag Shah expands on these ideas, explores how ranking of search results impact users, and presents some algorithms and statistical methods that can be used to increase fairness and diversity in search result rankings.
