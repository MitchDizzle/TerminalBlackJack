# Terminal BlackJack

A feature-rich command-line BlackJack game with dynamic UI, statistics tracking, and Hi-Lo card counting.

![Start](/img/start.png?raw=true "BlackJack Start")

![Win](/img/win.png?raw=true "BlackJack Win")

## Features

- **Dynamic Terminal UI**: Screen updates in place with colorful display
- **Single-Key Controls**: No need to press Enter - just hit H or S
- **Persistent Scoreboard**: Always-visible stats header showing win/loss/ties, card count, and more
- Play BlackJack with 1-8 decks
- Standard casino rules implementation
- Real-time Hi-Lo card counting system
- Automatic shuffle at 25% deck remaining

## Prerequisites

Before running this project, you need to have [Node.js](https://nodejs.org/en/) installed on your system.

*   **Recommended version:** Node.js v20 or higher (LTS version is preferred).

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## How to Play

1. **Start the game**: Run `npm start`
2. **Read the Hi-Lo explanation**: Learn about card counting on the welcome screen
3. **Choose decks**: Enter number of decks (1-8) or press Enter for default (1 deck)
4. **Play your hand**:
   - Press `H` to hit (draw another card) - no Enter needed!
   - Press `S` to stand (keep your current hand)
   - Press `Q` to quit the game gracefully (or use Ctrl+C)
5. **View statistics**: Always visible at the top of the screen
6. **Continue or quit**: After each round, press `Y` for another round or `Q` to quit

## Game Rules

- **Objective**: Get closer to 21 than the dealer without going over
- **Blackjack**: Ace + 10-value card dealt initially
- **Dealer**: Must hit on 16 or below, stands on 17 or above
- **Bust**: Hand value exceeds 21 (automatic loss)
- **Push**: Tie when player and dealer have equal values

## Statistics Tracked

- Games played
- Games won/lost/tied
- Win rate percentage
- Blackjacks achieved
- Player bust count
- Dealer bust count
- Hi-Lo running count
- Hi-Lo true count

## Hi-Lo Card Counting

The game includes a Hi-Lo card counting system:

- **+1**: Cards 2, 3, 4, 5, 6
- **0**: Cards 7, 8, 9
- **-1**: Cards 10, J, Q, K, A

**Running Count**: Cumulative total of all cards seen
**True Count**: Running count divided by estimated decks remaining

## License

ISC
