import { useState, useCallback } from 'react';

export type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: string;
    pattern?: { value: RegExp; message: string };
    custom?: (value: T[K], allValues: T) => string | null;
  };
};

export function useFormValidation<T extends Record<string, any>>(rules: ValidationRules<T>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = useCallback((name: keyof T, value: T[keyof T], allValues: T): string | null => {
    const fieldRules = rules[name];
    if (!fieldRules) return null;

    // Check required
    if (fieldRules.required) {
      if (value === undefined || value === null || String(value).trim() === '') {
        return fieldRules.required;
      }
    }

    // Only validate pattern and custom if there's an actual value
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      // Check pattern
      if (fieldRules.pattern) {
        if (!fieldRules.pattern.value.test(String(value))) {
          return fieldRules.pattern.message;
        }
      }

      // Check custom
      if (fieldRules.custom) {
        const customError = fieldRules.custom(value, allValues);
        if (customError) {
          return customError;
        }
      }
    }

    return null;
  }, [rules]);

  const handleChange = useCallback((name: keyof T, value: T[keyof T], allValues: T) => {
    // We clear the error immediately if they are fixing it, 
    // or validate on the fly if we want to be strict.
    // Usually it's best to validate and clear if valid.
    const error = validateField(name, value, allValues);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }));
  }, [validateField]);

  const handleBlur = useCallback((name: keyof T, value: T[keyof T], allValues: T) => {
    const error = validateField(name, value, allValues);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }));
  }, [validateField]);

  const validateAll = useCallback((allValues: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const key in rules) {
      const error = validateField(key, allValues[key], allValues);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  return {
    errors,
    handleChange,
    handleBlur,
    validateAll,
    setErrors
  };
}
