"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatMessage from "@/components/chat-message"
import TypingIndicator from "@/components/typing-indicator"
import { cn } from "@/lib/utils"

interface ChatMessageType {
  role: "user" | "bot"
  text: string
  id: string
}

interface BotResponse {
  response: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { role: "bot", text: "Sou o Toretto, queria falar comigo?", id: "intro" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    "Me fale da sua família",
    "Qual o seu carro favorito?",
    "Como você se sente em relação ao Brian?",
    "Algum conselho pra vida?",
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return

    const userMessageId = generateId()
    const newMessages: ChatMessageType[] = [...messages, { role: "user", text, id: userMessageId }]

    setMessages(newMessages)
    setInput("")
    setLoading(true)
    setShowSuggestions(false)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: text }),
      })

      const data = (await res.json()) as BotResponse

      setMessages([...newMessages, { role: "bot", text: data.response, id: generateId() }])
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "bot", text: "Falha na conexão. As ruas estão muito movimentadas agora.", id: generateId() },
      ])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const clearChat = () => {
    setMessages([{ role: "bot", text: "Sou o Toretto, queria falar comigo?", id: "intro-new" }])
    setShowSuggestions(true)
  }

  return (
    <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 flex flex-col h-[70vh]">
      {/* Header */}
      <div className="bg-zinc-900 p-4 flex items-center justify-between border-b border-zinc-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500">
              <img src="/toretto.webp" alt="Dom Toretto" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
          </div>
          <div>
            <h2 className="font-bold text-amber-500">Dom Toretto</h2>
            <p className="text-xs text-zinc-400">Online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="text-zinc-400 hover:text-white hover:bg-zinc-700"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && <TypingIndicator message={{ role: "bot", text: "", id: "typing" }} />}

        {showSuggestions && messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-3 py-2 rounded-full text-sm transition-all duration-200 border border-zinc-600 hover:border-amber-500"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className={cn(
          "p-4 bg-zinc-900 border-t border-zinc-700 transition-all duration-300",
          loading ? "opacity-50" : "opacity-100",
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2 items-center"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Fale com Toretto..."
            disabled={loading}
            className="flex-1 bg-zinc-800 border-zinc-700 focus-visible:ring-amber-500 text-white placeholder:text-zinc-500"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <Send size={18} className="mr-1" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
