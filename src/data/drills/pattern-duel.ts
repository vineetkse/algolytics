import type { Drill } from "@/lib/types";

export const patternDuelDrills: Drill[] = [
  {
    id: "pd1",
    type: "pattern-duel",
    problem: "Find two numbers in a sorted array that add up to a target.",
    correctPatternId: "two-pointers",
    distractorPatternId: "sliding-window",
    explanation: "Sorted array + pair sum at opposite ends = two pointers converging inward.",
    whyNotDistractor:
      "Sliding window is for contiguous segments with expand/shrink — not for picking two non-adjacent elements in a sorted array.",
    difficulty: "beginner",
  },
  {
    id: "pd2",
    type: "pattern-duel",
    problem: "Find the longest substring with at most K distinct characters.",
    correctPatternId: "sliding-window",
    distractorPatternId: "two-pointers",
    explanation: "Contiguous substring + constraint on window contents = sliding window.",
    whyNotDistractor:
      "Two pointers on opposite ends doesn't maintain a contiguous window — you need expand-right, shrink-left.",
    difficulty: "intermediate",
  },
  {
    id: "pd3",
    type: "pattern-duel",
    problem: "Return the zigzag level-order traversal of a binary tree.",
    correctPatternId: "tree-bfs",
    distractorPatternId: "tree-dfs",
    explanation: "Level-by-level processing requires BFS with a queue, even if order alternates per level.",
    whyNotDistractor:
      "DFS goes deep first — level order is inherently a breadth-first property.",
    difficulty: "intermediate",
  },
  {
    id: "pd4",
    type: "pattern-duel",
    problem: "Find the maximum path sum in a binary tree (any node to any node).",
    correctPatternId: "tree-dfs",
    distractorPatternId: "tree-bfs",
    explanation: "Combine left/right subtree answers at each node — post-order DFS aggregation.",
    whyNotDistractor:
      "BFS explores levels but doesn't naturally combine subtree results bottom-up for path optimization.",
    difficulty: "intermediate",
  },
  {
    id: "pd5",
    type: "pattern-duel",
    problem: "Search for a target in a rotated sorted array in O(log n).",
    correctPatternId: "modified-binary-search",
    distractorPatternId: "two-pointers",
    explanation: "O(log n) on a sorted/rotated array = modified binary search on one sorted half.",
    whyNotDistractor:
      "Two pointers is O(n) — the O(log n) requirement is the signal for binary search.",
    difficulty: "intermediate",
  },
  {
    id: "pd6",
    type: "pattern-duel",
    problem: "Find the Kth largest element in an unsorted array.",
    correctPatternId: "top-k-elements",
    distractorPatternId: "modified-binary-search",
    explanation: "Kth largest from unsorted data = min-heap of size K or quickselect.",
    whyNotDistractor:
      "Binary search needs a sorted or monotonic answer space — the array is unsorted with no such property.",
    difficulty: "intermediate",
  },
  {
    id: "pd7",
    type: "pattern-duel",
    problem: "Generate all subsets of an integer array.",
    correctPatternId: "subsets",
    distractorPatternId: "knapsack-dp",
    explanation: "Enumerate all subsets = backtracking with include/exclude at each index.",
    whyNotDistractor:
      "Knapsack optimizes a target sum constraint — here we need every combination, not an optimal one.",
    difficulty: "intermediate",
  },
  {
    id: "pd8",
    type: "pattern-duel",
    problem: "Can you partition an array into two subsets with equal sum?",
    correctPatternId: "knapsack-dp",
    distractorPatternId: "subsets",
    explanation: "Equal partition = subset sum to total/2 = 0/1 knapsack decision problem.",
    whyNotDistractor:
      "Generating all subsets is O(2^n) enumeration — DP solves the decision problem efficiently.",
    difficulty: "advanced",
  },
  {
    id: "pd9",
    type: "pattern-duel",
    problem: "Climbing stairs: count distinct ways to reach the top taking 1 or 2 steps.",
    correctPatternId: "fibonacci-dp",
    distractorPatternId: "knapsack-dp",
    explanation: "ways(n) = ways(n-1) + ways(n-2) — fixed linear dependency, classic Fibonacci DP.",
    whyNotDistractor:
      "No items to pick or capacity — just counting paths with a simple recurrence.",
    difficulty: "beginner",
  },
  {
    id: "pd10",
    type: "pattern-duel",
    problem: "Jump Game: can you reach the last index? Each element is max jump length.",
    correctPatternId: "greedy",
    distractorPatternId: "fibonacci-dp",
    explanation: "Track farthest reachable index greedily — if current index exceeds farthest, stuck.",
    whyNotDistractor:
      "DP is overkill — a single farthest-reachable variable suffices.",
    difficulty: "intermediate",
  },
  {
    id: "pd11",
    type: "pattern-duel",
    problem: "Daily temperatures: for each day, how many days until a warmer temperature?",
    correctPatternId: "monotonic-stack",
    distractorPatternId: "sliding-window",
    explanation: "Next greater element per index = monotonic decreasing stack.",
    whyNotDistractor:
      "Sliding window optimizes contiguous segments — here each index needs its own 'next greater' lookup.",
    difficulty: "advanced",
  },
  {
    id: "pd12",
    type: "pattern-duel",
    problem: "Course Schedule: can you finish all courses given prerequisites?",
    correctPatternId: "topological-sort",
    distractorPatternId: "graph-bfs-dfs",
    explanation: "Prerequisites = dependency ordering on a DAG — topological sort detects cycles.",
    whyNotDistractor:
      "Plain BFS/DFS traverses the graph but doesn't produce a valid dependency order or detect impossible schedules as directly.",
    difficulty: "advanced",
  },
  {
    id: "pd13",
    type: "pattern-duel",
    problem: "Number of connected components in a dynamic graph as edges are added.",
    correctPatternId: "union-find",
    distractorPatternId: "graph-bfs-dfs",
    explanation: "Dynamic connectivity with union queries = Union Find with path compression.",
    whyNotDistractor:
      "BFS/DFS recomputes from scratch each time — Union Find handles incremental merges in near-constant time.",
    difficulty: "advanced",
  },
  {
    id: "pd14",
    type: "pattern-duel",
    problem: "Detect cycle in a linked list.",
    correctPatternId: "fast-slow-pointers",
    distractorPatternId: "two-pointers",
    explanation: "Floyd's cycle detection: fast pointer moves 2×, catches slow if cycle exists.",
    whyNotDistractor:
      "Two pointers on opposite ends is for arrays — linked lists need same-direction different speeds.",
    difficulty: "intermediate",
  },
  {
    id: "pd15",
    type: "pattern-duel",
    problem: "Merge K sorted linked lists into one sorted list.",
    correctPatternId: "k-way-merge",
    distractorPatternId: "top-k-elements",
    explanation: "K sorted streams merged = min-heap holding the front of each list.",
    whyNotDistractor:
      "Top-K finds K best from one collection — here you're merging K separate sorted sequences.",
    difficulty: "advanced",
  },
  {
    id: "pd16",
    type: "pattern-duel",
    problem: "Find all words on a 2D board that exist in a dictionary.",
    correctPatternId: "trie",
    distractorPatternId: "graph-bfs-dfs",
    explanation: "Prefix-based word lookup while exploring the board = Trie + DFS.",
    whyNotDistractor:
      "Plain DFS alone can't efficiently check dictionary prefixes — Trie prunes impossible paths early.",
    difficulty: "advanced",
  },
  {
    id: "pd17",
    type: "pattern-duel",
    problem: "Minimum number of meeting rooms needed for a set of intervals.",
    correctPatternId: "merge-intervals",
    distractorPatternId: "greedy",
    explanation: "Peak concurrent overlaps = sort by start + min-heap of end times (interval family).",
    whyNotDistractor:
      "Greedy interval scheduling picks maximum non-overlapping set — here you need maximum overlap count.",
    difficulty: "intermediate",
  },
  {
    id: "pd18",
    type: "pattern-duel",
    problem: "Pacific Atlantic water flow: cells that can reach both oceans.",
    correctPatternId: "graph-bfs-dfs",
    distractorPatternId: "topological-sort",
    explanation: "Reverse DFS/BFS from each ocean to find reachable cells — graph traversal on a grid.",
    whyNotDistractor:
      "No dependency ordering involved — this is reachability, not topological ordering.",
    difficulty: "advanced",
  },
];
