"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Switch } from "./ui/switch"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center space-x-4 text-lg"> {/* Increased spacing and text size */}

      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="h-6 w-10 
          transition-all duration-300 ease-in-out
          [&>span]:h-5 [&>span]:w-5 
          [&>span]:translate-x-0 
          [&>span]:transition-all [&>span]:duration-300 [&>span]:ease-in-out 
          [&>span]:data-[state=checked]:translate-x-5
          data-[state=checked]:bg-primary
          data-[state=unchecked]:bg-input"
      />
 
    </div>
  )
}
