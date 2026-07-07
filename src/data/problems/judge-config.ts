import type { ProblemJudgeConfig } from "@/lib/types";

export const problemJudgeConfigs: Record<string, ProblemJudgeConfig> = {
  "two-sum": {
    functionName: "twoSum",
    paramNames: ["nums", "target"],
    testCases: [
      { args: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { args: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { args: { nums: [3, 3], target: 6 }, expected: [0, 1], hidden: true },
    ],
    solutionCode: {
      javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`,
    },
    approaches: [
      {
        name: "Hash map",
        description: "One pass: store each value's index. For each element, check if complement exists.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    editorial:
      "The optimal approach uses a hash map for O(n) time. Two pointers only work on sorted arrays — if you sort first, you must track original indices.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  "valid-palindrome": {
    functionName: "isPalindrome",
    paramNames: ["s"],
    testCases: [
      { args: { s: "A man, a plan, a canal: Panama" }, expected: true },
      { args: { s: "race a car" }, expected: false },
      { args: { s: " " }, expected: true, hidden: true },
    ],
    solutionCode: {
      javascript: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !/[a-z0-9]/i.test(s[l])) l++;
    while (l < r && !/[a-z0-9]/i.test(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`,
    },
    approaches: [
      {
        name: "Two pointers",
        description: "Skip non-alphanumeric from both ends, compare lowercase chars.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Classic two-pointer pattern. Clean the string in-place with pointers rather than building a new string.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "climbing-stairs": {
    functionName: "climbStairs",
    paramNames: ["n"],
    testCases: [
      { args: { n: 2 }, expected: 2 },
      { args: { n: 3 }, expected: 3 },
      { args: { n: 5 }, expected: 8, hidden: true },
    ],
    solutionCode: {
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}`,
    },
    approaches: [
      {
        name: "Fibonacci DP",
        description: "ways(n) = ways(n-1) + ways(n-2). Use two variables instead of full array.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "This is Fibonacci in disguise. Recognize overlapping subproblems — that's the DP signal.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "missing-number": {
    functionName: "missingNumber",
    paramNames: ["nums"],
    testCases: [
      { args: { nums: [3, 0, 1] }, expected: 2 },
      { args: { nums: [0, 1] }, expected: 2 },
      { args: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, expected: 8, hidden: true },
    ],
    solutionCode: {
      javascript: `function missingNumber(nums) {
  let n = nums.length;
  let expected = (n * (n + 1)) / 2;
  let sum = 0;
  for (const x of nums) sum += x;
  return expected - sum;
}`,
    },
    approaches: [
      {
        name: "Gauss sum",
        description: "Expected sum of 0..n minus actual sum equals missing number.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
      {
        name: "XOR",
        description: "XOR all indices and values — missing number remains.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Cyclic sort also works since values are in range [0,n]. Math/XOR are fastest to code in interviews.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "search-insert-position": {
    functionName: "searchInsert",
    paramNames: ["nums", "target"],
    testCases: [
      { args: { nums: [1, 3, 5, 6], target: 5 }, expected: 2 },
      { args: { nums: [1, 3, 5, 6], target: 2 }, expected: 1 },
      { args: { nums: [1, 3, 5, 6], target: 7 }, expected: 4, hidden: true },
    ],
    solutionCode: {
      javascript: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;
}`,
    },
    approaches: [
      {
        name: "Binary search",
        description: "Standard binary search; when not found, lo is the insert position.",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "The key insight: when binary search ends, `lo` points to the first element >= target.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  "longest-substring-without-repeating": {
    functionName: "lengthOfLongestSubstring",
    paramNames: ["s"],
    testCases: [
      { args: { s: "abcabcbb" }, expected: 3 },
      { args: { s: "bbbbb" }, expected: 1 },
      { args: { s: "pwwkew" }, expected: 3, hidden: true },
    ],
    solutionCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (last.has(s[right]) && last.get(s[right]) >= left) {
      left = last.get(s[right]) + 1;
    }
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    },
    approaches: [
      {
        name: "Sliding window",
        description: "Expand right, shrink left when duplicate found. Track last index per char.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(n, alphabet))",
      },
    ],
    editorial: "Sliding window with a hash map of last seen indices. Jump left pointer instead of shrinking one-by-one.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, alphabet))",
  },
  "min-size-subarray-sum": {
    functionName: "minSubArrayLen",
    paramNames: ["target", "nums"],
    testCases: [
      { args: { target: 7, nums: [2, 3, 1, 2, 4, 3] }, expected: 2 },
      { args: { target: 4, nums: [1, 4, 4] }, expected: 1 },
      { args: { target: 11, nums: [1, 1, 1, 1, 1, 1, 1, 1] }, expected: 0, hidden: true },
    ],
    solutionCode: {
      javascript: `function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}`,
    },
    approaches: [
      {
        name: "Sliding window",
        description: "Expand until sum >= target, then shrink from left to minimize length.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Variable-size sliding window. Each element enters and leaves the window at most once.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "house-robber": {
    functionName: "rob",
    paramNames: ["nums"],
    testCases: [
      { args: { nums: [1, 2, 3, 1] }, expected: 4 },
      { args: { nums: [2, 7, 9, 3, 1] }, expected: 12 },
      { args: { nums: [5, 3, 4, 11, 2] }, expected: 16, hidden: true },
    ],
    solutionCode: {
      javascript: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const cur = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    },
    approaches: [
      {
        name: "DP",
        description: "dp[i] = max(dp[i-1], nums[i] + dp[i-2]). Roll into two variables.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "At each house: rob it (+ profit from i-2) or skip it (profit from i-1). Classic 1D DP.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "coin-change": {
    functionName: "coinChange",
    paramNames: ["coins", "amount"],
    testCases: [
      { args: { coins: [1, 2, 5], amount: 11 }, expected: 3 },
      { args: { coins: [2], amount: 3 }, expected: -1 },
      { args: { coins: [1, 3, 4], amount: 6 }, expected: 2, hidden: true },
    ],
    solutionCode: {
      javascript: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    },
    approaches: [
      {
        name: "Unbounded knapsack DP",
        description: "dp[a] = min coins for amount a. Try each coin.",
        timeComplexity: "O(amount * coins)",
        spaceComplexity: "O(amount)",
      },
    ],
    editorial: "Bottom-up DP. Outer loop on amount, inner on coins — classic unbounded knapsack pattern.",
    timeComplexity: "O(amount × |coins|)",
    spaceComplexity: "O(amount)",
  },
  "merge-intervals": {
    functionName: "merge",
    paramNames: ["intervals"],
    testCases: [
      { args: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected: [[1, 6], [8, 10], [15, 18]] },
      { args: { intervals: [[1, 4], [4, 5]] }, expected: [[1, 5]] },
      { args: { intervals: [[1, 4], [0, 4]] }, expected: [[0, 4]], hidden: true },
    ],
    solutionCode: {
      javascript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else res.push(intervals[i]);
  }
  return res;
}`,
    },
    approaches: [
      {
        name: "Sort and merge",
        description: "Sort by start. If current overlaps last, extend end; else push new.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
      },
    ],
    editorial: "Sort first, then linear scan merging overlaps. State your O(n log n) complexity from sorting.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  "number-of-islands": {
    functionName: "numIslands",
    paramNames: ["grid"],
    testCases: [
      {
        args: { grid: [["1", "1", "0"], ["0", "1", "0"], ["1", "0", "1"]] },
        expected: 3,
      },
      { args: { grid: [["1", "1", "1"], ["0", "1", "0"], ["1", "1", "1"]] }, expected: 1 },
      { args: { grid: [["0", "0"], ["0", "0"]] }, expected: 0, hidden: true },
    ],
    solutionCode: {
      javascript: `function numIslands(grid) {
  let count = 0;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== "1") return;
    grid[r][c] = "0";
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "1") { count++; dfs(r, c); }
    }
  }
  return count;
}`,
    },
    approaches: [
      {
        name: "DFS flood fill",
        description: "For each unvisited land cell, DFS to sink the island and increment count.",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n) recursion",
      },
    ],
    editorial: "Graph DFS on a grid. Mark visited by mutating cells to avoid extra memory.",
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
  },
  "3sum": {
    functionName: "threeSum",
    paramNames: ["nums"],
    testCases: [
      { args: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: { nums: [0, 1, 1] }, expected: [] },
      { args: { nums: [0, 0, 0] }, expected: [[0, 0, 0]], hidden: true },
    ],
    solutionCode: {
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}`,
    },
    approaches: [
      {
        name: "Sort + two pointers",
        description: "Fix one element, two-pointer the rest for sum zero. Skip duplicates.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1) extra",
      },
    ],
    editorial: "Sort enables two pointers. Handle duplicate triplets carefully — interviewers watch for this.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  },
  "sort-colors": {
    functionName: "sortColors",
    paramNames: ["nums"],
    testCases: [
      { args: { nums: [2, 0, 2, 1, 1, 0] }, expected: [0, 0, 1, 1, 2, 2] },
      { args: { nums: [2, 0, 1] }, expected: [0, 1, 2] },
      { args: { nums: [1] }, expected: [1], hidden: true },
    ],
    solutionCode: {
      javascript: `function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    }
  }
}`,
    },
    approaches: [
      {
        name: "Dutch national flag",
        description: "Three pointers partition array into 0s, 1s, 2s in one pass.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "In-place three-way partition. Note: mutates input array — matches problem requirement.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "top-k-frequent-elements": {
    functionName: "topKFrequent",
    paramNames: ["nums", "k"],
    testCases: [
      { args: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, expected: [1, 2] },
      { args: { nums: [1], k: 1 }, expected: [1] },
      { args: { nums: [4, 4, 4, 2, 2, 1], k: 2 }, expected: [4, 2], hidden: true },
    ],
    solutionCode: {
      javascript: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([n]) => n);
}`,
    },
    approaches: [
      {
        name: "Hash map + sort",
        description: "Count frequencies, sort by freq, take top k. Bucket sort achieves O(n).",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
      },
    ],
    editorial: "For interviews, mention bucket sort O(n) as follow-up. Hash map counting is the core skill.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  "find-duplicate-number": {
    functionName: "findDuplicate",
    paramNames: ["nums"],
    testCases: [
      { args: { nums: [1, 3, 4, 2, 2] }, expected: 2 },
      { args: { nums: [3, 1, 3, 4, 2] }, expected: 3 },
      { args: { nums: [1, 1] }, expected: 1, hidden: true },
    ],
    solutionCode: {
      javascript: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
    },
    approaches: [
      {
        name: "Floyd's cycle",
        description: "Treat array as linked list where i -> nums[i]. Cycle entry is duplicate.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Fast-slow pointers on implicit linked list. Brilliant O(1) space solution.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "next-greater-element": {
    functionName: "nextGreaterElement",
    paramNames: ["nums1", "nums2"],
    testCases: [
      { args: { nums1: [4, 1, 2], nums2: [1, 3, 4, 2] }, expected: [-1, 3, -1] },
      { args: { nums1: [2, 4], nums2: [1, 2, 3, 4] }, expected: [3, -1] },
      { args: { nums1: [1], nums2: [1, 2] }, expected: [2], hidden: true },
    ],
    solutionCode: {
      javascript: `function nextGreaterElement(nums1, nums2) {
  const next = new Map();
  const stack = [];
  for (const n of nums2) {
    while (stack.length && stack[stack.length - 1] < n) {
      next.set(stack.pop(), n);
    }
    stack.push(n);
  }
  return nums1.map((n) => next.get(n) ?? -1);
}`,
    },
    approaches: [
      {
        name: "Monotonic stack",
        description: "Build next-greater map for nums2, then lookup nums1.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    editorial: "Decreasing monotonic stack. Each element pushed and popped once.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  "jump-game": {
    functionName: "canJump",
    paramNames: ["nums"],
    testCases: [
      { args: { nums: [2, 3, 1, 1, 4] }, expected: true },
      { args: { nums: [3, 2, 1, 0, 4] }, expected: false },
      { args: { nums: [0] }, expected: true, hidden: true },
    ],
    solutionCode: {
      javascript: `function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;
  }
  return true;
}`,
    },
    approaches: [
      {
        name: "Greedy",
        description: "Track farthest reachable index. If i > farthest, stuck.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Greedy farthest-reach. One pass, no DP needed.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "decode-ways": {
    functionName: "numDecodings",
    paramNames: ["s"],
    testCases: [
      { args: { s: "12" }, expected: 2 },
      { args: { s: "226" }, expected: 3 },
      { args: { s: "06" }, expected: 0, hidden: true },
    ],
    solutionCode: {
      javascript: `function numDecodings(s) {
  if (s[0] === "0") return 0;
  let prev2 = 1, prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let cur = 0;
    if (s[i] !== "0") cur += prev1;
    const two = parseInt(s.slice(i - 1, i + 1), 10);
    if (two >= 10 && two <= 26) cur += prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    },
    approaches: [
      {
        name: "DP",
        description: "At each position: decode single digit (if not 0) or pair (if 10-26).",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Fibonacci-style DP with validity checks for leading zeros and two-digit bounds.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "daily-temperatures": {
    functionName: "dailyTemperatures",
    paramNames: ["temperatures"],
    testCases: [
      { args: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: { temperatures: [30, 40, 50, 60] }, expected: [1, 1, 1, 0] },
      { args: { temperatures: [55] }, expected: [0], hidden: true },
    ],
    solutionCode: {
      javascript: `function dailyTemperatures(temperatures) {
  const res = Array(temperatures.length).fill(0);
  const stack = [];
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const idx = stack.pop();
      res[idx] = i - idx;
    }
    stack.push(i);
  }
  return res;
}`,
      python: `def dailyTemperatures(temperatures):
    res = [0] * len(temperatures)
    stack = []
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            idx = stack.pop()
            res[idx] = i - idx
        stack.append(i)
    return res`,
    },
    approaches: [
      {
        name: "Monotonic stack",
        description: "Stack of indices with decreasing temperatures. Pop when warmer day found.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    editorial: "Stack stores indices, not values. Classic next-greater-element variant.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  "container-with-most-water": {
    functionName: "maxArea",
    paramNames: ["height"],
    testCases: [
      { args: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 },
      { args: { height: [1, 1] }, expected: 1 },
      { args: { height: [4, 3, 2, 1, 4] }, expected: 16, hidden: true },
    ],
    solutionCode: {
      javascript: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`,
      python: `def maxArea(height):
    l, r, best = 0, len(height) - 1, 0
    while l < r:
        best = max(best, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best`,
    },
    approaches: [
      {
        name: "Two pointers",
        description: "Move the shorter line inward — only way to possibly increase area.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Greedy two pointers. Moving the taller line cannot improve area.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "trapping-rain-water": {
    functionName: "trap",
    paramNames: ["height"],
    testCases: [
      { args: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected: 6 },
      { args: { height: [4, 2, 0, 3, 2, 5] }, expected: 9 },
      { args: { height: [1, 0, 1] }, expected: 1, hidden: true },
    ],
    solutionCode: {
      javascript: `function trap(height) {
  let l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      leftMax = Math.max(leftMax, height[l]);
      water += leftMax - height[l++];
    } else {
      rightMax = Math.max(rightMax, height[r]);
      water += rightMax - height[r--];
    }
  }
  return water;
}`,
      python: `def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = water = 0
    while l < r:
        if height[l] < height[r]:
            left_max = max(left_max, height[l])
            water += left_max - height[l]
            l += 1
        else:
            right_max = max(right_max, height[r])
            water += right_max - height[r]
            r -= 1
    return water`,
    },
    approaches: [
      {
        name: "Two pointers",
        description: "Track left/right max; add trapped water from the shorter side.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "Two-pointer rain trapping. Process the side with smaller max height.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  "search-rotated-sorted-array": {
    functionName: "search",
    paramNames: ["nums", "target"],
    testCases: [
      { args: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expected: 4 },
      { args: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expected: -1 },
      { args: { nums: [1], target: 0 }, expected: -1, hidden: true },
    ],
    solutionCode: {
      javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
      python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
    },
    approaches: [
      {
        name: "Modified binary search",
        description: "Identify which half is sorted, then check if target lies there.",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
      },
    ],
    editorial: "One half is always sorted. Decide which half to search based on target range.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  "kth-largest-element": {
    functionName: "findKthLargest",
    paramNames: ["nums", "k"],
    testCases: [
      { args: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, expected: 5 },
      { args: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 }, expected: 4 },
      { args: { nums: [1], k: 1 }, expected: 1, hidden: true },
    ],
    solutionCode: {
      javascript: `function findKthLargest(nums, k) {
  const heap = [];
  const push = (n) => {
    heap.push(n);
    heap.sort((a, b) => a - b);
    if (heap.length > k) heap.shift();
  };
  for (const n of nums) push(n);
  return heap[0];
}`,
      python: `def findKthLargest(nums, k):
    import heapq
    h = []
    for n in nums:
        heapq.heappush(h, n)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]`,
    },
    approaches: [
      {
        name: "Min-heap of size k",
        description: "Keep k largest elements in a min-heap; root is kth largest.",
        timeComplexity: "O(n log k)",
        spaceComplexity: "O(k)",
      },
    ],
    editorial: "Min-heap of size k is interview-friendly. Mention quickselect O(n) average as follow-up.",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
  },
  "course-schedule": {
    functionName: "canFinish",
    paramNames: ["numCourses", "prerequisites"],
    testCases: [
      { args: { numCourses: 2, prerequisites: [[1, 0]] }, expected: true },
      { args: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, expected: false },
      { args: { numCourses: 3, prerequisites: [[0, 1], [0, 2], [1, 2]] }, expected: true, hidden: true },
    ],
    solutionCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  const indeg = Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let seen = 0;
  while (q.length) {
    const n = q.shift();
    seen++;
    for (const next of adj[n]) {
      if (--indeg[next] === 0) q.push(next);
    }
  }
  return seen === numCourses;
}`,
      python: `def canFinish(numCourses, prerequisites):
    from collections import deque
    indeg = [0] * numCourses
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(numCourses) if indeg[i] == 0)
    seen = 0
    while q:
        n = q.popleft()
        seen += 1
        for nxt in adj[n]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return seen == numCourses`,
    },
    approaches: [
      {
        name: "Kahn's topological sort",
        description: "BFS from zero-indegree nodes. Cycle exists if not all nodes processed.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V + E)",
      },
    ],
    editorial: "Topological sort detects cycles in prerequisite graph.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
  },
  "word-search": {
    functionName: "exist",
    paramNames: ["board", "word"],
    testCases: [
      {
        args: {
          board: [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          word: "ABCCED",
        },
        expected: true,
      },
      {
        args: {
          board: [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          word: "SEE",
        },
        expected: true,
      },
      {
        args: { board: [["A", "B"], ["C", "D"]], word: "ABDC" },
        expected: false,
        hidden: true,
      },
    ],
    solutionCode: {
      javascript: `function exist(board, word) {
  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
    if (board[r][c] !== word[i]) return false;
    const ch = board[r][c];
    board[r][c] = '#';
    const found = dfs(r+1,c,i+1) || dfs(r-1,c,i+1) || dfs(r,c+1,i+1) || dfs(r,c-1,i+1);
    board[r][c] = ch;
    return found;
  };
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[0].length; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
      python: `def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
            return False
        ch = board[r][c]
        board[r][c] = '#'
        found = any(dfs(r+dr, c+dc, i+1) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))
        board[r][c] = ch
        return found
    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))`,
    },
    approaches: [
      {
        name: "DFS backtracking",
        description: "Try each cell as start; mark visited, backtrack on failure.",
        timeComplexity: "O(m × n × 4^L)",
        spaceComplexity: "O(L)",
      },
    ],
    editorial: "Grid DFS with backtracking. Mark cells visited by mutating board temporarily.",
    timeComplexity: "O(m × n × 4^L)",
    spaceComplexity: "O(L)",
  },
};

export const MOCK_INTERVIEW_PROBLEM_IDS = [
  "longest-substring-without-repeating",
  "min-size-subarray-sum",
  "merge-intervals",
  "3sum",
  "house-robber",
  "coin-change",
  "number-of-islands",
  "sort-colors",
  "top-k-frequent-elements",
  "find-duplicate-number",
  "jump-game",
  "decode-ways",
  "daily-temperatures",
  "container-with-most-water",
  "search-rotated-sorted-array",
  "kth-largest-element",
  "course-schedule",
  "word-search",
  "trapping-rain-water",
] as const;

export function getJudgeConfig(problemId: string): ProblemJudgeConfig | undefined {
  return problemJudgeConfigs[problemId];
}

export function isJudgeSupported(problemId: string): boolean {
  return problemId in problemJudgeConfigs;
}

export function getJudgeSupportedCount(): number {
  return Object.keys(problemJudgeConfigs).length;
}
