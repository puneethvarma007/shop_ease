"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-[#A4D8E1]/20",
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-gradient-to-r from-[#A4D8E1] to-[#B2E0E6] transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
