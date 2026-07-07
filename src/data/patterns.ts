import type { Pattern, PatternCategory } from "@/lib/types";

export const patterns: Pattern[] = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    category: "arrays",
    difficulty: "beginner",
    tagline: "Converge or chase from both ends",
    signals: [
      "sorted array",
      "pair sum / triplet",
      "palindrome check",
      "remove duplicates in-place",
    ],
    whenToUse:
      "When the input is sorted or you need to compare elements from opposite ends, or chase a slow/fast pointer across a linear structure.",
    mentalModel:
      "Place pointers at strategic positions. Move them based on a condition — converge inward, or advance at different speeds.",
    timeComplexity: "O(n)",
    exampleProblems: ["Two Sum II", "3Sum", "Valid Palindrome", "Container With Most Water"],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    category: "arrays",
    difficulty: "beginner",
    tagline: "Expand right, shrink left",
    signals: [
      "contiguous subarray/substring",
      "longest/shortest with constraint",
      "fixed or variable window size",
      "frequency count in window",
    ],
    whenToUse:
      "When the answer lives in a contiguous segment and adding/removing one element only affects the window boundary.",
    mentalModel:
      "Grow the window with the right pointer. When a constraint breaks, shrink from the left until valid again. Track the best window.",
    timeComplexity: "O(n)",
    exampleProblems: ["Longest Substring Without Repeating", "Minimum Window Substring", "Max Sum Subarray of Size K"],
  },
  {
    id: "fast-slow-pointers",
    name: "Fast & Slow Pointers",
    category: "linked-lists",
    difficulty: "intermediate",
    tagline: "Tortoise and hare on linked structures",
    signals: [
      "cycle detection",
      "find middle of linked list",
      "palindrome in linked list",
      "happy number",
    ],
    whenToUse:
      "When traversing a linked structure where one pointer moves 2× speed — reveals cycles, midpoints, or convergence points.",
    mentalModel:
      "Slow moves 1 step, fast moves 2. If they meet, there's a cycle. If fast hits null, no cycle. Midpoint: when fast reaches end, slow is at middle.",
    timeComplexity: "O(n)",
    exampleProblems: ["Linked List Cycle", "Find Middle Node", "Palindrome Linked List"],
  },
  {
    id: "merge-intervals",
    name: "Merge Intervals",
    category: "arrays",
    difficulty: "beginner",
    tagline: "Sort, then sweep and merge overlaps",
    signals: [
      "overlapping intervals",
      "scheduling conflicts",
      "meeting rooms",
      "insert interval into sorted list",
    ],
    whenToUse:
      "When dealing with ranges that may overlap and you need to combine, insert, or find gaps.",
    mentalModel:
      "Sort by start time. Walk through: if current overlaps with previous, merge; else start a new interval.",
    timeComplexity: "O(n log n)",
    exampleProblems: ["Merge Intervals", "Insert Interval", "Meeting Rooms II"],
  },
  {
    id: "tree-bfs",
    name: "Tree BFS",
    category: "trees",
    difficulty: "beginner",
    tagline: "Level by level with a queue",
    signals: [
      "level-order traversal",
      "shortest path in tree",
      "nodes at distance K",
      "zigzag level order",
    ],
    whenToUse:
      "When you need to process a tree/graph layer by layer, or find the shortest path in an unweighted tree.",
    mentalModel:
      "Enqueue root. Dequeue node, process it, enqueue children. Use queue size to track levels.",
    timeComplexity: "O(n)",
    exampleProblems: ["Level Order Traversal", "Minimum Depth", "Right Side View"],
  },
  {
    id: "tree-dfs",
    name: "Tree DFS",
    category: "trees",
    difficulty: "beginner",
    tagline: "Dive deep, return answers up",
    signals: [
      "path sum / root to leaf",
      "validate BST",
      "diameter / height",
      "serialize tree",
    ],
    whenToUse:
      "When the answer depends on exploring all branches and combining results from subtrees.",
    mentalModel:
      "Recurse: base case at null leaf. Process current node. Combine left and right subtree results. Post-order for bottom-up answers.",
    timeComplexity: "O(n)",
    exampleProblems: ["Path Sum", "Validate BST", "Diameter of Binary Tree"],
  },
  {
    id: "modified-binary-search",
    name: "Modified Binary Search",
    category: "arrays",
    difficulty: "intermediate",
    tagline: "Halve the search space with a predicate",
    signals: [
      "sorted or rotated sorted array",
      "find boundary (first/last occurrence)",
      "search in matrix",
      "minimize/maximize with monotonic condition",
    ],
    whenToUse:
      "When the answer space is monotonic — if condition is true for X, it's true for all values after X (or before).",
    mentalModel:
      "Don't search for a value — search for a boundary. Define a predicate. Binary search on the answer space, not just indices.",
    timeComplexity: "O(log n)",
    exampleProblems: ["Search Rotated Array", "Find Minimum in Rotated Array", "Koko Eating Bananas"],
  },
  {
    id: "top-k-elements",
    name: "Top K Elements",
    category: "heaps",
    difficulty: "intermediate",
    tagline: "Heap maintains the best K candidates",
    signals: [
      "K largest / K smallest",
      "K closest points",
      "K frequent elements",
      "streaming data top K",
    ],
    whenToUse:
      "When you need K best items from N elements and N is large — heap gives O(n log k) instead of O(n log n) sort.",
    mentalModel:
      "Min-heap of size K for K largest (evict smallest). Max-heap for K smallest. Or bucket sort when values are bounded.",
    timeComplexity: "O(n log k)",
    exampleProblems: ["Kth Largest Element", "Top K Frequent Words", "K Closest Points"],
  },
  {
    id: "subsets",
    name: "Subsets / Backtracking",
    category: "backtracking",
    difficulty: "intermediate",
    tagline: "Choose, explore, unchoose",
    signals: [
      "all combinations/permutations",
      "generate subsets",
      "partition into groups",
      "constraint satisfaction",
    ],
    whenToUse:
      "When you need to enumerate all valid configurations by making choices at each step and backtracking on failure.",
    mentalModel:
      "Build a path. At each step, try including or excluding. Prune branches that violate constraints early.",
    timeComplexity: "O(2^n) or O(n!)",
    exampleProblems: ["Subsets", "Combination Sum", "N-Queens", "Word Search"],
  },
  {
    id: "knapsack-dp",
    name: "0/1 Knapsack DP",
    category: "dynamic-programming",
    difficulty: "advanced",
    tagline: "Take it or leave it — build optimal substructure",
    signals: [
      "subset with target sum",
      "partition equal subset",
      "can you form amount with coins (limited)",
      "maximize value with weight limit",
    ],
    whenToUse:
      "When items are used at most once and you're optimizing over a capacity or target sum.",
    mentalModel:
      "dp[i][w] = max value using first i items with capacity w. For each item: take it (if fits) or skip it.",
    timeComplexity: "O(n × W)",
    exampleProblems: ["Partition Equal Subset Sum", "Target Sum", "Coin Change II"],
  },
  {
    id: "fibonacci-dp",
    name: "Fibonacci / Linear DP",
    category: "dynamic-programming",
    difficulty: "intermediate",
    tagline: "Current state depends on previous states",
    signals: [
      "climbing stairs",
      "house robber (non-adjacent)",
      "decode ways",
      "minimum path sum",
    ],
    whenToUse:
      "When optimal answer at position i depends only on a fixed number of previous positions (usually i-1, i-2).",
    mentalModel:
      "Define dp[i] = best answer ending at i. Transition: dp[i] = f(dp[i-1], dp[i-2], ...). Often reducible to O(1) space.",
    timeComplexity: "O(n)",
    exampleProblems: ["Climbing Stairs", "House Robber", "Decode Ways", "Min Cost Climbing Stairs"],
  },
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    category: "misc",
    difficulty: "advanced",
    tagline: "Stack that only grows in one direction",
    signals: [
      "next greater/smaller element",
      "daily temperatures",
      "largest rectangle in histogram",
      "trapping rain water",
    ],
    whenToUse:
      "When each element needs to find the next element that is greater/smaller — stack maintains candidates in sorted order.",
    mentalModel:
      "Push indices. When current element violates monotonic order, pop and resolve waiting elements. Each element pushed/popped once.",
    timeComplexity: "O(n)",
    exampleProblems: ["Next Greater Element", "Daily Temperatures", "Largest Rectangle in Histogram"],
  },
  {
    id: "topological-sort",
    name: "Topological Sort",
    category: "graphs",
    difficulty: "advanced",
    tagline: "Order nodes respecting dependencies",
    signals: [
      "prerequisites / course schedule",
      "dependency resolution",
      "build order",
      "DAG ordering",
    ],
    whenToUse:
      "When tasks have dependencies forming a DAG and you need a valid processing order, or detect cycles.",
    mentalModel:
      "Kahn's: peel off nodes with zero in-degree. Or DFS post-order on reversed graph. Cycle = not all nodes processed.",
    timeComplexity: "O(V + E)",
    exampleProblems: ["Course Schedule", "Alien Dictionary", "Sequence Reconstruction"],
  },
  {
    id: "graph-bfs-dfs",
    name: "Graph BFS / DFS",
    category: "graphs",
    difficulty: "intermediate",
    tagline: "Traverse nodes and edges systematically",
    signals: [
      "connected components",
      "island counting",
      "shortest path in unweighted graph",
      "detect cycle in graph",
    ],
    whenToUse:
      "When the problem is modeled as nodes and edges — explore reachable nodes, find paths, or count components.",
    mentalModel:
      "BFS for shortest path/layers. DFS for exhaustive exploration, cycle detection, or connected components. Always track visited.",
    timeComplexity: "O(V + E)",
    exampleProblems: ["Number of Islands", "Clone Graph", "Pacific Atlantic Water Flow"],
  },
  {
    id: "trie",
    name: "Trie",
    category: "misc",
    difficulty: "intermediate",
    tagline: "Prefix tree for string lookups",
    signals: [
      "prefix search",
      "autocomplete",
      "word dictionary",
      "longest common prefix",
    ],
    whenToUse:
      "When you need fast prefix-based lookups, insertions, or searches over a set of strings.",
    mentalModel:
      "Each node is a character. Paths from root to node spell prefixes. Branch at each character. Mark end-of-word nodes.",
    timeComplexity: "O(L) per operation",
    exampleProblems: ["Implement Trie", "Word Search II", "Design Add and Search Words"],
  },
  {
    id: "cyclic-sort",
    name: "Cyclic Sort",
    category: "arrays",
    difficulty: "intermediate",
    tagline: "Place each number at its correct index",
    signals: [
      "numbers in range [1, n]",
      "find missing/duplicate numbers",
      "first K missing positive",
      "in-place rearrangement",
    ],
    whenToUse:
      "When numbers belong in a specific index range and you can swap each number to its correct position in O(1).",
    mentalModel:
      "Iterate: if nums[i] is not at its correct index, swap it with nums[correctIndex]. Each swap places at least one number correctly.",
    timeComplexity: "O(n)",
    exampleProblems: ["Missing Number", "Find All Duplicates", "First Missing Positive"],
  },
  {
    id: "union-find",
    name: "Union Find",
    category: "graphs",
    difficulty: "advanced",
    tagline: "Merge groups and query connectivity",
    signals: [
      "connected components in dynamic graph",
      "number of provinces",
      "redundant connection",
      "accounts merge",
    ],
    whenToUse:
      "When you need to dynamically connect nodes and quickly check if two nodes are in the same group.",
    mentalModel:
      "Parent array tracks group roots. Find with path compression. Union by rank/size. Connected = same root.",
    timeComplexity: "O(α(n)) amortized",
    exampleProblems: ["Number of Provinces", "Redundant Connection", "Accounts Merge"],
  },
  {
    id: "k-way-merge",
    name: "K-way Merge",
    category: "heaps",
    difficulty: "advanced",
    tagline: "Merge K sorted streams efficiently",
    signals: [
      "merge K sorted lists",
      "smallest range covering K lists",
      "Kth smallest in sorted matrix",
      "external merge sort",
    ],
    whenToUse:
      "When merging or finding elements across K sorted arrays/lists — use a min-heap to always pick the smallest frontier element.",
    mentalModel:
      "Seed heap with first element of each list. Pop smallest, push next from same list. Repeat until K lists exhausted.",
    timeComplexity: "O(N log K)",
    exampleProblems: ["Merge K Sorted Lists", "Smallest Range Covering K Lists", "Kth Smallest in Sorted Matrix"],
  },
  {
    id: "greedy",
    name: "Greedy",
    category: "misc",
    difficulty: "intermediate",
    tagline: "Make the locally optimal choice",
    signals: [
      "activity selection",
      "minimum arrows to burst balloons",
      "jump game",
      "interval scheduling",
    ],
    whenToUse:
      "When a locally optimal choice at each step leads to a globally optimal solution — often after sorting.",
    mentalModel:
      "Sort by a key (end time, start time, value). Greedily pick the best valid option. Prove the greedy choice is safe.",
    timeComplexity: "O(n log n)",
    exampleProblems: ["Jump Game", "Non-overlapping Intervals", "Partition Labels"],
  },
  {
    id: "bitmask-dp",
    name: "Bitmask DP",
    category: "dynamic-programming",
    difficulty: "advanced",
    tagline: "DP over subsets encoded as bits",
    signals: [
      "traveling salesman",
      "assign tasks to workers",
      "shortest path visiting all nodes",
      "state is a subset of items",
    ],
    whenToUse:
      "When the state is a subset of N items (N ≤ 20) and you need optimal assignment or path over all subsets.",
    mentalModel:
      "dp[mask][i] = best answer for visiting nodes in mask ending at i. Transition by adding one node to the mask.",
    timeComplexity: "O(2^n × n)",
    exampleProblems: ["Shortest Path Visiting All Nodes", "Can I Win", "Maximum Students Taking Exam"],
  },
  {
    id: "palindromic-dp",
    name: "Palindromic DP",
    category: "dynamic-programming",
    difficulty: "advanced",
    tagline: "Optimal palindrome substructure",
    signals: [
      "longest palindromic subsequence",
      "minimum insertions for palindrome",
      "palindrome partitioning",
      "count palindromic substrings",
    ],
    whenToUse:
      "When the answer involves palindrome properties on strings — compare characters from both ends and build inward.",
    mentalModel:
      "dp[i][j] = answer for s[i..j]. If s[i]==s[j], combine inner subproblem. Else, take best of excluding one end.",
    timeComplexity: "O(n²)",
    exampleProblems: ["Longest Palindromic Subsequence", "Palindrome Partitioning II", "Count Palindromic Substrings"],
  },
  {
    id: "two-heaps",
    name: "Two Heaps",
    category: "heaps",
    difficulty: "intermediate",
    tagline: "Split data into lower and upper halves",
    signals: [
      "streaming median",
      "balance two halves",
      "sliding window median",
      "find median from data stream",
    ],
    whenToUse:
      "When you need the median or a balanced split of a dynamic dataset — max-heap for lower half, min-heap for upper.",
    mentalModel:
      "Max-heap stores smaller half, min-heap stores larger half. Keep sizes balanced. Median is at heap tops.",
    timeComplexity: "O(log n) per insert",
    exampleProblems: ["Find Median from Data Stream", "Sliding Window Median", "IPO"],
  },
];

export function getPatternById(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id);
}

export function getPatternsByCategory(category: PatternCategory): Pattern[] {
  return patterns.filter((p) => p.category === category);
}

export const categoryLabels: Record<PatternCategory, string> = {
  arrays: "Arrays & Strings",
  "linked-lists": "Linked Lists",
  trees: "Trees",
  graphs: "Graphs",
  "dynamic-programming": "Dynamic Programming",
  heaps: "Heaps & Priority Queues",
  backtracking: "Backtracking",
  misc: "Specialized Structures",
};
