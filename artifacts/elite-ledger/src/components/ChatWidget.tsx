import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { user } = useAuth();
  
  const { messages, sendMessage, isSending } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    
    const senderName = user ? `${user.firstName} ${user.lastName}` : "Visitor";
    const text = input;
    setInput("");
    await sendMessage(text, senderName);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="bg-gradient-gold p-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-primary-foreground">Live Support</h3>
                <p className="text-xs text-primary-foreground/80">We typically reply in minutes</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                  <MessageCircle className="w-10 h-10 text-primary" />
                  <p className="text-sm">Send us a message and we'll get back to you shortly.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.senderType === 'visitor' || msg.senderType === 'user';
                  return (
                    <div key={msg.id || idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-end gap-2 max-w-[85%]">
                        {!isUser && (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mb-1">
                            <UserIcon className="w-3 h-3 text-primary" />
                          </div>
                        )}
                        <div 
                          className={`p-3 rounded-2xl text-sm ${
                            isUser 
                              ? 'bg-primary text-primary-foreground rounded-br-none' 
                              : 'bg-secondary text-secondary-foreground rounded-bl-none'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-background border-border"
                  disabled={isSending}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="premium" 
                  disabled={!input.trim() || isSending}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
