---
title: &title Left-Leaning Red-Black Trees
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1bVEkBaScqmkKYJBtySDODWvdoA7lvUhuzCOCtiYHo-s/edit?usp=sharing
canonical_url: *redirect
---

Balanced tree heights
This 2-3 tree has height 3. Next to each 3-node, draw the corresponding LLRB tree nodes. Then, give the exact height of the entire corresponding LLRB tree.
Height. The number of edges on the longest root-to-leaf path. (A leaf has 0 height.)
1
D  I
Q
B
G
K
O
R  S
W  X
A
C
F
H
J
L
N
P
T  V
U
M

What would a 2-3 tree do?
Draw the LLRB tree from adding the elements in this order: 1, 2, 3, 7, 8, 9, 5.
2

Rotation invariants
After performing a tree rotation, what could happen?
If the tree had the search tree property, it may lose it.
If the tree did not have the search tree property, it may gain it.
The height can stay the same.
The height can increase.
The height can decrease.
The number of nodes can change.
The overall root can change.
3
G
C
P
K
R
A
B
J
L
C
K
R
A
B
J
L
G  P
C
K
R
A
B
J
L
G
P
Left leaning
Right leaning
2-3 tree
rotateLeft(G)

Balanced trees
Consider this LLRB tree containing 12 nodes. We don't care about the specific values of elements, so the nodes are blank.
How many values do you need to add to thecorresponding 2-3 tree to increase its height?

How many values do you need to add tothis LLRB tree to increase its height?

What happens when a new element with a value greater than all other elements is added to this LLRB tree? Describe the new leaf node and any rotations/color flips.
4
red
red
