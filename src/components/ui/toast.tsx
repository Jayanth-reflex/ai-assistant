import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const ToastProvider = ToastPrimitive.Provider

export type ToastMessage = {
  title: string
  description: string
  variant: ToastVariant
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "bg-transparent fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

type ToastVariant = "neutral" | "success" | "error" | "custom"

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant
  customStyle?: React.CSSProperties
}

const toastVariants: Record<ToastVariant, string> = {
  neutral: "bg-yellow-500 text-white",
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  custom: "" // Custom styling will be applied via customStyle prop
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant = "neutral", customStyle, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      "group fixed top-4 left-4 z-50 w-auto max-w-xs px-3 py-2 rounded-md shadow-lg animate-in fade-in slide-in-from-bottom text-xs",
      variant === "custom" ? "" : toastVariants[variant],
      className
    )}
    style={variant === "custom" ? customStyle : undefined}
    {...props}
  />
))
Toast.displayName = ToastPrimitive.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn("text-xs font-medium text-white hover:opacity-90", className)}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitive.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute top-1 right-1 text-white opacity-70 hover:opacity-100",
      className
    )}
    {...props}
  >
    <X className="h-3 w-3" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("font-semibold text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-xs opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

export type { ToastProps, ToastVariant }
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription
}
