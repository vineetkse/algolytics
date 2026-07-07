import type { CodingProblem } from "@/lib/types";
import { additionalProblems } from "./additional";

const baseProblems: CodingProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "beginner",
    patternId: "two-pointers",
    description:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10⁴", "-10⁹ <= nums[i] <= 10⁹", "Only one valid answer exists"],
    hints: ["For the sorted variant, use two pointers from both ends.", "For unsorted, a hash map gives O(n)."],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // Your code here\n}\n",
      python: "def twoSum(nums, target):\n    # Your code here\n    pass\n",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}\n",
    },
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "beginner",
    patternId: "two-pointers",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 2 * 10⁵", "s consists of printable ASCII characters"],
    hints: ["Use two pointers from both ends, skip non-alphanumeric chars."],
    starterCode: {
      javascript: "function isPalindrome(s) {\n  // Your code here\n}\n",
      python: "def isPalindrome(s):\n    pass\n",
      java: "class Solution {\n    public boolean isPalindrome(String s) {\n    }\n}\n",
    },
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "intermediate",
    patternId: "two-pointers",
    description:
      "You are given an integer array `height` of length `n`. There are `n` vertical lines such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water a container can store.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
    ],
    constraints: ["n == height.length", "2 <= n <= 10⁵", "0 <= height[i] <= 10⁴"],
    hints: ["Two pointers at start and end. Move the shorter line inward."],
    starterCode: {
      javascript: "function maxArea(height) {\n}\n",
      python: "def maxArea(height):\n    pass\n",
      java: "class Solution {\n    public int maxArea(int[] height) {\n    }\n}\n",
    },
  },
  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "intermediate",
    patternId: "sliding-window",
    description:
      "Given a string `s`, find the length of the longest substring without duplicate characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc"' },
      { input: 's = "bbbbb"', output: "1" },
    ],
    constraints: ["0 <= s.length <= 5 * 10⁴", "s consists of English letters, digits, symbols and spaces"],
    hints: ["Sliding window with a map of last seen index for each character."],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n}\n",
      python: "def lengthOfLongestSubstring(s):\n    pass\n",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n    }\n}\n",
    },
  },
  {
    id: "min-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    difficulty: "intermediate",
    patternId: "sliding-window",
    description:
      "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0`.",
    examples: [
      { input: "target = 7, nums = [2,3,1,2,4,3]", output: "2", explanation: "[4,3] has sum 7" },
    ],
    constraints: ["1 <= target <= 10⁹", "1 <= nums.length <= 10⁵", "1 <= nums[i] <= 10⁴"],
    hints: ["Expand window until sum >= target, then shrink from left."],
    starterCode: {
      javascript: "function minSubArrayLen(target, nums) {\n}\n",
      python: "def minSubArrayLen(target, nums):\n    pass\n",
      java: "class Solution {\n    public int minSubArrayLen(int target, int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "beginner",
    patternId: "fast-slow-pointers",
    description:
      "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle if some node can be reached again by continuously following the `next` pointer.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects to node index 1" },
      { input: "head = [1], pos = -1", output: "false" },
    ],
    constraints: ["The number of nodes is in the range [0, 10⁴]"],
    hints: ["Floyd's algorithm: slow moves 1 step, fast moves 2. If they meet, cycle exists."],
    starterCode: {
      javascript: "function hasCycle(head) {\n}\n",
      python: "def hasCycle(head):\n    pass\n",
      java: "public class Solution {\n    public boolean hasCycle(ListNode head) {\n    }\n}\n",
    },
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "intermediate",
    patternId: "merge-intervals",
    description:
      "Given an array of `intervals` where `intervals[i] = [startᵢ, endᵢ]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
    ],
    constraints: ["1 <= intervals.length <= 10⁴", "intervals[i].length == 2"],
    hints: ["Sort by start. If current overlaps with previous, merge; else push new."],
    starterCode: {
      javascript: "function merge(intervals) {\n}\n",
      python: "def merge(intervals):\n    pass\n",
      java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n    }\n}\n",
    },
  },
  {
    id: "binary-tree-level-order",
    title: "Binary Tree Level Order Traversal",
    difficulty: "intermediate",
    patternId: "tree-bfs",
    description:
      "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
    ],
    constraints: ["The number of nodes is in the range [0, 2000]"],
    hints: ["BFS with a queue. Process queue size at each level."],
    starterCode: {
      javascript: "function levelOrder(root) {\n}\n",
      python: "def levelOrder(root):\n    pass\n",
      java: "class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n    }\n}\n",
    },
  },
  {
    id: "max-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "beginner",
    patternId: "tree-dfs",
    description:
      "Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root down to the farthest leaf.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
    ],
    constraints: ["The number of nodes is in the range [0, 10⁴]"],
    hints: ["DFS: 1 + max(left depth, right depth)."],
    starterCode: {
      javascript: "function maxDepth(root) {\n}\n",
      python: "def maxDepth(root):\n    pass\n",
      java: "class Solution {\n    public int maxDepth(TreeNode root) {\n    }\n}\n",
    },
  },
  {
    id: "search-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "intermediate",
    patternId: "modified-binary-search",
    description:
      "There is an integer array `nums` sorted in ascending order (with distinct values). The array is rotated at an unknown pivot.\n\nGiven `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` otherwise. Must be O(log n).",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 5000"],
    hints: ["One half is always sorted. Check which half contains target."],
    starterCode: {
      javascript: "function search(nums, target) {\n}\n",
      python: "def search(nums, target):\n    pass\n",
      java: "class Solution {\n    public int search(int[] nums, int target) {\n    }\n}\n",
    },
  },
  {
    id: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    difficulty: "intermediate",
    patternId: "top-k-elements",
    description:
      "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest in sorted order, not the `k`th distinct element.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
    ],
    constraints: ["1 <= k <= nums.length <= 10⁵"],
    hints: ["Min-heap of size k, or quickselect."],
    starterCode: {
      javascript: "function findKthLargest(nums, k) {\n}\n",
      python: "def findKthLargest(nums, k):\n    pass\n",
      java: "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n    }\n}\n",
    },
  },
  {
    id: "subsets",
    title: "Subsets",
    difficulty: "intermediate",
    patternId: "subsets",
    description:
      "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
    ],
    constraints: ["1 <= nums.length <= 10", "All nums are unique"],
    hints: ["Backtrack: at each index, include or exclude."],
    starterCode: {
      javascript: "function subsets(nums) {\n}\n",
      python: "def subsets(nums):\n    pass\n",
      java: "class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "intermediate",
    patternId: "graph-bfs-dfs",
    description:
      "Given an `m x n` 2D binary grid which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]', output: "3" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300"],
    hints: ["DFS/BFS flood fill each island, increment count."],
    starterCode: {
      javascript: "function numIslands(grid) {\n}\n",
      python: "def numIslands(grid):\n    pass\n",
      java: "class Solution {\n    public int numIslands(char[][] grid) {\n    }\n}\n",
    },
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "beginner",
    patternId: "fibonacci-dp",
    description:
      "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2" },
      { input: "n = 3", output: "3" },
    ],
    constraints: ["1 <= n <= 45"],
    hints: ["dp[i] = dp[i-1] + dp[i-2]. Same as Fibonacci."],
    starterCode: {
      javascript: "function climbStairs(n) {\n}\n",
      python: "def climbStairs(n):\n    pass\n",
      java: "class Solution {\n    public int climbStairs(int n) {\n    }\n}\n",
    },
  },
  {
    id: "house-robber",
    title: "House Robber",
    difficulty: "intermediate",
    patternId: "fibonacci-dp",
    description:
      "You are a robber planning to rob houses along a street. Each house has a certain amount of money. Adjacent houses have security systems — you cannot rob two adjacent houses.\n\nGiven `nums` representing money at each house, return the maximum you can rob without alerting police.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 and 3" },
      { input: "nums = [2,7,9,3,1]", output: "12" },
    ],
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
    hints: ["dp[i] = max(dp[i-1], nums[i] + dp[i-2])."],
    starterCode: {
      javascript: "function rob(nums) {\n}\n",
      python: "def rob(nums):\n    pass\n",
      java: "class Solution {\n    public int rob(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "intermediate",
    patternId: "knapsack-dp",
    description:
      "You are given an integer array `coins` representing coin denominations and an integer `amount`. Return the fewest number of coins needed to make up `amount`. If impossible, return `-1`.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "5+5+1" },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10⁴"],
    hints: ["dp[a] = min coins for amount a. Try each coin."],
    starterCode: {
      javascript: "function coinChange(coins, amount) {\n}\n",
      python: "def coinChange(coins, amount):\n    pass\n",
      java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n    }\n}\n",
    },
  },
  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "intermediate",
    patternId: "monotonic-stack",
    description:
      "Given an array of integers `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after day `i` for a warmer temperature. If there is no future day, keep `answer[i] == 0`.",
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
    ],
    constraints: ["1 <= temperatures.length <= 10⁵", "30 <= temperatures[i] <= 100"],
    hints: ["Monotonic decreasing stack of indices."],
    starterCode: {
      javascript: "function dailyTemperatures(temperatures) {\n}\n",
      python: "def dailyTemperatures(temperatures):\n    pass\n",
      java: "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n    }\n}\n",
    },
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "intermediate",
    patternId: "topological-sort",
    description:
      "There are a total of `numCourses` courses labeled `0` to `numCourses - 1`. You are given `prerequisites` where `prerequisites[i] = [aᵢ, bᵢ]` means you must take course `bᵢ` before `aᵢ`.\n\nReturn `true` if you can finish all courses.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" },
    ],
    constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
    hints: ["Topological sort / Kahn's algorithm. Cycle = impossible."],
    starterCode: {
      javascript: "function canFinish(numCourses, prerequisites) {\n}\n",
      python: "def canFinish(numCourses, prerequisites):\n    pass\n",
      java: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n    }\n}\n",
    },
  },
  {
    id: "implement-trie",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "intermediate",
    patternId: "trie",
    description:
      "Implement the `Trie` class:\n\n- `Trie()` initializes the trie\n- `insert(word)` inserts string `word`\n- `search(word)` returns true if `word` is in the trie\n- `startsWith(prefix)` returns true if a previously inserted string has prefix `prefix`",
    examples: [
      { input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', output: "[null,null,true,false,true,null,true]" },
    ],
    constraints: ["1 <= word.length, prefix.length <= 2000"],
    hints: ["Each node has children map and isEnd flag."],
    starterCode: {
      javascript: "var Trie = function() {\n};\nTrie.prototype.insert = function(word) {\n};\nTrie.prototype.search = function(word) {\n};\nTrie.prototype.startsWith = function(prefix) {\n};\n",
      python: "class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word):\n        pass\n    def search(self, word):\n        pass\n    def startsWith(self, prefix):\n        pass\n",
      java: "class Trie {\n    public Trie() {}\n    public void insert(String word) {}\n    public boolean search(String word) {}\n    public boolean startsWith(String prefix) {}\n}\n",
    },
  },
  {
    id: "find-median-data-stream",
    title: "Find Median from Data Stream",
    difficulty: "advanced",
    patternId: "two-heaps",
    description:
      "Implement the `MedianFinder` class:\n\n- `MedianFinder()` initializes the object\n- `addNum(num)` adds `num` from the data stream\n- `findMedian()` returns the median of all elements so far",
    examples: [
      { input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', output: "[null,null,null,1.5,null,2.0]" },
    ],
    constraints: ["-10⁵ <= num <= 10⁵", "At most 5 * 10⁴ calls"],
    hints: ["Max-heap for lower half, min-heap for upper half. Keep balanced."],
    starterCode: {
      javascript: "var MedianFinder = function() {\n};\nMedianFinder.prototype.addNum = function(num) {\n};\nMedianFinder.prototype.findMedian = function() {\n};\n",
      python: "class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num):\n        pass\n    def findMedian(self):\n        pass\n",
      java: "class MedianFinder {\n    public MedianFinder() {}\n    public void addNum(int num) {}\n    public double findMedian() {}\n}\n",
    },
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "advanced",
    patternId: "k-way-merge",
    description:
      "You are given an array of `k` linked lists, each sorted in ascending order. Merge all into one sorted linked list and return it.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
    ],
    constraints: ["k == lists.length", "0 <= k <= 10⁴"],
    hints: ["Min-heap of size k with head of each list."],
    starterCode: {
      javascript: "function mergeKLists(lists) {\n}\n",
      python: "def mergeKLists(lists):\n    pass\n",
      java: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n    }\n}\n",
    },
  },
  {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "intermediate",
    patternId: "greedy",
    description:
      "You are given an integer array `nums`. You are initially positioned at the first index, and each element represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" },
    ],
    constraints: ["1 <= nums.length <= 10⁴", "0 <= nums[i] <= 10⁵"],
    hints: ["Track farthest reachable index greedily."],
    starterCode: {
      javascript: "function canJump(nums) {\n}\n",
      python: "def canJump(nums):\n    pass\n",
      java: "class Solution {\n    public boolean canJump(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "beginner",
    patternId: "cyclic-sort",
    description:
      "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 10⁴"],
    hints: ["Cyclic sort or XOR/sum formula."],
    starterCode: {
      javascript: "function missingNumber(nums) {\n}\n",
      python: "def missingNumber(nums):\n    pass\n",
      java: "class Solution {\n    public int missingNumber(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "number-of-provinces",
    title: "Number of Provinces",
    difficulty: "intermediate",
    patternId: "union-find",
    description:
      "There are `n` cities connected by roads. `isConnected[i][j] = 1` if cities `i` and `j` are directly connected.\n\nA province is a group of directly or indirectly connected cities. Return the total number of provinces.",
    examples: [
      { input: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", output: "2" },
    ],
    constraints: ["1 <= n <= 200", "n == isConnected.length"],
    hints: ["Union Find or DFS to count connected components."],
    starterCode: {
      javascript: "function findCircleNum(isConnected) {\n}\n",
      python: "def findCircleNum(isConnected):\n    pass\n",
      java: "class Solution {\n    public int findCircleNum(int[][] isConnected) {\n    }\n}\n",
    },
  },
  {
    id: "longest-palindromic-subsequence",
    title: "Longest Palindromic Subsequence",
    difficulty: "advanced",
    patternId: "palindromic-dp",
    description:
      "Given a string `s`, find the length of the longest subsequence of `s` that is a palindrome.\n\nA subsequence is obtained by deleting some (or no) characters without changing order.",
    examples: [
      { input: 's = "bbbab"', output: "4", explanation: '"bbbb"' },
    ],
    constraints: ["1 <= s.length <= 1000"],
    hints: ["dp[i][j] = LPS in s[i..j]. If s[i]==s[j], add 2 to inner."],
    starterCode: {
      javascript: "function longestPalindromeSubseq(s) {\n}\n",
      python: "def longestPalindromeSubseq(s):\n    pass\n",
      java: "class Solution {\n    public int longestPalindromeSubseq(String s) {\n    }\n}\n",
    },
  },
  {
    id: "3sum",
    title: "3Sum",
    difficulty: "intermediate",
    patternId: "two-pointers",
    description:
      "Given an integer array `nums`, return all triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nThe solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
    ],
    constraints: ["3 <= nums.length <= 3000", "-10⁵ <= nums[i] <= 10⁵"],
    hints: ["Sort. Fix one element, two-pointer the rest for sum zero."],
    starterCode: {
      javascript: "function threeSum(nums) {\n}\n",
      python: "def threeSum(nums):\n    pass\n",
      java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "validate-bst",
    title: "Validate Binary Search Tree",
    difficulty: "intermediate",
    patternId: "tree-dfs",
    description:
      "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST: left subtree values < node < right subtree values (recursively).",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false" },
    ],
    constraints: ["The number of nodes is in the range [1, 10⁴]"],
    hints: ["DFS with min/max bounds passed down."],
    starterCode: {
      javascript: "function isValidBST(root) {\n}\n",
      python: "def isValidBST(root):\n    pass\n",
      java: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n    }\n}\n",
    },
  },
  {
    id: "combination-sum",
    title: "Combination Sum",
    difficulty: "intermediate",
    patternId: "subsets",
    description:
      "Given an array of distinct integers `candidates` and a `target`, return all unique combinations where the chosen numbers sum to `target`. Each number may be used unlimited times.",
    examples: [
      { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
    ],
    constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40"],
    hints: ["Backtrack with same start index to allow reuse."],
    starterCode: {
      javascript: "function combinationSum(candidates, target) {\n}\n",
      python: "def combinationSum(candidates, target):\n    pass\n",
      java: "class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n    }\n}\n",
    },
  },
  {
    id: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    difficulty: "intermediate",
    patternId: "knapsack-dp",
    description:
      "Given an integer array `nums`, return `true` if you can partition it into two subsets such that the sum of both subsets is equal.",
    examples: [
      { input: "nums = [1,5,11,5]", output: "true", explanation: "[1,5,5] and [11]" },
    ],
    constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
    hints: ["Target sum = total/2. 0/1 knapsack decision."],
    starterCode: {
      javascript: "function canPartition(nums) {\n}\n",
      python: "def canPartition(nums):\n    pass\n",
      java: "class Solution {\n    public boolean canPartition(int[] nums) {\n    }\n}\n",
    },
  },
];

export const codingProblems: CodingProblem[] = [...baseProblems, ...additionalProblems];

export { getJudgeConfig, isJudgeSupported, getJudgeSupportedCount, MOCK_INTERVIEW_PROBLEM_IDS } from "./judge-config";

export function getProblemById(id: string) {
  return codingProblems.find((p) => p.id === id);
}

export function getProblemsByPattern(patternId: string) {
  return codingProblems.filter((p) => p.patternId === patternId);
}

export function getProblemStats() {
  return {
    total: codingProblems.length,
    byDifficulty: {
      beginner: codingProblems.filter((p) => p.difficulty === "beginner").length,
      intermediate: codingProblems.filter((p) => p.difficulty === "intermediate").length,
      advanced: codingProblems.filter((p) => p.difficulty === "advanced").length,
    },
  };
}
