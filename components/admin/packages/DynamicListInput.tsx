"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui";

interface DynamicListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function DynamicListInput({ label, items, onChange, placeholder }: DynamicListInputProps) {
  
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
              placeholder={placeholder || `Item ${index + 1}`}
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeItem(index)}
                className="flex-shrink-0 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.05] hover:text-white transition-colors border-dashed rounded-xl py-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Item
        </Button>
      </div>
    </div>
  );
}
