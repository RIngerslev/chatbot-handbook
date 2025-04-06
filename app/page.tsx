'use client';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/src/components/ui/chat/chat-bubble";
import { ChatInput } from "@/src/components/ui/chat/chat-input";
import { ChatMessageList } from "@/src/components/ui/chat/chat-message-list";
import { callAi } from "./ai/ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<{ text: string; variant: 'sent' | 'received' }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State for the input value

  const handleSendMessage = async (message: string) => {
    // Add the user's message to the chat
    setMessages((prev) => [...prev, { text: message, variant: 'sent' }]);

    // Show loading indicator
    setIsLoading(true);

    // Call AI and add the response to the chat
    try {
      const response = await callAi({ message });
      setMessages((prev) => [
        ...prev,
        { text: response ?? "Error: No response from AI", variant: 'received' }, // Fallback for undefined
      ]);
    } catch (error) {
      console.error("Error calling AI:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Unable to get a response from AI", variant: 'received' }, // Error message
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Return") {
      e.preventDefault(); // Prevent adding a new line
      if (inputValue.trim()) {
        handleSendMessage(inputValue); // Send the message
        setInputValue(""); // Clear the input field
      }
    }
  };

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue); // Send the message
      setInputValue(""); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:max-w-3xl mx-auto text-lg">
      <ChatMessageList>
        {messages.map((msg, index) => (
          <ChatBubble key={index} variant={msg.variant}>
            <ChatBubbleAvatar fallback={msg.variant === 'sent' ? 'US' : 'AI'} />
            <ChatBubbleMessage variant={msg.variant}>{msg.text}</ChatBubbleMessage>
          </ChatBubble>
        ))}
        {isLoading && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="AI" />
            <ChatBubbleMessage isLoading={true} />
          </ChatBubble>
        )}
      </ChatMessageList>
      <div className="w-full">
        <div
          className="relative mx-4 w-auto rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1 mb-3"
        >
          <ChatInput
            placeholder="Spørg mig..."
            value={inputValue} // Bind the input value
            onChange={(e) => setInputValue(e.target.value)} // Update the input value
            onKeyDown={handleKeyDown} // Handle Enter key press
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 text-base"
          />
        </div>
      </div>
    </div>
  );
}