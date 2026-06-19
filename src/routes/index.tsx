import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  CheckSquare,
  FileText,
  Mail,
  NotebookPen,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Unified AI workspace for emails, meeting summaries, task planning, research, and chat.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Automate faster. Achieve more with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const KPIS = [
  { label: "Emails ready to send", value: "—", icon: Mail },
  { label: "Meetings summarized", value: "—", icon: NotebookPen },
  { label: "Plans created", value: "—", icon: CheckSquare },
  { label: "Research briefs", value: "—", icon: FileText },
];

const ACTIONS = [
  {
    to: "/email",
    label: "Generate Email",
    desc: "Draft professional emails in seconds.",
    icon: Mail,
  },
  {
    to: "/summarizer",
    label: "Summarize Meeting",
    desc: "Turn transcripts into action items.",
    icon: NotebookPen,
  },
  {
    to: "/planner",
    label: "Create Task Plan",
    desc: "Convert goals into milestones.",
    icon: CheckSquare,
  },
  {
    to: "/research",
    label: "Run Research",
    desc: "Structured insights on any topic.",
    icon: Search,
  },
  {
    to: "/chat",
    label: "Open AI Chat",
    desc: "Ask anything, in context.",
    icon: Bot,
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Welcome back"
      description="Your unified AI workspace. Pick a tool to get started."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-lg border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{k.value}</span>
                <span className="text-xs text-muted-foreground">this session</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Quick actions
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.to}
                to={a.to}
                className="group rounded-lg border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{a.label}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">{a.desc}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent activity
          </h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          No activity yet. Outputs from each tool will appear here as you work.
        </p>
      </section>
    </AppShell>
  );
}
