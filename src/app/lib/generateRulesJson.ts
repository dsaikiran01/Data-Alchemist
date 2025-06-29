export default {
  rules: [
    { "type": "coRun", "tasks": ["T1", "T3"] },
    { "type": "phaseWindow", "task": "T5", "allowedPhases": [1, 2] }
  ]
}
