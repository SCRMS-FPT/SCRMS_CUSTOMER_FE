import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ")
}

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

