import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-2">
      <span className="text-sm text-gray-500">Dempseek is typing</span>
      <motion.span
        className="h-2 w-2 rounded-full bg-blue-500"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-blue-500"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-blue-500"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
}
