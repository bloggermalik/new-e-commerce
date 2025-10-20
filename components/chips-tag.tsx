"use client"

import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type TagsInputProps = {
  value: string[]
  onChange: (value: string[]) => void
}

export function ChipsTag({ value, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("")

  const addTag = () => {
    const newTag = inputValue.trim()
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag])
      setInputValue("")
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-col ">
      <div className="flex flex-wrap">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-sidebar-primary hover:bg-sidebar-primary-foreground px-3 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="bg-sidebar-primary hover:bg-sidebar-primary-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          className="
                                                        border border-red-200
                                                        focus:border-[var(--sidebar-primary)]
                                                        focus:!ring-0 focus:!outline-none focus:!ring-offset-0
                                                        dark:focus:border-[var(--sidebar-primary)]
                                                        dark:border-border
                                                        dark:bg-muted
                                                        font-sans font-medium
                                                        placeholder:font-light placeholder:text-muted-foreground
                                                        disabled:cursor-not-allowed disabled:opacity-50
                                                        "
          placeholder="Add a tag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addTag()
            }
          }}
        />
      
      </div>
    </div>
  )
}
