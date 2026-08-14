"use client";

import React, { useState, useEffect } from "react";

interface WordLimitTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxWords?: number;
  rows?: number;
  hasError?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function WordLimitTextarea({
  value,
  onChange,
  onBlur,
  name,
  id,
  required = false,
  disabled = false,
  placeholder = "",
  className = "",
  maxWords = 500,
  rows = 5,
  hasError = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: WordLimitTextareaProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [wordCount, setWordCount] = useState(0);

  // Function to count words
  const countWords = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
      setWordCount(countWords(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const currentWords = countWords(text);

    if (currentWords <= maxWords) {
      setInternalValue(text);
      setWordCount(currentWords);
      onChange(text);
    } else {
      // If user pastes or types a word that exceeds the limit, 
      // we prevent updating the state (so the textarea rejects the input)
      // Alternatively, we could trim the text to exactly maxWords
      const words = text.trim().split(/\s+/);
      const allowedText = words.slice(0, maxWords).join(" ");
      
      // If they were typing a space after maxWords, we just ignore the space
      if (text.endsWith(" ") && currentWords === maxWords + 1) {
          // Do nothing
          return;
      }
      
      setInternalValue(allowedText);
      setWordCount(maxWords);
      onChange(allowedText);
    }
  };

  const borderClass = hasError ? "border-red-500 focus:ring-red-500" : "border-border dark:border-white/10 focus:ring-blue-500";

  return (
    <div className="w-full relative">
      <textarea
        id={id}
        name={name}
        value={internalValue}
        onChange={handleChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        className={`w-full bg-background/50 dark:bg-black/20 border ${borderClass} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${className}`}
      />
      <div className={`text-xs mt-1 text-right font-medium ${wordCount >= maxWords ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground'}`}>
        {wordCount} / {maxWords} words
      </div>
    </div>
  );
}
