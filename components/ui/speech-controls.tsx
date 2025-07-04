import { Button } from "@/components/ui/button";
import { Mic, Settings, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech, VoiceGender } from "@/hooks/useSpeech";
import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSpeaking = speakingId === messageId;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "flex h-8 items-center gap-1 rounded-full px-2 text-xs transition-colors",
          isSpeaking
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary",
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
        <>
          {isMobile ? (
            <Dialog open={showControls} onOpenChange={setShowControls}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Voice Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voice Settings
                  </DialogTitle>
                </DialogHeader>
                <VoiceSelector />
                <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          ) : (
            <Popover open={showControls} onOpenChange={setShowControls}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-8 items-center gap-1 rounded-full px-3 text-xs"
                >
                  <Settings className="h-3 w-3" />
                  <span>Settings</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="border-b bg-primary/5 px-4 py-2">
                  <h4 className="flex items-center gap-1.5 text-sm font-medium">
                    <Mic className="h-3.5 w-3.5" />
                    Voice Settings
                  </h4>
                </div>
                <div className="p-4">
                  <VoiceSelector />
                </div>
              </PopoverContent>
            </Popover>
          )}
        </>
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
    testVoice,
  } = useSpeech();
  const [isVoicesLoaded, setIsVoicesLoaded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Check if voices are loaded
  useEffect(() => {
    if (allVoices.length > 0) {
      setIsVoicesLoaded(true);
    }
  }, [allVoices]);

  // If voices are not loaded, try to manually trigger loading
  useEffect(() => {
    if (
      !isVoicesLoaded &&
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      // Try to manually trigger voice loading
      window.speechSynthesis.getVoices();

      // Set a timer to show a warning if voices still aren't loaded
      const timer = setTimeout(() => {
        if (allVoices.length === 0) {
          console.warn(
            "Failed to load voices. Please refresh the page or check browser settings.",
          );
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVoicesLoaded, allVoices.length]);

  // Group voices by language for better organization
  const voicesByLanguage = voices.reduce(
    (acc, voice) => {
      const lang = voice.lang;
      if (!acc[lang]) {
        acc[lang] = [];
      }
      acc[lang].push(voice);
      return acc;
    },
    {} as Record<string, SpeechSynthesisVoice[]>,
  );

  // Sort languages by name
  const sortedLanguages = Object.keys(voicesByLanguage).sort();

  // If no voices are available, show loading state or error message
  if (allVoices.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Loading voices...</p>
        <p className="mt-2 text-xs text-muted-foreground">
          If voices don't load, please refresh the page or try another browser.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", isMobile ? "p-0" : "")}>
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-lg">
          <TabsTrigger value="voice" className="rounded-l-md">
            Voice
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-r-md">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-4 pt-4">
          {/* Gender filter */}
          <div className="space-y-2">
            <Label
              htmlFor="gender-filter"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              Gender Filter
            </Label>
            <Select
              value={genderFilter}
              onValueChange={(value) => setGenderFilter(value as VoiceGender)}
            >
              <SelectTrigger id="gender-filter" className="w-full">
                <SelectValue placeholder="Select gender filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Voices</SelectItem>
                <SelectItem value="male">Male Voices</SelectItem>
                <SelectItem value="female">Female Voices</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Voice selection */}
          <div className="space-y-2">
            <Label
              htmlFor="voice-select"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              Select Voice
              {selectedVoice && (
                <span className="text-xs font-normal text-muted-foreground">
                  ({selectedVoice.lang})
                </span>
              )}
            </Label>
            <Select
              value={selectedVoice?.voiceURI || ""}
              onValueChange={(value) => {
                const voice = voices.find((v) => v.voiceURI === value);
                if (voice) {
                  setSelectedVoice(voice);
                }
              }}
            >
              <SelectTrigger id="voice-select" className="w-full">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {sortedLanguages.map((lang) => (
                  <div key={lang} className="mb-2">
                    <div className="rounded bg-muted/50 px-2 py-1 text-xs font-semibold">
                      {lang}
                    </div>
                    {voicesByLanguage[lang].map((voice) => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          {/* Rate slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rate" className="text-sm font-medium">
                Rate
              </Label>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {rate.toFixed(1)}x
              </span>
            </div>
            <Slider
              id="rate"
              min={0.5}
              max={2}
              step={0.1}
              value={[rate]}
              onValueChange={(values) => setRate(values[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Pitch slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pitch" className="text-sm font-medium">
                Pitch
              </Label>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {pitch.toFixed(1)}
              </span>
            </div>
            <Slider
              id="pitch"
              min={0.5}
              max={2}
              step={0.1}
              value={[pitch]}
              onValueChange={(values) => setPitch(values[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Test button */}
          <Button
            className="mt-2 w-full"
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
