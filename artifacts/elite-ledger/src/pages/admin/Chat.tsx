import { useState, useEffect, useRef } from "react";
import { useAdminGetChatSessions, useAdminGetSessionMessages, useAdminReplyChat, getAdminGetChatSessionsQueryKey, getAdminGetSessionMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User as UserIcon } from "lucide-react";

export default function AdminChat() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: loadingSessions } = useAdminGetChatSessions({
    query: { queryKey: getAdminGetChatSessionsQueryKey(), refetchInterval: 5000 }
  });

  const { data: messages = [], isLoading: loadingMessages } = useAdminGetSessionMessages(activeSessionId || "", {
    query: {
      queryKey: getAdminGetSessionMessagesQueryKey(activeSessionId || ""),
      enabled: !!activeSessionId,
      refetchInterval: 3000,
    }
  });

  const replyMutation = useAdminReplyChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeSessionId) return;

    try {
      await replyMutation.mutateAsync({
        data: {
          sessionId: activeSessionId,
          message: replyText
        }
      });
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: getAdminGetSessionMessagesQueryKey(activeSessionId) });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Live Support Inbox</h1>
      </div>

      <Card className="flex-1 flex overflow-hidden border-white/5">
        {/* Sidebar - Sessions */}
        <div className="w-1/3 border-r border-white/5 flex flex-col bg-background/50">
          <div className="p-4 border-b border-white/5 bg-card">
            <h3 className="font-semibold text-white">Active Sessions</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingSessions ? (
              <div className="p-4 text-muted-foreground text-sm">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="p-4 text-muted-foreground text-sm">No active chats.</div>
            ) : (
              sessions.map(s => (
                <button
                  key={s.sessionId}
                  onClick={() => setActiveSessionId(s.sessionId)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
                    activeSessionId === s.sessionId ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-white truncate">{s.visitorName}</span>
                    {s.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {s.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.lastMessage}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="w-2/3 flex flex-col bg-card relative">
          {!activeSessionId ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a session to view messages
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="text-muted-foreground">Loading messages...</div>
                ) : (
                  messages.map(msg => {
                    const isAdmin = msg.senderType === 'admin';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className="text-xs text-muted-foreground mb-1 ml-1">{msg.senderName}</div>
                        <div className="flex items-end gap-2 max-w-[70%]">
                          {!isAdmin && (
                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mb-1">
                              <UserIcon className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                          <div 
                            className={`p-3 rounded-2xl text-sm ${
                              isAdmin 
                                ? 'bg-primary text-primary-foreground rounded-br-none' 
                                : 'bg-background border border-white/10 text-white rounded-bl-none'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-background border-t border-white/5">
                <form onSubmit={handleReply} className="flex gap-3">
                  <Input 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1"
                    disabled={replyMutation.isPending}
                  />
                  <Button type="submit" variant="premium" disabled={!replyText.trim() || replyMutation.isPending}>
                    <Send className="w-4 h-4 mr-2" /> Send
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
