import { createFileRoute, useRouter } from "@tanstack/react-router";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      { name: "description", content: "Generate professional emails with AI." },
    ],
  }),
  errorComponent: ErrorView,
  component: Page,
});

function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="p-6">
      <p className="text-sm text-destructive">{error.message}</p>
      <button
        className="mt-3 text-sm underline"
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}

type Values = {
  purpose: string;
  recipient: string;
  tone: string;
  keyPoints: string;
  length: string;
};

function Page() {
  const run = useServerFn(generateEmail);
  return (
    <AppShell
      title="Smart Email Generator"
      description="Draft clear, professional emails in seconds."
    >
      <ToolPage<Values>
        formTitle="Email details"
        submitLabel="Generate email"
        filename="email.md"
        initialValues={{
          purpose: "",
          recipient: "",
          tone: "Professional",
          keyPoints: "",
          length: "Medium",
        }}
        renderFields={(v, set) => (
          <>
            <div className="space-y-1.5">
              <Label>Purpose *</Label>
              <Input
                required
                value={v.purpose}
                onChange={(e) => set({ purpose: e.target.value })}
                placeholder="e.g. Follow up on Q3 budget proposal"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Recipient</Label>
              <Input
                value={v.recipient}
                onChange={(e) => set({ recipient: e.target.value })}
                placeholder="e.g. Director of Finance"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={v.tone} onValueChange={(val) => set({ tone: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Professional", "Friendly", "Formal", "Concise", "Persuasive", "Apologetic"].map(
                      (t) => <SelectItem key={t} value={t}>{t}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Length</Label>
                <Select value={v.length} onValueChange={(val) => set({ length: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Short", "Medium", "Long"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Key points</Label>
              <Textarea
                value={v.keyPoints}
                onChange={(e) => set({ keyPoints: e.target.value })}
                placeholder="Bullet the must-include points..."
                className="min-h-[120px]"
              />
            </div>
          </>
        )}
        run={(values) => run({ data: values })}
      />
    </AppShell>
  );
}