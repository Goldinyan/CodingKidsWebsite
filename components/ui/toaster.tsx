"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();
  const { theme, isRounded } = useTheme();

  return (
    <ToastProvider>
      {toasts.map(function({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const isDark = theme === "dark";

        const themeClasses = cn(
          "bg-white text-zinc-950",
          isDark && "bg-zinc-950 text-white",

          variant === "failed" &&
          (isDark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"),
        );

        const radiusClass = isRounded ? "rounded-md" : "rounded-none";

        return (
          <Toast
            key={id}
            variant={variant}
            className={cn(themeClasses, radiusClass)}
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription
                  className={cn(
                    isDark ? "text-zinc-400" : "text-zinc-500",
                    variant === "failed" &&
                    (isDark ? "text-zinc-700" : "text-zinc-300"),
                  )}
                >
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose
              className={
                isDark
                  ? "text-white/50 hover:text-white"
                  : "text-black/50 hover:text-black"
              }
            />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
