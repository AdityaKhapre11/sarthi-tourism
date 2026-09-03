import { Check, X } from "lucide-react";

export interface PasswordValidationRules {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export function validatePassword(password: string): PasswordValidationRules {
  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  return {
    ...rules,
    isValid: Object.values(rules).every(Boolean),
  };
}

export function PasswordRequirements({ password }: { password: string }) {
  const rules = validatePassword(password);
  const isPristine = password.length === 0;

  const Requirement = ({ met, text }: { met: boolean; text: string }) => (
    <div
      className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
        isPristine ? "text-gray-400" : met ? "text-green-400" : "text-red-400"
      }`}
    >
      {isPristine ? (
        <div className="w-4 h-4 rounded-full border border-gray-500 shrink-0" />
      ) : met ? (
        <Check className="w-4 h-4 shrink-0" />
      ) : (
        <X className="w-4 h-4 shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="mt-3 space-y-2 bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm animate-in fade-in duration-300">
      <p className="text-sm font-semibold text-gray-300 mb-3">Password requirements:</p>
      <div className="grid grid-cols-1 gap-2">
        <Requirement met={rules.minLength} text="At least 8 characters" />
        <Requirement met={rules.hasUpper} text="Uppercase letter (A-Z)" />
        <Requirement met={rules.hasLower} text="Lowercase letter (a-z)" />
        <Requirement met={rules.hasNumber} text="Number (0-9)" />
        <Requirement met={rules.hasSpecial} text="Special character (!@#$%^&* etc.)" />
      </div>
    </div>
  );
}
