import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

async function run(system: string, prompt: string) {
  const { text } = await generateText({ model: getModel(), system, prompt });
  return { text };
}

const EmailInput = z.object({
  purpose: z.string().min(1).max(500),
  recipient: z.string().max(200).optional().default(""),
  tone: z.string().max(50).optional().default("Professional"),
  keyPoints: z.string().max(2000).optional().default(""),
  length: z.string().max(50).optional().default("Medium"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(({ data }) =>
    run(
      "You are a professional business communication assistant. Write clear, concise, well-structured emails.",
      `Generate a professional email.\n\nPurpose: ${data.purpose}\nRecipient: ${data.recipient || "—"}\nTone: ${data.tone}\nDesired length: ${data.length}\nKey information:\n${data.keyPoints || "—"}\n\nReturn the result as markdown in this exact structure:\n\n**Subject:** <subject line>\n\n---\n\n<email body>\n\n---\n\n**Suggested follow-up:** <one short follow-up suggestion>`,
    ),
  );

const SummarizeInput = z.object({
  transcript: z.string().min(20).max(50000),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SummarizeInput.parse(d))
  .handler(({ data }) =>
    run(
      "You are an executive assistant skilled at distilling meetings into actionable summaries.",
      `Analyze the following meeting notes and produce a structured markdown summary with these sections (use ## headings):\n\n## Executive Summary\n## Key Discussion Points\n## Action Items\n(Render as a markdown table with columns: Action | Owner | Deadline)\n## Key Decisions\n## Risks & Concerns\n\nMeeting notes:\n"""\n${data.transcript}\n"""`,
    ),
  );

const PlannerInput = z.object({
  goal: z.string().min(3).max(1000),
  deadline: z.string().max(100).optional().default(""),
  priority: z.string().max(50).optional().default("Medium"),
  teamSize: z.string().max(50).optional().default("1"),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(({ data }) =>
    run(
      "You are a senior project manager. Produce realistic, well-sequenced plans.",
      `Create a detailed task plan in markdown.\n\nGoal: ${data.goal}\nDeadline: ${data.deadline || "Not specified"}\nPriority: ${data.priority}\nTeam size: ${data.teamSize}\n\nInclude the sections (## headings):\n## Overview\n## Milestones (numbered)\n## Weekly Tasks (group by Week N with checkbox list - [ ])\n## Risks\n## Recommendations`,
    ),
  );

const ResearchInput = z.object({
  topic: z.string().min(3).max(500),
  keywords: z.string().max(500).optional().default(""),
  questions: z.string().max(2000).optional().default(""),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(({ data }) =>
    run(
      "You are a professional research analyst. Be specific, structured, and cite where claims are general industry knowledge versus speculation.",
      `Research brief.\n\nTopic: ${data.topic}\nKeywords: ${data.keywords || "—"}\nQuestions to answer:\n${data.questions || "—"}\n\nProduce a markdown report with these sections (## headings):\n## Executive Overview\n## Key Insights\n## Industry Trends\n## Risks\n## Opportunities\n## Recommendations\n## References / Further Reading`,
    ),
  );