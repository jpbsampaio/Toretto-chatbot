import ChatInterface from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <div className="w-full py-8 flex flex-col items-center">
          <div className="relative w-full max-w-md mb-6">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 rounded-full"></div>
            <h1 className="relative text-5xl font-bold text-center text-white">
              <span className="text-amber-500">Toretto</span> Chat
            </h1>
          </div>
          <p className="text-zinc-400 text-center max-w-md mb-8">
            "Eu vivo minha vida a um quarto de milha por vez."
          </p>
        </div>

        <ChatInterface />

        <footer className="mt-8 text-zinc-500 text-sm text-center">
          <p>© {new Date().getFullYear()} Toretto Chat | Fast & Furious Fan Project</p>
        </footer>
      </div>
    </main>
  )
}