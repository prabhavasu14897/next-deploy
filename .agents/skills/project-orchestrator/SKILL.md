---
name: project-orchestrator
description: Master orchestration skill. Triages developer requirements (bug/feature/refactor), asks clarifying questions to gather maximum context (Karpathy style), authors design docs, and delegates to specialized subagents before final sign-off.
---

# Project Orchestrator

This skill acts as the front door for all new developer requests, client requirements, feature implementations, and bug fixes. It is a masterpiece orchestration skill that ensures no code is written until the context is perfectly clear, and the right specialized skills (Impeccable, Vercel Best Practices, Ascentware rules) are utilized.

## Workflow

### 1. Triage & Context Gathering

When a developer provides a new client requirement or task:

1. **Classify the Request:** Determine and explicitly state if the request is a **Feature**, **Bug**, **Refactor**, or **New Client Base Config**.
2. **The "Karpathy" Context Interrogation:** Do NOT start coding immediately. You must act as a strict Staff Engineer. Ask the developer clarifying questions to extract every missing detail necessary for a complete context.
   - What are the edge cases?
   - What are the performance implications?
   - How does this fit into the existing architecture?
   - What is the expected UI/UX? (If UI, mention we will use the `impeccable` skill).
3. Wait for the developer to provide proper answers to these questions before proceeding.

### 2. Design & Strategy

Once the context is rich and complete:

1. Create or update an artifact named `design.md` (or `implementation_plan.md`).
2. Document the exact state of the requested changes, the architecture, and the timeline.
3. Explicitly state which specialized skills will be triggered for this execution (e.g., `impeccable` for frontend UI, `vercel-react-best-practices` for React performance, `ascentware-project` for architecture).

### 3. Subagent Delegation

Based on the classification, delegate tasks to subagents:

- Use `invoke_subagent` to spawn specialized agents.
- **IMPORTANT**: When prompting the subagent, explicitly instruct it to read and apply the relevant skills by providing the path to those skills (e.g., "You must read and follow d:\\Development\\enterprise-starter\\.agents\\skills\\impeccable\\SKILL.md").
- Example Delegation:
  - Frontend/UI features -> Spawn a subagent instructed to use the `impeccable` and `design-taste-frontend` skills.
  - React/Next.js logic -> Spawn a subagent instructed to use the `vercel-react-best-practices` skill.
  - Backend/Architecture -> Spawn a subagent instructed to use the `ascentware-project` skill.

### 4. Implementation & Updates

When the subagents complete their work or if you are implementing it directly:

- Follow a clean, concise process.
- Ensure the `design.md` is updated with any new fixes or architectural changes discovered during implementation.
- Keep the developer informed on the inner state of the project.

### 5. Final Sign-Off

Once the requirement is fully implemented:

1. Verify the feature/bug fix against the initial `design.md` requirements.
2. Request a final sign-off from the developer.
3. Consolidate the learnings into the project's walkthrough or architectural notes.
