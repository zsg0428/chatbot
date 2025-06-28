"use client";
import React from "react";
import Typed from "typed.js";

export default function TypingAnimation() {
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);
  const terminalEl = React.useRef(null);

  React.useEffect(() => {
    // First, show the npm install sequence
    const terminalTyped = new Typed(terminalEl.current, {
      strings: [
        "$ npm install dempseek-ai@latest\n\n> dempseek-ai@1.0.0 install\n> node install.js\n\n✅ Dempseek AI successfully installed!\n✨ 1 package installed in 1.23s\n\nStarting Dempseek AI...",
      ],
      typeSpeed: 10,
      showCursor: false,
      onComplete: () => {
        // After npm install completes, start the main messages
        const typed = new Typed(el.current, {
          strings: [
            "Welcome to Dempseek AI!",
            "Welcome to the kind of useless chatbot in the world!",
            "But, whatever",
            "Click the button below ↓ to start a chat",
            "Enjoy loll",
          ],
          typeSpeed: 45,
          backSpeed: 15,
          startDelay: 500,
          smartBackspace: true,
          loop: true,
          showCursor: true,
          cursorChar: "▋",
          backDelay: 1500,
        });

        return () => {
          typed.destroy();
        };
      },
    });

    return () => {
      terminalTyped.destroy();
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-gray-500 p-4 text-left font-mono text-green-400 dark:bg-gray-900">
      <div className="mb-2 flex gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <div className="ml-2 text-xs text-gray-500">terminal@dempseek-ai</div>
      </div>
      <div className="whitespace-pre-line" ref={terminalEl}></div>
      <div ref={el} className="mt-2"></div>
    </div>
  );
}
