import { useState, useEffect, useCallback } from "react";
import { useGetChatMessages, useSendChatMessage, getGetChatMessagesQueryKey, type ChatMessage } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

function getOrCreateSessionId(): string {
  const stored = localStorage.getItem("elite_chat_session");
  if (stored) return stored;
  const newSession = crypto.randomUUID();
  localStorage.setItem("elite_chat_session", newSession);
  return newSession;
}

function mergeMessage(prev: ChatMessage[], incoming: ChatMessage): ChatMessage[] {
  if (prev.some((m) => m.id === incoming.id)) return prev;
  return [...prev, incoming];
}

export function useChat() {
  const queryClient = useQueryClient();

  const [sessionId] = useState<string>(() => getOrCreateSessionId());

  const { data: history = [], isLoading } = useGetChatMessages({ sessionId });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (history.length > 0) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    if (!sessionId) return;

    let eventSource: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      eventSource = new EventSource(`/api/chat/events?sessionId=${encodeURIComponent(sessionId)}`);

      eventSource.onmessage = (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as { type?: string } & Partial<ChatMessage>;
          if (data.type === "connected") return;
          const incoming = data as ChatMessage;
          setMessages((prev) => mergeMessage(prev, incoming));
          queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey({ sessionId }) });
        } catch {
          // ignore parse errors
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
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

  const sendMessage = useCallback(
    async (content: string, senderName: string = "Visitor") => {
      if (!content.trim()) return;

      try {
        const sent = await sendMutation.mutateAsync({
          data: { sessionId, message: content, senderName },
        });
        setMessages((prev) => mergeMessage(prev, sent));
      } catch {
        queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey({ sessionId }) });
      }
    },
    [sessionId, sendMutation, queryClient]
  );

  return {
    sessionId,
    messages,
    isLoading,
    sendMessage,
    isSending: sendMutation.isPending,
  };
}
