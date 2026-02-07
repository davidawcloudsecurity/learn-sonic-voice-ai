import { motion } from "framer-motion";

interface VoiceOrbProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  volumeLevel: number;
  onClick: () => void;
}

export function VoiceOrb({ isActive, isListening, isSpeaking, volumeLevel, onClick }: VoiceOrbProps) {
  const scale = 1 + volumeLevel * 0.3;
  const glowIntensity = isActive ? 0.6 + volumeLevel * 0.4 : 0.2;

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center outline-none focus:outline-none cursor-pointer group"
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {/* Outer pulse rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute rounded-full border border-primary/20"
            animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            style={{ width: 200, height: 200 }}
          />
          <motion.div
            className="absolute rounded-full border border-secondary/20"
            animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            style={{ width: 200, height: 200 }}
          />
        </>
      )}

      {/* Glow layer */}
      <motion.div
        className="absolute rounded-full"
        animate={{ scale: scale * 1.4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: 180,
          height: 180,
          background: isSpeaking
            ? `radial-gradient(circle, hsl(270 60% 55% / ${glowIntensity}), transparent 70%)`
            : `radial-gradient(circle, hsl(195 100% 50% / ${glowIntensity}), transparent 70%)`,
        }}
      />

      {/* Main orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{
          width: 140,
          height: 140,
          background: isSpeaking
            ? "radial-gradient(circle at 35% 35%, hsl(270 60% 65%), hsl(270 60% 35%), hsl(240 15% 8%))"
            : isListening
            ? "radial-gradient(circle at 35% 35%, hsl(195 100% 60%), hsl(195 100% 30%), hsl(240 15% 8%))"
            : "radial-gradient(circle at 35% 35%, hsl(220 20% 30%), hsl(240 12% 15%), hsl(240 15% 8%))",
          boxShadow: isActive
            ? `0 0 40px -5px hsl(${isSpeaking ? "270 60% 55%" : "195 100% 50%"} / 0.5)`
            : "0 0 20px -5px hsl(195 100% 50% / 0.15)",
        }}
      >
        {/* Inner light */}
        <motion.div
          className="absolute rounded-full"
          animate={{
            opacity: isActive ? [0.5, 1, 0.5] : 0.3,
            scale: isActive ? [0.8, 1.1, 0.8] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 40,
            height: 40,
            background: "radial-gradient(circle, hsl(0 0% 100% / 0.9), transparent)",
            filter: "blur(8px)",
          }}
        />

        {/* Icon */}
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 text-foreground/90"
          animate={{ opacity: isActive ? [0.8, 1, 0.8] : 0.7 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isListening ? (
            <>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </>
          ) : isSpeaking ? (
            <>
              <motion.path
                d="M2 10v3"
                animate={{ scaleY: [1, 1.8, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
              />
              <motion.path
                d="M6 6v11"
                animate={{ scaleY: [1, 1.4, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
              />
              <motion.path
                d="M10 3v18"
                animate={{ scaleY: [1, 1.6, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.path
                d="M14 8v7"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
              />
              <motion.path
                d="M18 5v13"
                animate={{ scaleY: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
              />
              <motion.path
                d="M22 10v3"
                animate={{ scaleY: [1, 1.7, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.05 }}
              />
            </>
          ) : (
            <>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </>
          )}
        </motion.svg>
      </motion.div>

      {/* Label */}
      <motion.span
        className="absolute -bottom-10 text-sm font-mono tracking-wider text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isListening ? "LISTENING..." : isSpeaking ? "SPEAKING..." : "TAP TO TALK"}
      </motion.span>
    </button>
  );
}
