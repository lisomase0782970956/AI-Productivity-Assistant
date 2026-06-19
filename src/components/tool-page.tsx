import { Loader2 } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ResponsibleAi } from "./responsible-ai";
import { ToolOutput } from "./tool-output";

export function ToolPage<T>({
  formTitle,
  submitLabel,
  initialValues,
  renderFields,
  run,
  filename,
}: {
  formTitle: string;
  submitLabel: string;
  initialValues: T;
  renderFields: (values: T, set: (patch: Partial<T>) => void) => ReactNode;
  run: (values: T) => Promise<{ text: string }>;
  filename?: string;
}) {
  const [values, setValues] = useState<T>(initialValues);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (patch: Partial<T>) => setValues((v) => ({ ...v, ...patch }));

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await run(values);
      setOutput(res.text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (/429|rate/i.test(msg)) {
        toast.error("Rate limited. Please wait a moment and try again.");
      } else if (/402|credit/i.test(msg)) {
        toast.error("AI credits exhausted. Add credits in your Lovable workspace.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-lg border bg-card p-5 h-fit">
        <h2 className="text-base font-semibold">{formTitle}</h2>
        {renderFields(values, set)}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
        <ResponsibleAi />
      </form>
      <div>
        {output || loading ? (
          <ToolOutput
            value={output}
            onChange={setOutput}
            onRegenerate={() => submit()}
            loading={loading}
            filename={filename}
          />
        ) : (
          <div className="grid min-h-[400px] place-items-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Your AI-generated result will appear here.
          </div>
        )}
      </div>
    </div>
  );
}