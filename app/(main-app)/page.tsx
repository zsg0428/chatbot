import { Button } from "@/components/ui/button";
import Link from "next/link";
import TypingAnimation from "@/components/TypingAnimation";
import { BotMessageSquare, Languages } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center py-4">
      <div className="mx-auto w-full pt-6 text-center text-2xl">
        <TypingAnimation />
        {/*  This is my first chatbot app - just for fun and learning purposes*/}
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <Link href="/chat">
          <Button
            className="w-64 animate-collapsible-up py-6 text-lg"
            variant="default"
          >
            <BotMessageSquare className="h-4 w-4" /> Chat with Dempseek now!
          </Button>
        </Link>

        <Link href="/translator">
          <Button className="w-64 py-6 text-lg" variant="outline">
            <Languages className="h-4 w-4" />
            Try your AI Translator
          </Button>
        </Link>
      </div>
    </div>
  );
}
