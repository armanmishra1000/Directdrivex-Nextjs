"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-red-500" });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: "Weak", color: "bg-red-500" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = "Weak";
    let color = "from-red-500 to-red-600";
    if (score >= 3) {
      label = "Medium";
      color = "from-amber-500 to-amber-600";
    }
    if (score >= 4) {
      label = "Strong";
      color = "from-emerald-500 to-emerald-600";
    }
    setStrength({ score, label, color });
  }, [password]);

  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex-grow bg-slate-200 dark:bg-slate-700/60 rounded-full h-1.5 flex gap-1 p-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full w-1/5 rounded-full transition-all duration-300",
              i < strength.score ? `bg-gradient-to-r ${strength.color}` : "bg-transparent"
            )}
          />
        ))}
      </div>
      <span className="w-16 text-xs font-medium text-right text-slate-600 dark:text-slate-300">
        {strength.label}
      </span>
    </div>
  );
}