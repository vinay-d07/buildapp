"use client"

import React, { useState } from "react"
import { ExternalLink, RefreshCcw } from "lucide-react"
import { Hint } from "@/components/ui/Hint"
import { Button } from "@/components/ui/button"

export const FragmentWeb = ({ data }) => {
  const url = data?.[0]?.sandBoxUrl

  const [fragKey, setFragKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const onRefresh = () => setFragKey((p) => p + 1)

  const onCopy = () => {
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col w-full h-full bg-background">
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/40">

        <Hint text="Refresh" side="bottom">
          <Button size="icon" variant="ghost" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </Hint>

        {/* URL field */}
        <Hint text={copied ? "Copied" : "Click to copy"} side="bottom">
          <button
            onClick={onCopy}
            disabled={!url}
            className="flex-1 text-left text-sm px-3 py-1.5 rounded-md 
                       bg-muted hover:bg-muted/70 
                       transition-colors truncate"
          >
            {url || "No preview available"}
          </button>
        </Hint>

        <Hint text="Open in new tab" side="bottom">
          <Button
            size="icon"
            variant="ghost"
            disabled={!url}
            onClick={() => window.open(url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Hint>

      </div>

      {/* Preview */}
      <div className="flex-1 bg-background">
        {url && (
          <iframe
            key={fragKey}
            src={url}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        )}
      </div>
    </div>
  )
}