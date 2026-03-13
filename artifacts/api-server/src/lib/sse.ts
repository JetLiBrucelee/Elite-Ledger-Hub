import type { Response } from "express";

type SSEClientType = "visitor" | "admin";

type SSEClient = {
  id: string;
  sessionId: string;
  clientType: SSEClientType;
  res: Response;
};

const clients: SSEClient[] = [];

export function addSSEClient(client: SSEClient) {
  clients.push(client);
}

export function removeSSEClient(id: string) {
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) {
    clients.splice(index, 1);
  }
}

export function broadcastToSession(sessionId: string, data: unknown) {
  const sessionClients = clients.filter(
    (c) => c.clientType === "visitor" && c.sessionId === sessionId
  );
  for (const client of sessionClients) {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export function broadcastToAdmins(data: unknown) {
  const adminClients = clients.filter((c) => c.clientType === "admin");
  for (const client of adminClients) {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export function createSSEClientId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
