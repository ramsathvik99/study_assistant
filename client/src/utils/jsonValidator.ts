import { StudyPlan, KeyConcept, Flashcard, QuizQuestion, RoadmapPhase, RevisionTip, Mnemonic } from "../types/index";

/**
 * Parse JSON with recovery attempts for partially malformed data
 */
function parseJSONWithRecovery(jsonString: string): any {
  // Try direct parse first
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn('[jsonValidator] Direct JSON parse failed, attempting recovery:', err);
  }

  // Try fixing common JSON errors
  try {
    let fixed = jsonString;
    
    // Remove trailing commas
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unquoted property names
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
    
    // Fix common escape issues
    fixed = fixed.replace(/\\'/g, "'");
    
    const recovered = JSON.parse(fixed);
    console.log('[jsonValidator] Successfully recovered malformed JSON');
    return recovered;
  } catch (err) {
    console.error('[jsonValidator] Recovery attempt failed:', err);
    throw new Error(`Failed to parse JSON response: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Validates and sanitizes a raw object returned from the API to guarantee
 * it conforms to the StudyPlan TypeScript interface.
 * If fields are missing or wrong type, it supplies safe defaults or throws an error.
 * 
 * Features:
 * - Graceful fallback for missing fields
 * - Safe recovery from partial/malformed data
 * - Detailed validation logging
 * - Helpful error messages for debugging
 */
export function validateStudyPlan(data: any): StudyPlan {
  if (!data) {
    throw new Error("Invalid response format: Response is null or undefined.");
  }

  if (typeof data === "string") {
    try {
      data = parseJSONWithRecovery(data);
    } catch (err) {
      throw new Error(`Cannot parse response as JSON: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (typeof data !== "object") {
    throw new Error("Invalid response format: Expected a JSON object.");
  }

  console.log('[jsonValidator] Validating study plan with fields:', Object.keys(data));

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
        if (tasks.length > 0) {
          roadmap.push({
            phase: phaseItem.phase.trim(),
            tasks,
          });
        }
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

  // Log validation results
  console.log('[jsonValidator] Validation results:', {
    title: !!title,
    summary: summary.length,
    keyConcepts: keyConcepts.length,
    flashcards: flashcards.length,
    quiz: quiz.length,
    roadmap: roadmap.length,
    revisionTips: revisionTips.length,
    mnemonics: mnemonics.length,
  });

  // Final structural safety check with clear error messages
  if (keyConcepts.length === 0) {
    throw new Error("Invalid study plan: The AI response is missing key concepts. Please try again with a different topic.");
  }
  if (flashcards.length === 0) {
    throw new Error("Invalid study plan: The AI response is missing flashcards. Please try again.");
  }
  if (quiz.length === 0) {
    throw new Error("Invalid study plan: The AI response is missing quiz questions. Please try again.");
  }
  if (roadmap.length === 0) {
    console.warn('[jsonValidator] Study plan has no roadmap phases, using fallback');
  }
  if (revisionTips.length === 0) {
    console.warn('[jsonValidator] Study plan has no revision tips, using fallback');
  }

  return {
    title,
    summary,
    difficulty,
    estimatedStudyTime,
    keyConcepts,
    flashcards,
    quiz,
    roadmap: roadmap.length > 0 ? roadmap : [
      {
        phase: "Foundation",
        tasks: [
          {
            id: "task-foundation-1",
            task: "Study the fundamentals",
            description: "Build a strong foundation in the basics",
            completed: false,
          },
        ],
      },
    ],
    revisionTips: revisionTips.length > 0 ? revisionTips : [
      {
        id: "tip-default-1",
        text: "Review the key concepts regularly",
        completed: false,
        pinned: false,
      },
    ],
    mnemonics,
  };
}
