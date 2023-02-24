---
title: &title Dynamic Programming
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1YYRECF9h2HLY40XQzLZqQpbPMx4N594JnQDBMBHnaec/edit?usp=sharing
canonical_url: *redirect
---

Reductions
The following sentences incorrectly apply the idea of reduction. Explain each issue.
Seam finding reduces to Dijkstra's algorithm.


Topological sorting reduces to depth-first search.


Topological sorting reduces to graph traversal.
1

Dynamic programming
Can merge sort be written as a dynamic programming algorithm? Why or why not?
2
Andrea Muljono.

Robot pathfinding
Let’s help a robot find its way on an 3-by-3 grid. The robot starts at the top-left corner (0, 0) and wants to go to the bottom-right corner (2, 2). The robot can only take one step down or one step right at a time.
How many unique paths can the robot take to reach the bottom-right corner?


How can we express this as a recursive problem?
3
h
w
Andrea Muljono.

numUniquePaths
Fill in the assignment statements to complete the dynamic programming solution.
public static int numUniquePaths(int w, int h) {
    int[][] grid = new int[w + 1][h + 1];
    for (int x = 0; x <= w; x += 1) {
        grid[x][0] =
    }
    for (int y = 0; y <= h; y += 1) {
        grid[0][y] =
    }
    for (int x = 1; x <= w; x += 1) {
        for (int y = 1; y <= h; y += 1) {
            grid[    ][    ] =
    } }
    return grid[w][h];
}
4
Andrea Muljono.
