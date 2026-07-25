import { StudyPlan, KeyConcept, Flashcard, QuizQuestion, RoadmapPhase, RevisionTip, Mnemonic } from "../types/index.js";

/**
 * Validates and sanitizes a raw object returned from the API to guarantee
 * it conforms to the StudyPlan TypeScript interface.
 * If fields are missing or wrong type, it supplies defaults or throws an error.
 */
export function validateStudyPlan(data: any): StudyPlan {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response format: Expected a JSON object.");
  }

  const title = typeof data.title === "string" ? data.title.trim() : "Untitled Study Session";
  const summary = typeof data.summary === "string" ? data.summary.trim() : "No summary provided by AI.";
  
  let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
  if (data.difficulty === "Easy" || data.difficulty === "Medium" || data.difficulty === "Hard") {
    difficulty = data.difficulty;
  }

  const estimatedStudyTime =
    typeof data.estimatedStudyTime === "string" ? data.estimatedStudyTime.trim() : "2 hours";

  // Validate Key Concepts
  const keyConcepts: KeyConcept[] = [];
  if (Array.isArray(data.keyConcepts)) {
    for (const item of data.keyConcepts) {
      if (item && typeof item === "object" && typeof item.concept === "string" && typeof item.explanation === "string") {
        keyConcepts.push({
          concept: item.concept.trim(),
          explanation: item.explanation.trim(),
        });
      }
    }
  }

  // Validate Flashcards
  const flashcards: Flashcard[] = [];
  if (Array.isArray(data.flashcards)) {
    for (const item of data.flashcards) {
      if (item && typeof item === "object" && typeof item.front === "string" && typeof item.back === "string") {
        flashcards.push({
          front: item.front.trim(),
          back: item.back.trim(),
          isFavorite: false,
          isDifficult: false,
          completed: false,
        });
      }
    }
  }

  // Validate Quiz
  const quiz: QuizQuestion[] = [];
  if (Array.isArray(data.quiz)) {
    for (const item of data.quiz) {
      if (
        item &&
        typeof item === "object" &&
        typeof item.question === "string" &&
        Array.isArray(item.options) &&
        item.options.every((opt: any) => typeof opt === "string") &&
        typeof item.answerIndex === "number" &&
        item.answerIndex >= 0 &&
        item.answerIndex < item.options.length
      ) {
        quiz.push({
          question: item.question.trim(),
          options: item.options.map((opt: string) => opt.trim()),
          answerIndex: item.answerIndex,
          explanation: typeof item.explanation === "string" ? item.explanation.trim() : "Correct answer selected.",
          userAnswerIndex: null,
        });
      }
    }
  }

  // Validate Roadmap
  const roadmap: RoadmapPhase[] = [];
  if (Array.isArray(data.roadmap)) {
    for (const phaseItem of data.roadmap) {
      if (phaseItem && typeof phaseItem === "object" && typeof phaseItem.phase === "string") {
        const tasks: any[] = [];
        if (Array.isArray(phaseItem.tasks)) {
          let taskIndex = 1;
          for (const taskItem of phaseItem.tasks) {
            if (taskItem && typeof taskItem === "object" && typeof taskItem.task === "string") {
              tasks.push({
                id: typeof taskItem.id === "string" ? taskItem.id : `task-${Date.now()}-${taskIndex++}`,
                task: taskItem.task.trim(),
                description: typeof taskItem.description === "string" ? taskItem.description.trim() : "",
                completed: false,
              });
            }
          }
        }
        roadmap.push({
          phase: phaseItem.phase.trim(),
          tasks,
        });
      }
    }
  }

  // Validate Revision Tips
  const revisionTips: RevisionTip[] = [];
  if (Array.isArray(data.revisionTips)) {
    let tipIndex = 1;
    for (const item of data.revisionTips) {
      if (item && typeof item === "object") {
        // If it's a string, convert to object
        if (typeof item === "string") {
          revisionTips.push({
            id: `tip-${Date.now()}-${tipIndex++}`,
            text: item,
            completed: false,
            pinned: false,
          });
        } else if (typeof item.text === "string") {
          revisionTips.push({
            id: typeof item.id === "string" ? item.id : `tip-${Date.now()}-${tipIndex++}`,
            text: item.text.trim(),
            completed: false,
            pinned: false,
          });
        }
      }
    }
  } else if (Array.isArray(data.tips)) {
    // Check fallback naming
    let tipIndex = 1;
    for (const item of data.tips) {
      if (typeof item === "string") {
        revisionTips.push({
          id: `tip-${Date.now()}-${tipIndex++}`,
          text: item,
          completed: false,
          pinned: false,
        });
      }
    }
  }

  // Validate Mnemonics
  const mnemonics: Mnemonic[] = [];
  if (Array.isArray(data.mnemonics)) {
    for (const item of data.mnemonics) {
      if (item && typeof item === "object" && typeof item.concept === "string" && typeof item.phrase === "string") {
        mnemonics.push({
          concept: item.concept.trim(),
          phrase: item.phrase.trim(),
          isFavorite: false,
        });
      }
    }
  }

  // Final structural safety check
  if (keyConcepts.length === 0) {
    throw new Error("Invalid study plan: Key concepts list is missing or empty.");
  }
  if (flashcards.length === 0) {
    throw new Error("Invalid study plan: Flashcards list is missing or empty.");
  }
  if (quiz.length === 0) {
    throw new Error("Invalid study plan: Quiz questions list is missing or empty.");
  }

  return {
    title,
    summary,
    difficulty,
    estimatedStudyTime,
    keyConcepts,
    flashcards,
    quiz,
    roadmap,
    revisionTips,
    mnemonics,
  };
}
