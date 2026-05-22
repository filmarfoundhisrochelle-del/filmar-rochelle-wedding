import React, { useState } from "react";
import { cn } from "@/lib/utils";
export const Tabs = ({ defaultValue, children, className }) => {
  const [active, setActive] = useState(defaultValue);
  return <div className={className}>{React.Children.map(children, c => React.cloneElement(c, { activeTab: active, setActiveTab: setActive }))}</div>;
};
export const TabsList = ({ children, className, activeTab, setActiveTab }) => (
  <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
    {React.Children.map(children, c => React.cloneElement(c, { activeTab, setActiveTab }))}
  </div>
);
export const TabsTrigger = ({ value, children, className, activeTab, setActiveTab, ...props }) => (
  <button onClick={() => setActiveTab(value)} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", activeTab===value ? "bg-background text-foreground shadow" : "", className)} {...props}>{children}</button>
);
export const TabsContent = ({ value, children, className, activeTab }) => (
  activeTab === value ? <div className={cn("mt-2", className)}>{children}</div> : null
);
