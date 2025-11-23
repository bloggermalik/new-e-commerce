"use client"

import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
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
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="text-white  flex items-center gap-1 rounded-full bg-sidebar-primary text-sidebar-primary-foreground px-3 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-white bg-sidebar-primary cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <Input
          className=""
                                                      
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
