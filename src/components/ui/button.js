import React from "react";
import { cn } from "@/lib/utils";
export const Button = React.forwardRef(({ className, variant="default", ...props }, ref) => (
  <button ref={ref} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", variant==="outline" ? "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground shadow hover:bg-primary/90", className)} {...props} />
));
Button.displayName = "Button";
