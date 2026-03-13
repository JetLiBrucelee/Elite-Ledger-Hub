import { Response } from "express";

type SSEClient = {
  id: string;
  sessionId: string;
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

export function broadcastToSession(sessionId: string, data: any) {
  const sessionClients = clients.filter((c) => c.sessionId === sessionId);
  for (const client of sessionClients) {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export function broadcastToAdmins(data: any) {
  const adminClients = clients.filter((c) => c.sessionId === "admin");
  for (const client of adminClients) {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
