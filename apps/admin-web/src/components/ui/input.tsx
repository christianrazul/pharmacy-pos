import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "input flex min-h-11 w-full rounded-[var(--radius-sm)] border border-border-strong bg-background px-3 py-2 pr-9 text-base text-foreground outline-2 outline-transparent outline-offset-1 placeholder:text-neutral disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:border-error aria-invalid:bg-error-surface",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
