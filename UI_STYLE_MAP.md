# Acts of Conservation UI Style Map

This file defines the reusable component style system for the game UI. It is intended to keep every screen readable, consistent, expandable, and friendly for younger players.

## Core Theme Tokens

Use the existing theme variables from `styles.css`.

### Surface tokens

- `--bg-main`
  Main app background.
- `--bg-elevated`
  Main card/panel surface.
- `--bg-soft`
  Softer nested surface for grouped content.
- `--border`
  Default border color for cards, outlines, and controls.

### Text tokens

- `--text-primary`
  Highest-priority text.
- `--text-secondary`
  Supporting body and descriptive text.
- `--text-muted`
  Small helper labels, step text, and microcopy only.

### Action tokens

- `--button-primary`
  Main action background.
- `--button-secondary`
  Secondary action surface.

### Fixed stat colors

- Money: `--money-color`
- Environment: `--environment-color`
- Trust: `--trust-color`

These stat colors should never change meaning.

## Global Text Rules

- Important text must use `text-primary`.
- Supporting text must use `text-secondary`.
- Only small tags and helper labels should use `text-muted`.
- Do not fade important text with opacity.
- Do not rely on parent color inheritance for critical labels.
- On mobile, body text should remain at or above `16px` where possible.

## Utility Classes

These are available in `styles.css` and should be reused:

- `.bg-main`
- `.bg-elevated`
- `.bg-soft`
- `.border-default`
- `.surface-card`
- `.surface-soft`
- `.touch-target`
- `.text-primary`
- `.text-secondary`
- `.text-muted`
- `.stat-money`
- `.stat-environment`
- `.stat-trust`
- `.severity-secondary`
- `.severity-warning`
- `.severity-danger`
- `.severity-positive`

## Component Map

### 1. App shell / page background

- Visual purpose:
  Frame the whole game and separate it from the browser.
- Background surface:
  `--bg-main`
- Border use:
  None
- Radius:
  None
- Spacing:
  `16px` outer padding on mobile, `24px` on larger screens
- Text hierarchy:
  No direct text style
- Mobile behavior:
  Keep the shell centered and avoid forcing scrolling for setup steps

### 2. Screen container

- Visual purpose:
  Hold one major step or game state at a time
- Background surface:
  Transparent over app shell
- Border use:
  None
- Radius:
  None
- Spacing:
  `16px` internal padding
- Text hierarchy:
  Titles = primary, intro = secondary, step label = muted
- Mobile behavior:
  Must fit the main viewport without hiding the main action

### 3. Header bar

- Visual purpose:
  Show screen title and context
- Background surface:
  Transparent or `--bg-elevated` when used as a gameplay HUD
- Border use:
  `1px solid var(--border)` if elevated
- Radius:
  `20px`
- Spacing:
  `12px 16px`
- Text hierarchy:
  Title = primary, sublabel = muted
- Mobile behavior:
  Stay compact and avoid stealing board space

### 4. Hero section

- Visual purpose:
  Introduce the game or current setup step clearly
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `24px`
- Spacing:
  `24px`
- Text hierarchy:
  Title = primary, subtitle = secondary, small version text = muted
- Mobile behavior:
  Stack actions vertically

### 5. Surface card

- Visual purpose:
  Default reusable container for grouped content
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `20px`
- Spacing:
  `16px–20px`
- Text hierarchy:
  Heading = primary, body = secondary
- Mobile behavior:
  Full-width and touch-safe

### 6. Mode card

- Visual purpose:
  Let the player compare gameplay philosophies quickly
- Background surface:
  `--bg-soft`
- Border use:
  `1px solid var(--border)` plus colored left accent
- Radius:
  `16px`
- Spacing:
  `16px`
- Text hierarchy:
  Mode name = primary, description = secondary
- Interactive states:
  Hover/tap scale to `1.02`
  Selected state:
  `#DBEAFE` background, `2px solid #3B82F6`, stronger shadow
- Mobile behavior:
  One or two columns depending on width

### 7. Mode overview panel

- Visual purpose:
  Explain the selected mode clearly
- Background surface:
  `#FFFFFF` in light mode, elevated readable surface in dark mode
- Border use:
  `1px solid var(--border)`
- Radius:
  `20px`
- Spacing:
  `16px`
- Text hierarchy:
  Panel title and section headings = primary, descriptions = secondary, small tag = muted
- Mobile behavior:
  Stack internal boxes vertically

### 8. Character / token card

- Visual purpose:
  Let players choose a guide/token with personality and bonus
- Background surface:
  `--bg-soft`
- Border use:
  `1px solid var(--border)`
- Radius:
  `16px`
- Spacing:
  `16px`
- Text hierarchy:
  Name = primary, description and bonus explanation = secondary
- Interactive states:
  Same selected treatment as mode cards
- Mobile behavior:
  Large emoji/icon, readable bonus chip, no cramped copy

### 9. Round selection card

- Visual purpose:
  Let players choose game length confidently
- Background surface:
  `--bg-soft`
- Border use:
  `1px solid var(--border)`
- Radius:
  `16px`
- Spacing:
  `16px`
- Text hierarchy:
  `Short/Medium/Long` = primary
  `10 Turns / 20 Turns / 30 Turns` = primary
  helper copy = muted
- Interactive states:
  Strong selected outline and scale
- Mobile behavior:
  Full-width tap targets

### 10. Ready summary card

- Visual purpose:
  Confirm the player’s setup before starting
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `20px`
- Spacing:
  `16px–20px`
- Text hierarchy:
  Labels and values = primary
  goal explanation and risk text = secondary
  step label = muted
- Mobile behavior:
  Summary boxes stack cleanly

### 11. Primary button

- Visual purpose:
  Main action for the current step
- Background surface:
  `--button-primary`
- Border use:
  Solid border matching the action color
- Radius:
  `999px` or `16px` depending on context
- Spacing:
  `12px 18px`
- Text hierarchy:
  Always primary action text, high contrast
- Interactive states:
  Hover scale, focus ring, disabled reduced emphasis
- Mobile behavior:
  Minimum `48px` high

### 12. Secondary button

- Visual purpose:
  Back, close, or optional actions
- Background surface:
  `--button-secondary`
- Border use:
  `1px solid var(--border)`
- Radius:
  `999px` or `16px`
- Spacing:
  `12px 18px`
- Text hierarchy:
  Primary text
- Interactive states:
  Hover scale, visible outline
- Mobile behavior:
  Same tap target as primary

### 13. Settings panel

- Visual purpose:
  Central place for theme, voice, and accessibility controls
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `24px`
- Spacing:
  `16px–20px`
- Text hierarchy:
  Section titles = primary, descriptions = secondary, tiny tags = muted
- Mobile behavior:
  Inputs stack vertically

### 14. Toggle switch row

- Visual purpose:
  Present one readable setting and its state
- Background surface:
  `--bg-soft`
- Border use:
  `1px solid var(--border)`
- Radius:
  `18px`
- Spacing:
  `12px 16px`
- Text hierarchy:
  Label = primary, help note = secondary
- Interactive states:
  Checkbox or switch must remain large and obvious
- Mobile behavior:
  Full-width row, no tiny labels

### 15. Stat card / stat pill

- Visual purpose:
  Show one stat clearly and quickly
- Background surface:
  `--bg-soft`
- Border use:
  `1px solid var(--border)`
- Radius:
  `16px`
- Spacing:
  `10px–14px`
- Text hierarchy:
  Label = primary
  Numeric value = primary with stat color
  condition label = secondary
- Mobile behavior:
  Avoid wrapping critical labels awkwardly

### 16. Gameplay HUD

- Visual purpose:
  Keep gameplay info visible without crowding the board
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `20px`
- Spacing:
  `10px–12px`
- Text hierarchy:
  `Available Budget`, `Environment`, `Community Trust`, `Year`, `Turn`, `Last Roll` = primary
  numeric values = primary with stat color where relevant
  conditions like `Stable Reserves`, `Stressed`, `Uneasy` = secondary
- Mobile behavior:
  Collapse into a dense, readable wrap layout

### 17. Board tile

- Visual purpose:
  Represent one place on the island board
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `16px–18px`
- Spacing:
  `8px`
- Text hierarchy:
  Place name = primary
  badge or area label = muted
- Interactive states:
  Hover/tap highlight, keyboard focus
- Mobile behavior:
  Tile text should clamp instead of overflowing

### 18. Center board panel

- Visual purpose:
  Provide live board context and short status feedback
- Background surface:
  Must follow active theme
  Light mode:
  main frame `--bg-main`
  inner cards `--bg-elevated` / `--bg-soft`
- Border use:
  `1px solid var(--border)`
- Radius:
  `20px`
- Spacing:
  `12px–16px`
- Text hierarchy:
  Heading = primary
  current message = secondary
  mini stat labels = secondary
  mini stat values = primary with stat colors
- Mobile behavior:
  Must stay compact and never keep old dark patches in light mode

### 19. Decision card modal

- Visual purpose:
  Present a single important decision in under 2 seconds
- Background surface:
  Main modal card = `--bg-elevated`
  option cards = `--bg-soft`
- Border use:
  `1px solid var(--border)`
- Radius:
  `20px` modal, `16px` option cards
- Spacing:
  `20px`
- Text hierarchy:
  Card title = primary
  description and outcome explanation = secondary
  location tag and `Option A / Option B` labels = muted
  option titles = primary
  stat labels = secondary
- Interactive states:
  slide-up entrance
  selected option scales slightly before resolving
- Mobile behavior:
  95% width max, stacked options

### 20. Warning banner

- Visual purpose:
  Surface urgent budget or system risk clearly
- Background surface:
  `--bg-soft`
- Border use:
  strong left border by severity
- Radius:
  `16px`
- Spacing:
  `12px 14px`
- Text hierarchy:
  warning title = primary
  warning body = secondary
  small tag = muted
- Mobile behavior:
  full-width and readable in one glance

### 21. Tooltip / hint box

- Visual purpose:
  Explain a tile or helper message without cluttering the board
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `14px`
- Spacing:
  `12px`
- Text hierarchy:
  tooltip title = primary
  body = secondary
- Mobile behavior:
  tap-friendly and positioned safely

### 22. Voice narration UI

- Visual purpose:
  Let players control narration accessibly
- Background surface:
  `--bg-soft`
- Border use:
  `1px solid var(--border)`
- Radius:
  `16px`
- Spacing:
  `12px–16px`
- Text hierarchy:
  Voice Narration, Read Cards, Read Warnings, Read Endings = primary
  supporting notes = secondary
  tiny section labels = muted
- Mobile behavior:
  no small controls or tiny labels

### 23. Game over / result screen

- Visual purpose:
  Reflect on outcomes emotionally and clearly
- Background surface:
  `--bg-elevated`
- Border use:
  `1px solid var(--border)`
- Radius:
  `24px`
- Spacing:
  `20px`
- Text hierarchy:
  ending title = primary
  final stat labels and values = primary
  ending summary and educational explanation = secondary
  tiny section tags = muted
- Mobile behavior:
  stack stat groups and keep actions visible

### 24. Status severity labels

- Visual purpose:
  Show health state of systems without overwhelming the player
- Background surface:
  transparent or soft badge
- Border use:
  optional thin border
- Radius:
  `999px` when badge-like
- Spacing:
  `4px 8px`
- Text hierarchy:
  never muted when meaningful
  normal state = secondary
  warning/danger states use severity helpers
- Mobile behavior:
  short and readable

### 25. Icon and emoji usage rules

- Visual purpose:
  Support comprehension, especially for younger players
- Background surface:
  N/A
- Border use:
  N/A
- Radius:
  N/A
- Spacing:
  Keep icons aligned with text and not oversized
- Text hierarchy:
  Icons support text, they do not replace text
- Rules:
  Use emoji or icons only as helpers
  Never rely on color alone
  Keep one icon meaning consistent
  Use the same stat icon pairings throughout:
  `💰` Money
  `🌿` Environment
  `👥` Trust

## Interaction Rules

- Selected states should always be visually strong.
- Pressed/hover states should be noticeable but not distracting.
- Critical setup actions must stay visible without scrolling.
- All tappable controls should be at least `44px` high, preferably `48px`.

## Mobile Rules

- Avoid multi-column layouts when text becomes cramped.
- Keep one clear decision per screen in setup.
- Never hide essential controls below a long block of copy.
- Cards should fit within the viewport width without horizontal scrolling.

## Expansion Guidance

When adding a new component:

1. Start with `surface-card` or `surface-soft`.
2. Apply one of the text utility classes explicitly.
3. Use stat color helpers only for money, environment, or trust meaning.
4. Add a mobile fallback before adding decorative extras.
5. Keep the component readable in under 2 seconds.
