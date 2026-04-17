// ─── CODE SNIPPETS ────────────────────────────────────────────────────────────
const makeCode = (js, py, java, c, cpp) => ({ JavaScript: js, Python: py, Java: java, C: c, "C++": cpp });

// ─── ALGO DATABASE ────────────────────────────────────────────────────────────
export const ALGO_DATA = {

  bubble: {
    id: "bubble",
    title: "Bubble Sort",
    category: "Comparison · Sorting",
    color: "#f59e0b",
    tags: ["Comparison", "In-Place", "Stable", "Easy"],
    tagColors: { Comparison: "#3b82f6", "In-Place": "#10b981", Stable: "#8b5cf6", Easy: "#f59e0b" },
    shortDesc: "Repeatedly swaps adjacent elements that are in the wrong order.",
    whatIs: `Bubble Sort is the simplest sorting algorithm. It repeatedly steps through the list, 
    compares adjacent elements, and swaps them if they are in the wrong order. 
    After each full pass, the largest unsorted element "bubbles up" to its correct position at the end.`,
    howItWorks: [
      ["Pass 1", "[64, 34, 25, 12]", "Compare & swap adjacent pairs → 64 bubbles to end", "[34, 25, 12, 64]"],
      ["Pass 2", "[34, 25, 12, 64]", "34 bubbles to its position", "[25, 12, 34, 64]"],
      ["Pass 3", "[25, 12, 34, 64]", "25 bubbles to its position", "[12, 25, 34, 64] ✓"],
    ],
    steps: [
      "Start from the first element.",
      "Compare current element with the next element.",
      "If current > next, swap them.",
      "Move to the next pair and repeat.",
      "After one full pass, the largest element is at the end.",
      "Repeat for remaining unsorted portion (n−1 passes total).",
    ],
    complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    pros: ["Simple to understand and implement", "Detects already-sorted arrays in O(n) with optimization", "No extra memory needed (in-place)", "Stable sort"],
    cons: ["O(n²) in average/worst case", "Very slow on large datasets", "More swaps than Selection Sort", "Not used in practice"],
    whenToUse: `Bubble Sort is mainly used for educational purposes. Its only real practical advantage is 
    detecting a sorted array in O(n) time when optimized. Never use it on large datasets — 
    QuickSort or MergeSort will always be better choices.`,
    quiz: [
      { q: "What is Bubble Sort's best-case time complexity?", opts: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], ans: 2 },
      { q: "After how many passes is the largest element in its final position?", opts: ["n passes", "n/2 passes", "1 pass", "log n passes"], ans: 2 },
      { q: "Is Bubble Sort a stable algorithm?", opts: ["Yes", "No", "Depends on input", "Only for integers"], ans: 0 },
      { q: "What optimization makes Bubble Sort O(n) in the best case?", opts: ["Using recursion", "Stopping if no swap happened in a pass", "Sorting backwards", "Using extra memory"], ans: 1 },
      { q: "Which sorting algorithm also has O(n²) but makes fewer swaps?", opts: ["Merge Sort", "Quick Sort", "Selection Sort", "Counting Sort"], ans: 2 },
    ],
    code: makeCode(
      `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
  return arr;
}`,
      `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`,
      `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
    ),
  },

  // ──────────────────────────────────────────────────────────────────
  insertion: {
    id: "insertion",
    title: "Insertion Sort",
    category: "Comparison · Sorting",
    color: "#10b981",
    tags: ["Comparison", "In-Place", "Stable", "Easy"],
    tagColors: { Comparison: "#3b82f6", "In-Place": "#10b981", Stable: "#8b5cf6", Easy: "#10b981" },
    shortDesc: "Builds the sorted array one element at a time by inserting into correct position.",
    whatIs: `Insertion Sort works like sorting playing cards in your hand. It takes one element at a time 
    from the unsorted region and inserts it into the correct position in the already-sorted region on the left. 
    It's efficient for small datasets and nearly-sorted arrays.`,
    howItWorks: [
      ["Step 1", "[5, 3, 4, 1]", "Take 3 → insert before 5", "[3, 5, 4, 1]"],
      ["Step 2", "[3, 5, 4, 1]", "Take 4 → insert between 3 and 5", "[3, 4, 5, 1]"],
      ["Step 3", "[3, 4, 5, 1]", "Take 1 → insert at beginning", "[1, 3, 4, 5] ✓"],
    ],
    steps: [
      "Start from the second element (index 1).",
      "Store the current element as 'key'.",
      "Compare key with elements to its left.",
      "Shift elements that are greater than key one position to the right.",
      "Insert key in the correct position.",
      "Move to the next element and repeat.",
    ],
    complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    pros: ["Simple and intuitive", "Efficient for small or nearly-sorted data", "Stable and in-place", "Online — can sort as data arrives"],
    cons: ["O(n²) for large unsorted data", "More writes than Selection Sort", "Not suitable for large datasets"],
    whenToUse: `Insertion Sort shines on small arrays (< 20 elements) and nearly-sorted data. 
    It's used as a building block in Timsort (Python's default sort) for small sub-arrays. 
    It's adaptive — faster when input is partially sorted.`,
    quiz: [
      { q: "What is the best-case complexity of Insertion Sort?", opts: ["O(n²)", "O(n log n)", "O(1)", "O(n)"], ans: 3 },
      { q: "Insertion Sort is best for which type of input?", opts: ["Random arrays", "Reverse sorted", "Nearly sorted arrays", "Large datasets"], ans: 2 },
      { q: "Is Insertion Sort stable?", opts: ["No", "Yes", "Only for numbers", "Depends"], ans: 1 },
      { q: "Which real sorting algorithm uses Insertion Sort internally?", opts: ["QuickSort", "HeapSort", "Timsort", "RadixSort"], ans: 2 },
      { q: "What is the space complexity of Insertion Sort?", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2 },
    ],
    code: makeCode(
      `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; j--;
        }
        arr[j + 1] = key;
    }
}`,
      `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; j--;
        }
        arr[j + 1] = key;
    }
}`,
      `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; j--;
        }
        arr[j + 1] = key;
    }
}`
    ),
  },

  // ──────────────────────────────────────────────────────────────────
  selection: {
    id: "selection",
    title: "Selection Sort",
    category: "Comparison · Sorting",
    color: "#3b82f6",
    tags: ["Comparison", "In-Place", "Unstable", "Easy"],
    tagColors: { Comparison: "#3b82f6", "In-Place": "#10b981", Unstable: "#ef4444", Easy: "#f59e0b" },
    shortDesc: "Repeatedly selects the minimum element and places it at the front.",
    whatIs: `Selection Sort divides the array into two parts: a sorted region (left) and an unsorted region (right). 
    In each pass it finds the minimum element in the unsorted region and swaps it to the front of that region, 
    expanding the sorted region by one. Despite its simplicity, it always takes O(n²) comparisons.`,
    howItWorks: [
      ["Pass 1", "[64, 25, 12, 22, 11]", "min=11 at idx 4 → swap with idx 0", "[11, 25, 12, 22, 64]"],
      ["Pass 2", "[11, 25, 12, 22, 64]", "min=12 at idx 2 → swap with idx 1", "[11, 12, 25, 22, 64]"],
      ["Pass 3", "[11, 12, 25, 22, 64]", "min=22 at idx 3 → swap with idx 2", "[11, 12, 22, 25, 64]"],
      ["Pass 4", "[11, 12, 22, 25, 64]", "min=25 already in place", "[11, 12, 22, 25, 64] ✓"],
    ],
    steps: [
      "Set the first element as the current minimum.",
      "Scan all remaining elements to find a smaller one.",
      "If found, update the minimum index.",
      "After full scan, swap minimum with the first unsorted element.",
      "Move the sorted boundary one step right.",
      "Repeat for n−1 passes.",
    ],
    complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    pros: ["Simple to implement", "Only O(n) swaps — good when writes are costly", "Minimal memory (in-place)", "Predictable performance"],
    cons: ["O(n²) comparisons always — even on sorted input", "Not stable", "Slower than Insertion Sort for nearly-sorted data", "Not practical for large arrays"],
    whenToUse: `Selection Sort's one edge case is when memory writes are expensive (e.g., flash memory). 
    Since it makes at most O(n) swaps, it's useful there. Otherwise prefer Insertion Sort for small arrays 
    or QuickSort/MergeSort for anything larger.`,
    quiz: [
      { q: "What is the time complexity of Selection Sort in all cases?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 2 },
      { q: "How many swaps does Selection Sort make in the worst case?", opts: ["O(n²)", "O(n)", "O(1)", "O(n log n)"], ans: 1 },
      { q: "Is Selection Sort stable?", opts: ["Yes, always", "No", "Depends on implementation", "Yes for integers only"], ans: 1 },
      { q: "What does Selection Sort do in each pass?", opts: ["Inserts element at right pos", "Finds min and swaps to front", "Compares adjacent elements", "Merges sorted halves"], ans: 1 },
      { q: "Space complexity of Selection Sort?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 3 },
    ],
    code: makeCode(
      `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx]) minIdx = j;
    if (minIdx !== i)
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
      `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int tmp = arr[minIdx]; arr[minIdx] = arr[i]; arr[i] = tmp;
    }
}`,
      `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int tmp = arr[minIdx]; arr[minIdx] = arr[i]; arr[i] = tmp;
    }
}`,
      `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        swap(arr[i], arr[minIdx]);
    }
}`
    ),
  },

  // ──────────────────────────────────────────────────────────────────
  merge: {
    id: "merge",
    title: "Merge Sort",
    category: "Divide & Conquer · Sorting",
    color: "#8b5cf6",
    tags: ["Divide & Conquer", "Stable", "Not In-Place", "Medium"],
    tagColors: { "Divide & Conquer": "#8b5cf6", Stable: "#10b981", "Not In-Place": "#ef4444", Medium: "#f59e0b" },
    shortDesc: "Divides array in half recursively, then merges sorted halves back.",
    whatIs: `Merge Sort is a classic divide-and-conquer algorithm. It recursively splits the array in half 
    until each sub-array has one element (trivially sorted), then merges pairs of sorted sub-arrays 
    back together. It guarantees O(n log n) in all cases but requires O(n) extra space.`,
    howItWorks: [
      ["Split",   "[38, 27, 43, 3]", "Divide into halves recursively", "[38,27] and [43,3]"],
      ["Split",   "[38,27] [43,3]",  "Divide again until single elements", "[38],[27],[43],[3]"],
      ["Merge",   "[38],[27]",        "Merge sorted → compare & place",    "[27, 38]"],
      ["Merge",   "[43],[3]",         "Merge sorted → compare & place",    "[3, 43]"],
      ["Merge",   "[27,38] [3,43]",  "Final merge",                        "[3, 27, 38, 43] ✓"],
    ],
    steps: [
      "If array has 0 or 1 element, it's already sorted — return.",
      "Find the midpoint and split into left and right halves.",
      "Recursively sort the left half.",
      "Recursively sort the right half.",
      "Merge the two sorted halves by comparing elements one by one.",
      "Place the smaller element first into the result array.",
    ],
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    pros: ["Guaranteed O(n log n) in all cases", "Stable sort", "Works well for linked lists", "Predictable, consistent performance"],
    cons: ["Requires O(n) extra space", "Slower than QuickSort in practice due to memory allocation", "Not adaptive (doesn't speed up on sorted input)"],
    whenToUse: `Merge Sort is ideal when you need a guaranteed O(n log n) sort or when sorting linked lists. 
    It's the algorithm behind Java's Arrays.sort() for objects, and Python used a variant (Timsort) as its default. 
    Use it when stability matters and extra memory is available.`,
    quiz: [
      { q: "What is the worst-case complexity of Merge Sort?", opts: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], ans: 1 },
      { q: "Merge Sort is an example of which paradigm?", opts: ["Greedy", "Dynamic Programming", "Divide & Conquer", "Backtracking"], ans: 2 },
      { q: "Is Merge Sort stable?", opts: ["No", "Yes", "Depends on implementation", "Only for integers"], ans: 1 },
      { q: "What is Merge Sort's space complexity?", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], ans: 2 },
      { q: "Which language uses a variant of Merge Sort as its default sort?", opts: ["C++", "JavaScript", "Python", "Go"], ans: 2 },
    ],
    code: makeCode(
      `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(l, r) {
  const res = []; let i = 0, j = 0;
  while (i < l.length && j < r.length)
    res.push(l[i] <= r[j] ? l[i++] : r[j++]);
  return [...res, ...l.slice(i), ...r.slice(j)];
}`,
      `def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(l, r):
    res, i, j = [], 0, 0
    while i < len(l) and j < len(r):
        if l[i] <= r[j]: res.append(l[i]); i += 1
        else: res.append(r[j]); j += 1
    return res + l[i:] + r[j:]`,
      `int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    int[] l = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] r = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(l, r);
}`,
      `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m+1, r);
        merge(arr, l, m, r);
    }
}`,
      `void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
    ),
  },

  // ──────────────────────────────────────────────────────────────────
  quick: {
    id: "quick",
    title: "Quick Sort",
    category: "Divide & Conquer · Sorting",
    color: "#ef4444",
    tags: ["Divide & Conquer", "In-Place", "Unstable", "Medium"],
    tagColors: { "Divide & Conquer": "#8b5cf6", "In-Place": "#10b981", Unstable: "#ef4444", Medium: "#f59e0b" },
    shortDesc: "Picks a pivot, partitions elements around it, and recurses on each side.",
    whatIs: `Quick Sort selects a 'pivot' element and partitions the array so that all elements smaller 
    than the pivot go to its left and all larger elements go to its right. It then recursively applies 
    the same process to both sides. It's the fastest sorting algorithm in practice for most inputs.`,
    howItWorks: [
      ["Choose pivot", "[3, 6, 8, 10, 1, 2, 1]", "pivot = 1 (last element)", ""],
      ["Partition",    "[3, 6, 8, 10, 1, 2, 1]", "< pivot: [1] | pivot: [1] | > pivot: [3,6,8,10,2]", ""],
      ["Recurse",      "[3, 6, 8, 10, 2]",         "Recursively sort right side", "[2, 3, 6, 8, 10]"],
      ["Combined",     "",                           "Merge partitions",            "[1, 1, 2, 3, 6, 8, 10] ✓"],
    ],
    steps: [
      "Choose a pivot element (commonly last, first, or random).",
      "Partition: move elements < pivot to left, > pivot to right.",
      "The pivot is now in its final sorted position.",
      "Recursively apply Quick Sort to the left sub-array.",
      "Recursively apply Quick Sort to the right sub-array.",
      "Base case: arrays of size 0 or 1 are already sorted.",
    ],
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    pros: ["Fastest in practice for most inputs", "Cache-friendly (in-place)", "O(log n) stack space", "Easy to implement"],
    cons: ["O(n²) worst case (already sorted + bad pivot)", "Not stable", "Recursive — stack overflow on very large inputs", "Performance depends on pivot choice"],
    whenToUse: `Quick Sort is the go-to general-purpose sorting algorithm. C's qsort(), C++'s std::sort(), 
    and most other standard library sorts use a variant of Quick Sort (often Introsort — hybrid with HeapSort). 
    Use randomized pivot to avoid worst-case behavior.`,
    quiz: [
      { q: "When does Quick Sort have O(n²) complexity?", opts: ["Random input", "Already sorted + bad pivot", "Reverse sorted always", "Small arrays"], ans: 1 },
      { q: "What is the average-case complexity of Quick Sort?", opts: ["O(n²)", "O(n)", "O(n log n)", "O(log n)"], ans: 2 },
      { q: "Is Quick Sort stable?", opts: ["Yes", "No", "Only with random pivot", "Yes for integers"], ans: 1 },
      { q: "What is the space complexity of Quick Sort?", opts: ["O(n)", "O(n²)", "O(1)", "O(log n)"], ans: 3 },
      { q: "Which standard library uses Quick Sort internally?", opts: ["Java Arrays.sort for primitives", "Python sorted()", "Both A and B", "Neither"], ans: 0 },
    ],
    code: makeCode(
      `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}
function partition(arr, lo, hi) {
  const pivot = arr[hi]; let i = lo - 1;
  for (let j = lo; j < hi; j++)
    if (arr[j] <= pivot) [arr[++i], arr[j]] = [arr[j], arr[i]];
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  return i + 1;
}`,
      `def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)
    return arr

def partition(arr, lo, hi):
    pivot = arr[hi]; i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1; arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1`,
      `int partition(int[] a, int lo, int hi) {
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) { int t=a[++i]; a[i]=a[j]; a[j]=t; }
    int t=a[i+1]; a[i+1]=a[hi]; a[hi]=t;
    return i + 1;
}`,
      `int partition(int a[], int lo, int hi) {
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) { int t=a[++i]; a[i]=a[j]; a[j]=t; }
    int t=a[i+1]; a[i+1]=a[hi]; a[hi]=t;
    return i + 1;
}`,
      `int partition(vector<int>& a, int lo, int hi) {
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) swap(a[++i], a[j]);
    swap(a[i+1], a[hi]);
    return i + 1;
}`
    ),
  },

  // ──────────────────────────────────────────────────────────────────
  heap: {
    id: "heap",
    title: "Heap Sort",
    category: "Comparison · Sorting",
    color: "#6366f1",
    tags: ["Comparison", "In-Place", "Unstable", "Medium"],
    tagColors: { Comparison: "#3b82f6", "In-Place": "#10b981", Unstable: "#ef4444", Medium: "#f59e0b" },
    shortDesc: "Builds a max-heap, then repeatedly extracts the maximum element.",
    whatIs: `Heap Sort uses a binary heap data structure. It first builds a max-heap from the input array, 
    then repeatedly extracts the maximum element (root) and places it at the end, reducing the heap size by one. 
    It guarantees O(n log n) and requires no extra memory.`,
    howItWorks: [
      ["Build heap", "[4, 10, 3, 5, 1]", "Heapify → max-heap", "[10, 5, 3, 4, 1]"],
      ["Extract 1",  "[10, 5, 3, 4, 1]", "Swap root(10) with last, heapify", "[5, 4, 3, 1, | 10]"],
      ["Extract 2",  "[5, 4, 3, 1]",     "Swap root(5) with last, heapify",  "[4, 1, 3, | 5, 10]"],
      ["Done",       "",                  "Repeat until heap size = 1",        "[1, 3, 4, 5, 10] ✓"],
    ],
    steps: [
      "Build a max-heap from the array (heapify from n/2 down to 0).",
      "The root of the heap is the maximum element.",
      "Swap the root with the last element of the heap.",
      "Reduce heap size by 1.",
      "Heapify the root to restore the max-heap property.",
      "Repeat steps 3–5 until the heap has one element.",
    ],
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
    pros: ["Guaranteed O(n log n) in all cases", "In-place — no extra memory", "No worst-case degradation like Quick Sort", "Good for finding top-k elements"],
    cons: ["Not stable", "Poor cache performance (jumps around in memory)", "Slower in practice than Quick Sort", "Complex to implement correctly"],
    whenToUse: `Heap Sort is used when you need guaranteed O(n log n) performance and O(1) space. 
    It's also fundamental for implementing priority queues. Introsort (used in C++ std::sort) 
    falls back to Heap Sort when Quick Sort recurses too deeply.`,
    quiz: [
      { q: "What data structure does Heap Sort use?", opts: ["Stack", "Queue", "Binary Heap", "BST"], ans: 2 },
      { q: "What is the time complexity of Heap Sort in all cases?", opts: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], ans: 1 },
      { q: "Is Heap Sort stable?", opts: ["Yes", "No", "Depends", "Only for integers"], ans: 1 },
      { q: "What is the space complexity of Heap Sort?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 2 },
      { q: "Which sorting algorithm falls back to Heap Sort in C++ std::sort?", opts: ["Merge Sort", "Quick Sort via Introsort", "Bubble Sort", "Radix Sort"], ans: 1 },
    ],
    code: makeCode(
      `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n-1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let max = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[max]) max = l;
  if (r < n && arr[r] > arr[max]) max = r;
  if (max !== i) { [arr[i], arr[max]] = [arr[max], arr[i]]; heapify(arr, n, max); }
}`,
      `def heap_sort(arr):
    n = len(arr)
    for i in range(n//2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    max_i, l, r = i, 2*i+1, 2*i+2
    if l < n and arr[l] > arr[max_i]: max_i = l
    if r < n and arr[r] > arr[max_i]: max_i = r
    if max_i != i:
        arr[i], arr[max_i] = arr[max_i], arr[i]
        heapify(arr, n, max_i)`,
      `void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        int t=arr[0]; arr[0]=arr[i]; arr[i]=t;
        heapify(arr, i, 0);
    }
}`,
      `void heapSort(int arr[], int n) {
    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        int t=arr[0]; arr[0]=arr[i]; arr[i]=t;
        heapify(arr, i, 0);
    }
}`,
      `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`
    ),
  },

  // ──────────────────────────────────────────────────────────────────
  counting: {
    id: "counting",
    title: "Counting Sort",
    category: "Non-Comparison · Sorting",
    color: "#14b8a6",
    tags: ["Non-Comparison", "Stable", "Not In-Place", "Medium"],
    tagColors: { "Non-Comparison": "#14b8a6", Stable: "#10b981", "Not In-Place": "#ef4444", Medium: "#f59e0b" },
    shortDesc: "Counts occurrences of each value, then reconstructs the sorted output.",
    whatIs: `Counting Sort doesn't compare elements — it counts how many times each value appears. 
    It creates a count array of size k (range of values), fills it with frequencies, 
    then reconstructs the sorted array. It's incredibly fast — O(n+k) — but only works on integers within a known range.`,
    howItWorks: [
      ["Input",   "[4, 2, 2, 8, 3, 3, 1]", "Range: 1–8", ""],
      ["Count",   "count[1]=1, count[2]=2, count[3]=2, count[4]=1, count[8]=1", "Tally each element", ""],
      ["Prefix",  "Cumulative sum of count array", "Gives final positions", ""],
      ["Output",  "Place elements using count array", "Stable placement", "[1, 2, 2, 3, 3, 4, 8] ✓"],
    ],
    steps: [
      "Find the maximum value k in the input array.",
      "Create a count array of size k+1, initialized to 0.",
      "Count occurrences: count[arr[i]]++ for each element.",
      "Compute prefix sums: count[i] += count[i-1].",
      "Build output array by placing elements at their correct positions.",
      "Copy the output back to the original array.",
    ],
    complexity: { best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)" },
    pros: ["Linear time O(n+k) — faster than comparison sorts", "Stable sort", "Simple to implement", "Great for small integer ranges"],
    cons: ["Only works for non-negative integers", "Wastes space when k >> n", "Not suitable for floating-point or string data", "O(k) space can be large"],
    whenToUse: `Counting Sort is perfect when you know the range of values is small relative to n. 
    Classic use cases: sorting exam scores (0–100), sorting characters in a string, 
    or as a subroutine in Radix Sort. Avoid it when values span a huge range.`,
    quiz: [
      { q: "What type of elements can Counting Sort handle?", opts: ["Any comparable elements", "Non-negative integers only", "Floating-point numbers", "Strings only"], ans: 1 },
      { q: "What is the time complexity of Counting Sort?", opts: ["O(n²)", "O(n log n)", "O(n+k)", "O(k)"], ans: 2 },
      { q: "Is Counting Sort stable?", opts: ["No", "Yes", "Depends on implementation", "Only if k is small"], ans: 1 },
      { q: "What is 'k' in Counting Sort's complexity O(n+k)?", opts: ["Number of comparisons", "Range of input values", "Number of passes", "Stack depth"], ans: 1 },
      { q: "Counting Sort is used as a subroutine in which algorithm?", opts: ["Merge Sort", "Quick Sort", "Radix Sort", "Heap Sort"], ans: 2 },
    ],
    code: makeCode(
      `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  arr.forEach(v => count[v]++);
  for (let i = 1; i <= max; i++) count[i] += count[i-1];
  const out = new Array(arr.length);
  for (let i = arr.length-1; i >= 0; i--)
    out[--count[arr[i]]] = arr[i];
  return out;
}`,
      `def counting_sort(arr):
    max_v = max(arr)
    count = [0] * (max_v + 1)
    for v in arr: count[v] += 1
    for i in range(1, max_v+1): count[i] += count[i-1]
    out = [0] * len(arr)
    for v in reversed(arr):
        count[v] -= 1; out[count[v]] = v
    return out`,
      `int[] countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int[] count = new int[max+1];
    for (int v : arr) count[v]++;
    for (int i = 1; i <= max; i++) count[i] += count[i-1];
    int[] out = new int[arr.length];
    for (int i = arr.length-1; i >= 0; i--)
        out[--count[arr[i]]] = arr[i];
    return out;
}`,
      `void countingSort(int arr[], int n) {
    int max = *max_element(arr, arr+n);
    int count[max+1]; memset(count,0,sizeof(count));
    for(int i=0;i<n;i++) count[arr[i]]++;
    for(int i=1;i<=max;i++) count[i]+=count[i-1];
    int out[n];
    for(int i=n-1;i>=0;i--) out[--count[arr[i]]]=arr[i];
    for(int i=0;i<n;i++) arr[i]=out[i];
}`,
      `void countingSort(vector<int>& arr) {
    int max = *max_element(arr.begin(), arr.end());
    vector<int> count(max+1,0);
    for(int v : arr) count[v]++;
    for(int i=1;i<=max;i++) count[i]+=count[i-1];
    vector<int> out(arr.size());
    for(int i=arr.size()-1;i>=0;i--)
        out[--count[arr[i]]]=arr[i];
    arr = out;
}`
    ),
  },

  // ══════════════════════════════════════════════════════════════════
  //  SEARCHING
  // ══════════════════════════════════════════════════════════════════

  "linear-search": {
    id: "linear-search",
    title: "Linear Search",
    category: "Searching",
    color: "#f59e0b",
    tags: ["Sequential", "No Prerequisites", "Stable", "Easy"],
    tagColors: { Sequential: "#f59e0b", "No Prerequisites": "#10b981", Stable: "#8b5cf6", Easy: "#10b981" },
    shortDesc: "Scans each element one by one until the target is found.",
    whatIs: `Linear Search is the simplest searching algorithm. It checks every element of the array 
    sequentially until it finds the target value or reaches the end. 
    No preprocessing required — works on unsorted arrays.`,
    howItWorks: [
      ["Check idx 0", "[10, 20, 30, 40, 50]", "10 == target(30)? No", "→ move right"],
      ["Check idx 1", "[10, 20, 30, 40, 50]", "20 == target(30)? No", "→ move right"],
      ["Check idx 2", "[10, 20, 30, 40, 50]", "30 == target(30)? Yes!", "return index 2 ✓"],
    ],
    steps: [
      "Start from the first element (index 0).",
      "Compare the current element with the target.",
      "If they match, return the current index.",
      "If they don't match, move to the next element.",
      "Repeat until found or end of array is reached.",
      "If end is reached without finding, return -1.",
    ],
    complexity: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
    pros: ["Works on unsorted arrays", "No preprocessing needed", "Simple to implement", "Works on any data type"],
    cons: ["O(n) time — slow for large arrays", "Much slower than Binary Search on sorted data", "Not practical for large datasets"],
    whenToUse: `Use Linear Search when: the array is unsorted, the array is very small, 
    or you're searching once and sorting isn't worth it. For repeated searches on large sorted data, 
    always prefer Binary Search.`,
    quiz: [
      { q: "What is the best-case complexity of Linear Search?", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2 },
      { q: "Does Linear Search require a sorted array?", opts: ["Yes", "No", "Only for integers", "Depends on implementation"], ans: 1 },
      { q: "What does Linear Search return if element is not found?", opts: ["0", "null", "-1", "throws error"], ans: 2 },
      { q: "What is the worst-case complexity of Linear Search?", opts: ["O(1)", "O(n log n)", "O(n)", "O(n²)"], ans: 2 },
      { q: "Linear Search checks how many elements in the worst case?", opts: ["1", "n/2", "n", "log n"], ans: 2 },
    ],
    code: makeCode(
      `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === target) return i;
  return -1;
}`,
      `def linear_search(arr, target):
    for i, v in enumerate(arr):
        if v == target: return i
    return -1`,
      `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++)
        if (arr[i] == target) return i;
    return -1;
}`,
      `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (arr[i] == target) return i;
    return -1;
}`,
      `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`
    ),
  },

  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    category: "Searching",
    color: "#3b82f6",
    tags: ["Divide & Conquer", "Sorted Array Required", "Easy"],
    tagColors: { "Divide & Conquer": "#8b5cf6", "Sorted Array Required": "#ef4444", Easy: "#10b981" },
    shortDesc: "Halves the search space at each step on a sorted array.",
    whatIs: `Binary Search works on sorted arrays by repeatedly halving the search space. 
    It compares the target with the middle element: if equal, done; if less, search the left half; 
    if greater, search the right half. With each step the search space halves, giving O(log n) time.`,
    howItWorks: [
      ["lo=0 hi=6", "[1, 3, 5, 7, 9, 11, 13]", "mid=3, arr[3]=7, target=11 → 11>7", "lo = mid+1 = 4"],
      ["lo=4 hi=6", "[1, 3, 5, 7, 9, 11, 13]", "mid=5, arr[5]=11, target=11 → match!", "return 5 ✓"],
    ],
    steps: [
      "Set lo = 0, hi = n-1.",
      "Calculate mid = Math.floor((lo + hi) / 2).",
      "If arr[mid] === target, return mid.",
      "If arr[mid] < target, set lo = mid + 1.",
      "If arr[mid] > target, set hi = mid - 1.",
      "Repeat until lo > hi. Return -1 if not found.",
    ],
    complexity: { best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
    pros: ["Very fast — O(log n)", "Simple and elegant", "Widely used in practice", "Can find first/last occurrence with variations"],
    cons: ["Array must be sorted", "Not suitable for linked lists (no random access)", "Off-by-one errors are common"],
    whenToUse: `Binary Search is the go-to algorithm whenever you need to search in a sorted array. 
    It's used everywhere: finding a word in dictionary, sqrt computation, searching in databases, 
    competitive programming problems, and as a building block for many advanced algorithms.`,
    quiz: [
      { q: "What is the time complexity of Binary Search?", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 2 },
      { q: "Binary Search requires the array to be:", opts: ["Unsorted", "Sorted", "All positive", "No duplicates"], ans: 1 },
      { q: "How many elements does Binary Search eliminate in each step?", opts: ["1", "√n", "Half the remaining", "All greater elements"], ans: 2 },
      { q: "What should lo be set to when target > arr[mid]?", opts: ["mid", "mid - 1", "mid + 1", "hi"], ans: 2 },
      { q: "How many comparisons does Binary Search need for 1 million elements?", opts: ["1,000,000", "500,000", "~20", "1000"], ans: 2 },
    ],
    code: makeCode(
      `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
      `int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      `int binarySearch(int arr[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      `int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`
    ),
  },

  // ══════════════════════════════════════════════════════════════════
  //  GRAPH
  // ══════════════════════════════════════════════════════════════════

  bfs: {
    id: "bfs",
    title: "BFS",
    category: "Graph Traversal",
    color: "#3b82f6",
    tags: ["Graph", "Queue", "Shortest Path", "Easy"],
    tagColors: { Graph: "#3b82f6", Queue: "#8b5cf6", "Shortest Path": "#10b981", Easy: "#f59e0b" },
    shortDesc: "Explores all neighbors at current depth before going deeper.",
    whatIs: `Breadth-First Search (BFS) traverses a graph level by level. Starting from a source node, 
    it visits all immediate neighbors first, then their neighbors, and so on. 
    It uses a queue to keep track of nodes to visit and guarantees the shortest path in unweighted graphs.`,
    howItWorks: [
      ["Start",   "Queue: [A]",       "Visit A, enqueue neighbors B, C",    "Visited: [A]"],
      ["Level 1", "Queue: [B, C]",    "Visit B (enqueue D,E), visit C",     "Visited: [A,B,C]"],
      ["Level 2", "Queue: [D, E]",    "Visit D, visit E",                    "Visited: [A,B,C,D,E] ✓"],
    ],
    steps: [
      "Enqueue the starting node and mark it as visited.",
      "Dequeue the front node.",
      "Process it (print/record).",
      "Enqueue all unvisited neighbors and mark them visited.",
      "Repeat from step 2 until the queue is empty.",
    ],
    complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    pros: ["Finds shortest path in unweighted graphs", "Guaranteed to visit all reachable nodes", "Level-by-level traversal is intuitive", "Good for finding closest nodes"],
    cons: ["Uses O(V) memory for the queue", "Slower than DFS when target is deep", "Not suitable for weighted shortest paths (use Dijkstra)"],
    whenToUse: `BFS is the algorithm for shortest path in unweighted graphs. Use it for: 
    level-order tree traversal, finding connected components, web crawlers, social network friend suggestions 
    (degree of separation), and puzzle solving (e.g., shortest path in a maze).`,
    quiz: [
      { q: "What data structure does BFS use?", opts: ["Stack", "Queue", "Heap", "Array"], ans: 1 },
      { q: "BFS gives shortest path in:", opts: ["Weighted graphs", "Unweighted graphs", "All graphs", "Directed graphs only"], ans: 1 },
      { q: "What is BFS time complexity?", opts: ["O(V²)", "O(V log V)", "O(V+E)", "O(E²)"], ans: 2 },
      { q: "BFS explores nodes:", opts: ["Depth-first", "Level by level", "Randomly", "By weight"], ans: 1 },
      { q: "BFS uses how much space in worst case?", opts: ["O(1)", "O(E)", "O(V)", "O(V+E)"], ans: 2 },
    ],
    code: makeCode(
      `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start], result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node] || [])
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
  }
  return result;
}`,
      `from collections import deque
def bfs(graph, start):
    visited = {start}
    queue = deque([start]); result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for nb in graph.get(node, []):
            if nb not in visited:
                visited.add(nb); queue.append(nb)
    return result`,
      `void bfs(Map<Integer,List<Integer>> g, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> q = new LinkedList<>();
    visited.add(start); q.add(start);
    while (!q.isEmpty()) {
        int node = q.poll();
        System.out.print(node + " ");
        for (int nb : g.getOrDefault(node, List.of()))
            if (!visited.contains(nb)) { visited.add(nb); q.add(nb); }
    }
}`,
      `void bfs(int graph[][MAX], int n, int start) {
    int visited[MAX]={0}, queue[MAX], front=0, rear=0;
    visited[start]=1; queue[rear++]=start;
    while(front<rear) {
        int node=queue[front++];
        printf("%d ", node);
        for(int i=0;i<n;i++)
            if(graph[node][i] && !visited[i])
                { visited[i]=1; queue[rear++]=i; }
    }
}`,
      `void bfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start]=true; q.push(start);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";
        for (int nb : adj[node])
            if (!visited[nb]) { visited[nb]=true; q.push(nb); }
    }
}`
    ),
  },

  dfs: {
    id: "dfs",
    title: "DFS",
    category: "Graph Traversal",
    color: "#10b981",
    tags: ["Graph", "Stack/Recursion", "Backtracking", "Easy"],
    tagColors: { Graph: "#3b82f6", "Stack/Recursion": "#8b5cf6", Backtracking: "#ef4444", Easy: "#f59e0b" },
    shortDesc: "Explores as far as possible along each branch before backtracking.",
    whatIs: `Depth-First Search (DFS) explores a graph by going as deep as possible along each branch 
    before backtracking. It uses a stack (or recursion) and is the foundation of many 
    graph algorithms: cycle detection, topological sort, finding strongly connected components.`,
    howItWorks: [
      ["Visit A", "Stack: [A]",    "Visit A, push neighbors C, B",  "Visited: [A]"],
      ["Visit B", "Stack: [B, C]", "Visit B, push D, E",            "Visited: [A, B]"],
      ["Visit D", "Stack: [D, E]", "Visit D (no new neighbors)",    "Visited: [A, B, D]"],
      ["Backtrack", "Stack: [E]",  "Backtrack, visit E, then C",    "Visited: [A,B,D,E,C] ✓"],
    ],
    steps: [
      "Push the starting node onto the stack (or call recursively).",
      "Pop the top node, mark it visited.",
      "Process the node.",
      "Push all unvisited neighbors onto the stack.",
      "Repeat until the stack is empty.",
      "For recursive DFS: call DFS on each unvisited neighbor.",
    ],
    complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    pros: ["Less memory than BFS for deep graphs", "Natural fit for recursion", "Foundation of many algorithms (SCC, topo sort)", "Easy to implement recursively"],
    cons: ["Doesn't guarantee shortest path", "Can get stuck in deep branches", "Stack overflow for very deep graphs (use iterative)", "Not intuitive for level-based problems"],
    whenToUse: `DFS is ideal for: topological sorting, cycle detection, finding all paths, 
    maze solving, connected components, and solving puzzles. 
    It's also the backbone of algorithms like Tarjan's and Kosaraju's for strongly connected components.`,
    quiz: [
      { q: "What data structure does DFS use internally?", opts: ["Queue", "Heap", "Stack", "Array"], ans: 2 },
      { q: "DFS is used for:", opts: ["Shortest path in weighted graphs", "Level-order traversal", "Topological sorting", "Finding nearest neighbor"], ans: 2 },
      { q: "What is DFS space complexity?", opts: ["O(1)", "O(V+E)", "O(V)", "O(E)"], ans: 2 },
      { q: "DFS can cause stack overflow when:", opts: ["Array is sorted", "Graph is cyclic", "Graph is very deep", "Too many edges"], ans: 2 },
      { q: "Which traversal does DFS produce for a binary tree?", opts: ["Level-order", "Inorder/Preorder/Postorder", "BFS order", "Random order"], ans: 1 },
    ],
    code: makeCode(
      `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  for (const nb of graph[start] || [])
    if (!visited.has(nb)) dfs(graph, nb, visited);
  return visited;
}`,
      `def dfs(graph, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    print(start, end=' ')
    for nb in graph.get(start, []):
        if nb not in visited:
            dfs(graph, nb, visited)
    return visited`,
      `void dfs(Map<Integer,List<Integer>> g, int node, Set<Integer> visited) {
    visited.add(node);
    System.out.print(node + " ");
    for (int nb : g.getOrDefault(node, List.of()))
        if (!visited.contains(nb)) dfs(g, nb, visited);
}`,
      `void dfs(int graph[][MAX], int n, int node, int visited[]) {
    visited[node]=1; printf("%d ", node);
    for(int i=0;i<n;i++)
        if(graph[node][i] && !visited[i]) dfs(graph, n, i, visited);
}`,
      `void dfs(vector<vector<int>>& adj, int node, vector<bool>& visited) {
    visited[node]=true; cout << node << " ";
    for (int nb : adj[node])
        if (!visited[nb]) dfs(adj, nb, visited);
}`
    ),
  },
};

// ─── VISUALIZER CONFIG (which algos have an animated visualizer) ──────────────
export const HAS_VISUALIZER = new Set(["merge", "quick", "selection", "bubble", "insertion", "heap", "counting"]);
