import { motion } from "framer-motion";
import { VoiceOrb } from "@/components/VoiceOrb";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { StatusBar } from "@/components/StatusBar";
import { useVoiceAgent } from "@/hooks/use-voice-agent";

const Index = () => {
  const {
    isListening,
    isSpeaking,
    isActive,
    transcript,
    messages,
    volumeLevel,
    startListening,
    stopListening,
  } = useVoiceAgent();

  const handleOrbClick = () => {
    if (isListening) {
      stopListening();
    } else if (!isSpeaking) {
      startListening();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsl(var(--secondary)), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-4"
      >
        <h1 className="text-5xl font-bold tracking-tight text-gradient">NOVA</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-12 text-sm font-mono uppercase tracking-[0.3em] text-muted-foreground"
      >
        Voice AI Agent
      </motion.p>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-12"
      >
        <StatusBar isActive={isActive} isListening={isListening} isSpeaking={isSpeaking} />
      </motion.div>

      {/* Voice Orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
        className="mb-16"
      >
        <VoiceOrb
          isActive={isActive}
          isListening={isListening}
          isSpeaking={isSpeaking}
          volumeLevel={volumeLevel}
          onClick={handleOrbClick}
        />
      </motion.div>

      {/* Transcript */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <TranscriptPanel
          messages={messages}
          liveTranscript={transcript}
          isListening={isListening}
        />
      </motion.div>
    </div>
  );
};

export default Index;
