import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech, VoiceGender } from "@/hooks/useSpeech";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SpeechButtonProps {
  text: string;
  messageId: string;
  className?: string;
  showSettings?: boolean;
}

export function SpeechButton({
  text,
  messageId,
  className,
  showSettings = false,
}: SpeechButtonProps) {
  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    speakingId,
    speak,
    rate,
    setRate,
    pitch,
    setPitch,
  } = useSpeech();
  const [showControls, setShowControls] = useState(false);

  const isSpeaking = speakingId === messageId;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 text-xs flex items-center gap-1",
          isSpeaking ? "text-primary" : "text-muted-foreground"
        )}
        onClick={() => speak(text, messageId)}
      >
        {isSpeaking ? (
          <>
            <VolumeX className="h-3 w-3" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3 w-3" />
            <span>Speak</span>
          </>
        )}
      </Button>

      {showSettings && (
        <Popover open={showControls} onOpenChange={setShowControls}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              Settings
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <VoiceSelector />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export function VoiceSelector() {
  const { 
    voices, 
    allVoices,
    selectedVoice, 
    setSelectedVoice,
    genderFilter,
    setGenderFilter,
    rate,
    setRate,
    pitch,
    setPitch,
    testVoice
  } = useSpeech();
  const [isVoicesLoaded, setIsVoicesLoaded] = useState(false);

  // Check if voices are loaded
  useEffect(() => {
    if (allVoices.length > 0) {
      setIsVoicesLoaded(true);
    }
  }, [allVoices]);

  // If voices are not loaded, try to manually trigger loading
  useEffect(() => {
    if (!isVoicesLoaded && typeof window !== 'undefined' && window.speechSynthesis) {
      // Try to manually trigger voice loading
      window.speechSynthesis.getVoices();
      
      // Set a timer to show a warning if voices still aren't loaded
      const timer = setTimeout(() => {
        if (allVoices.length === 0) {
          console.warn('Failed to load voices. Please refresh the page or check browser settings.');
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVoicesLoaded, allVoices.length]);

  // Group voices by language for better organization
  const voicesByLanguage = voices.reduce((acc, voice) => {
    const lang = voice.lang;
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  // Sort languages by name
  const sortedLanguages = Object.keys(voicesByLanguage).sort();

  // If no voices are available, show loading state or error message
  if (allVoices.length === 0) {
    return (
      <div className="p-4 text-center border-b">
        <p className="text-sm text-muted-foreground">Loading voice options...</p>
        <p className="text-xs text-muted-foreground mt-1">
          If voice options don't appear, please refresh the page or check if your browser supports speech synthesis
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 border-b">
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="voice">Select Voice</TabsTrigger>
          <TabsTrigger value="settings">Voice Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="voice" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="flex items-center gap-2 min-w-[200px]">
              <Label htmlFor="gender-filter" className="text-sm whitespace-nowrap">
                Gender:
              </Label>
              <Select
                value={genderFilter}
                onValueChange={(value: VoiceGender) => {
                  setGenderFilter(value);
                }}
              >
                <SelectTrigger id="gender-filter" className="h-8 flex-1">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 flex-1">
              <Label htmlFor="voice-select" className="text-sm whitespace-nowrap">
                Voice:
              </Label>
              <Select
                value={selectedVoice?.voiceURI || ""}
                onValueChange={(value) => {
                  const voice = allVoices.find((v) => v.voiceURI === value);
                  if (voice) {
                    console.log(`Selected voice: ${voice.name} (${voice.lang})`);
                    setSelectedVoice(voice);
                  }
                }}
              >
                <SelectTrigger id="voice-select" className="h-8 flex-1">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {sortedLanguages.map(lang => (
                    <div key={lang} className="py-1">
                      <div className="px-2 text-xs font-semibold text-muted-foreground">{lang}</div>
                      {voicesByLanguage[lang].map(voice => (
                        <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Display current selected voice info */}
          {selectedVoice && (
            <div className="text-xs text-muted-foreground px-2">
              Current voice: {selectedVoice.name} ({selectedVoice.lang})
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="col-span-1">Rate:</Label>
              <div className="col-span-2">
                <Slider
                  id="rate"
                  value={[rate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(values) => {
                    const newRate = values[0];
                    console.log(`Setting rate: ${newRate}`);
                    setRate(newRate);
                  }}
                />
              </div>
              <div className="text-center">{rate.toFixed(1)}</div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pitch" className="col-span-1">Pitch:</Label>
              <div className="col-span-2">
                <Slider
                  id="pitch"
                  value={[pitch]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(values) => {
                    const newPitch = values[0];
                    console.log(`Setting pitch: ${newPitch}`);
                    setPitch(newPitch);
                  }}
                />
              </div>
              <div className="text-center">{pitch.toFixed(1)}</div>
            </div>
            
            {/* Test button */}
            <Button 
              className="w-full mt-2" 
              onClick={() => {
                if (selectedVoice) {
                  testVoice();
                } else {
                  console.warn("Please select a voice first");
                }
              }}
            >
              Test Current Voice Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
