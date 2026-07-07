export interface ConfusionPair {
  id: string;
  patternA: string;
  patternB: string;
  distinction: string;
}

export const confusionPairs: ConfusionPair[] = [
  {
    id: "tp-sw",
    patternA: "two-pointers",
    patternB: "sliding-window",
    distinction:
      "Two pointers: sorted array or opposite ends. Sliding window: contiguous subarray/substring with expand/shrink.",
  },
  {
    id: "bfs-dfs-tree",
    patternA: "tree-bfs",
    patternB: "tree-dfs",
    distinction:
      "BFS: level-by-level, shortest path in tree. DFS: deep exploration, path/subtree aggregation.",
  },
  {
    id: "tree-dfs-graph",
    patternA: "tree-dfs",
    patternB: "graph-bfs-dfs",
    distinction:
      "Tree DFS: hierarchical, no cycles. Graph DFS: arbitrary edges, visited set required.",
  },
  {
    id: "binsrch-tp",
    patternA: "modified-binary-search",
    patternB: "two-pointers",
    distinction:
      "Binary search: O(log n) on sorted/monotonic space. Two pointers: linear scan, often pair sum on sorted array.",
  },
  {
    id: "topk-binsrch",
    patternA: "top-k-elements",
    patternB: "modified-binary-search",
    distinction:
      "Top-K: heap of size K from unsorted data. Binary search: find boundary in sorted/monotonic answer space.",
  },
  {
    id: "subset-knapsack",
    patternA: "subsets",
    patternB: "knapsack-dp",
    distinction:
      "Subsets: enumerate all combinations. Knapsack: optimize yes/no per item to hit exact target sum.",
  },
  {
    id: "fib-knapsack",
    patternA: "fibonacci-dp",
    patternB: "knapsack-dp",
    distinction:
      "Fibonacci DP: fixed dependency on previous 1-2 states. Knapsack: choose items with capacity constraint.",
  },
  {
    id: "greedy-dp",
    patternA: "greedy",
    patternB: "fibonacci-dp",
    distinction:
      "Greedy: local optimal choice is globally safe. DP: overlapping subproblems need memoization.",
  },
  {
    id: "stack-sw",
    patternA: "monotonic-stack",
    patternB: "sliding-window",
    distinction:
      "Monotonic stack: next greater/smaller per index. Sliding window: contiguous segment with two boundaries.",
  },
  {
    id: "topo-graph",
    patternA: "topological-sort",
    patternB: "graph-bfs-dfs",
    distinction:
      "Topo sort: dependency ordering on DAG. Graph BFS/DFS: reachability, components, general traversal.",
  },
  {
    id: "uf-graph",
    patternA: "union-find",
    patternB: "graph-bfs-dfs",
    distinction:
      "Union Find: dynamic connectivity queries. Graph DFS/BFS: one-shot traversal or path finding.",
  },
  {
    id: "fastslow-tp",
    patternA: "fast-slow-pointers",
    patternB: "two-pointers",
    distinction:
      "Fast/slow: linked list cycle or middle, different speeds. Two pointers: arrays/strings, often opposite ends.",
  },
  {
    id: "merge-greedy",
    patternA: "merge-intervals",
    patternB: "greedy",
    distinction:
      "Merge intervals: sort and sweep overlaps. Greedy scheduling: sort by end time, pick non-overlapping.",
  },
  {
    id: "kmerge-topk",
    patternA: "k-way-merge",
    patternB: "top-k-elements",
    distinction:
      "K-way merge: merge K sorted streams. Top-K: find K best from single unsorted collection.",
  },
  {
    id: "trie-graph",
    patternA: "trie",
    patternB: "graph-bfs-dfs",
    distinction:
      "Trie: prefix-based string dictionary. Graph DFS: grid/board path exploration with visited cells.",
  },
];

export function getConfusionPair(id: string): ConfusionPair | undefined {
  return confusionPairs.find((p) => p.id === id);
}

export function getPairsForPattern(patternId: string): ConfusionPair[] {
  return confusionPairs.filter(
    (p) => p.patternA === patternId || p.patternB === patternId
  );
}
