import { Copy, Download, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ToolOutput({
  value,
  onChange,
  onRegenerate,
  loading,
  filename = "ai-output.md",
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  filename?: string;
}) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  useEffect(() => {
    if (value) setMode("preview");
  }, [value]);

  if (!value && !loading) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={mode === "preview" ? "secondary" : "ghost"}
            onClick={() => setMode("preview")}
          >
            Preview
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "edit" ? "secondary" : "ghost"}
            onClick={() => setMode("edit")}
          >
            Edit
          </Button>
        </div>
        <div className="flex gap-1">
          {onRegenerate && (
            <Button type="button" size="sm" variant="ghost" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="ml-1">Regenerate</span>
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={copy} disabled={!value}>
            <Copy className="h-4 w-4" />
            <span className="ml-1">Copy</span>
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={download} disabled={!value}>
            <Download className="h-4 w-4" />
            <span className="ml-1">Export</span>
          </Button>
        </div>
      </div>
      <div className="p-4">
        {loading && !value ? (
          <div className="space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        ) : mode === "preview" ? (
          <article className="prose prose-sm max-w-none prose-headings:font-semibold prose-table:text-sm">
            <ReactMarkdown>{value}</ReactMarkdown>
          </article>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        )}
      </div>
    </div>
  );
}