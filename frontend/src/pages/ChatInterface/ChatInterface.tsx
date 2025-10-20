import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Send, ChevronDown, LibraryBig } from "lucide-react";
import PromptCard from "./PromptCard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import StudentSideBar from "../../components/ChatInterface/StudentSideBar";
import { useLocation } from "react-router";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: number;
};

export default function AIChatPage() {
  const [message, setMessage] = useState("");
  const location = useLocation();

  const navTextbook = location.state?.textbook;
  const textbookTitle = navTextbook?.title ?? "Calculus: Volume 3";
  const textbookAuthor = navTextbook?.author
    ? navTextbook.author.join(", ")
    : "OpenStax";

  const prompts = [
    "Summarize a Chapter",
    "Define and explain a term",
    "Generate an example problem",
  ];

  // chat state
  const [messages, setMessages] = useState<Message[]>([]);

  function sendMessage() {
    const text = message.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      sender: "user",
      text,
      time: Date.now(),
    };

    // append user message
    setMessages((m) => [...m, userMsg]);
    setMessage("");

    // fake bot reply after a short delay
    setTimeout(() => {
      const botMsg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        sender: "bot",
        text: `This is a placeholder reply to: "${text}"`,
        time: Date.now(),
      };
      setMessages((m) => [...m, botMsg]);
    }, 700);
  }

  function messageFormatter(m: Message) {
    if (m.sender === "user") {
      return (
        <div className="flex justify-end">
          <Card key={m.id} className="py-[10px] w-[90%]">
            <CardContent className="px-[10px] text-sm lg:text-md">
              <p>{m.text}</p>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="flex justify-start">
          <Card key={m.id} className="py-[10px] w-fit bg-transparent border-none shadow-none">
            <CardContent className="px-[10px] text-sm">
              <p>{m.text}</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="pt-[70px] flex-1 flex">
        <StudentSideBar
          textbookTitle={textbookTitle}
          textbookAuthor={textbookAuthor}
        />

        <main className="md:ml-64 flex flex-1 justify-center items-center">
          <div className="w-full max-w-2xl px-4">
            {messages.length === 0 ? (
              <>
                {/* Hero title */}
                <h1 className="text-4xl font-bold text-center mb-12 leading-tight max-w-full break-words">
                  What can I help with?
                </h1>
              </>
            ) : (
              // messages area
              <div className="flex flex-col gap-4 mb-6">
                {messages.map((m) => (
                  messageFormatter(m)
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="relative mb-6">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={`Ask anything about ${textbookTitle}`}
                className="bg-input !border-[var(--border)] h-[120px] pr-12 resize-none text-sm"
              />
              <Button
                onClick={sendMessage}
                size="icon"
                variant="link"
                className="cursor-pointer absolute bottom-3 right-3 h-8 w-8 text-muted-foreground hover:text-gray-900 transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* TODO: Remove prompt suggestions when there are messages */}
            {/* Prompt Suggestions */}
            <div className="flex gap-3 mb-6">
              {prompts.map((prompt, index) => (
                <PromptCard key={index} text={prompt} />
              ))}
            </div>

            {/* Prompt Options*/}
            <div className="w-full flex gap-4 justify-end items-center">
              <Button
                variant={"link"}
                className="cursor-pointer gap-2 text-sm font-normal text-muted-foreground hover:text-gray-900 transition-colors"
              >
                Prompt Library
                <LibraryBig className="h-4 w-4" />
              </Button>
              <Button
                variant={"link"}
                className="cursor-pointer gap-2 text-sm font-normal text-muted-foreground hover:text-gray-900 transition-colors"
              >
                See more prompts
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
