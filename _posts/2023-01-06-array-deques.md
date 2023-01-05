---
title: &title Array Deques
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1ezT23_FyoB91Em2zIQEOf6wfKSp_u3Kh3Eun7hYiypI/edit?usp=sharing
canonical_url: *redirect
---

ArrayListDeque
ArrayList invariant. The i-th element in the list is always at elementData[i].
Say we want to implement Deque using ArrayList. For each method, explain what the ArrayList must do to implement the behavior while maintaining its invariant.
void addFirst(E element). Adds the element to the front of the deque.

void addLast(E element). Adds the element to the back of the deque.

E removeFirst(). Removes and returns the element at the front of the deque.

E removeLast(). Removes and returns the element at the back of the deque.
1

ArrayDeque
In the project instructions, we showed you this picture of an ArrayDeque.





What are the elements in the deque? List them out from first to last.

Describe an invariant (statement that must always be true) for ArrayDeque.
2
addLast()
addFirst()
data
e
f
2
front
c
a
b
d
1
back
0    1    2    3    4    5    6    7   
6
size

IntelliJ Debugging Demo
3

Blank space
When we studied ArrayIntList in CSE 143, we introduced a clever way to clear all the elements from a list by taking advantage of the ArrayList invariant.
public void clear() {
    size = 0;
}
However, Java’s actual ArrayList class works differently. Let’s talk about it.
4
