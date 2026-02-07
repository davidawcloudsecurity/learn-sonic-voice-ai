import { motion } from "framer-motion";

interface StatusBarProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

export function StatusBar({ isActive, isListening, isSpeaking }: StatusBarProps) {
  return (
    <div className="glass rounded-full px-6 py-3 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isActive ? (isSpeaking ? "bg-secondary" : "bg-primary") : "bg-muted-foreground/30"
          }`}
          animate={isActive ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {isListening ? "Recording" : isSpeaking ? "Responding" : "Standby"}
        </span>
      </div>

      <div className="h-3 w-px bg-border" />

      <span className="text-xs font-mono text-muted-foreground/50">
        NOVA v1.0
      </span>

      <div className="h-3 w-px bg-border" />

      <span className="text-xs font-mono text-muted-foreground/50">
        Web Speech API
      </span>
    </div>
  );
}
