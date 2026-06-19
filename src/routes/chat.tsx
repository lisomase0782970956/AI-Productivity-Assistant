import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { Bot, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { ResponsibleAi } from "@/components/responsible-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat - AI Workplace" },
      { name: "description", content: "Conversational AI productivity assistant." },
    ],
  }),
  component: ChatPage,
});

const transport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTIONS = [
  "Draft a project kick-off agenda for next Monday",
  "Summarize the pros and cons of switching to OKRs",
  "Help me prepare 5 interview questions for a senior PM",
  "Outline a 30-60-90 day plan for a new team lead",
];

function ChatPage() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Chat error";
      toast.error(msg);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) textareaRef.current?.focus();
  }, [isLoading]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    void sendMessage({ text: value });
    setInput("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <AppShell title="AI Chat" description="Ask anything. Plan, draft, summarize, brainstorm.">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex h-[calc(100vh-220px)] min-h-[500px] flex-col rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-primary" />
              <span className="font-medium">Workplace Assistant</span>
              {isLoading && (
                <span className="ml-2 text-xs text-muted-foreground">Thinking...</span>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setMessages([])}
              disabled={messages.length === 0 || isLoading}
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-1">Clear</span>
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                <div>
                  <Bot className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="font-medium text-foreground">How can I help you today?</p>
                  <p className="mt-1">Try a prompt from the right, or ask anything.</p>
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {isUser ? (
                      <span className="whitespace-pre-wrap">{text}</span>
                    ) : (
                      <article className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{text || "..."}</ReactMarkdown>
                      </article>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="border-t p-3">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message the assistant..."
                className="min-h-[52px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for newline.
            </p>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-semibold">Try asking</h3>
            <div className="mt-3 space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  disabled={isLoading}
                  className="block w-full rounded-md border bg-background p-2 text-left text-xs hover:bg-accent disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <ResponsibleAi />
        </div>
      </div>
    </AppShell>
  );
}