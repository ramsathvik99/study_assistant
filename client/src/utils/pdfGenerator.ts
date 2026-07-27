import { StudyPlan, Flashcard, QuizQuestion } from "../types/index";

/**
 * Formats study materials into a clean, print-ready document and opens the browser print dialog.
 * This utilizes the browser's high-fidelity print engine to save as a PDF.
 */
export function printStudyPlan(studyPlan: StudyPlan) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print/export the study plan.");
    return;
  }

  const flashcardHTML = studyPlan.flashcards
    .map(
      (f, idx) => `
    <div class="card-item">
      <div class="card-num">Card ${idx + 1}</div>
      <div class="card-front"><strong>Q:</strong> ${f.front}</div>
      <div class="card-back"><strong>A:</strong> ${f.back}</div>
    </div>
  `
    )
    .join("");

  const quizHTML = studyPlan.quiz
    .map(
      (q, idx) => `
    <div class="quiz-item">
      <div class="question"><strong>Q${idx + 1}:</strong> ${q.question}</div>
      <ul class="options">
        ${q.options.map((opt, oIdx) => `<li>${oIdx === q.answerIndex ? "✔ " : "○ "} ${opt}</li>`).join("")}
      </ul>
      <div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>
    </div>
  `
    )
    .join("");

  const keyConceptsHTML = studyPlan.keyConcepts
    .map(
      (c) => `
    <div class="concept-item">
      <h3>${c.concept}</h3>
      <p>${c.explanation}</p>
    </div>
  `
    )
    .join("");

  const roadmapHTML = studyPlan.roadmap
    .map(
      (phase) => `
    <div class="roadmap-phase">
      <h4>${phase.phase}</h4>
      <ul>
        ${phase.tasks.map((t) => `<li><strong>${t.task}:</strong> ${t.description}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");

  const mnemonicsHTML = studyPlan.mnemonics
    .map(
      (m) => `
    <div class="mnemonic-item">
      <strong>${m.concept}:</strong> <em>${m.phrase}</em>
    </div>
  `
    )
    .join("");

  const tipsHTML = studyPlan.revisionTips.map((t) => `<li>${t.text}</li>`).join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Study Notes: ${studyPlan.title}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
          }
          h1 { font-size: 28px; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px; }
          h2 { font-size: 20px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px; }
          h3 { font-size: 16px; color: #2563eb; margin-bottom: 5px; }
          h4 { font-size: 15px; color: #475569; margin-top: 15px; margin-bottom: 5px; }
          .meta { font-style: italic; color: #64748b; margin-bottom: 20px; }
          .summary { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 25px; border-radius: 4px; }
          .concept-item { margin-bottom: 15px; }
          .card-item { page-break-inside: avoid; border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 10px; border-radius: 6px; background: #fafafa; }
          .card-num { font-size: 11px; font-weight: bold; color: #64748b; margin-bottom: 4px; text-transform: uppercase; }
          .card-front { border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px; margin-bottom: 6px; }
          .quiz-item { page-break-inside: avoid; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px; }
          .question { font-weight: bold; margin-bottom: 8px; }
          .options { list-style: none; padding-left: 10px; margin-bottom: 8px; }
          .options li { margin-bottom: 4px; }
          .explanation { font-size: 13px; color: #475569; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; }
          .roadmap-phase { margin-bottom: 20px; }
          .mnemonic-item { border-bottom: 1px dashed #e2e8f0; padding: 6px 0; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${studyPlan.title}</h1>
        <div class="meta">Difficulty: ${studyPlan.difficulty} | Est. Study Time: ${studyPlan.estimatedStudyTime}</div>
        
        <h2>Summary</h2>
        <div class="summary">${studyPlan.summary}</div>
        
        <h2>Key Concepts</h2>
        <div class="concepts-list">${keyConceptsHTML}</div>
        
        <h2>Study Roadmap</h2>
        <div class="roadmap-list">${roadmapHTML}</div>

        <h2>Flashcards</h2>
        <div class="cards-list">${flashcardHTML}</div>
        
        <h2>Quiz Questions</h2>
        <div class="quiz-list">${quizHTML}</div>

        <h2>Revision Tips</h2>
        <ul>${tipsHTML}</ul>

        <h2>Mnemonics</h2>
        <div class="mnemonics-list">${mnemonicsHTML}</div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Downloads flashcards as a clean text file format (.txt)
 */
export function downloadFlashcardsTxt(flashcards: Flashcard[], topicTitle: string) {
  let content = `FLASHCARDS FOR: ${topicTitle.toUpperCase()}\n`;
  content += `Generated by AI Study Assistant\n`;
  content += `=========================================================\n\n`;

  flashcards.forEach((card, idx) => {
    content += `CARD ${idx + 1}\n`;
    content += `Front: ${card.front}\n`;
    content += `Back:  ${card.back}\n`;
    content += `---------------------------------------------------------\n\n`;
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_flashcards.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a quiz as a text file format (.txt)
 */
export function downloadQuizTxt(quiz: QuizQuestion[], topicTitle: string) {
  let content = `QUIZ FOR: ${topicTitle.toUpperCase()}\n`;
  content += `Generated by AI Study Assistant\n`;
  content += `=========================================================\n\n`;

  quiz.forEach((q, idx) => {
    content += `QUESTION ${idx + 1}: ${q.question}\n`;
    q.options.forEach((opt, oIdx) => {
      content += `  ${String.fromCharCode(65 + oIdx)}) ${opt}\n`;
    });
    content += `\nCorrect Answer: Option ${String.fromCharCode(65 + q.answerIndex)}\n`;
    content += `Explanation: ${q.explanation}\n`;
    content += `---------------------------------------------------------\n\n`;
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_quiz.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
