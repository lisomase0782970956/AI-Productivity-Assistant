import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/app-shell";
import { ToolPage } from "@/components/tool-page";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer - AI Workplace" },
      { name: "description", content: "Turn meeting transcripts into action-ready summaries." },
    ],
  }),
  component: Page,
});

function Page() {
  const run = useServerFn(summarizeMeeting);
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Paste a transcript or notes - get a clean summary with action items."
    >
      <ToolPage<{ transcript: string }>
        formTitle="Meeting transcript"
        submitLabel="Summarize meeting"
        filename="meeting-summary.md"
        initialValues={{ transcript: "" }}
        renderFields={(v, set) => (
          <div className="space-y-1.5">
            <Label>Transcript or notes *</Label>
            <Textarea
              required
              value={v.transcript}
              onChange={(e) => set({ transcript: e.target.value })}
              placeholder="Paste raw notes, transcript text, or bullet points..."
              className="min-h-[320px]"
            />
          </div>
        )}
        run={(values) => run({ data: values })}
      />
    </AppShell>
  );
}