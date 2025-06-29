// taskAllocator.ts
type Task = {
  TaskID: string;
  TaskName: string;
  RequiredSkills: string;
  PreferredPhases: string;
  Duration: number;
};

type Worker = {
  WorkerID: string;
  Skills: string;
  AvailableSlots: string; // should be JSON array "[1,2,3]"
  MaxLoadPerPhase: number;
};

type Rule = {
  taskId?: string;
  mustAssignToWorkerId?: string;
};

type Priorities = {
  fairness: number;
  speed: number;
  loadBalance: number;
};

type Assignment = Task & {
  AssignedTo: string;
  MatchScore: number;
  Notes: string;
};

export function assignTasks(
  tasks: Task[],
  workers: Worker[],
  rules: Rule[],
  priorities: Priorities
): Assignment[] {
  const normalize = (str: string) =>
    str.toLowerCase().split(",").map((s) => s.trim());

  const parsePhases = (val: string): number[] => {
    try {
      if (val.includes("-")) {
        const [start, end] = val.split("-").map(Number);
        return Array.from({ length: end - start + 1 }, (_, i) => i + start);
      } else if (val.startsWith("[")) {
        return JSON.parse(val);
      }
      return [Number(val)];
    } catch {
      return [];
    }
  };

  const assignments: Assignment[] = [];

  for (const task of tasks) {
    const requiredSkills = normalize(task.RequiredSkills);
    const preferredPhases = parsePhases(task.PreferredPhases);

    // Check if rule forces a specific worker
    const rule = rules.find((r) => r.taskId === task.TaskID);
    if (rule?.mustAssignToWorkerId) {
      assignments.push({
        ...task,
        AssignedTo: rule.mustAssignToWorkerId,
        MatchScore: 100,
        Notes: "Assigned by rule",
      });
      continue;
    }

    let bestScore = -1;
    let bestWorker: Worker | null = null;
    let bestNotes = "";

    for (const worker of workers) {
      const workerSkills = normalize(worker.Skills);
      const availableSlots = JSON.parse(worker.AvailableSlots || "[]") as number[];

      const skillMatch = requiredSkills.filter((s) => workerSkills.includes(s)).length;
      const phaseMatch = preferredPhases.filter((p) => availableSlots.includes(p)).length;

      const loadMatch = Math.min(phaseMatch, worker.MaxLoadPerPhase ?? 1);

      const score =
        skillMatch * priorities.fairness +
        phaseMatch * priorities.speed +
        loadMatch * priorities.loadBalance;

      if (score > bestScore) {
        bestScore = score;
        bestWorker = worker;
        bestNotes = `Skills: ${skillMatch}, Phases: ${phaseMatch}, Load: ${loadMatch}`;
      }
    }

    assignments.push({
      ...task,
      AssignedTo: bestWorker?.WorkerID || "Unassigned",
      MatchScore: bestScore,
      Notes: bestNotes || "No suitable worker found",
    });
  }

  return assignments;
}
