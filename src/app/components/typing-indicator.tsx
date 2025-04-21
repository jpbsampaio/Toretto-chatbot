"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    role: "user" | "bot"
    text: string
    id: string
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "bot"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-end gap-2", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500">
            <img src="/toretto.webp" alt="Dom" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-md",
          isBot ? "bg-zinc-700 text-white rounded-bl-none" : "bg-amber-500 text-black rounded-br-none",
        )}
      >
        {message.text}
      </div>
    </motion.div>
  )
}
