"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast, type CustomToastVariant } from "@/components/ui/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();
  const { theme, isRounded } = useTheme();
  const isDark = theme === "dark";

  return (
    <ToastProvider>
      {toasts.map(function({
        id,
        title,
        description,
        action,
        variant = "default", 
        ...props
      }) {
        
        const radiusClass = isRounded ? "rounded-md" : "rounded-none";

        const variantStyles: Record<CustomToastVariant, string> = {
          default: isDark 
            ? "bg-zinc-950 text-zinc-50 border-zinc-800" 
            : "bg-white text-zinc-950 border-zinc-200",
            
          info: isDark
            ? "border-amber-500 bg-zinc-950 text-amber-500"
            : "border-amber-200 bg-amber-50 text-amber-700",
            
          success: isDark
            ? "border-emerald-500 bg-zinc-950 text-emerald-500"
            : "border-emerald-200 bg-emerald-50 text-emerald-700",
            
          failed: isDark
            ? "border-rose-500 bg-zinc-950 text-rose-500"
            : "border-rose-200 bg-rose-50 text-rose-600",
        };

        const baseLayout = "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden border p-4 pr-6 transition-all font-sans";

        return (
          <Toast
            key={id}
            className={cn(baseLayout, variantStyles[variant as CustomToastVariant], radiusClass)}
            {...props}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-sm font-semibold tracking-tight">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className={cn(
                  "text-xs opacity-90",
                  variant === "default" ? "text-muted-foreground" : ""
                )}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={cn(
              "absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100",
              variant === "failed" && (isDark ? "text-rose-500 hover:text-rose-400" : "text-rose-400 hover:text-rose-200"),
              variant === "success" && (isDark ? "text-emerald-500 hover:text-emerald-400" : "text-emerald-400 hover:text-emerald-200"),
              variant === "info" && (isDark ? "text-amber-500 hover:text-amber-400" : "text-amber-400 hover:text-amber-200")
            )} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
