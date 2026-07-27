import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Zap,
  Brain,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  Shield,
  Rocket,
  Layers,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { ErrorToast } from "../components/common/ErrorToast";
import { GenerateStudyPlanSchema, GenerateStudyPlanInput } from "../schemas/index";
import { StudySession } from "../types/index";
import { CelebrationAnimation } from "../components/animations/CelebrationAnimation";
import { useGenerateStudyPlan } from "../hooks/useGenerateStudyPlan";
import { useCancelOnNavigate } from "../hooks/useCancelOnNavigate";
import { getErrorInfo } from "../utils/errorHandler";

interface HomeProps {
  onStartSession: (session: StudySession) => void;
  activeSession: StudySession | null;
}

const FEATURE_CARDS = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description: "Advanced language models create personalized study materials instantly",
    gradient: "from-primary-500 to-primary-600",
    bgColor: "bg-primary-50",
  },
  {
    icon: Target,
    title: "Interactive Learning",
    description: "Flashcards, quizzes, and roadmaps designed for maximum retention",
    gradient: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed analytics and insights",
    gradient: "from-accent-500 to-accent-600",
    bgColor: "bg-accent-50",
  },
];

const QUICK_STARTS = [
  { topic: "Machine Learning Fundamentals", color: "primary" },
  { topic: "React & TypeScript", color: "emerald" },
  { topic: "System Design Patterns", color: "purple" },
  { topic: "Data Structures & Algorithms", color: "accent" },
];

export const Home: React.FC<HomeProps> = ({ onStartSession }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ReturnType<typeof getErrorInfo> | null>(null);

  // Cancel any in-flight requests when navigating away
  useCancelOnNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GenerateStudyPlanInput>({
    resolver: zodResolver(GenerateStudyPlanSchema),
    defaultValues: { topic: "", difficulty: "Medium" },
  });

  const topic = watch("topic");
  const difficulty = watch("difficulty");

  const { mutate: generate, isPending: isLoading } = useGenerateStudyPlan({
    onSuccess: (session) => {
      console.log("[Home] onSuccess called with session:", session);
      console.log("[Home] Session study plan keys:", Object.keys(session.studyPlan));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 100);
      console.log("[Home] Calling onStartSession");
      onStartSession(session);
      console.log("[Home] onStartSession completed");
    },
    onError: (error) => {
      setErrorInfo(error);
      setIsErrorVisible(true);
    },
  });

  const onSubmit = (data: GenerateStudyPlanInput) => {
    // Prevent duplicate submissions while loading
    if (isLoading) {
      console.log("[Home] Submission blocked - already loading");
      return;
    }
    generate({ topic: data.topic, difficulty: data.difficulty });
  };

  const handleRetry = () => {
    // Clear error state before retrying
    setIsErrorVisible(false);
    setErrorInfo(null);
    
    const currentTopic = watch("topic");
    const currentDifficulty = watch("difficulty");
    if (currentTopic.trim()) {
      console.log("[Home] Retrying generation for topic:", currentTopic);
      generate({ topic: currentTopic, difficulty: currentDifficulty });
    }
  };

  const loadingLabel = isLoading ? "Generating..." : "Generate Study Plan";

  const handleQuickStart = (topicText: string) => {
    setValue("topic", topicText, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen transition-colors">
      {/* Error Toast */}
      {errorInfo && (
        <ErrorToast
          isVisible={isErrorVisible}
          title={errorInfo.title}
          message={errorInfo.message}
          icon={errorInfo.icon}
          onClose={() => setIsErrorVisible(false)}
          onRetry={handleRetry}
          showRetry={errorInfo.action === 'retry' || errorInfo.action === 'both'}
        />
      )}

      {/* Hero Section - Compact with visible background */}
      <section className="relative min-h-[calc(100vh-100px)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        {/* Animated CTA particles for home */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`hero-particle-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1.5, 0],
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
              }}
              transition={{
                duration: 4 + i,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400"
            />
          ))}
        </div>

        {/* Hero Content - Centered and compact */}
        <div className="relative z-10 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 glass-sm rounded-full mb-4 sm:mb-6"
            >
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Powered by Advanced AI</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-4 sm:mb-6 leading-tight">
              <span className="gradient-text">
                Master Any Topic
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">With AI Power</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8">
              Transform your notes into interactive flashcards, quizzes, and personalized study roadmaps in seconds
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                { icon: Shield, label: "100% Free", color: "primary" },
                { icon: Rocket, label: "Instant", color: "secondary" },
                { icon: Sparkles, label: "AI-Powered", color: "accent" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 glass-sm rounded-full`}
                  >
                    <Icon className={`w-4 h-4 text-${item.color}-600`} />
                    <span className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-white`}>{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Main Input Card - Glass Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full"
          >
            <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                <div>
                  <textarea
                    {...register("topic")}
                    placeholder="Enter your study topic or paste your notes here..."
                    rows={4}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 glass text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-900/20 transition-all resize-none text-sm sm:text-base min-h-[100px] touch-manipulation font-medium"
                  />
                  {errors.topic && (
                    <p className="mt-2 text-xs sm:text-sm font-bold text-error-500 dark:text-error-400">{errors.topic.message}</p>
                  )}
                </div>

                {/* Difficulty Pills */}
                <div className="space-y-3">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {(["Easy", "Medium", "Hard"] as const).map((level) => (
                      <label key={level} className={`relative cursor-pointer ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <input
                          type="radio"
                          value={level}
                          {...register("difficulty")}
                          disabled={isLoading}
                          className="peer sr-only"
                        />
                        <div className={`px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm glass rounded-lg sm:rounded-xl font-bold transition-all peer-checked:bg-primary-600 peer-checked:text-white peer-checked:border-primary-600 peer-checked:shadow-soft peer-checked:dark:shadow-md text-slate-900 dark:text-slate-200 min-h-[44px] flex items-center justify-center ${isLoading ? 'pointer-events-none' : ''}`}>
                          {level}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {topic && (
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <span>{topic.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <span>•</span>
                    <span>~{Math.ceil(topic.trim().split(/\s+/).filter(Boolean).length / 200)} min read</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    isLoading={isLoading}
                    icon={<Sparkles className="w-4 h-4" />}
                    fullWidth
                    disabled={!topic.trim() || isLoading}
                  >
                    <span className="hidden sm:inline">{loadingLabel}</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>

                  {(topic || isLoading) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => reset()}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Quick Start Topics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-10 w-full"
          >
            <p className="text-center text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 sm:mb-5">
              Or try a popular topic
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {QUICK_STARTS.map((item, idx) => (
                <motion.button
                  key={item.topic}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => handleQuickStart(item.topic)}
                  className={`p-3 sm:p-4 glass-sm rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-left group min-h-[70px] sm:min-h-[80px]`}
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-lg flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-105 transition-transform`}>
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">{item.topic}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white mb-3 sm:mb-4">
              Why Choose StudyFlow?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to master any subject, powered by cutting-edge AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURE_CARDS.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="glass h-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-2xl hover:shadow-lg transition-all">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-soft`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-xl backdrop-blur-3xl rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-16 text-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white mb-4 sm:mb-5">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-xl mx-auto">
              Join thousands of students achieving their academic goals with AI-powered study materials
            </p>
            <Button
              variant="gradient"
              size="lg"
              icon={<Sparkles className="w-5 h-5" />}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Celebration Animation */}
      <CelebrationAnimation trigger={showCelebration} type="success" />
    </div>
  );
};

export default Home;
