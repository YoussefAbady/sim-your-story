import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, GraduationCap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import DOMPurify from "dompurify";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: {
    title: string;
    content: string;
    icon?: string;
    category?: string;
  };
  language?: string;
  fieldKey?: string | null;
  userData?: any;
}

export function AIChatPanel({ isOpen, onClose, initialContext, language = 'en', fieldKey, userData }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize with context when panel opens
  useEffect(() => {
    if (isOpen && initialContext && !hasInitialized) {
      const initialMessage = language === 'pl'
        ? 'Wyjaśnij więcej na temat treści wygenerowanej w wyskakującym oknie.'
        : 'Explain more about the generated content of the popup.';
      
      setMessages([{ role: "user", content: initialMessage }]);
      setHasInitialized(true);
      streamChat([{ role: "user", content: initialMessage }]);
    } else if (!isOpen) {
      setHasInitialized(false);
      setMessages([]);
    }
  }, [isOpen, initialContext, hasInitialized, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (chatMessages: Message[]) => {
    setIsLoading(true);
    let assistantMessage = "";

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-education`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: chatMessages, 
          language, 
          fieldKey, 
          userData, 
          tipTitle: initialContext?.title,
          tipContent: initialContext?.content
        }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429 || response.status === 402) {
          const errorData = await response.json();
          toast.error(errorData.error);
        } else {
          toast.error("Failed to get response from AI");
        }
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantMessage } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantMessage }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to connect to AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    await streamChat(newMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 bottom-0 w-96 bg-background border-r shadow-xl z-30 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-[#FF6B6B]/10 via-[#FD8D8D]/10 to-[#FF6B6B]/10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
                className="text-2xl"
              >
                🎓
              </motion.div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#FF6B6B] to-[#FD8D8D] bg-clip-text text-transparent">
                Private Tutor
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#FF6B6B] to-[#FD8D8D] text-white"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div
                        className="text-sm prose prose-sm max-w-none dark:prose-invert [&_h3]:text-base [&_h4]:text-sm [&_p]:text-sm [&_li]:text-sm [&_ul]:list-disc [&_ol]:list-decimal"
                        style={{
                          fontFamily: 'inherit'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(message.content, {
                            ALLOWED_TAGS: ['p', 'strong', 'em', 'br', 'ul', 'ol', 'li', 'h3', 'h4', 'span', 'div'],
                            ALLOWED_ATTR: ['style', 'class']
                          })
                        }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#FF6B6B]" />
                    <span className="text-sm text-muted-foreground">Tutoring...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-gradient-to-r from-[#FF6B6B] to-[#FD8D8D] hover:from-[#FF5252] hover:to-[#FF7B7B]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
