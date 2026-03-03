"use client"

import React, { useEffect, useState } from "react"

const messages = [
  "Thinking",
  "Analyzing request",
  "Generating response",
  "Resolving",
  "Almost there"
]

export const ThinkingMessage = () => {
  const [index, setIndex] = useState(0)
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 2500)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."))
    }, 400)

    return () => {
      clearInterval(messageInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  return (
    <div className="flex justify-start px-3 py-1">
      <div className="max-w-[70%] rounded-lg px-3 py-2 text-sm 
                      bg-neutral-100 dark:bg-neutral-900 
                      text-neutral-600 dark:text-neutral-400 
                      italic tracking-tight">
        {messages[index]}
        <span className="inline-block w-6">{dots}</span>
      </div>
    </div>
  )
}