<!-- @format -->

# openchessengine

Work in progress! The engine & interface is functional but lacks optimisations and features.

## Description

openchessengine is a chess engine written in TypeScript designed to be easy to use and understand.

## CLI

The CLI is currently the only interface available:

### Options

| Option            | Description                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `-f / --fen`      | Specifies the [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) string of the chess position to analyze. |
| `-d / --depth`    | (optional) Sets the depth of the search for the best move.                                                                   |
| `-a / --autoplay` | (optional) Fully iterates through all the moves found within the depth (useful for checkmate in x).                          |

For example, to analyze the position `kr5R/p7/2B5/3N4/8/8/1r6/8 b - - 0 1` with a depth of 3:

```bash
npm run start -- -f "kr5R/p7/2B5/3N4/8/8/1r6/8 b - - 0 1" -d 3
```

###### 1) Note that the engine needs one extra depth to find checkmates, so a depth of 3 will find checkmates in 2. This will be fixed in the future.

###### 2) Be sure to use quotes around the FEN string and use double dashes when using `npm run`: (`start -- -f`)

###### 3) The engine does not yet prioritise checkmates, so it may not find the quickest checkmate in the given depth if there are other checkmates available.

## Installation

1. Clone the repository

```bash
gh repo clone TetieWasTaken/openchessengine # github cli
git clone https://github.com/TetieWasTaken/openchessengine.git # git
```

2. Install the dependencies

```bash
npm install
```

3. Run

```bash
npm run start -- -f "6k1/8/8/8/8/3K4/4R3/5R2 w - - 0 1" -d 4
```

or, if you want to use a compiled version (faster):

```bash
npm run build
node dist/interfaces/cli.js -f "6k1/8/8/8/8/3K4/4R3/5R2 w - - 0 1" -d 4
```

Tests and linting can be run with:

```bash
npm run test
npm run lint
```
