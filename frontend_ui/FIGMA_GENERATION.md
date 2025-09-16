# Figma Code Generation Control

This project can optionally use a simple lock/state file to coordinate Figma-driven code generation.

- State file location: `frontend_ui/figma_generation_state.json`

## Fields

- `status`: one of `idle`, `running`, `failed`, `completed`
- `locked`: boolean indicating if a generation is in progress
- `lastAction`: free text audit entry (e.g., `started`, `cancelled_by_user_request`)
- `timestamp`: ISO string for the last update
- `note`: free text comment; include target component/screen when applicable (e.g., "Target component: 'Cover'")

## Cancelling / Resetting

To cancel/clear any ongoing Figma generation and allow a new task to start:

1. Set:
   - `status` = `idle`
   - `locked` = `false`
   - Update `lastAction` to `cancelled_by_user_request` (or similar)
   - Update `timestamp` to current time
   - Optionally set `note` to include the specific screen/component cancelled (e.g., "Cancelled/reset by user request. Target component: 'Cover'.")

2. Save the file. This signals to any orchestration layer that no generation is in progress.

## Specific: Stop 'Cover' Generation

- When stopping generation for the 'Cover' screen/component:
  - Ensure `locked` is `false`.
  - Ensure `status` is `idle` (even if previously `running`).
  - Set `lastAction` to `cancelled_by_user_request`.
  - Include in `note`: "Target component: 'Cover'".
  - Update `timestamp` to the current time.

Current state has been reset accordingly in `figma_generation_state.json`.
