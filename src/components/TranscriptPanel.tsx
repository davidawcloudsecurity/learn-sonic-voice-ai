import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Message } from "@/hooks/use-voice-agent";

interface TranscriptPanelProps {
  messages: Message[];
  liveTranscript: string;
  isListening: boolean;
}

export function TranscriptPanel({ messages, liveTranscript, isListening }: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, liveTranscript]);

  return (
    <div className="glass rounded-2xl p-6 w-full max-w-lg h-72 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Transcript
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 scrollbar-thin pr-1">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary/15 text-foreground border border-primary/20 rounded-br-md"
                    : "bg-secondary/15 text-foreground border border-secondary/20 rounded-bl-md"
                }`}
              >
                <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  {msg.role === "user" ? "You" : "Nova"}
                </span>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isListening && liveTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md text-sm bg-primary/10 border border-primary/10 text-foreground/70 italic">
              {liveTranscript}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ▌
              </motion.span>
            </div>
          </motion.div>
        )}

        {messages.length === 0 && !liveTranscript && (
          <div className="flex items-center justify-center h-full text-muted-foreground/50 text-sm font-mono">
            Tap the orb to begin...
          </div>
        )}
      </div>
    </div>
  );
}
