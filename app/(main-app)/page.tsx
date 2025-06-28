import { Button } from "@/components/ui/button";
import Link from "next/link";
import TypingAnimation from "@/components/TypingAnimation";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center py-4">
      <div className="mx-auto w-full pt-10 text-center text-2xl">
        <TypingAnimation />
        {/*  This is my first chatbot app - just for fun and learning purposes*/}
      </div>

      <Link href="/chat">
        <Button className="mt-10" variant="default">
          Go chat with Dempseek now!
        </Button>
      </Link>
    </div>
  );
}
