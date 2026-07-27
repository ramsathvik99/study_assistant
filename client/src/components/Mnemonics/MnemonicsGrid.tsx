import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Star, Search } from "lucide-react";
import { Mnemonic } from "../../types/index";
import { Card } from "../common/Card";
import { EmptyState } from "../animations/EmptyState";

interface MnemonicsGridProps {
  mnemonics: Mnemonic[];
  onUpdate: (mnemonics: Mnemonic[]) => void;
}

export const MnemonicsGrid: React.FC<MnemonicsGridProps> = ({ mnemonics, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "favorite">("all");

  const toggleFavorite = (index: number) => {
    const updated = mnemonics.map((m, i) =>
      i === index ? { ...m, isFavorite: !m.isFavorite } : m
    );
    onUpdate(updated);
  };

  const filteredMnemonics = mnemonics.filter((m) => {
    const matchesSearch =
      m.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phrase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "favorite" && m.isFavorite);
    return matchesSearch && matchesFilter;
  });

  const favoriteCount = mnemonics.filter((m) => m.isFavorite).length;

  // Empty state check for no mnemonics at all
  if (!mnemonics || mnemonics.length === 0) {
    return (
      <EmptyState
        type="session"
        title="No mnemonics available"
        description="No memory aids are available for this study plan."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-elevation-2">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">Memory Aids</h3>
              <p className="text-neutral-600 dark:text-slate-400 font-medium">
                {filteredMnemonics.length} mnemonic{filteredMnemonics.length !== 1 ? "s" : ""} • {favoriteCount} favorited
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search mnemonics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === "all"
                    ? "bg-brand-600 text-white shadow-elevation-1"
                    : "glass-sm text-neutral-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("favorite")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === "favorite"
                    ? "bg-brand-600 text-white shadow-elevation-1"
                    : "glass-sm text-neutral-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80"
                }`}
              >
                Favorites
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid - show EmptyState only when filtered results are empty */}
      {filteredMnemonics.length === 0 ? (
        <EmptyState
          type="session"
          title="No mnemonics found"
          description={
            filter !== "all" || searchTerm
              ? "Try adjusting your search or filter."
              : "No memory aids available for this study plan."
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredMnemonics.map((mnemonic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant="elevated"
                padding="lg"
                hover
                className="h-full relative group overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-100/50 dark:from-brand-900/20 to-transparent rounded-full blur-2xl -z-10" />

                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center shrink-0 shadow-elevation-1">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {mnemonic.concept}
                        </h4>
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(index)}
                      className={`p-2 rounded-lg transition-all shrink-0 ${
                        mnemonic.isFavorite
                          ? "bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400"
                          : "text-neutral-400 dark:text-slate-500 hover:bg-neutral-100 dark:hover:bg-slate-700 hover:text-accent-600 dark:hover:text-accent-400"
                      }`}
                    >
                      <Star
                        className={`w-5 h-5 ${mnemonic.isFavorite ? "fill-accent-600 dark:fill-accent-400" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Phrase */}
                  <div className="flex-1">
                    <div className="p-4 bg-gradient-to-br from-brand-50 dark:from-brand-900/20 to-accent-50 dark:to-accent-900/20 rounded-xl border border-brand-200 dark:border-brand-800">
                      <p className="text-sm font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wide mb-2">
                        Memory Phrase
                      </p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-white leading-relaxed italic">
                        "{mnemonic.phrase}"
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
