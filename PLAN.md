# Voices of the Forest: AVAF Edition Plan

## Goal
Create a browser-based, single-player, round-based eco strategy board game with a polished hand-drawn nature feel. The player rolls dice, travels around a square board, and makes tradeoff-heavy decisions that affect:

- Money
- Environment Health
- Community Trust

The game should reward balance rather than pure profit.

## Core Game Flow
1. Land on the start screen.
2. Choose a round length:
   - 10 rounds
   - 15 rounds
   - 20 rounds
3. Start the game with:
   - Money: 100
   - Environment Health: 50
   - Community Trust: 50
4. Roll one six-sided die.
5. Move the token around the board.
6. Trigger a tile event modal on landing.
7. Choose exactly one of two options before continuing.
8. Apply stat changes, clamp values between 0 and 100, and advance the round.
9. End the game when:
   - the selected round count is reached, or
   - one stat reaches 0
10. Show an ending screen with results, reflection, and educational context.

## Board Structure
- Total tiles: 16
- Layout: square perimeter board on a 5x5 visual grid
- All board spaces use made-up place names rather than issue names
- Issues only appear inside the decision modal
- Each tile should feel like a playful location in the same eco-themed world

### Place Name Direction
Examples:
- Breezy Bay Bend
- Mangomoss Crossing
- Coral Curl Coast
- Pebblepalm Point
- Fernwhistle Fork
- Driftroot Docks
- Sunroot Village
- Glowgrove Path

## Turn and Round Rules
- One round equals one dice roll plus one resolved tile decision
- The player cannot roll again until a choice is made
- Corner and standard tiles alike should present an event so every round has a meaningful decision
- The turn counter should display the current round out of the selected total

## Stats
### Starting Values
- Money: 100
- Environment Health: 50
- Community Trust: 50

### Stat Constraints
- Minimum: 0
- Maximum: 100

### Tradeoff Philosophy
- Every option must affect all three stats
- No perfect options
- Some choices improve money while harming trust or nature
- Some choices protect the environment but reduce short-term cash
- Some choices invest in people and trust at a financial cost

## End Conditions
### Early Endings
- Money reaches 0: Financial Collapse
- Environment Health reaches 0: Environmental Decline
- Community Trust reaches 0: Community Breakdown

### Scheduled Endings
At the end of the chosen round count:
- Thriving Future
- Fragile Progress
- Environmental Decline
- Community Breakdown
- Financial Collapse

### Ending Evaluation
- `Thriving Future` if all stats remain healthy and reasonably balanced
- `Fragile Progress` if the player survives but leaves one pillar noticeably weak
- Collapse endings if any pillar reaches zero before the final round

## Tile Data Structure
Use a clearly organized `plots` array in JavaScript.

```js
{
  tileName: "Breezy Bay Bend",
  issueTitle: "Stray Animal Management",
  scenario: "Stray and feral animals are increasing around Breezy Bay Bend...",
  optionA: {
    label: "Build a free vet clinic for strays and ferals",
    money: -15,
    environment: 10,
    trust: 12,
    feedback: "You invested in long-term animal care, improving health and community support while reducing your funds."
  },
  optionB: {
    label: "Ignore the issue and invest funds elsewhere",
    money: 8,
    environment: -8,
    trust: -10,
    feedback: "You saved money now, but the unmanaged population creates bigger environmental and social problems."
  }
}
```

## Screen Requirements
### 1. Start Screen
- Title
- Short premise
- Round selection controls
- Start button

### 2. Main Game Screen
- Board with place names
- Player token
- Roll Dice button
- Round counter
- Stat panel
- Context/status panel

### 3. Tile Decision Modal
- Tile name
- Issue title
- Short scenario description
- Option A and Option B buttons
- Visible color-coded stat effects for each option

### 4. Final Results Screen
- Ending type
- Final stats
- Summary paragraph about the player's strategy
- Educational paragraph connecting outcomes to real-world systems
- Reflection line: "Small choices create long-term impact."
- Restart button

## Visual Direction
- Eco-themed and portfolio-ready
- Hand-drawn / chalk-inspired / nature-cartoon feel
- Rounded cards and tiles
- Greens, blues, sandy neutrals, and earthy accents
- Clear typography and readable spacing
- Responsive layout for desktop and mobile

## Implementation Notes
- Plain HTML, CSS, and JavaScript only
- No backend and no login
- Store tile data separately from rendering logic
- Keep code readable with small comments where they help
- Use CSS shapes and gradients instead of external art assets

## Version 2 Plan
1. Add a mode system with setup-screen selection and mode-based starting rules.
2. Preserve token selection, dice animation, token movement, and decision-card flow.
3. Expand yearly systems with recurring investments, financial events, loan pressure, and clearer summaries.
4. Add educational feedback hooks, especially for Education Mode and major yearly outcomes.
5. Keep the board-first layout intact while refactoring data and rules into cleaner long-term modules.
