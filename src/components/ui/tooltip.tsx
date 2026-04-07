import * as React from "react";

// Minimal proxy for tooltip to not crash imports
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
