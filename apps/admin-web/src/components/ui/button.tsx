import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "button inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border text-sm font-medium outline-2 outline-transparent outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=loading]:cursor-wait data-[state=error]:border-error data-[state=success]:border-success [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-accent bg-accent text-accent-foreground hover:bg-accent-hover active:translate-y-px",
        secondary:
          "border-border-strong bg-background text-foreground hover:bg-surface active:translate-y-px",
        ghost:
          "border-transparent bg-transparent text-muted hover:bg-surface hover:text-foreground active:translate-y-px",
      },
      size: {
        default: "px-4 py-2",
        compact: "px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
