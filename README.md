# Acts of Conservation

A browser-based single-player eco strategy board game built as a long-term product foundation.

## Version 1 Structure

- `index.html`
  Browser shell, screen markup, modals, and script load order.
- `styles.css`
  Visual system, board layout, HUD, modals, and responsive behavior.
- `js/data/game-content.js`
  Board data, scenario/event data, investment data, outcome definitions, and board layout metadata.
- `js/core/game-state.js`
  Starting config, state factory, element registry factory, and shared utilities.
- `js/core/game-rules.js`
  Reusable gameplay rules, scenario selection, outcome resolution, summaries, endings, and stat interpretation helpers.
- `js/ui/game-ui.js`
  DOM querying, rendering, board UI, modals, tooltips, and HUD updates.
- `js/app.js`
  Main controller, event wiring, state transitions, turn flow, and boot logic.

## Expansion Paths

- Add multi-outcome choices or surprise variants by extending each choice's `outcomes` array in `js/data/game-content.js`
- Add investment actions by consuming `AOC.data.investments` in `js/app.js`
- Consume `AOC.data.investmentEvents` for a future investment phase that uses the same choice/outcome engine as board scenarios
- Add special tile behaviors in `js/core/game-rules.js`
- Add save/load support by serializing the state object from `js/core/game-state.js`
- Add more scenarios or boards by extending `js/data/game-content.js`
- Add animations and audio through `js/ui/game-ui.js`

## Design Intent

This V1 refactor keeps the current gameplay working while separating content, rules, state, and rendering so the project can grow into a polished long-term game and portfolio piece.
