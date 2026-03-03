import React from "react"
import { CodeIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export const FragmentCard = ({ isActive, fragment, onFragmentClick }) => {
    console.log(isActive)
    return (
        <button
            onClick={() => onFragmentClick()}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                "bg-neutral-100 dark:bg-neutral-900",
                "hover:bg-neutral-200 dark:hover:bg-neutral-800",
                "transition-colors",
                isActive && "bg-neutral-200 dark:bg-neutral-800"
            )}
        >
            <CodeIcon className="h-3.5 w-3.5 opacity-70" />
            <span className="truncate">
                {fragment.title || "untitled"}
            </span>
        </button>
    )
}