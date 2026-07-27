import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Bookmark, Calendar, Clock, Search, Filter } from "lucide-react";
import { StudySession } from "../types/index";
import { PageContainer, PageHeader, SectionHeader } from "../components/layout/PageContainer";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";

interface HistoryPageProps {
  sessions: StudySession[];
  onSelectSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

type SortOrder = "recent" | "oldest" | "alphabetical";

export const HistoryPage: React.FC<HistoryPageProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  // Filter and sort sessions
  let filtered = sessions.filter((session) => {
    const matchesSearch =
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.studyPlan.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterBookmarked || session.isBookmarked;
    return matchesSearch && matchesFilter;
  });

  if (sortOrder === "alphabetical") {
    filtered.sort((a, b) => a.topic.localeCompare(b.topic));
  } else if (sortOrder === "oldest") {
    filtered.sort((a, b) => a.timestamp - b.timestamp);
  } else {
    filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Study History"
        subtitle={`${filtered.length} ${filtered.length === 1 ? "session" : "sessions"} saved`}
      />

      {sessions.length > 0 && (
        <Card padding="lg" className="mb-6 bg-gradient-to-r from-primary-50 dark:from-primary-900/20 to-accent-50 dark:to-accent-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by topic or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 glass-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-sm font-medium"
              />
            </div>

            {/* Sort and Filter */}
            <div className="flex gap-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="flex-1 px-3 py-2 glass-sm text-slate-900 dark:text-white text-sm font-medium"
              >
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">Alphabetical</option>
              </select>

              <button
                onClick={() => setFilterBookmarked(!filterBookmarked)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterBookmarked
                    ? "bg-primary-500 text-white"
                    : "glass-sm text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80"
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Sessions List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  padding="md"
                  variant="bordered"
                  hover
                  onClick={() => onSelectSession(session)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{session.topic}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {session.studyPlan.title}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(session.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.studyPlan.estimatedStudyTime}
                        </div>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 font-medium">
                          {session.studyPlan.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(session.id);
                        }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title={session.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        {session.isBookmarked ? (
                          <Bookmark className="w-4 h-4 fill-primary-500 text-primary-500" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this study session?")) {
                            onDeleteSession(session.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              {sessions.length === 0
                ? "No study sessions yet. Create one to get started!"
                : "No sessions match your search."}
            </p>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default HistoryPage;
