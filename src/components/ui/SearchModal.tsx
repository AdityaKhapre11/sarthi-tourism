"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, ArrowRight, History, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { packages } from "@/data/packages";
import { Button } from "@/components/ui/button";

interface RecentSearch {
  id: number;
  name: string;
}

// Helper component to highlight matched text
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-blue-400 font-bold bg-blue-500/10 px-0.5 rounded">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const defaultTags = ["Dubai", "Andaman", "Kerala", "Thailand"];

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("sarthiRecentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Focus input when modal opens & handle body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Ctrl+K shortcut globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          window.dispatchEvent(new CustomEvent("openSearchModal"));
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search logic
  const filteredPackages = query
    ? packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(query.toLowerCase()) ||
          pkg.highlights?.some((h) => h.toLowerCase().includes(query.toLowerCase())) ||
          pkg.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation within the modal
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const itemsCount = query ? filteredPackages.length : recentSearches.length + defaultTags.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % itemsCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query && filteredPackages.length > 0) {
        handleNavigate(filteredPackages[selectedIndex].id, filteredPackages[selectedIndex].name);
      } else if (!query) {
        const totalRecent = recentSearches.length;
        if (selectedIndex < totalRecent) {
          setQuery(recentSearches[selectedIndex].name);
        } else {
          setQuery(defaultTags[selectedIndex - totalRecent]);
        }
      }
    }
  };

  // Keep selected item in view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedEl = scrollContainerRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleNavigate = (id: number, name: string) => {
    // Save to recent
    const newRecent = [{ id, name }, ...recentSearches.filter((r) => r.id !== id)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("sarthiRecentSearches", JSON.stringify(newRecent));

    onClose();
    router.push(`/packages/${id}`);
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("sarthiRecentSearches");
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-start justify-center pt-[10vh] px-4 sm:px-0"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-card/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header / Search Input */}
            <div className="relative flex items-center p-6 border-b border-white/10 shrink-0">
              <Search className="w-6 h-6 text-blue-400 mr-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search destinations, packages, or keywords..."
                className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none focus:ring-0"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  className="mr-2 text-gray-400 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Results Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {query && filteredPackages.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Search className="w-16 h-16 mx-auto mb-6 opacity-20" />
                  <p className="text-xl text-gray-300">No results found for "{query}"</p>
                  <p className="text-sm mt-3 opacity-60">Try searching for "Bali", "Andaman", or "Beaches"</p>
                </div>
              ) : query ? (
                // --- Search Results List ---
                <div className="space-y-2">
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Packages ({filteredPackages.length})
                  </div>
                  {filteredPackages.map((pkg, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <Button
                        variant="ghost"
                        key={pkg.id}
                        data-selected={isSelected}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => handleNavigate(pkg.id, pkg.name)}
                        className={`w-full h-auto justify-start text-left group flex items-center p-3 rounded-2xl transition-all border ${
                          isSelected
                            ? "bg-blue-600/10 border-blue-500/30 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)] hover:bg-blue-600/10"
                            : "border-transparent hover:bg-white/[0.04] hover:border-white/10"
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-white font-bold text-lg">
                            <HighlightText text={pkg.name} highlight={query} />
                          </h4>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-400/70" />
                            <span className="truncate">
                              {pkg.duration} • {pkg.price}
                            </span>
                          </div>
                        </div>
                        <ArrowRight
                          className={`w-5 h-5 transition-all transform ${
                            isSelected ? "text-blue-400 translate-x-1" : "text-gray-600"
                          }`}
                        />
                      </Button>
                    );
                  })}
                </div>
              ) : (
                // --- Empty State (Recent & Suggestions) ---
                <div className="space-y-6 py-4">
                  {recentSearches.length > 0 && (
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                        <span>Recent Searches</span>
                        <Button
                          variant="link"
                          onClick={clearRecent}
                          className="hover:text-gray-300 flex items-center gap-1 transition-colors text-gray-500 h-auto p-0"
                        >
                          <Trash2 className="w-3 h-3" /> Clear
                        </Button>
                      </div>
                      {recentSearches.map((recent, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <Button
                            variant="ghost"
                            key={`recent-${recent.id}`}
                            data-selected={isSelected}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() => handleNavigate(recent.id, recent.name)}
                            className={`w-full h-auto justify-start text-left flex items-center p-3 rounded-xl transition-all border ${
                              isSelected
                                ? "bg-white/10 border-white/20 hover:bg-white/10"
                                : "bg-transparent border-transparent hover:bg-white/5"
                            }`}
                          >
                            <History className={`w-5 h-5 mr-3 ${isSelected ? "text-blue-400" : "text-gray-500"}`} />
                            <span className={`flex-1 ${isSelected ? "text-white" : "text-gray-300"}`}>
                              {recent.name}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Suggested Destinations
                    </div>
                    <div className="flex flex-wrap gap-2 px-4">
                      {defaultTags.map((tag, idx) => {
                        const globalIdx = recentSearches.length + idx;
                        const isSelected = selectedIndex === globalIdx;
                        return (
                          <span
                            key={tag}
                            data-selected={isSelected}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuery(tag);
                              inputRef.current?.focus();
                            }}
                            className={`text-sm px-4 py-2 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                                : "border-white/10 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
