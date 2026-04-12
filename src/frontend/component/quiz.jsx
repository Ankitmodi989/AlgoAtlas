import { useState } from "react";

const quizData = {
  "merge": [
    { question: "What is the time complexity of Merge Sort?", options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], correct: 2 },
    { question: "Merge Sort is which type of algorithm?", options: ["Greedy", "Divide & Conquer", "Dynamic", "Backtracking"], correct: 1 },
    { question: "Is Merge Sort a stable algorithm?", options: ["Yes", "No", "Sometimes", "Depends"], correct: 0 }
  ],
  "quick": [
    { question: "What is the average time complexity of Quick Sort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], correct: 1 },
    { question: "What is the worst case of Quick Sort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correct: 2 },
    { question: "Quick Sort uses which technique?", options: ["Merging", "Pivot", "Heap", "Stack"], correct: 1 }
  ],
  "bubble": [
    { question: "What is the worst case of Bubble Sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 2 },
    { question: "Is Bubble Sort stable?", options: ["Yes", "No", "Sometimes", "Depends"], correct: 0 },
    { question: "Bubble Sort compares which elements?", options: ["Random", "Adjacent", "First & Last", "Middle"], correct: 1 }
  ],
  "selection": [
    { question: "What is the time complexity of Selection Sort?", options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], correct: 1 },
    { question: "Is Selection Sort stable?", options: ["Yes", "No", "Sometimes", "Depends"], correct: 1 },
    { question: "Selection Sort finds what in each pass?", options: ["Maximum", "Minimum", "Average", "Median"], correct: 1 }
  ],
  "insertion": [
    { question: "Best case of Insertion Sort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], correct: 2 },
    { question: "Is Insertion Sort stable?", options: ["Yes", "No", "Sometimes", "Depends"], correct: 0 },
    { question: "Insertion Sort is best for?", options: ["Large arrays", "Nearly sorted arrays", "Random arrays", "Reverse sorted"], correct: 1 }
  ],
  "counting": [
    { question: "Counting Sort works on?", options: ["Floating points", "Strings", "Integers", "Characters"], correct: 2 },
    { question: "Time complexity of Counting Sort?", options: ["O(n²)", "O(n log n)", "O(n+k)", "O(k)"], correct: 2 },
    { question: "Is Counting Sort a comparison sort?", options: ["Yes", "No", "Sometimes", "Depends"], correct: 1 }
  ],
  "heap": [
    { question: "Heap Sort uses which data structure?", options: ["Stack", "Queue", "Binary Heap", "Linked List"], correct: 2 },
    { question: "What is the time complexity of Heap Sort?", options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], correct: 2 },
    { question: "Is Heap Sort stable?", options: ["Yes", "No", "Sometimes", "Depends"], correct: 1 }
  ]
};

export default function QuizChallenge({ algoId }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const questions = quizData[algoId] || [];

  const getStars = () => {
    const ratio = score / questions.length;
    if (ratio === 1) return "⭐⭐⭐⭐⭐";
    if (ratio >= 0.8) return "⭐⭐⭐⭐";
    if (ratio >= 0.6) return "⭐⭐⭐";
    if (ratio >= 0.4) return "⭐⭐";
    return "⭐";
  };

  const handleAnswer = (index) => {
    setSelected(index);
    if (index === questions[current].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const reset = () => {
    setStarted(false);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  if (!started) return (
    <div className="quiz-box">
      <h2>🏆 Quiz Challenge</h2>
      <ul>
        <li>✅ +1 point for each correct answer</li>
        <li>❌ 0 points for wrong answers</li>
        <li>🏆 Earn stars based on final score (max 5 stars)</li>
      </ul>
      <button className="quiz-btn" onClick={() => setStarted(true)}>
        Start Quiz →
      </button>
    </div>
  );

  if (finished) return (
    <div className="quiz-box">
      <h2>Quiz Complete! 🎉</h2>
      <p style={{ fontSize: "1.2rem" }}>Score: <strong>{score} / {questions.length}</strong></p>
      <p style={{ fontSize: "2rem" }}>{getStars()}</p>
      <button className="quiz-btn" onClick={reset}>Try Again 🔄</button>
    </div>
  );

  return (
    <div className="quiz-box">
      <p>Question {current + 1} of {questions.length}</p>
      <div className="progress-bar">
        <div style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>
      <h3>{questions[current].question}</h3>
      <div className="options-grid">
        {questions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selected !== null}
            className={`option-btn ${
              selected === null ? ""
              : i === questions[current].correct ? "correct"
              : selected === i ? "wrong" : ""
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}