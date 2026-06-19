import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/app-shell";
import { ToolPage } from "@/components/tool-page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant" },
      { name: "description", content: "Accelerate research with structured AI insights." },
    ],
  }),
  component: Page,
});

type Values = { topic: string; keywords: string; questions: string };

function Page() {
  const run = useServerFn(runResearch);
  return (
    <AppShell
      title="AI Research Assistant"
      description="Get a structured brief: insights, trends, risks, opportunities."
    >
      <ToolPage<Values>
        formTitle="Research scope"
        submitLabel="Run research"
        filename="research-brief.md"
        initialValues={{ topic: "", keywords: "", questions: "" }}
        renderFields={(v, set) => (
          <>
            <div className="space-y-1.5">
              <Label>Topic *</Label>
              <Input
                required
                value={v.topic}
                onChange={(e) => set({ topic: e.target.value })}
                placeholder="e.g. AI adoption in mid-market banks"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Keywords</Label>
              <Input
                value={v.keywords}
                onChange={(e) => set({ keywords: e.target.value })}
                placeholder="comma, separated, keywords"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Specific questions</Label>
              <Textarea
                value={v.questions}
                onChange={(e) => set({ questions: e.target.value })}
                placeholder="What specific questions should the brief answer?"
                className="min-h-[140px]"
              />
            </div>
          </>
        )}
        run={(values) => run({ data: values })}
      />
    </AppShell>
  );
}