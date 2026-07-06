"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface ItineraryInputProps {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
}

export function ItineraryInput({ itinerary, onChange }: ItineraryInputProps) {
  const handleChange = (index: number, field: "title" | "description", value: string) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    onChange(newItinerary);
  };

  const addDay = () => {
    onChange([...itinerary, { day: itinerary.length + 1, title: "", description: "" }]);
  };

  const removeDay = (index: number) => {
    if (itinerary.length > 1) {
      const newItinerary = itinerary
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 }));
      onChange(newItinerary);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">4</span>
        Itinerary
      </h2>

      <div className="space-y-6">
        {itinerary.map((day, index) => (
          <div key={index} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative group transition-colors hover:bg-white/[0.03]">
            {itinerary.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeDay(index)}
                className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 hover:bg-red-400/10"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            <h3 className="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider">Day {day.day}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={day.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="e.g. Arrival in Dubai"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={day.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600 resize-none"
                  placeholder="Describe the activities for this day..."
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addDay}
          className="w-full bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.05] hover:text-white transition-colors border-dashed rounded-xl py-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Day
        </Button>
      </div>
    </div>
  );
}
