import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const getButtonClasses = (variant?: string, size?: string) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

  const variantClasses = {
    default: "bg-orange-500 text-white shadow hover:bg-orange-600 focus-visible:ring-orange-500",
    destructive: "bg-red-500 text-white shadow hover:bg-red-600 focus-visible:ring-red-500",
    outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 focus-visible:ring-gray-500",
    secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:ring-gray-500",
    ghost: "hover:bg-gray-100 focus-visible:ring-gray-500",
    link: "text-orange-500 underline-offset-4 hover:underline focus-visible:ring-orange-500",
  }

  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 py-1.5 text-xs",
    lg: "h-10 px-6 py-2.5",
    icon: "h-9 w-9",
  }

  return cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses] || variantClasses.default,
    sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default,
  )
}

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

function Button({ className, variant = "default", size = "default", asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return <Comp className={cn(getButtonClasses(variant, size), className)} {...props} />
}

export { Button }
