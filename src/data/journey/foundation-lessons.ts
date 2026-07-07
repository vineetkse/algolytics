export interface FoundationLesson {
  day: number;
  title: string;
  subtitle: string;
  sections: { heading: string; body: string }[];
  exercise: string;
  checkpoints: string[];
}

export const foundationLessons: FoundationLesson[] = [
  {
    day: 1,
    title: "How Programmers Think",
    subtitle: "Input → process → output",
    sections: [
      {
        heading: "Every program is a recipe",
        body: "A program takes input, follows steps, and produces output. A microwave: input = time + power, process = heat food, output = warm meal. Coding is the same — just more precise.",
      },
      {
        heading: "Precision matters",
        body: "Computers do exactly what you say, not what you mean. \"Add numbers\" is vague. \"Take two numbers a and b, return a + b\" is a program. Smart engineers break vague goals into precise steps.",
      },
      {
        heading: "Your first mental model",
        body: "Before any interview problem, ask: What is the input? What is the output? What are the steps in between? Write those steps in plain English before writing code.",
      },
    ],
    exercise:
      "In plain English, describe how you would find the largest number in a list of 5 numbers someone reads aloud. Write at least 4 steps.",
    checkpoints: [
      "I can explain input → process → output",
      "I wrote steps to find a maximum without code",
    ],
  },
  {
    day: 2,
    title: "Variables & Decisions",
    subtitle: "Store values, branch on conditions",
    sections: [
      {
        heading: "Variables are labeled boxes",
        body: "A variable stores a value: `count = 0`, `name = \"Ada\"`, `isReady = true`. You read and update them as your program runs.",
      },
      {
        heading: "If / else — make decisions",
        body: "If temperature > 30, print \"hot\". Else print \"cool\". Every real program branches: validate input, handle edge cases, choose algorithms.",
      },
      {
        heading: "Interview habit",
        body: "Always ask: what if the input is empty? What if it's one element? Edge cases are where juniors fail and seniors shine.",
      },
    ],
    exercise:
      "Write pseudocode: given a number n, print \"positive\", \"negative\", or \"zero\". Then add: what if someone passes text instead of a number?",
    checkpoints: [
      "I understand variables store values",
      "I can write if/else logic in plain English",
    ],
  },
  {
    day: 3,
    title: "Loops — Repeat With Purpose",
    subtitle: "When you need to check every item",
    sections: [
      {
        heading: "Why loops exist",
        body: "If you need to look at every element in a list, you loop. `for each item in list` is the most common pattern in all of programming.",
      },
      {
        heading: "Two loop types",
        body: "`for i from 0 to n-1` — when you need the index. `for each x in arr` — when you only need values. Know both.",
      },
      {
        heading: "Loop invariants",
        body: "Smart coders know what is true before and after each iteration. \"After each step, maxSoFar holds the largest seen so far.\" This is how you prove code works.",
      },
    ],
    exercise:
      "Write pseudocode to count how many numbers in a list are greater than 10. State your loop invariant in one sentence.",
    checkpoints: [
      "I know when to use a loop",
      "I stated a loop invariant for my exercise",
    ],
  },
  {
    day: 4,
    title: "Functions — Reusable Logic",
    subtitle: "Name your steps, reuse them",
    sections: [
      {
        heading: "Functions bundle steps",
        body: "A function has a name, inputs (parameters), and an output (return value). `max(a, b)` returns the larger of two numbers. You stop repeating yourself.",
      },
      {
        heading: "Decomposition",
        body: "Hard problems become easy when split into functions. \"Reverse a string\" → `reverse(s)`. \"Check palindrome\" → `isPalindrome(s)` calls `reverse`. This is the skill Google tests.",
      },
      {
        heading: "Practice naming",
        body: "Good function names are verbs: `findMax`, `countVowels`, `isValid`. If you can't name it, you don't understand it yet.",
      },
    ],
    exercise:
      "Break \"check if a word is a palindrome\" into 2 functions. Write what each takes and returns — no code required.",
    checkpoints: [
      "I can define function inputs and outputs",
      "I decomposed palindrome check into 2 functions",
    ],
  },
  {
    day: 5,
    title: "Arrays — Your Main Tool",
    subtitle: "Ordered collections of data",
    sections: [
      {
        heading: "Array basics",
        body: "An array is an ordered list: `[3, 1, 4, 1, 5]`. Index starts at 0. Last index is `length - 1`. Access is instant — O(1).",
      },
      {
        heading: "Common operations",
        body: "Scan all elements (loop). Compare pairs (nested loop or two pointers later). Track best so far (variable updated in loop). These three cover 60% of array problems.",
      },
      {
        heading: "Draw it",
        body: "Smart engineers sketch arrays on paper. Mark indices, move pointers, highlight subarrays. Visual thinking prevents bugs.",
      },
    ],
    exercise:
      "Given `[4, 2, 7, 1]`, trace by hand: find the sum of all elements. Show index `i` and running `sum` at each step.",
    checkpoints: [
      "I know index starts at 0",
      "I traced a loop by hand on paper",
    ],
  },
  {
    day: 6,
    title: "Strings — Arrays of Characters",
    subtitle: "Text is data too",
    sections: [
      {
        heading: "Strings are sequences",
        body: "A string is a sequence of characters: `\"hello\"` has indices 0-4. Many string problems are array problems in disguise.",
      },
      {
        heading: "Two-pointer preview",
        body: "Check palindrome: one pointer at start, one at end, move inward comparing characters. You just learned your first algorithmic pattern — before we name it.",
      },
      {
        heading: "Immutability",
        body: "In many languages strings can't be changed in place — you build new ones. Know your language. This affects how you solve problems.",
      },
    ],
    exercise:
      "On paper, check if `\"racecar\"` is a palindrome using two pointers. Write each comparison step.",
    checkpoints: [
      "I treated a string as a sequence with indices",
      "I used two pointers manually on a palindrome",
    ],
  },
  {
    day: 7,
    title: "Week 1 Review — Think Like a Coder",
    subtitle: "Consolidate before moving on",
    sections: [
      {
        heading: "What you built",
        body: "You can decompose problems, use loops, write functions, and trace code by hand. This is the foundation every Google engineer has — even if they forgot they learned it.",
      },
      {
        heading: "The smart habit",
        body: "Never code first. Always: understand → examples → brute force → optimize → then code. Skipping steps is why people freeze in interviews.",
      },
      {
        heading: "What's next",
        body: "Next week: more array skills, counting, and hash maps — the tool behind O(n) solutions.",
      },
    ],
    exercise:
      "Pick any everyday task (making tea, finding a book). Write 5 precise steps. Identify inputs, outputs, and one edge case.",
    checkpoints: [
      "I completed Week 1 review exercise",
      "I commit to think-before-code from now on",
    ],
  },
  {
    day: 8,
    title: "Counting & Frequency",
    subtitle: "Track how often things appear",
    sections: [
      {
        heading: "Counting pattern",
        body: "Loop through data, increment a counter when you see what you care about. \"How many vowels?\" → `count++` when char is a vowel.",
      },
      {
        heading: "Frequency maps",
        body: "Instead of one counter, use a map: `char → count`. \"How many times does each letter appear?\" This is the hash map pattern — O(n) instead of O(n²).",
      },
      {
        heading: "Why this matters",
        body: "Two Sum, anagrams, duplicates — all use frequency counting. Master this and dozens of problems open up.",
      },
    ],
    exercise:
      "Given `\"hello\"`, build a frequency table by hand: h=1, e=1, l=2, o=1. What character appears most?",
    checkpoints: [
      "I built a frequency table by hand",
      "I understand why maps beat nested loops",
    ],
  },
  {
    day: 9,
    title: "Hash Maps — The O(n) Secret",
    subtitle: "Instant lookup changes everything",
    sections: [
      {
        heading: "What a hash map does",
        body: "Store key → value pairs. Lookup, insert, delete in O(1) average. \"Have I seen this number before?\" becomes instant instead of scanning.",
      },
      {
        heading: "Classic use",
        body: "Two Sum: for each number, check if `target - num` exists in the map. One pass, O(n). Without a map: O(n²). This single idea appears in 100+ interview problems.",
      },
      {
        heading: "Trade-off",
        body: "You trade space for time. Extra memory for a map is almost always worth it in interviews.",
      },
    ],
    exercise:
      "Explain Two Sum in plain English using a hash map. No code — just: what do you store, when do you look up?",
    checkpoints: [
      "I explained Two Sum with a map",
      "I know hash maps trade space for time",
    ],
  },
  {
    day: 10,
    title: "Nested Loops & When to Avoid Them",
    subtitle: "O(n²) is usually too slow",
    sections: [
      {
        heading: "Brute force first",
        body: "Check all pairs with nested loops — correct but slow. For n=10⁵, n² = 10¹⁰ — too slow. Always know your brute force, then optimize.",
      },
      {
        heading: "Optimization instinct",
        body: "If you're comparing every element to every other, ask: can a hash map or sorted structure eliminate inner loop?",
      },
      {
        heading: "Complexity literacy",
        body: "O(n) = scan once. O(n log n) = sort then scan. O(n²) = nested loops. Google expects you to state complexity out loud.",
      },
    ],
    exercise:
      "A problem asks: \"Does any pair sum to target?\" Write the O(n²) approach in 2 lines of pseudocode. Then the O(n) map approach in 3 lines.",
    checkpoints: [
      "I wrote brute force and optimized approaches",
      "I can say O(n) vs O(n²) out loud",
    ],
  },
  {
    day: 11,
    title: "Sorting — When Order Helps",
    subtitle: "Sorted data unlocks two pointers & binary search",
    sections: [
      {
        heading: "Why sort",
        body: "Sorted arrays let you skip comparisons. Two pointers from both ends. Binary search for O(log n) lookup. Many problems become easy after sorting.",
      },
      {
        heading: "Cost",
        body: "Sorting costs O(n log n). Only worth it if it eliminates worse work (like O(n²) inner loops).",
      },
      {
        heading: "Signals",
        body: "Problem says \"sorted\" or \"find pair/triplet\" or \"non-overlapping intervals\" → think sort first.",
      },
    ],
    exercise:
      "Given sorted `[1, 2, 4, 6, 10]`, find two numbers that sum to 8 using two pointers. Trace each step.",
    checkpoints: [
      "I traced two pointers on a sorted array",
      "I know sorting costs O(n log n)",
    ],
  },
  {
    day: 12,
    title: "Subarrays & Substrings",
    subtitle: "Contiguous chunks of data",
    sections: [
      {
        heading: "Definitions",
        body: "Subarray = contiguous part of array. `[2,3]` in `[1,2,3,4]` yes. `[1,3]` no. Substring = same for strings.",
      },
      {
        heading: "Sliding window preview",
        body: "\"Longest substring without repeating chars\" — expand window right, shrink left when invalid. You'll train this pattern soon.",
      },
      {
        heading: "Counting subarrays",
        body: "Number of subarrays of length n is n(n+1)/2. Knowing this helps sanity-check answers.",
      },
    ],
    exercise:
      "List all subarrays of `[1, 2, 3]`. How many are there? Does n(n+1)/2 match?",
    checkpoints: [
      "I listed all subarrays of a small array",
      "I understand contiguous vs subsequence",
    ],
  },
  {
    day: 13,
    title: "Recursion — Functions That Call Themselves",
    subtitle: "Trees and backtracking depend on this",
    sections: [
      {
        heading: "Base case + recursive case",
        body: "Every recursion needs a stop condition (base case) and a way to shrink the problem. `factorial(n)`: base n≤1 return 1, else n * factorial(n-1).",
      },
      {
        heading: "Trust the recursion",
        body: "Assume the recursive call works for a smaller input. You only prove one step. This mindset unlocks tree DFS and backtracking.",
      },
      {
        heading: "Stack depth",
        body: "Too deep recursion crashes. For n=10⁵, prefer loops or iterative solutions. Know the limit.",
      },
    ],
    exercise:
      "Write recursive pseudocode for `sum(1..n)`. Identify base case and recursive case.",
    checkpoints: [
      "I identified base and recursive cases",
      "I understand recursion shrinks the problem",
    ],
  },
  {
    day: 14,
    title: "Week 2 Review — Data Structure Instincts",
    subtitle: "Maps, sorting, and complexity",
    sections: [
      {
        heading: "Your toolkit so far",
        body: "Loops, functions, arrays, strings, hash maps, sorting, two pointers preview, recursion preview. This is real programming — not trivia.",
      },
      {
        heading: "Smart coder checklist",
        body: "Before coding: What's brute force? Can a map help? Is data sorted? What's time complexity? Say it aloud.",
      },
      {
        heading: "Next week",
        body: "We introduce algorithmic patterns by name and start recognition drills — no implementation pressure yet.",
      },
    ],
    exercise:
      "Read: \"Find duplicate in array of n+1 integers in range 1..n.\" Which tools apply? (map? sort? math?) Write 2 approaches.",
    checkpoints: [
      "I proposed 2 approaches to find duplicate",
      "I stated complexity for each approach",
    ],
  },
  {
    day: 15,
    title: "The Problem-Solving Pipeline",
    subtitle: "How experts approach any problem",
    sections: [
      {
        heading: "The 5-step pipeline",
        body: "1. Clarify input/output & constraints. 2. Work 2-3 examples by hand. 3. Brute force solution + complexity. 4. Optimize using a pattern. 5. Code & test edge cases.",
      },
      {
        heading: "Communication = points",
        body: "Google grades how you think, not just final code. Talk through steps 1-4 before typing. Silence loses offers.",
      },
      {
        heading: "Patterns are shortcuts",
        body: "Patterns are optimized templates for step 4. You still do steps 1-3 every time.",
      },
    ],
    exercise:
      "Run the 5-step pipeline on: \"Return the second largest number in an array.\" Write steps 1-3 only.",
    checkpoints: [
      "I used the 5-step pipeline",
      "I worked examples by hand before optimizing",
    ],
  },
  {
    day: 16,
    title: "Meet Your First Pattern: Two Pointers",
    subtitle: "Sorted arrays, pairs, palindromes",
    sections: [
      {
        heading: "The idea",
        body: "Two indices moving through data — often from opposite ends or at different speeds. Eliminates nested loops when structure allows.",
      },
      {
        heading: "Signals",
        body: "\"Sorted array\", \"pair summing to target\", \"palindrome\", \"remove duplicates in place\", \"container with most water\".",
      },
      {
        heading: "Don't code yet",
        body: "This week you only learn to RECOGNIZE two pointers. Implementation comes in Phase 3. Recognition first — that's what makes you smart fast.",
      },
    ],
    exercise:
      "Read three problem titles: Valid Palindrome, 3Sum, Container With Most Water. Which use two pointers? Why?",
    checkpoints: [
      "I named two-pointer signals",
      "I resisted jumping to code",
    ],
  },
  {
    day: 17,
    title: "Meet Sliding Window",
    subtitle: "Contiguous subarray/substring problems",
    sections: [
      {
        heading: "The idea",
        body: "Maintain a window [left, right] that grows and shrinks. Track something inside the window (sum, char counts). O(n) for many subarray problems.",
      },
      {
        heading: "Signals",
        body: "\"Longest/shortest subarray\", \"subarray with sum ≥ k\", \"at most k distinct characters\", \"fixed size k window\".",
      },
      {
        heading: "vs Two pointers",
        body: "Two pointers often on sorted data for pairs. Sliding window on contiguous segments with a running constraint. Confusing these fails interviews — you'll drill the difference later.",
      },
    ],
    exercise:
      "Problem: \"Longest substring with at most 2 distinct characters.\" Is this sliding window or two pointers? Explain in 2 sentences.",
    checkpoints: [
      "I distinguished sliding window from two pointers",
      "I listed 2 sliding window signals",
    ],
  },
  {
    day: 18,
    title: "Trees — Hierarchical Data",
    subtitle: "Preview BFS and DFS",
    sections: [
      {
        heading: "Tree basics",
        body: "A tree has a root and children. Binary tree: max 2 children. Depth = distance from root. Height = longest path to leaf.",
      },
      {
        heading: "BFS vs DFS",
        body: "BFS: level by level (queue). \"Shortest path\", \"level order\". DFS: go deep first (recursion/stack). \"Path sum\", \"validate BST\", \"max depth\".",
      },
      {
        heading: "Drawing trees",
        body: "Always sketch the tree. Mark current node, left/right. 80% of tree bugs come from not drawing.",
      },
    ],
    exercise:
      "Draw a tree with root 3, children 9 and 20, 20 has children 15 and 7. Write BFS visit order, then DFS (preorder).",
    checkpoints: [
      "I drew a tree and traced BFS/DFS",
      "I know BFS uses a queue",
    ],
  },
  {
    day: 19,
    title: "Dynamic Programming Preview",
    subtitle: "Optimal substructure & overlapping subproblems",
    sections: [
      {
        heading: "When DP applies",
        body: "Problem asks for optimal (min/max/count ways) and big problem breaks into overlapping smaller versions. \"Climbing stairs\", \"max profit\", \"coin change\".",
      },
      {
        heading: "Fibonacci pattern",
        body: "dp[i] depends on dp[i-1] and dp[i-2]. Start with base cases, fill table forward. Simplest DP family.",
      },
      {
        heading: "Not magic",
        body: "DP is brute force with memoization — remember answers to subproblems instead of recomputing.",
      },
    ],
    exercise:
      "Climbing stairs: 1 or 2 steps at a time, n=4. List ways by hand. See the Fibonacci pattern?",
    checkpoints: [
      "I listed ways for n=4 stairs",
      "I see overlapping subproblems",
    ],
  },
  {
    day: 20,
    title: "Debugging & Testing Like a Pro",
    subtitle: "Edge cases separate juniors from seniors",
    sections: [
      {
        heading: "Test categories",
        body: "Empty input. Single element. Two elements. Duplicates. Negative numbers. Maximum size. Run these mentally before submitting.",
      },
      {
        heading: "Trace with examples",
        body: "When stuck, pick the smallest non-trivial example and trace line by line. Bugs reveal themselves.",
      },
      {
        heading: "Off-by-one",
        body: "The #1 bug: loop bounds, index 0 vs 1, inclusive vs exclusive ranges. Always check first and last iteration.",
      },
    ],
    exercise:
      "You're solving \"find max in array\". List 5 test cases including edge cases. What should each return?",
    checkpoints: [
      "I wrote 5 test cases with expected outputs",
      "I included empty and single-element cases",
    ],
  },
  {
    day: 21,
    title: "Phase 1 Complete — You're Ready",
    subtitle: "Foundation gate before pattern training",
    sections: [
      {
        heading: "What you accomplished",
        body: "You think in steps, know core data structures, understand complexity, and previewed major patterns. You're not \"zero\" anymore — you're building.",
      },
      {
        heading: "Phase 2 starts tomorrow",
        body: "Pattern Spotter and Signal Hunter drills. No coding required. Your job: see the pattern in 30 seconds. This builds the Google interview reflex.",
      },
      {
        heading: "Honest expectation",
        body: "168 days of consistency beats 168 hours of cramming. Show up daily. The journey makes you smart — not memorization.",
      },
    ],
    exercise:
      "Write a short commitment: what time each day will you train? What's your goal for Phase 2 accuracy (aim for 70%)?",
    checkpoints: [
      "I set a daily training time",
      "I'm ready for Phase 2: Pattern Eyes",
    ],
  },
];

export function getFoundationLesson(day: number): FoundationLesson | undefined {
  return foundationLessons.find((l) => l.day === day);
}

export const FOUNDATION_LESSON_COUNT = foundationLessons.length;
