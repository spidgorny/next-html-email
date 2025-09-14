# Agent Helper Configuration

This file allows you to configure how the agent (AI assistant) will work in your project. You can specify preferences, rules, and custom behaviors for automation, coding, and interaction.

---

## General Settings

- **Agent Name:**
  - `name: CopilotAgent`
- **Default Language:**
  - `language: TypeScript`
- **Framework Preference:**
  - `framework: Next.js`
- **Error Handling:**
  - `onError: report_and_fix`
- **Testing Policy:**
  - `runTests: always`
- **Code Style:**
  - `styleGuide: prettier, eslint`

---

## Automation Rules

- **Auto-fix on Save:**
  - `enabled: true`
- **Auto-generate Types:**
  - `enabled: true`
- **Auto-run Prisma Generate:**
  - `enabled: true`

---

## Interaction Preferences

- **Verbose Explanations:**
  - `enabled: false`
- **Step-by-step Output:**
  - `enabled: true`
- **Ask Before Major Changes:**
  - `enabled: false`

---

## Custom Behaviors

- **Custom Commands:**
  - `[]` (Add shell or npm commands to run before/after builds)
- **File Watch List:**
  - `src/app/email/[id]/rule/[name]/page.tsx`
  - `prisma/schema.prisma`

---

## Example Usage

```
# To change agent verbosity:
verbose: true

# To add a custom command:
customCommands:
  - npm run lint
```

---

## How to Use

- Edit this file to change agent behavior.
- The agent will read this file and adjust its workflow accordingly.
- Place this file at the root of your project as `agent-helper.md`.

---

## Future Extensions

- Add more configuration options as needed.
- Support for multiple agents or roles.
- Integration with CI/CD pipelines.

---

_Last updated: 2025-09-14_

Please use axios for all API calls.
Don't use useSWR directly inside the components, create a separate function for data fetching.
Always use async/await for handling promises.
