import type { CodingProblem } from "@/lib/types";

export const additionalProblems: CodingProblem[] = [
  // ── Two Pointers ──
  {
    id: "sort-colors",
    title: "Sort Colors",
    difficulty: "intermediate",
    patternId: "two-pointers",
    description:
      "Given an array `nums` with `n` objects colored red, white, or blue (0, 1, and 2), sort them in-place so that objects of the same color are adjacent, in the order red, white, blue.\n\nYou must solve this without using the library's sort function. One-pass is preferred.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is 0, 1, or 2"],
    hints: ["Dutch national flag: three pointers — low, mid, high."],
    starterCode: {
      javascript: "function sortColors(nums) {\n}\n",
      python: "def sortColors(nums):\n    pass\n",
      java: "class Solution {\n    public void sortColors(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "advanced",
    patternId: "two-pointers",
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: ["n == height.length", "1 <= n <= 2 * 10⁴", "0 <= height[i] <= 10⁵"],
    hints: ["Two pointers from ends tracking leftMax and rightMax."],
    starterCode: {
      javascript: "function trap(height) {\n}\n",
      python: "def trap(height):\n    pass\n",
      java: "class Solution {\n    public int trap(int[] height) {\n    }\n}\n",
    },
  },

  // ── Sliding Window ──
  {
    id: "longest-repeating-char-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "intermediate",
    patternId: "sliding-window",
    description:
      "You are given a string `s` and an integer `k`. You can choose any character and change it to any other uppercase English character at most `k` times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.",
    examples: [
      { input: 's = "ABAB", k = 2', output: "4", explanation: "Replace both A's with B's" },
      { input: 's = "AABABBA", k = 1', output: "4" },
    ],
    constraints: ["1 <= s.length <= 10⁵", "s consists of uppercase English letters", "0 <= k <= s.length"],
    hints: ["Window is valid when (windowSize - maxFreq) <= k."],
    starterCode: {
      javascript: "function characterReplacement(s, k) {\n}\n",
      python: "def characterReplacement(s, k):\n    pass\n",
      java: "class Solution {\n    public int characterReplacement(String s, int k) {\n    }\n}\n",
    },
  },
  {
    id: "max-consecutive-ones-iii",
    title: "Max Consecutive Ones III",
    difficulty: "intermediate",
    patternId: "sliding-window",
    description:
      "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive 1's in the array if you can flip at most `k` 0's.",
    examples: [
      { input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", output: "6" },
      { input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3", output: "10" },
    ],
    constraints: ["1 <= nums.length <= 10⁵", "nums[i] is 0 or 1", "0 <= k <= nums.length"],
    hints: ["Shrink window when zero count exceeds k."],
    starterCode: {
      javascript: "function longestOnes(nums, k) {\n}\n",
      python: "def longestOnes(nums, k):\n    pass\n",
      java: "class Solution {\n    public int longestOnes(int[] nums, int k) {\n    }\n}\n",
    },
  },

  // ── Fast & Slow Pointers ──
  {
    id: "middle-of-linked-list",
    title: "Middle of the Linked List",
    difficulty: "beginner",
    patternId: "fast-slow-pointers",
    description:
      "Given the `head` of a singly linked list, return the middle node.\n\nIf there are two middle nodes, return the second middle node.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[3,4,5]" },
      { input: "head = [1,2,3,4,5,6]", output: "[4,5,6]" },
    ],
    constraints: ["The number of nodes is in the range [1, 100]"],
    hints: ["Slow moves 1 step, fast moves 2. When fast reaches end, slow is at middle."],
    starterCode: {
      javascript: "function middleNode(head) {\n}\n",
      python: "def middleNode(head):\n    pass\n",
      java: "class Solution {\n    public ListNode middleNode(ListNode head) {\n    }\n}\n",
    },
  },
  {
    id: "find-duplicate-number",
    title: "Find the Duplicate Number",
    difficulty: "intermediate",
    patternId: "fast-slow-pointers",
    description:
      "Given an array `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive, there is only one repeated number. Return the duplicate number.\n\nYou must solve it without modifying the array and using only constant extra space.",
    examples: [
      { input: "nums = [1,3,4,2,2]", output: "2" },
      { input: "nums = [3,1,3,4,2]", output: "3" },
    ],
    constraints: ["1 <= n <= 10⁵", "nums.length == n + 1", "1 <= nums[i] <= n"],
    hints: ["Treat array as linked list where nums[i] points to index nums[i]. Floyd's cycle detection."],
    starterCode: {
      javascript: "function findDuplicate(nums) {\n}\n",
      python: "def findDuplicate(nums):\n    pass\n",
      java: "class Solution {\n    public int findDuplicate(int[] nums) {\n    }\n}\n",
    },
  },

  // ── Merge Intervals ──
  {
    id: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "intermediate",
    patternId: "merge-intervals",
    description:
      "Given an array of `intervals` where `intervals[i] = [startᵢ, endᵢ]`, return the minimum number of intervals you need to remove to make the rest non-overlapping.",
    examples: [
      { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "Remove [1,3]" },
      { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
    ],
    constraints: ["1 <= intervals.length <= 10⁵", "intervals[i].length == 2", "-5 * 10⁴ <= startᵢ < endᵢ <= 5 * 10⁴"],
    hints: ["Sort by end time. Greedily keep intervals that end earliest."],
    starterCode: {
      javascript: "function eraseOverlapIntervals(intervals) {\n}\n",
      python: "def eraseOverlapIntervals(intervals):\n    pass\n",
      java: "class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n    }\n}\n",
    },
  },
  {
    id: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    difficulty: "intermediate",
    patternId: "merge-intervals",
    description:
      "Given an array of meeting time intervals `intervals` where `intervals[i] = [startᵢ, endᵢ]`, return the minimum number of conference rooms required.",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
      { input: "intervals = [[7,10],[2,4]]", output: "1" },
    ],
    constraints: ["1 <= intervals.length <= 10⁴", "0 <= startᵢ < endᵢ <= 10⁶"],
    hints: ["Sort starts and ends separately. Sweep line with two pointers."],
    starterCode: {
      javascript: "function minMeetingRooms(intervals) {\n}\n",
      python: "def minMeetingRooms(intervals):\n    pass\n",
      java: "class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n    }\n}\n",
    },
  },

  // ── Tree BFS ──
  {
    id: "zigzag-level-order",
    title: "Binary Tree Zigzag Level Order",
    difficulty: "intermediate",
    patternId: "tree-bfs",
    description:
      "Given the `root` of a binary tree, return the zigzag level order traversal of its nodes' values (i.e., from left to right, then right to left for the next level, alternating).",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" },
    ],
    constraints: ["The number of nodes is in the range [0, 2000]", "-100 <= Node.val <= 100"],
    hints: ["BFS with a flag to reverse each alternate level."],
    starterCode: {
      javascript: "function zigzagLevelOrder(root) {\n}\n",
      python: "def zigzagLevelOrder(root):\n    pass\n",
      java: "class Solution {\n    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {\n    }\n}\n",
    },
  },
  {
    id: "right-side-view",
    title: "Binary Tree Right Side View",
    difficulty: "intermediate",
    patternId: "tree-bfs",
    description:
      "Given the `root` of a binary tree, imagine standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.",
    examples: [
      { input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]" },
      { input: "root = [1,null,3]", output: "[1,3]" },
    ],
    constraints: ["The number of nodes is in the range [0, 100]", "-100 <= Node.val <= 100"],
    hints: ["BFS: last node at each level is visible from the right."],
    starterCode: {
      javascript: "function rightSideView(root) {\n}\n",
      python: "def rightSideView(root):\n    pass\n",
      java: "class Solution {\n    public List<Integer> rightSideView(TreeNode root) {\n    }\n}\n",
    },
  },

  // ── Tree DFS ──
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "beginner",
    patternId: "tree-dfs",
    description:
      "Given the `root` of a binary tree, invert the tree (mirror it) and return its root.",
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", output: "[2,3,1]" },
    ],
    constraints: ["The number of nodes is in the range [0, 100]", "-100 <= Node.val <= 100"],
    hints: ["Swap left and right children recursively."],
    starterCode: {
      javascript: "function invertTree(root) {\n}\n",
      python: "def invertTree(root):\n    pass\n",
      java: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n    }\n}\n",
    },
  },
  {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    difficulty: "intermediate",
    patternId: "tree-dfs",
    description:
      "Given the `root` of a binary tree, return the length of the diameter of the tree.\n\nThe diameter is the length of the longest path between any two nodes (may or may not pass through the root), measured in number of edges.",
    examples: [
      { input: "root = [1,2,3,4,5]", output: "3", explanation: "Path [4,2,1,3] or [5,2,1,3]" },
      { input: "root = [1,2]", output: "1" },
    ],
    constraints: ["The number of nodes is in the range [1, 10⁴]", "-100 <= Node.val <= 100"],
    hints: ["At each node, diameter candidate = leftDepth + rightDepth."],
    starterCode: {
      javascript: "function diameterOfBinaryTree(root) {\n}\n",
      python: "def diameterOfBinaryTree(root):\n    pass\n",
      java: "class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n    }\n}\n",
    },
  },

  // ── Modified Binary Search ──
  {
    id: "find-min-rotated-sorted",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "intermediate",
    patternId: "modified-binary-search",
    description:
      "Suppose an array of length `n` sorted in ascending order is rotated between `1` and `n` times. Given the rotated array `nums`, return the minimum element.\n\nYou must write an algorithm that runs in O(log n) time.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All integers are unique"],
    hints: ["Compare mid with right end to decide which half is sorted."],
    starterCode: {
      javascript: "function findMin(nums) {\n}\n",
      python: "def findMin(nums):\n    pass\n",
      java: "class Solution {\n    public int findMin(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    difficulty: "beginner",
    patternId: "modified-binary-search",
    description:
      "Given a sorted array of distinct integers and a `target` value, return the index if the target is found. If not, return the index where it would be inserted in order.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      { input: "nums = [1,3,5,6], target = 5", output: "2" },
      { input: "nums = [1,3,5,6], target = 2", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10⁴", "-10⁴ <= nums[i], target <= 10⁴", "nums is sorted with distinct values"],
    hints: ["Classic binary search; if not found, left pointer is insert position."],
    starterCode: {
      javascript: "function searchInsert(nums, target) {\n}\n",
      python: "def searchInsert(nums, target):\n    pass\n",
      java: "class Solution {\n    public int searchInsert(int[] nums, int target) {\n    }\n}\n",
    },
  },

  // ── Top K Elements ──
  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "intermediate",
    patternId: "top-k-elements",
    description:
      "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: ["1 <= nums.length <= 10⁵", "-10⁴ <= nums[i] <= 10⁴", "k is in the range [1, number of unique elements]"],
    hints: ["Count frequencies, then min-heap of size k or bucket sort."],
    starterCode: {
      javascript: "function topKFrequent(nums, k) {\n}\n",
      python: "def topKFrequent(nums, k):\n    pass\n",
      java: "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n    }\n}\n",
    },
  },
  {
    id: "k-closest-points",
    title: "K Closest Points to Origin",
    difficulty: "intermediate",
    patternId: "top-k-elements",
    description:
      "Given an array of `points` where `points[i] = [xᵢ, yᵢ]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance is the Euclidean distance.",
    examples: [
      { input: "points = [[1,3],[-2,2]], k = 1", output: "[[-2,2]]" },
      { input: "points = [[3,3],[5,-1],[-2,4]], k = 2", output: "[[3,3],[-2,4]]" },
    ],
    constraints: ["1 <= k <= points.length <= 10⁴", "-10⁴ <= xᵢ, yᵢ <= 10⁴"],
    hints: ["Max-heap of size k by distance, or quickselect on distances."],
    starterCode: {
      javascript: "function kClosest(points, k) {\n}\n",
      python: "def kClosest(points, k):\n    pass\n",
      java: "class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n    }\n}\n",
    },
  },

  // ── Subsets / Backtracking ──
  {
    id: "permutations",
    title: "Permutations",
    difficulty: "intermediate",
    patternId: "subsets",
    description:
      "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { input: "nums = [0,1]", output: "[[0,1],[1,0]]" },
    ],
    constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All integers are unique"],
    hints: ["Backtrack: swap or use a used[] array to build each permutation."],
    starterCode: {
      javascript: "function permute(nums) {\n}\n",
      python: "def permute(nums):\n    pass\n",
      java: "class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n    }\n}\n",
    },
  },
  {
    id: "letter-combinations-phone",
    title: "Letter Combinations of a Phone Number",
    difficulty: "intermediate",
    patternId: "subsets",
    description:
      "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent on a telephone keypad. Return the answer in any order.",
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""', output: "[]" },
    ],
    constraints: ["0 <= digits.length <= 4", "digits[i] is a digit in the range ['2', '9']"],
    hints: ["Backtrack over each digit, branching into its 3-4 letters."],
    starterCode: {
      javascript: "function letterCombinations(digits) {\n}\n",
      python: "def letterCombinations(digits):\n    pass\n",
      java: "class Solution {\n    public List<String> letterCombinations(String digits) {\n    }\n}\n",
    },
  },

  // ── Knapsack DP ──
  {
    id: "target-sum",
    title: "Target Sum",
    difficulty: "intermediate",
    patternId: "knapsack-dp",
    description:
      "You are given an integer array `nums` and an integer `target`.\n\nAdd `'+'` or `'-'` before each integer in `nums` so that the resulting expression evaluates to `target`. Return the number of different expressions that can be built.",
    examples: [
      { input: "nums = [1,1,1,1,1], target = 3", output: "5" },
      { input: "nums = [1], target = 1", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 20", "0 <= nums[i] <= 1000", "0 <= sum(nums[i]) <= 1000", "-1000 <= target <= 1000"],
    hints: ["Subset sum variant: dp[sum] = ways to reach sum with +/- signs."],
    starterCode: {
      javascript: "function findTargetSumWays(nums, target) {\n}\n",
      python: "def findTargetSumWays(nums, target):\n    pass\n",
      java: "class Solution {\n    public int findTargetSumWays(int[] nums, int target) {\n    }\n}\n",
    },
  },

  // ── Fibonacci DP ──
  {
    id: "decode-ways",
    title: "Decode Ways",
    difficulty: "intermediate",
    patternId: "fibonacci-dp",
    description:
      "A message containing letters from `A-Z` can be encoded into numbers using the mapping `'A' -> 1`, `'B' -> 2`, ..., `'Z' -> 26`.\n\nGiven a string `s` containing only digits, return the number of ways to decode it.",
    examples: [
      { input: 's = "12"', output: "2", explanation: '"AB" (1 2) or "L" (12)' },
      { input: 's = "226"', output: "3" },
    ],
    constraints: ["1 <= s.length <= 100", "s contains only digits and may contain leading zeros"],
    hints: ["dp[i] = ways to decode s[0..i]. Add dp[i-1] if valid single, dp[i-2] if valid pair."],
    starterCode: {
      javascript: "function numDecodings(s) {\n}\n",
      python: "def numDecodings(s):\n    pass\n",
      java: "class Solution {\n    public int numDecodings(String s) {\n    }\n}\n",
    },
  },

  // ── Monotonic Stack ──
  {
    id: "next-greater-element",
    title: "Next Greater Element I",
    difficulty: "beginner",
    patternId: "monotonic-stack",
    description:
      "The next greater element of some element `x` in an array is the first greater element to its right. If it does not exist, return `-1`.\n\nGiven two distinct 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`, return an array `answer` of length `nums1.length` where `answer[i]` is the next greater element for `nums1[i]` in `nums2`.",
    examples: [
      { input: "nums1 = [4,1,2], nums2 = [1,3,4,2]", output: "[-1,3,-1]" },
      { input: "nums1 = [2,4], nums2 = [1,2,3,4]", output: "[3,-1]" },
    ],
    constraints: ["1 <= nums1.length <= nums2.length <= 1000", "All integers are unique"],
    hints: ["Monotonic decreasing stack on nums2 to build next-greater map."],
    starterCode: {
      javascript: "function nextGreaterElement(nums1, nums2) {\n}\n",
      python: "def nextGreaterElement(nums1, nums2):\n    pass\n",
      java: "class Solution {\n    public int[] nextGreaterElement(int[] nums1, int[] nums2) {\n    }\n}\n",
    },
  },

  // ── Topological Sort ──
  {
    id: "course-schedule-order",
    title: "Course Schedule II",
    difficulty: "intermediate",
    patternId: "topological-sort",
    description:
      "There are a total of `numCourses` courses labeled `0` to `numCourses - 1`. You are given `prerequisites` where `prerequisites[i] = [aᵢ, bᵢ]` means you must take course `bᵢ` before `aᵢ`.\n\nReturn the ordering of courses you should take to finish all courses. If impossible, return an empty array.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "[0,1]" },
      { input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", output: "[0,1,2,3] or [0,2,1,3]" },
    ],
    constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= numCourses * (numCourses - 1)"],
    hints: ["Kahn's BFS topological sort or DFS post-order reversal."],
    starterCode: {
      javascript: "function findOrder(numCourses, prerequisites) {\n}\n",
      python: "def findOrder(numCourses, prerequisites):\n    pass\n",
      java: "class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n    }\n}\n",
    },
  },

  // ── Graph BFS/DFS ──
  {
    id: "rotting-oranges",
    title: "Rotting Oranges",
    difficulty: "intermediate",
    patternId: "graph-bfs-dfs",
    description:
      "You are given an `m x n` grid where each cell can have one of three values:\n\n- `0` empty\n- `1` fresh orange\n- `2` rotten orange\n\nEvery minute, any fresh orange adjacent to a rotten one becomes rotten. Return the minimum number of minutes until no fresh orange remains. If impossible, return `-1`.",
    examples: [
      { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
      { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 10"],
    hints: ["Multi-source BFS from all rotten oranges simultaneously."],
    starterCode: {
      javascript: "function orangesRotting(grid) {\n}\n",
      python: "def orangesRotting(grid):\n    pass\n",
      java: "class Solution {\n    public int orangesRotting(int[][] grid) {\n    }\n}\n",
    },
  },
  {
    id: "word-search",
    title: "Word Search",
    difficulty: "intermediate",
    patternId: "graph-bfs-dfs",
    description:
      "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once.",
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true" },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: "true" },
    ],
    constraints: ["m == board.length", "n == board[i].length", "1 <= word.length <= 15"],
    hints: ["DFS backtracking with visited marking on the grid."],
    starterCode: {
      javascript: "function exist(board, word) {\n}\n",
      python: "def exist(board, word):\n    pass\n",
      java: "class Solution {\n    public boolean exist(char[][] board, String word) {\n    }\n}\n",
    },
  },

  // ── Trie ──
  {
    id: "design-add-search-words",
    title: "Design Add and Search Words",
    difficulty: "intermediate",
    patternId: "trie",
    description:
      "Design a data structure that supports adding new words and finding if a string matches any previously added string.\n\nImplement the `WordDictionary` class:\n\n- `WordDictionary()` initializes the object\n- `addWord(word)` adds `word` to the data structure\n- `search(word)` returns `true` if there is any string that matches `word`, where `'.'` can match any letter",
    examples: [
      { input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]', output: "[null,null,null,null,false,true,true,true]" },
    ],
    constraints: ["1 <= word.length <= 25", "word consists of lowercase English letters or '.'", "At most 10⁴ calls"],
    hints: ["Trie nodes; DFS on '.' branches to try all children."],
    starterCode: {
      javascript: "var WordDictionary = function() {\n};\nWordDictionary.prototype.addWord = function(word) {\n};\nWordDictionary.prototype.search = function(word) {\n};\n",
      python: "class WordDictionary:\n    def __init__(self):\n        pass\n    def addWord(self, word):\n        pass\n    def search(self, word):\n        pass\n",
      java: "class WordDictionary {\n    public WordDictionary() {}\n    public void addWord(String word) {}\n    public boolean search(String word) {}\n}\n",
    },
  },

  // ── Cyclic Sort ──
  {
    id: "find-all-duplicates",
    title: "Find All Duplicates in an Array",
    difficulty: "intermediate",
    patternId: "cyclic-sort",
    description:
      "Given an integer array `nums` of length `n` where all integers are in the range `[1, n]` and each appears once or twice, return an array of all integers that appears twice.\n\nYou must write an algorithm that runs in O(n) time and uses only constant extra space.",
    examples: [
      { input: "nums = [4,3,2,7,8,2,3,1]", output: "[2,3]" },
      { input: "nums = [1,1,2]", output: "[1]" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 10⁵", "1 <= nums[i] <= n"],
    hints: ["Place each number at index (num-1). If already there, it's a duplicate."],
    starterCode: {
      javascript: "function findDuplicates(nums) {\n}\n",
      python: "def findDuplicates(nums):\n    pass\n",
      java: "class Solution {\n    public List<Integer> findDuplicates(int[] nums) {\n    }\n}\n",
    },
  },

  // ── Union Find ──
  {
    id: "redundant-connection",
    title: "Redundant Connection",
    difficulty: "intermediate",
    patternId: "union-find",
    description:
      "In this problem, a tree is an undirected graph with no cycles.\n\nYou are given a graph that started as a tree with `n` nodes labeled `1` to `n`, with one additional edge added. Return an edge that can be removed so that the resulting graph is a tree. If there are multiple answers, return the last edge in the input.",
    examples: [
      { input: "edges = [[1,2],[1,3],[2,3]]", output: "[2,3]" },
      { input: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", output: "[1,4]" },
    ],
    constraints: ["n == edges.length", "3 <= n <= 1000", "edges[i].length == 2"],
    hints: ["Union-Find: first edge connecting already-connected nodes is redundant."],
    starterCode: {
      javascript: "function findRedundantConnection(edges) {\n}\n",
      python: "def findRedundantConnection(edges):\n    pass\n",
      java: "class Solution {\n    public int[] findRedundantConnection(int[][] edges) {\n    }\n}\n",
    },
  },

  // ── K-way Merge ──
  {
    id: "smallest-range-k-lists",
    title: "Smallest Range Covering Elements from K Lists",
    difficulty: "advanced",
    patternId: "k-way-merge",
    description:
      "You have `k` lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the `k` lists.\n\nReturn the range `[min, max]` with the smallest difference.",
    examples: [
      { input: "nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", output: "[20,24]" },
      { input: "nums = [[1,2,3],[1,2,3],[1,2,3]]", output: "[1,1]" },
    ],
    constraints: ["nums.length == k", "1 <= k <= 3500", "1 <= nums[i].length <= 50"],
    hints: ["Min-heap tracking head of each list; track current min/max range."],
    starterCode: {
      javascript: "function smallestRange(nums) {\n}\n",
      python: "def smallestRange(nums):\n    pass\n",
      java: "class Solution {\n    public int[] smallestRange(List<List<Integer>> nums) {\n    }\n}\n",
    },
  },

  // ── Greedy ──
  {
    id: "task-scheduler",
    title: "Task Scheduler",
    difficulty: "intermediate",
    patternId: "greedy",
    description:
      "You are given an array of CPU tasks represented by letters `A` to `Z` and a cooling interval `n`. Each cycle can complete one task or be idle.\n\nReturn the least number of intervals the CPU will take to finish all tasks.",
    examples: [
      { input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: "8", explanation: "A -> B -> idle -> A -> B -> idle -> A -> B" },
      { input: 'tasks = ["A","A","A","B","B","B"], n = 0', output: "6" },
    ],
    constraints: ["1 <= tasks.length <= 10⁴", "tasks[i] is an uppercase English letter", "0 <= n <= 100"],
    hints: ["Formula: (maxFreq - 1) * (n + 1) + countOfMaxFreq, or tasks.length."],
    starterCode: {
      javascript: "function leastInterval(tasks, n) {\n}\n",
      python: "def leastInterval(tasks, n):\n    pass\n",
      java: "class Solution {\n    public int leastInterval(char[] tasks, int n) {\n    }\n}\n",
    },
  },

  // ── Bitmask DP ──
  {
    id: "maximum-product-word-lengths",
    title: "Maximum Product of Word Lengths",
    difficulty: "intermediate",
    patternId: "bitmask-dp",
    description:
      "Given a string array `words`, find the maximum value of `length(word[i]) * length(word[j])` where the two words do not share any letters.\n\nYou may assume each word contains only lowercase English letters. If no such pair exists, return 0.",
    examples: [
      { input: 'words = ["abcw","baz","foo","bar","xtfn","abcdef"]', output: "16", explanation: '"abcw" and "xtfn"' },
      { input: 'words = ["a","ab","abc","d","cd","bcd","abcd"]', output: "4" },
    ],
    constraints: ["2 <= words.length <= 1000", "1 <= words[i].length <= 1000"],
    hints: ["Encode each word as a 26-bit bitmask. Two words are compatible if (maskA & maskB) == 0."],
    starterCode: {
      javascript: "function maxProduct(words) {\n}\n",
      python: "def maxProduct(words):\n    pass\n",
      java: "class Solution {\n    public int maxProduct(String[] words) {\n    }\n}\n",
    },
  },
  {
    id: "can-partition-k-subsets",
    title: "Partition to K Equal Sum Subsets",
    difficulty: "advanced",
    patternId: "bitmask-dp",
    description:
      "Given an integer array `nums` and an integer `k`, return `true` if it is possible to distribute `nums` into `k` non-empty subsets whose sums are all equal.",
    examples: [
      { input: "nums = [4,3,2,3,5,2,1], k = 4", output: "true", explanation: "[5],[1,4],[2,3],[2,3]" },
      { input: "nums = [1,2,3,4], k = 3", output: "false" },
    ],
    constraints: ["1 <= k <= nums.length <= 16", "0 <= nums[i] <= 10⁴", "The frequency of each element is in the range [1, 4]"],
    hints: ["Bitmask DP or backtracking with used mask. Target sum = total / k."],
    starterCode: {
      javascript: "function canPartitionKSubsets(nums, k) {\n}\n",
      python: "def canPartitionKSubsets(nums, k):\n    pass\n",
      java: "class Solution {\n    public boolean canPartitionKSubsets(int[] nums, int k) {\n    }\n}\n",
    },
  },

  // ── Palindromic DP ──
  {
    id: "longest-palindrome-substring",
    title: "Longest Palindromic Substring",
    difficulty: "intermediate",
    patternId: "palindromic-dp",
    description:
      "Given a string `s`, return the longest palindromic substring in `s`.",
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also accepted' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: ["1 <= s.length <= 1000", "s consists of digits and English letters"],
    hints: ["Expand around center for each index, or dp[i][j] = palindrome in s[i..j]."],
    starterCode: {
      javascript: "function longestPalindrome(s) {\n}\n",
      python: "def longestPalindrome(s):\n    pass\n",
      java: "class Solution {\n    public String longestPalindrome(String s) {\n    }\n}\n",
    },
  },

  // ── Two Heaps ──
  {
    id: "sliding-window-median",
    title: "Sliding Window Median",
    difficulty: "advanced",
    patternId: "two-heaps",
    description:
      "The median is the middle value in an ordered list. If the list length is even, the median is the mean of the two middle values.\n\nGiven an array `nums` and an integer `k`, there is a sliding window of size `k` moving from left to right. Return the median array for each window position.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]" },
      { input: "nums = [1,2,3,4,2,3,1,4,2], k = 3", output: "[2.00000,3.00000,3.00000,3.00000,2.00000,3.00000,2.00000]" },
    ],
    constraints: ["1 <= k <= nums.length <= 10⁵", "-10⁵ <= nums[i] <= 10⁵"],
    hints: ["Two heaps with lazy deletion, or balanced BST. Slide window and update heaps."],
    starterCode: {
      javascript: "function medianSlidingWindow(nums, k) {\n}\n",
      python: "def medianSlidingWindow(nums, k):\n    pass\n",
      java: "class Solution {\n    public double[] medianSlidingWindow(int[] nums, int k) {\n    }\n}\n",
    },
  },
];
