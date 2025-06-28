import { Rule } from "@/types/rules";

// This function accepts data and returns rule suggestions
export function analyzeDataAndSuggestRules({
  clients,
  tasks,
  workers,
}: {
  clients: any[];
  tasks: any[];
  workers: any[];
}): Rule[] {
  const suggestions: Rule[] = [];

  // Sample heuristic-based suggestion: if two tasks are requested together often → suggest coRun
  const taskPairs: Record<string, number> = {};

  for (const client of clients) {
    const requested = client.RequestedTaskIDs?.split(",").map((id: string) => id.trim());
    if (requested?.length >= 2) {
      for (let i = 0; i < requested.length; i++) {
        for (let j = i + 1; j < requested.length; j++) {
          const key = [requested[i], requested[j]].sort().join("-");
          taskPairs[key] = (taskPairs[key] || 0) + 1;
        }
      }
    }
  }

  for (const [pair, count] of Object.entries(taskPairs)) {
    if (count >= 3) {
      const tasks = pair.split("-");
      suggestions.push({ type: "coRun", tasks });
    }
  }

  return suggestions;
}
