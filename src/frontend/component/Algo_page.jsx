import React from 'react'
import { useParams } from 'react-router-dom'
import MergeSort from '../Sorting_algo/MergeSort';
import QuickSort from '../Sorting_algo/QuickSort';
import BubbleSort from '../Sorting_algo/BubbleSort';
import SelectionSort from '../Sorting_algo/SelectionSort';
import InsertionSort from '../Sorting_algo/InsertionSort';
import CountingSort from '../Sorting_algo/CountingSort';
import HeapSort from '../Sorting_algo/HeapSort';
import QuizChallenge from "./quiz";

const algoData = {
  merge: {
    name: "Merge Sort",
    description: "Merge Sort is a Divide and Conquer algorithm. It divides the array into halves, recursively sorts them, and then merges the sorted halves back together.",
    algorithm: ["Divide the array into two halves", "Recursively sort the left half", "Recursively sort the right half", "Merge the two sorted halves", "Repeat until the entire array is sorted"],
    complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    advantages: ["Stable sorting algorithm", "Guaranteed O(n log n) in all cases", "Works well for large datasets", "Good for linked lists"],
    disadvantages: ["Requires extra O(n) space", "Slower than Quick Sort in practice", "Not in-place sorting algorithm", "Overkill for small arrays"]
  },
  quick: {
    name: "Quick Sort",
    description: "Quick Sort is a Divide and Conquer algorithm. It picks a pivot element and partitions the array around it, placing smaller elements before and larger after.",
    algorithm: ["Pick a pivot element", "Partition array around pivot", "Elements smaller than pivot go left", "Elements greater than pivot go right", "Recursively sort left and right parts"],
    complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    advantages: ["In-place sorting algorithm", "Very fast in practice", "Cache friendly", "O(log n) space complexity"],
    disadvantages: ["Worst case O(n²)", "Not a stable sort", "Poor pivot choice can degrade performance", "Recursive — stack overflow risk"]
  },
  bubble: {
    name: "Bubble Sort",
    description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through is repeated until the list is sorted.",
    algorithm: ["Start from the first element", "Compare adjacent elements", "Swap if left element is greater", "Move to next pair", "Repeat until no swaps needed"],
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    advantages: ["Simple to understand and implement", "No extra memory needed", "Stable sorting algorithm", "Detects already sorted array in O(n)"],
    disadvantages: ["Very slow for large datasets", "O(n²) average complexity", "Not suitable for production use", "Too many swaps compared to other algorithms"]
  },
  selection: {
    name: "Selection Sort",
    description: "Selection Sort divides the array into sorted and unsorted parts. It repeatedly selects the minimum element from the unsorted part and places it at the beginning.",
    algorithm: ["Find minimum element in unsorted array", "Swap it with first unsorted element", "Move boundary of sorted array one step right", "Repeat for remaining unsorted array", "Continue until array is sorted"],
    complexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    advantages: ["Simple implementation", "In-place sorting", "Minimum number of swaps", "Works well for small arrays"],
    disadvantages: ["Always O(n²) regardless of input", "Not stable by default", "Slow for large datasets", "Does not adapt to input order"]
  },
  insertion: {
    name: "Insertion Sort",
    description: "Insertion Sort builds the sorted array one element at a time by picking each element and inserting it into its correct position among the previously sorted elements.",
    algorithm: ["Start from second element", "Compare with elements before it", "Shift larger elements one position right", "Insert element in correct position", "Repeat for all remaining elements"],
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    advantages: ["Simple implementation", "Efficient for small datasets", "Stable sorting algorithm", "Adaptive — fast for nearly sorted arrays"],
    disadvantages: ["O(n²) for large datasets", "Slower than merge and quick sort", "Not suitable for large inputs", "Many shifts in worst case"]
  },
  counting: {
    name: "Counting Sort",
    description: "Counting Sort is a non-comparison sorting algorithm. It counts the occurrences of each element and uses this information to place elements in their correct sorted position.",
    algorithm: ["Find maximum element in array", "Create count array of size max+1", "Count occurrences of each element", "Compute cumulative counts", "Place elements in output array"],
    complexity: { best: "O(n+k)", average: "O(n+k)", worst: "O(n+k)", space: "O(k)" },
    advantages: ["Linear time O(n+k) complexity", "Stable sorting algorithm", "Very fast for small range integers", "Simple to implement"],
    disadvantages: ["Only works for integers", "Extra O(k) space needed", "Inefficient for large range of values", "Not suitable for floating point numbers"]
  },
  heap: {
    name: "Heap Sort",
    description: "Heap Sort uses a Binary Heap data structure. It first builds a max-heap from the array, then repeatedly extracts the maximum element and places it at the end.",
    algorithm: ["Build a max-heap from the array", "Extract maximum element (root)", "Place it at the end of array", "Reduce heap size by one", "Heapify and repeat until heap is empty"],
    complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
    advantages: ["Guaranteed O(n log n) always", "In-place sorting algorithm", "No extra memory needed", "Good for large datasets"],
    disadvantages: ["Not stable", "Poor cache performance", "Slower than Quick Sort in practice", "Complex implementation"]
  }
};

const sectionTitle = {
  fontSize: 28,
  fontWeight: 700,
  borderBottom: "2px solid #378ADD",
  paddingBottom: 8,
  marginBottom: "1.2rem",
  marginTop: 0
};

const components = {
  merge: <MergeSort />,
  quick: <QuickSort />,
  bubble: <BubbleSort />,
  selection: <SelectionSort />,
  insertion: <InsertionSort />,
  counting: <CountingSort />,
  heap: <HeapSort />
};

const Algo_page = () => {
  const { id } = useParams();
  const data = algoData[id];

  if (!data) return (
    <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Algorithm not found!</h2>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "sans-serif" }}>

      {/* 1. Introduction */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: "0 0 12px" }}>{data.name}</h1>
        <p style={{ fontSize: 18, color: "var(--primary-color)", lineHeight: 1.8, margin: 0 }}>
          {data.description}
        </p>
      </section>

      {/* 2. Algorithm Steps */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={sectionTitle}>📋 Algorithm</h2>
        <ol style={{ lineHeight: 2.2, paddingLeft: "1.5rem", margin: 0 }}>
          {data.algorithm.map((step, i) => (
            <li key={i} style={{ fontSize: 17, marginBottom: 4 }}>{step}</li>
          ))}
        </ol>
      </section>

      {/* 3. Complexity Table */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={sectionTitle}>📊 Time & Space Complexity</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 17, borderRadius: 10, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#378ADD", color: "white" }}>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 18 }}>Case</th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 18 }}>Complexity</th>
            </tr>
          </thead>
          <tbody>
            {[
              { case: "⚡ Best Case", value: data.complexity.best },
              { case: "📈 Average Case", value: data.complexity.average },
              { case: "🐢 Worst Case", value: data.complexity.worst },
              { case: "💾 Space Complexity", value: data.complexity.space },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "var(--card-bg)" : "transparent" }}>
                <td style={{ padding: "14px 16px", fontWeight: 500 }}>{row.case}</td>
                <td style={{ padding: "14px 16px", color: "#378ADD", fontWeight: 700, fontSize: 18 }}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. Advantages & Disadvantages */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={sectionTitle}>⚖️ Advantages & Disadvantages</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginTop: "1rem" }}>
          <div style={{ background: "#E1F5EE", borderRadius: 12, padding: "1.5rem" }}>
            <h3 style={{ color: "#085041", marginTop: 0, fontSize: 20 }}>✅ Advantages</h3>
            <ul style={{ paddingLeft: "1.2rem", lineHeight: 2.2, margin: 0 }}>
              {data.advantages.map((a, i) => (
                <li key={i} style={{ fontSize: 16, color: "#085041" }}>{a}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: "#FEE2E2", borderRadius: 12, padding: "1.5rem" }}>
            <h3 style={{ color: "#7F1D1D", marginTop: 0, fontSize: 20 }}>❌ Disadvantages</h3>
            <ul style={{ paddingLeft: "1.2rem", lineHeight: 2.2, margin: 0 }}>
              {data.disadvantages.map((d, i) => (
                <li key={i} style={{ fontSize: 16, color: "#7F1D1D" }}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Visualization */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={sectionTitle}>🎬 Visualization</h2>
        {components[id]}
      </section>

      {/* 6. Quiz */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={sectionTitle}>🏆 Quiz Challenge</h2>
        <QuizChallenge algoId={id} />
      </section>

    </div>
  );
}

export default Algo_page