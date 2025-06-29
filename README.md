# 🧪 Data Alchemist

**Data Alchemist** is an intelligent data configuration and validation tool designed to streamline the preparation of complex resource assignment problems involving tasks, workers, and clients.

This project enables users to upload datasets, define rules and priorities, validate relationships between entities, and export a ready-to-use JSON configuration — all through a powerful yet user-friendly interface.

---

## 🔧 Key Features

### 📥 Upload & Inline Edit
- Supports `.csv`, `.xlsx`, and `.xls` formats
- Upload data for **Clients**, **Tasks**, and **Workers**
- Preview and **edit data in-place** using interactive grids
- Inline **validation powered by Zod** (e.g., malformed fields, out-of-range values)

### 🧠 Smart Rule Engine
- Define custom rules via form or **natural language input** (powered by OpenAI)
- Autocomplete and suggestions for known fields and task IDs
- Real-time rule preview and JSON export

### 🎚️ Priority Weights
- Set weights for **fairness**, **urgency**, and **load balancing**
- Use preset profiles for quick configurations (e.g., Speed First, Balanced)
- Integrated with task assignment engine for scoring and ranking

### 🧮 Intelligent Task Assignment
- Assigns tasks to optimal workers based on:
  - Skill matching
  - Slot availability
  - Phase preferences
  - Custom rules
  - Priority weights
- Outputs `tasks.json` with assignments, scores, and notes

### ✅ Validation Summary & Auto-Checks
- Highlights:
  - Missing required columns
  - Broken JSON or malformed values
  - Unknown references (e.g. invalid Task IDs)
- (In progress) Cross-checks:
  - Phase-slot feasibility
  - MaxConcurrency & overload detection
  - Skill coverage matrix
  - Rule conflicts

### 📦 Export (One-Click)
- All outputs are zipped for convenience
- Includes:
  - Cleaned `clients.csv`, `tasks.csv`, `workers.csv`
  - `rules.json`
  - `prioritization.json`
  - `tasks.json` (with assignments)
  - Timestamped `.zip` bundle

---

## 📁 Folder Highlights

```
src/
├── app/
│ ├── components/ → UI modules: FileUpload, RuleBuilder, Priorities
│ ├── lib/ → Core logic: taskAllocator, validators, parsers
│ ├── types/ → Typed schemas for clients, tasks, and workers
│ └── store/ → App state (Zustand or Redux)
```


---

## 🚀 Why Use This?

Whether you're configuring a task-assignment engine, simulating worker availability, or validating incoming data for scheduling — **Data Alchemist simplifies the pipeline** and helps you ship clean, validated configs with confidence.

Built with ❤️ using React, Next.js, and MUI.
