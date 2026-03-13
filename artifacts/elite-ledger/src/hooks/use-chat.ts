import { useState, useEffect, useCallback } from "react";
import { useGetChatMessages, useSendChatMessage, getGetChatMessagesQueryKey, type ChatMessage } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function useChat(providedSessionId?: string) {
  const queryClient = useQueryClient();
  
  // Manage visitor session ID in local storage if not provided
  const [sessionId, setSessionId] = useState<string>(() => {
    if (providedSessionId) return providedSessionId;
    const stored = localStorage.getItem("elite_chat_session");
    if (stored) return stored;
    const newSession = crypto.randomUUID();
    localStorage.setItem("elite_chat_session", newSession);
    return newSession;
  });

  const { data: history = [], isLoading } = useGetChatMessages({ sessionId });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Sync loaded history to local state
  useEffect(() => {
    if (history.length > 0) {
      setMessages(history);
    }
  }, [history]);

  // Handle SSE connection
  useEffect(() => {
    if (!sessionId) return;
    
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(`/api/chat/events?sessionId=${sessionId}`);
      
      eventSource.onmessage = (event) => {
        try {
          const newMessage = JSON.parse(event.data) as ChatMessage;
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          // Invalidate React Query cache too just in case
          queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey({ sessionId }) });
        } catch (e) {
          console.error("Failed to parse chat message", e);
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        // Reconnect after 3 seconds
        retryTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, [sessionId, queryClient]);

  const sendMutation = useSendChatMessage();

  const sendMessage = useCallback(async (content: string, senderName: string = "Visitor") => {
    if (!content.trim()) return;
    
    // Optimistic UI update
    const tempMessage: ChatMessage = {
      id: Date.now(),
      sessionId,
      message: content,
      senderName,
      senderType: "visitor",
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMessage]);

    try {
      await sendMutation.mutateAsync({
        data: {
          sessionId,
          message: content,
          senderName,
        }
      });
    } catch (error) {
      console.error("Failed to send message", error);
      // Revert optimistic update on failure by refetching
      queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey({ sessionId }) });
    }
  }, [sessionId, sendMutation, queryClient]);

  return {
    sessionId,
    messages,
    isLoading,
    sendMessage,
    isSending: sendMutation.isPending
  };
}
