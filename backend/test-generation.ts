import { generateStudyPlan } from "./src/services/geminiService.js";
import dotenv from "dotenv";

dotenv.config();

const TEST_TOPICS = [
  "Operating Systems",
  "Artificial Intelligence",
  "Machine Learning",
  "DBMS",
  "Java",
  "Computer Networks",
  "Data Structures",
];

interface TestResult {
  topic: string;
  success: boolean;
  error?: string;
  validations: {
    hasSummary: boolean;
    summaryLength: number;
    conceptsCount: number;
    flashcardsCount: number;
    quizCount: number;
    roadmapPhases: number;
    tipsCount: number;
    mnemonicsCount: number;
  };
}

async function testGeneration(topic: string): Promise<TestResult> {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`Testing: ${topic}`);
  console.log(`${"=".repeat(70)}`);

  const result: TestResult = {
    topic,
    success: false,
    validations: {
      hasSummary: false,
      summaryLength: 0,
      conceptsCount: 0,
      flashcardsCount: 0,
      quizCount: 0,
      roadmapPhases: 0,
      tipsCount: 0,
      mnemonicsCount: 0,
    },
  };

  try {
    const { studyPlan } = await generateStudyPlan(topic, "Medium", (event) => {
      console.log(`[Progress] ${event.stage}: ${event.message}`);
    });

    // Validate all sections
    result.validations.hasSummary = !!studyPlan.summary && studyPlan.summary.length > 0;
    result.validations.summaryLength = studyPlan.summary?.length ?? 0;
    result.validations.conceptsCount = studyPlan.keyConcepts?.length ?? 0;
    result.validations.flashcardsCount = studyPlan.flashcards?.length ?? 0;
    result.validations.quizCount = studyPlan.quiz?.length ?? 0;
    result.validations.roadmapPhases = studyPlan.roadmap?.length ?? 0;
    result.validations.tipsCount = studyPlan.revisionTips?.length ?? 0;
    result.validations.mnemonicsCount = studyPlan.mnemonics?.length ?? 0;

    // Check if all required sections are present and non-empty
    const allValid =
      result.validations.hasSummary &&
      result.validations.summaryLength >= 20 &&
      result.validations.conceptsCount >= 5 &&
      result.validations.flashcardsCount >= 10 &&
      result.validations.quizCount >= 10 &&
      result.validations.roadmapPhases >= 3 &&
      result.validations.tipsCount >= 5 &&
      result.validations.mnemonicsCount >= 3;

    result.success = allValid;

    console.log(`\n✓ Generation completed for: ${topic}`);
    console.log(`\nValidation Results:`);
    console.log(`  Summary: ${result.validations.hasSummary ? "✓" : "✗"} (${result.validations.summaryLength} chars)`);
    console.log(`  Key Concepts: ${result.validations.conceptsCount >= 5 ? "✓" : "✗"} (${result.validations.conceptsCount}/5+ items)`);
    console.log(`  Flashcards: ${result.validations.flashcardsCount >= 10 ? "✓" : "✗"} (${result.validations.flashcardsCount}/10+ cards)`);
    console.log(`  Quiz: ${result.validations.quizCount >= 10 ? "✓" : "✗"} (${result.validations.quizCount}/10+ questions)`);
    console.log(`  Roadmap: ${result.validations.roadmapPhases >= 3 ? "✓" : "✗"} (${result.validations.roadmapPhases}/3+ phases)`);
    console.log(`  Tips: ${result.validations.tipsCount >= 5 ? "✓" : "✗"} (${result.validations.tipsCount}/5+ tips)`);
    console.log(`  Mnemonics: ${result.validations.mnemonicsCount >= 3 ? "✓" : "✗"} (${result.validations.mnemonicsCount}/3+ mnemonics)`);
    console.log(`\nOverall: ${result.success ? "✅ PASS" : "❌ FAIL"}`);
  } catch (error: any) {
    result.error = error?.message ?? String(error);
    console.error(`\n✗ Generation failed for ${topic}:`);
    console.error(`  Error: ${result.error}`);
  }

  return result;
}

async function runAllTests(): Promise<void> {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`AI Study Assistant - Content Generation Test Suite`);
  console.log(`Testing ${TEST_TOPICS.length} topics...`);
  console.log(`${"=".repeat(70)}`);

  const results: TestResult[] = [];

  for (const topic of TEST_TOPICS) {
    const result = await testGeneration(topic);
    results.push(result);
    
    // Add delay between tests to avoid rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  // Print summary
  console.log(`\n${"=".repeat(70)}`);
  console.log(`TEST SUMMARY`);
  console.log(`${"=".repeat(70)}`);

  let passCount = 0;
  let failCount = 0;

  for (const result of results) {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} - ${result.topic}`);

    if (result.success) {
      passCount++;
      console.log(
        `       Summary: ${result.validations.summaryLength} chars | ` +
        `Concepts: ${result.validations.conceptsCount} | ` +
        `Flashcards: ${result.validations.flashcardsCount} | ` +
        `Quiz: ${result.validations.quizCount} | ` +
        `Roadmap: ${result.validations.roadmapPhases} phases | ` +
        `Tips: ${result.validations.tipsCount} | ` +
        `Mnemonics: ${result.validations.mnemonicsCount}`
      );
    } else {
      failCount++;
      console.log(`       Error: ${result.error}`);
    }
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log(`Results: ${passCount} passed, ${failCount} failed out of ${TEST_TOPICS.length} topics`);
  console.log(`Success Rate: ${((passCount / TEST_TOPICS.length) * 100).toFixed(1)}%`);
  console.log(`${"=".repeat(70)}\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
