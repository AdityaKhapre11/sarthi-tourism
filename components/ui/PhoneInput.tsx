"use client";

import React from "react";
interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  name,
  id,
  required = false,
  disabled = false,
  className = "",
  hasError = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: PhoneInputProps) {
  // Extract just the digits from the incoming value if it already has +91
  const digits = value.startsWith("+91") ? value.slice(3).trim() : value.replace(/\D/g, "").slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric characters
    const rawValue = e.target.value.replace(/\D/g, "");
    
    // Truncate to 10 digits
    const truncatedValue = rawValue.slice(0, 10);
    
    // Emit the final formatted value or empty string if empty
    if (truncatedValue.length > 0) {
      onChange(`+91${truncatedValue}`);
    } else {
      onChange("");
    }
  };

  const borderClass = hasError ? "border-red-500 focus:ring-red-500" : "border-border dark:border-white/10 focus:ring-blue-500";
  const prefixBorderClass = hasError ? "border-red-500" : "border-border dark:border-white/10";

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Fixed Country Code Prefix */}
      <div className={`absolute left-0 top-0 bottom-0 flex items-center justify-center px-4 bg-background/80 dark:bg-black/40 border-r ${prefixBorderClass} rounded-l-xl text-foreground font-semibold`}>
        +91
      </div>
      
      {/* Number Input */}
      <input
        type="tel"
        id={id}
        name={name}
        value={digits}
        onChange={handleChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        placeholder="9876543210"
        className={`w-full bg-background/50 dark:bg-black/20 border ${borderClass} rounded-xl pl-16 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </div>
  );
}
