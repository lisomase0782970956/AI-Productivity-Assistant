import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/app-shell";
import { ToolPage } from "@/components/tool-page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner" },
      { name: "description", content: "Turn a goal into a structured project plan." },
    ],
  }),
  component: Page,
});

type Values = { goal: string; deadline: string; priority: string; teamSize: string };

function Page() {
  const run = useServerFn(planTasks);
  return (
    <AppShell title="AI Task Planner" description="Convert goals into milestones, tasks, and risks.">
      <ToolPage<Values>
        formTitle="Plan details"
        submitLabel="Generate plan"
        filename="task-plan.md"
        initialValues={{ goal: "", deadline: "", priority: "Medium", teamSize: "3" }}
        renderFields={(v, set) => (
          <>
            <div className="space-y-1.5">
              <Label>Project goal *</Label>
              <Textarea
                required
                value={v.goal}
                onChange={(e) => set({ goal: e.target.value })}
                placeholder="e.g. Launch the new customer onboarding portal"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input
                value={v.deadline}
                onChange={(e) => set({ deadline: e.target.value })}
                placeholder="e.g. 8 weeks, or 2026-08-15"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={v.priority} onValueChange={(val) => set({ priority: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Low", "Medium", "High", "Critical"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Team size</Label>
                <Input
                  value={v.teamSize}
                  onChange={(e) => set({ teamSize: e.target.value })}
                  placeholder="e.g. 5"
                />
              </div>
            </div>
          </>
        )}
        run={(values) => run({ data: values })}
      />
    </AppShell>
  );
}