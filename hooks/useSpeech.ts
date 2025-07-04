import { useState, useEffect } from "react";

interface UseSpeechOptions {
  defaultLang?: string;
}

export type VoiceGender = "all" | "male" | "female";

// GLOBAL VOICE SETTINGS - These will be used for ALL messages
const GLOBAL_VOICE = {
  currentVoice: null as SpeechSynthesisVoice | null,
  rate: 1,
  pitch: 1,
  genderFilter: "all" as VoiceGender
};

export function useSpeech(options: UseSpeechOptions = {}) {
  // Local state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(GLOBAL_VOICE.currentVoice);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [rate, setRate] = useState(GLOBAL_VOICE.rate);
  const [pitch, setPitch] = useState(GLOBAL_VOICE.pitch);
  const [genderFilter, setGenderFilter] = useState<VoiceGender>(GLOBAL_VOICE.genderFilter);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Helper function to guess voice gender based on name
  const guessVoiceGender = (voice: SpeechSynthesisVoice): "male" | "female" => {
    const name = voice.name.toLowerCase();

    // Common female indicators in voice names
    const femaleIndicators = [
      "female", "woman", "girl", "fiona", "victoria", "karen", "moira", "samantha", 
      "tessa", "amelie", "anna", "ting-ting", "mei-jia", "sin-ji", "kathy", "susan",
      "zira", "laura", "julia", "alice", "alva", "rosa", "paulina", "satu", "ona",
      "ioana", "sabina", "helena", "katja", "herena", "tatyana", "xiaoyu", "yaoyao",
      "huihui", "tracy", "elsa", "melina", "nora", "zosia", "luciana", "joana", "maria"
    ];

    // Common male indicators in voice names
    const maleIndicators = [
      "male", "man", "guy", "boy", "daniel", "fred", "lee", "bruce", "tom", "diego",
      "juan", "jorge", "carlos", "xander", "david", "mark", "james", "richard", "george",
      "pablo", "stefan", "henrik", "ivan", "andrei", "pavel", "kangkang", "zhiwei",
      "paul", "claude", "guillaume", "felix", "ryan", "michael", "sean", "wayne", "bob"
    ];

    // Check for explicit gender indicators
    if (femaleIndicators.some((indicator) => name.includes(indicator))) {
      return "female";
    }
    if (maleIndicators.some((indicator) => name.includes(indicator))) {
      return "male";
    }

    // Default to male if we can't determine
    return "male";
  };

  // Filter voices by gender
  const getFilteredVoices = (allVoices: SpeechSynthesisVoice[], gender: VoiceGender) => {
    if (gender === "all") return allVoices;

    return allVoices.filter((voice) => {
      const voiceGender = guessVoiceGender(voice);
      return voiceGender === gender;
    });
  };

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadVoices = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      const availableVoices = window.speechSynthesis.getVoices();
      console.log("Available voices:", availableVoices.length);

      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoicesLoaded(true);

        // If we already have a global voice, try to find it in the available voices
        if (GLOBAL_VOICE.currentVoice) {
          const existingVoice = availableVoices.find(
            v => v.voiceURI === GLOBAL_VOICE.currentVoice?.voiceURI
          );
          
          if (existingVoice) {
            console.log(`Using existing global voice: ${existingVoice.name}`);
            setSelectedVoice(existingVoice);
            return;
          }
        }

        // Otherwise try to find a suitable default voice
        const defaultLang = options.defaultLang || "en-US";
        const preferredLang = /[\u4e00-\u9fa5]/.test(defaultLang)
          ? "zh-CN"
          : defaultLang;

        const defaultVoice =
          availableVoices.find((v) => v.lang === preferredLang) ||
          availableVoices.find((v) =>
            v.lang.startsWith(preferredLang.split("-")[0])
          ) ||
          availableVoices[0];

        if (defaultVoice) {
          console.log(
            `Setting default voice: ${defaultVoice.name} (${defaultVoice.lang})`
          );
          setVoice(defaultVoice);
        }
      }
    };

    // Try to load voices immediately
    loadVoices();

    // Also set up the onvoiceschanged event
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, [options.defaultLang]);

  // Function to set voice and update global state
  const setVoice = (voice: SpeechSynthesisVoice | null) => {
    if (voice) {
      // Update global state first
      GLOBAL_VOICE.currentVoice = voice;
      
      // Then update component state
      setSelectedVoice(voice);
      
      console.log(`Voice set globally: ${voice.name} (${voice.lang})`);
      
      // Test the new voice immediately
      testVoice();
    } else {
      GLOBAL_VOICE.currentVoice = null;
      setSelectedVoice(null);
    }
  };

  // Function to set rate and update global state
  const setRateValue = (newRate: number) => {
    // Update global state first
    GLOBAL_VOICE.rate = newRate;
    
    // Then update component state
    setRate(newRate);
    
    console.log(`Rate set globally: ${newRate}`);
    
    // Test with new rate
    testVoice();
  };

  // Function to set pitch and update global state
  const setPitchValue = (newPitch: number) => {
    // Update global state first
    GLOBAL_VOICE.pitch = newPitch;
    
    // Then update component state
    setPitch(newPitch);
    
    console.log(`Pitch set globally: ${newPitch}`);
    
    // Test with new pitch
    testVoice();
  };

  // Function to set gender filter and update global state
  const setGenderFilterValue = (gender: VoiceGender) => {
    // Update global state first
    GLOBAL_VOICE.genderFilter = gender;
    
    // Then update component state
    setGenderFilter(gender);
    
    console.log(`Gender filter set globally: ${gender}`);
  };
  
  // Function to test voice settings with a short sample
  const testVoice = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    // ALWAYS use the global voice settings
    const voice = GLOBAL_VOICE.currentVoice;
    if (!voice) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    // Create a short test utterance
    const testUtterance = new SpeechSynthesisUtterance("Testing voice settings.");

    // Apply settings from global state
    testUtterance.voice = voice;
    testUtterance.lang = voice.lang;
    testUtterance.rate = GLOBAL_VOICE.rate;
    testUtterance.pitch = GLOBAL_VOICE.pitch;

    // Speak the test
    window.speechSynthesis.speak(testUtterance);
    console.log(`Testing voice: ${voice.name}, rate: ${GLOBAL_VOICE.rate}, pitch: ${GLOBAL_VOICE.pitch}`);
  };

  // Function to speak text - ALWAYS uses the current global settings
  const speak = (text: string, id: string) => {
    try {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        console.warn("Speech synthesis not available");
        return;
      }

      // If already speaking this text, stop it
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      // Stop any current speech
      window.speechSynthesis.cancel();

      // Don't try to speak empty text
      if (!text.trim()) {
        return;
      }

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // CRITICAL: ALWAYS use the GLOBAL voice settings
      // This ensures all messages use the current voice
      const currentVoice = GLOBAL_VOICE.currentVoice;
      
      // Set voice if available, otherwise auto-detect language
      if (currentVoice) {
        utterance.voice = currentVoice;
        utterance.lang = currentVoice.lang;
        console.log(`Using global voice: ${currentVoice.name} (${currentVoice.lang})`);
      } else {
        // Auto-detect language
        const detectedLang = /[\u4e00-\u9fa5]/.test(text) ? "zh-CN" : "en-US";
        utterance.lang = detectedLang;
        console.log(`No voice selected, using detected language: ${detectedLang}`);
      }

      // ALWAYS use the global rate and pitch
      utterance.rate = GLOBAL_VOICE.rate;
      utterance.pitch = GLOBAL_VOICE.pitch;
      console.log(`Using global rate: ${GLOBAL_VOICE.rate}, pitch: ${GLOBAL_VOICE.pitch}`);

      // Set callbacks
      utterance.onend = () => {
        console.log("Speech playback ended");
        setSpeakingId(null);
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setSpeakingId(null);
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
      setSpeakingId(id);
      console.log("Started speech playback");
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setSpeakingId(null);
    }
  };

  // Get voices filtered by current gender selection
  const filteredVoices = getFilteredVoices(voices, genderFilter);

  return {
    voices: filteredVoices,
    allVoices: voices,
    selectedVoice,
    setSelectedVoice: setVoice,
    speakingId,
    speak,
    rate,
    setRate: setRateValue,
    pitch,
    setPitch: setPitchValue,
    genderFilter,
    setGenderFilter: setGenderFilterValue,
    testVoice,
    voicesLoaded,
  };
}
