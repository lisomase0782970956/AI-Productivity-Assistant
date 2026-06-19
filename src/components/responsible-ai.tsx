import { ShieldAlert } from "lucide-react";

export function ResponsibleAi() {
  return (
    <div className="mt-6 flex gap-3 rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span>{" "}
        AI-generated content is intended to assist users and should be reviewed for accuracy,
        completeness, compliance, and suitability before use in professional or business
        environments. You remain responsible for all decisions and actions taken based on AI
        outputs.
      </p>
    </div>
  );
}