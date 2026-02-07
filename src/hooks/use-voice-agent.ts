import { useState, useCallback, useRef, useEffect } from "react";

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

const AGENT_RESPONSES: Record<string, string> = {
  hello: "Hello! I'm Nova, your AI voice assistant. How can I help you today?",
  help: "I can assist you with general questions, tell you about the weather, set reminders, or just have a conversation. What would you like to do?",
  weather: "I don't have live weather data, but I can tell you it's always sunny in the digital world! For real weather, try checking a weather app.",
  name: "I'm Nova, a voice-powered AI assistant built right here in your browser.",
  default: "",
};

function getAgentResponse(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) return AGENT_RESPONSES.hello;
  if (lower.includes("help") || lower.includes("what can you do")) return AGENT_RESPONSES.help;
  if (lower.includes("weather")) return AGENT_RESPONSES.weather;
  if (lower.includes("your name") || lower.includes("who are you")) return AGENT_RESPONSES.name;

  const responses = [
    `Interesting! You said: "${userText}". I'm a demo agent using browser speech APIs — connect me to a real AI backend for smarter responses!`,
    `I heard you say "${userText}". As a frontend-only agent, my responses are limited, but the voice experience is real!`,
    `"${userText}" — got it! For production use, you'd connect me to an LLM API for intelligent conversations.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function useVoiceAgent() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const stopVolumeMonitor = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setVolumeLevel(0);
  }, []);

  const startVolumeMonitor = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setVolumeLevel(Math.min(avg / 128, 1));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // mic not available
    }
  }, []);

  const speak = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      const voices = synth.getVoices();
      const preferred = voices.find(
        (v) => v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel")
      );
      if (preferred) utterance.voice = preferred;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      synth.speak(utterance);
    });
  }, []);

  const addMessage = useCallback((role: "user" | "agent", content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content, timestamp: new Date() },
    ]);
  }, []);

  const startListening = useCallback(async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage("agent", "Sorry, your browser doesn't support speech recognition. Try Chrome or Edge.");
      return;
    }

    await startVolumeMonitor();
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(result);
    };

    recognition.onend = async () => {
      setIsListening(false);
      stopVolumeMonitor();
      const finalText = transcript;
      if (finalText.trim()) {
        addMessage("user", finalText);
        setTranscript("");
        const response = getAgentResponse(finalText);
        addMessage("agent", response);
        await speak(response);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      stopVolumeMonitor();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }, [addMessage, speak, startVolumeMonitor, stopVolumeMonitor, transcript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    stopVolumeMonitor();
  }, [stopVolumeMonitor]);

  useEffect(() => {
    return () => {
      stopVolumeMonitor();
      recognitionRef.current?.abort();
    };
  }, [stopVolumeMonitor]);

  return {
    isListening,
    isSpeaking,
    transcript,
    messages,
    volumeLevel,
    startListening,
    stopListening,
    isActive: isListening || isSpeaking,
  };
}
